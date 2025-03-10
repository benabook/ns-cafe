
import { supabase } from "@/integrations/supabase/client";
import { Order } from "@/types";

// Generate a Lightning invoice for an order
export async function generateLightningInvoice(orderId: string, amountMYR: number): Promise<{ 
  success: boolean; 
  data?: { 
    payment_id: string; 
    invoice: string; 
    status: string;
  }; 
  error?: any;
}> {
  try {
    const { data, error } = await supabase.functions.invoke('create-lightning-invoice', {
      body: { orderId, amountMYR }
    });

    if (error || !data.success) {
      console.error("Error generating Lightning invoice:", error || data.error);
      return { success: false, error: error || data.error };
    }

    // Update the order with the lightning payment details
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        lightning_payment_id: data.data.payment_id,
        lightning_invoice: data.data.invoice
      })
      .eq('id', orderId);

    if (updateError) {
      console.error("Error updating order with lightning details:", updateError);
      return { success: false, error: updateError };
    }

    return { success: true, data: data.data };
  } catch (error) {
    console.error("Error in generateLightningInvoice:", error);
    return { success: false, error };
  }
}

// Check the status of a Lightning payment
export async function checkLightningPayment(paymentId: string): Promise<{ 
  paid: boolean; 
  status: string; 
  error?: any;
}> {
  try {
    const { data, error } = await supabase.functions.invoke('check-lightning-payment', {
      method: 'GET',
      query: { paymentId }
    });

    if (error) {
      console.error("Error checking Lightning payment:", error);
      return { paid: false, status: 'error', error };
    }

    return { paid: data.paid, status: data.status };
  } catch (error) {
    console.error("Error in checkLightningPayment:", error);
    return { paid: false, status: 'error', error };
  }
}

// Check payment status by order ID
export async function checkOrderPaymentStatus(orderId: string): Promise<{ 
  paid: boolean; 
  status: string; 
  error?: any;
}> {
  try {
    const { data, error } = await supabase.functions.invoke('check-lightning-payment', {
      method: 'GET',
      query: { orderId }
    });

    if (error) {
      console.error("Error checking order payment status:", error);
      return { paid: false, status: 'error', error };
    }

    return { paid: data.paid, status: data.status };
  } catch (error) {
    console.error("Error in checkOrderPaymentStatus:", error);
    return { paid: false, status: 'error', error };
  }
}
