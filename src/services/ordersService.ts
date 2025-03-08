
import { supabase } from "@/integrations/supabase/client";
import { Order, CartItem } from "@/types";

// Save an order to Supabase
export async function saveOrder(order: Order): Promise<{ data: any; error: any }> {
  try {
    // First insert the order
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        id: order.id,
        customer_name: order.customerInfo.name,
        customer_discord: order.customerInfo.discord || null,
        customer_phone: order.customerInfo.phone,
        table_number: order.tableNumber || null,
        pickup_time: order.pickupTime,
        total: order.total,
        status: order.status,
        payment_method: order.paymentMethod,
        payment_status: order.paymentStatus
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // Then insert all order items
    const orderItems = order.items.map((item: CartItem) => ({
      order_id: order.id,
      menu_item_id: item.menuItemId,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      selected_option_id: item.selectedOption?.id || null,
      selected_option_name: item.selectedOption?.name || null,
      selected_option_price: item.selectedOption?.price || null,
      special_instructions: item.specialInstructions || null
    }));

    const { data: itemsData, error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    return { data: { order: orderData, items: itemsData }, error: null };
  } catch (error) {
    console.error("Error saving order:", error);
    return { data: null, error };
  }
}

// Get all orders from Supabase
export async function getAllOrders(): Promise<{ data: any[]; error: any }> {
  try {
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (ordersError) throw ordersError;

    // For each order, get its items
    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const { data: items, error: itemsError } = await supabase
          .from('order_items')
          .select('*')
          .eq('order_id', order.id);

        if (itemsError) throw itemsError;

        return {
          ...order,
          items
        };
      })
    );

    return { data: ordersWithItems, error: null };
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
