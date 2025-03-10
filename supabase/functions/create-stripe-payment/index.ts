
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'
import Stripe from 'https://esm.sh/stripe@12.18.0?target=deno'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  // Only accept POST requests
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  try {
    const { orderId, amountMYR } = await req.json()
    
    // Validate request
    if (!orderId || !amountMYR) {
      return new Response(JSON.stringify({ error: 'Missing required parameters' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Get Stripe API key from environment
    const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY')
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!STRIPE_SECRET_KEY) {
      return new Response(JSON.stringify({ error: 'Stripe API key not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return new Response(JSON.stringify({ error: 'Supabase config not available' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Initialize Stripe
    const stripe = new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16', // Use appropriate API version
      httpClient: Stripe.createFetchHttpClient(),
    })

    // Initialize Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    // Amount in smallest currency unit (cents for MYR)
    const amount = Math.round(amountMYR * 100)

    // Create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'myr',
      metadata: { orderId },
      automatic_payment_methods: {
        enabled: true,
      },
    })

    // Update the order with the Stripe payment intent ID
    if (paymentIntent.id) {
      const { error } = await supabase
        .from('orders')
        .update({ 
          payment_method: 'stripe',
          stripe_payment_intent_id: paymentIntent.id
        })
        .eq('id', orderId)

      if (error) {
        console.error('Error updating order with payment intent ID:', error)
      }
    }

    // Return the client secret to initialize Stripe Elements
    return new Response(JSON.stringify({ 
      success: true, 
      clientSecret: paymentIntent.client_secret 
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Error creating payment intent:', error)
    return new Response(JSON.stringify({ error: 'Internal server error', details: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
