
import { supabase } from "@/integrations/supabase/client";
import { Order, CartItem } from "@/types";

// Save an order to Supabase
export async function saveOrder(order: Order): Promise<{ data: any; error: any }> {
  try {
    // Insert the order with items as JSON
    const { data, error } = await supabase
      .from('orders')
      .insert({
        customer_name: order.customerInfo.name,
        customer_discord: order.customerInfo.discord || null,
        customer_phone: order.customerInfo.phone,
        items: JSON.parse(JSON.stringify(order.items)), // Convert to JSON
        pickup_time: order.pickupTime,
        total: order.total,
        status: order.status,
        payment_method: order.paymentMethod,
        payment_status: order.paymentStatus
      })
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error saving order:", error);
    return { data: null, error };
  }
}

// Get all orders from Supabase
export async function getAllOrders(): Promise<{ data: Order[]; error: any }> {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Transform the data to match our Order type
    const transformedOrders = data.map(order => ({
      id: order.id,
      customerInfo: {
        name: order.customer_name,
        discord: order.customer_discord || '',
        phone: order.customer_phone
      },
      items: order.items as unknown as CartItem[], // Type casting
      status: order.status as Order['status'], // Ensure correct type
      total: order.total,
      date: new Date(order.created_at),
      paymentMethod: order.payment_method,
      paymentStatus: order.payment_status,
      pickupTime: order.pickup_time,
      createdAt: order.created_at
    }));

    return { data: transformedOrders, error: null };
  } catch (error) {
    console.error("Error fetching orders:", error);
    return { data: [], error };
  }
}

// Get order status options
export function getOrderStatusOptions() {
  return [
    { value: 'pending', label: 'Pending' },
    { value: 'preparing', label: 'Preparing' },
    { value: 'ready', label: 'Ready for Pickup' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];
}

// Update order status
export async function updateOrderStatus(orderId: string, status: string): Promise<{ success: boolean; error: any }> {
  try {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);

    if (error) throw error;
    return { success: true, error: null };
  } catch (error) {
    console.error("Error updating order status:", error);
    return { success: false, error };
  }
}
