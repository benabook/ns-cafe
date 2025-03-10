
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const OPENNODE_API_URL = 'https://api.opennode.com/v1/charge'

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  // Only accept GET requests
  if (req.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  try {
    const url = new URL(req.url)
    const paymentId = url.searchParams.get('paymentId')
    const orderId = url.searchParams.get('orderId')
    
    if (!paymentId && !orderId) {
      return new Response(JSON.stringify({ error: 'Missing payment ID or order ID' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const OPENNODE_API_KEY = Deno.env.get('OPENNODE_API_KEY')
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!OPENNODE_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return new Response(JSON.stringify({ error: 'API keys not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Initialize Supabase client with the service role key
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    // If we have a payment ID, check with OpenNode
    if (paymentId) {
      const response = await fetch(`${OPENNODE_API_URL}/${paymentId}`, {
        method: 'GET',
        headers: {
          'Authorization': `${OPENNODE_API_KEY}`,
        },
      })

      const data = await response.json()
      
      if (!response.ok) {
        return new Response(JSON.stringify({ error: 'Failed to check payment', details: data }), {
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      const { status, order_id } = data.data

      // If payment is paid, update the order in the database
      if (status === 'paid') {
        const { error } = await supabase
          .from('orders')
          .update({ 
            payment_status: 'paid', 
            status: 'preparing' // Automatically move to preparing when paid
          })
          .eq('id', order_id)

        if (error) {
          console.error('Error updating order:', error)
        }
      }

      return new Response(JSON.stringify({ 
        status,
        paid: status === 'paid'
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
    
    // If we only have an order ID, check payment status from the database
    if (orderId) {
      const { data, error } = await supabase
        .from('orders')
        .select('payment_status, lightning_payment_id')
        .eq('id', orderId)
        .single()

      if (error) {
        return new Response(JSON.stringify({ error: 'Error fetching order', details: error }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      // If we have a payment ID in the database but status is not paid, double-check with OpenNode
      if (data.lightning_payment_id && data.payment_status !== 'paid') {
        const response = await fetch(`${OPENNODE_API_URL}/${data.lightning_payment_id}`, {
          method: 'GET',
          headers: {
            'Authorization': `${OPENNODE_API_KEY}`,
          },
        })

        const paymentData = await response.json()
        
        if (response.ok && paymentData.data.status === 'paid') {
          // Update the order status
          await supabase
            .from('orders')
            .update({ 
              payment_status: 'paid',
              status: 'preparing' // Automatically move to preparing when paid
            })
            .eq('id', orderId)
            
          return new Response(JSON.stringify({ 
            status: 'paid',
            paid: true
          }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }
      }

      return new Response(JSON.stringify({ 
        status: data.payment_status,
        paid: data.payment_status === 'paid'
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
  } catch (error) {
    console.error('Error checking payment:', error)
    return new Response(JSON.stringify({ error: 'Internal server error', details: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
