
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AnimatedPage from '@/components/ui/AnimatedPage';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { ArrowLeft, LogOut } from 'lucide-react';
import { getAllOrders, updateOrderStatus } from '@/services/ordersService';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Order } from '@/types';
import AdminOrderCard from '@/components/admin/AdminOrderCard';
import { useAuth } from '@/context/AuthContext';

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const pendingOrders = orders.filter(order => order.status === 'pending');
  const preparingOrders = orders.filter(order => order.status === 'preparing');
  const readyOrders = orders.filter(order => order.status === 'ready' || order.status === 'completed');

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await getAllOrders();
    
    if (error) {
      toast.error("Failed to load orders");
      console.error("Error loading orders:", error);
    } else {
      setOrders(data || []);
    }
    
    setLoading(false);
  };

  // Set up real-time subscription when component mounts
  useEffect(() => {
    // Fetch orders initially
    fetchOrders();
    
    console.log("Setting up Supabase real-time subscription");
    
    // Subscribe to real-time updates from Supabase
    const channel = supabase
      .channel('orders_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'orders' 
      }, (payload) => {
        console.log("Real-time update received:", payload);
        // Fetch the latest orders when any change occurs
        fetchOrders();
      })
      .subscribe((status) => {
        console.log("Supabase subscription status:", status);
      });
      
    // Return cleanup function
    return () => {
      console.log("Cleaning up Supabase subscription");
      supabase.removeChannel(channel);
    };
  }, []);

  const handleDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) return;

    let newStatus: string;
    switch (destination.droppableId) {
      case 'pending':
        newStatus = 'pending';
        break;
      case 'preparing':
        newStatus = 'preparing';
        break;
      case 'ready':
        newStatus = 'ready';
        break;
      default:
        return;
    }

    // Optimistically update the UI
    const updatedOrders = orders.map(order => 
      order.id === draggableId 
        ? { ...order, status: newStatus as Order['status'] } 
        : order
    );
    setOrders(updatedOrders);

    // Then update the database
    const { success, error } = await updateOrderStatus(draggableId, newStatus);
    
    if (success) {
      toast.success(`Order status updated to ${newStatus}`);
    } else {
      toast.error("Failed to update order status");
      console.error("Error updating order status:", error);
      // Revert to the original state if the update fails
      fetchOrders();
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <AnimatedPage>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <Button 
            variant="ghost" 
            className="flex items-center gap-1" 
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="h-4 w-4" /> Back to Menu
          </Button>
          <div className="flex gap-2">
            <Button 
              variant="destructive" 
              className="flex items-center gap-1"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" /> Logout
            </Button>
          </div>
        </div>

        <div className="mb-6">
          <h1 className="text-3xl font-bold">Order Management</h1>
          <p className="text-muted-foreground">
            Drag and drop orders between columns to update their status
          </p>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Card>
                <CardHeader className="bg-yellow-100 dark:bg-yellow-900/20">
                  <CardTitle className="text-lg">New Orders</CardTitle>
                  <CardDescription>
                    {pendingOrders.length} pending orders
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4">
                  <Droppable droppableId="pending">
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="min-h-[200px]"
                      >
                        {pendingOrders.length === 0 ? (
                          <div className="text-center py-8 text-muted-foreground">
                            No pending orders
                          </div>
                        ) : (
                          pendingOrders.map((order, index) => (
                            <Draggable key={order.id} draggableId={order.id} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <AdminOrderCard 
                                    order={order} 
                                    isDragging={snapshot.isDragging}
                                  />
                                </div>
                              )}
                            </Draggable>
                          ))
                        )}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader className="bg-blue-100 dark:bg-blue-900/20">
                  <CardTitle className="text-lg">Orders in Progress</CardTitle>
                  <CardDescription>
                    {preparingOrders.length} orders being prepared
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4">
                  <Droppable droppableId="preparing">
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="min-h-[200px]"
                      >
                        {preparingOrders.length === 0 ? (
                          <div className="text-center py-8 text-muted-foreground">
                            No orders in progress
                          </div>
                        ) : (
                          preparingOrders.map((order, index) => (
                            <Draggable key={order.id} draggableId={order.id} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <AdminOrderCard 
                                    order={order} 
                                    isDragging={snapshot.isDragging}
                                  />
                                </div>
                              )}
                            </Draggable>
                          ))
                        )}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader className="bg-green-100 dark:bg-green-900/20">
                  <CardTitle className="text-lg">Completed Orders</CardTitle>
                  <CardDescription>
                    {readyOrders.length} orders ready for pickup
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4">
                  <Droppable droppableId="ready">
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="min-h-[200px]"
                      >
                        {readyOrders.length === 0 ? (
                          <div className="text-center py-8 text-muted-foreground">
                            No completed orders
                          </div>
                        ) : (
                          readyOrders.map((order, index) => (
                            <Draggable key={order.id} draggableId={order.id} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <AdminOrderCard 
                                    order={order} 
                                    isDragging={snapshot.isDragging}
                                  />
                                </div>
                              )}
                            </Draggable>
                          ))
                        )}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </CardContent>
              </Card>
            </div>
          </div>
        </DragDropContext>
      </div>
    </AnimatedPage>
  );
};

export default Admin;
