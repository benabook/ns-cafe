
import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1"

// Set up CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// This is a mock implementation - in a real app, you would connect to a proper Lightning Network provider
const createMockLightningInvoice = (amount: number, orderId: string) => {
  // This is a simplified mock - in production, you'd call a Lightning Network provider API
  const mockInvoice = `lnbc${amount}n1pjahkdapp5wfr4l5hg75nrg9d3kjgtm8qejjq5d3ncn6f5l84xh9z6w5z98ehyvqdqqcqzpgxq9z0rgqsp5u5g8c43xj88zt0cqhkdl2e0lqsjf3uswqz5r0fsvs4k03r6gjks9qyyssq3p2qlh2zqnhfn0u0n33nmqj5c5s8myzldf2j7j569wpwxs9rcy58wju426jytvkqfhpwxvw8w5xaqqg68qpnp0a73gswhjuxy0l46cpjahsz3`;
  const mockPaymentId = `payment_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  
  return {
    invoice: mockInvoice,
    paymentId: mockPaymentId,
    amount: amount,
    orderId: orderId,
    expiresAt: new Date(Date.now() + 15 * 60000).toISOString(), // 15 minutes expiry
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { orderId, amount } = await req.json()
    
    if (!orderId || !amount) {
      return new Response(
        JSON.stringify({ error: 'Order ID and amount are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Creating Lightning invoice for order ${orderId} with amount ${amount}`)
    
    // In a real implementation, you would call your Lightning Network provider API here
    const invoiceData = createMockLightningInvoice(amount, orderId)
    
    // Store the invoice information in the database
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || ""
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY") || ""
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Update the order with the invoice information
    const { data, error } = await supabase
      .from('orders')
      .update({
        lightning_invoice: invoiceData.invoice,
        lightning_payment_id: invoiceData.paymentId
      })
      .eq('id', orderId)
      .select()
      .single()

    if (error) {
      console.error('Error updating order with invoice:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to update order with invoice' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify(invoiceData),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error creating Lightning invoice:', error)
    return new Response(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
