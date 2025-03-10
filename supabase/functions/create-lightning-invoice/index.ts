
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'

const OPENNODE_API_URL = 'https://api.opennode.com/v1/charges'

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Only accept POST requests
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const { orderId, amountMYR } = await req.json()
    const OPENNODE_API_KEY = Deno.env.get('OPENNODE_API_KEY')

    if (!OPENNODE_API_KEY) {
      return new Response(JSON.stringify({ error: 'API key not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    if (!orderId || !amountMYR) {
      return new Response(JSON.stringify({ error: 'Missing required parameters' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Fetch BTC to MYR exchange rate from CoinGecko
    const priceResponse = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=myr')
    const priceData = await priceResponse.json()
    const btcPriceMYR = priceData.bitcoin.myr

    // Calculate BTC amount (convert from MYR to BTC)
    const amountBTC = amountMYR / btcPriceMYR

    // Create invoice with OpenNode
    const response = await fetch(OPENNODE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${OPENNODE_API_KEY}`, // OpenNode expects just the key without "Bearer"
      },
      body: JSON.stringify({
        amount: amountBTC,
        currency: 'BTC',
        order_id: orderId,
        description: `Order #${orderId.substring(0, 8)}`,
        ttl: 60 * 15, // 15 minutes expiry
        auto_settle: true
      }),
    })

    const data = await response.json()
    
    if (!response.ok) {
      console.error('OpenNode API error:', data)
      return new Response(JSON.stringify({ error: 'Failed to create invoice', details: data }), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Extract important information from the OpenNode response
    const { id: payment_id, lightning_invoice: invoice, status } = data.data

    // Return success response with invoice data
    return new Response(JSON.stringify({ 
      success: true, 
      data: { 
        payment_id, 
        invoice, 
        status 
      }
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Error creating lightning invoice:', error)
    return new Response(JSON.stringify({ error: 'Internal server error', details: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
