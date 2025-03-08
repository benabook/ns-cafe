
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AnimatedPage from '@/components/ui/AnimatedPage';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Clock, RefreshCw } from 'lucide-react';
import { getAllOrders, updateOrderStatus, getOrderStatusOptions } from '@/services/ordersService';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const statusOptions = getOrderStatusOptions();

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

  useEffect(() => {
    fetchOrders();
    
    // Set up real-time subscription to orders table
    const ordersSubscription = supabase
      .channel('orders_channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, (payload) => {
        fetchOrders();
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(ordersSubscription);
    };
  }, []);

  const filteredOrders = activeTab === 'all' 
    ? orders 
    : orders.filter(order => order.status === activeTab);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    const { success, error } = await updateOrderStatus(orderId, newStatus);
    
    if (success) {
      toast.success(`Order status updated to ${newStatus}`);
      fetchOrders();
    } else {
      toast.error("Failed to update order status");
      console.error("Error updating order status:", error);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500 hover:bg-yellow-600';
      case 'preparing': return 'bg-blue-500 hover:bg-blue-600';
      case 'ready': return 'bg-green-500 hover:bg-green-600';
      case 'completed': return 'bg-gray-500 hover:bg-gray-600';
      case 'cancelled': return 'bg-red-500 hover:bg-red-600';
      default: return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
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
          <Button 
            variant="outline" 
            className="flex items-center gap-1"
            onClick={fetchOrders}
          >
            <RefreshCw className="h-4 w-4" /> Refresh
          </Button>
        </div>

        <div className="max-w-5xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Order Management</CardTitle>
              <CardDescription>
                View and manage all customer orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-5 mb-6">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="preparing">Preparing</TabsTrigger>
                  <TabsTrigger value="ready">Ready</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="space-y-4">
                  {loading ? (
                    <div className="flex justify-center py-8">
                      <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : filteredOrders.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No orders found
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredOrders.map((order) => (
                        <Card key={order.id} className="overflow-hidden">
                          <div className="p-4">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                              <div>
                                <div className="flex items-center gap-3">
                                  <h3 className="text-lg font-medium">
                                    Order #{order.id.substring(0, 8)}
                                  </h3>
                                  <Badge className={getStatusBadgeColor(order.status)}>
                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                  </Badge>
                                </div>
                                <div className="text-sm text-muted-foreground mt-1">
                                  {order.createdAt ? formatDate(order.createdAt) : ''}
                                </div>
                              </div>
                              
                              <div className="mt-3 md:mt-0">
                                <Select
                                  defaultValue={order.status}
                                  onValueChange={(value) => handleStatusChange(order.id, value)}
                                >
                                  <SelectTrigger className="w-40">
                                    <SelectValue placeholder="Status" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {statusOptions.map((option) => (
                                      <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                              <div>
                                <div className="text-sm font-medium text-muted-foreground mb-1">
                                  Customer
                                </div>
                                <div>{order.customerInfo.name}</div>
                                <div className="text-sm">{order.customerInfo.phone}</div>
                                {order.customerInfo.discord && (
                                  <div className="text-sm">{order.customerInfo.discord}</div>
                                )}
                              </div>
                              
                              <div>
                                <div className="text-sm font-medium text-muted-foreground mb-1">
                                  Pickup
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  <span>{order.pickupTime} minutes</span>
                                </div>
                                {order.tableNumber && (
                                  <div className="text-sm">Table: {order.tableNumber}</div>
                                )}
                              </div>
                              
                              <div>
                                <div className="text-sm font-medium text-muted-foreground mb-1">
                                  Payment
                                </div>
                                <div>{order.paymentMethod}</div>
                                <div className="text-sm capitalize">{order.paymentStatus}</div>
                              </div>
                            </div>

                            <Separator className="my-4" />
                            
                            <div className="space-y-3">
                              <div className="font-medium">Order Items</div>
                              {order.items.map((item: any, index: number) => (
                                <div key={index} className="flex justify-between">
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium">{item.quantity}x</span>
                                      <span>{item.name}</span>
                                    </div>
                                    {item.selectedOption && (
                                      <div className="text-sm text-muted-foreground ml-7">
                                        Option: {item.selectedOption.name}
                                      </div>
                                    )}
                                    {item.specialInstructions && (
                                      <div className="text-sm text-muted-foreground ml-7">
                                        Note: {item.specialInstructions}
                                      </div>
                                    )}
                                  </div>
                                  <div className="font-medium">
                                    RM {(item.price * item.quantity).toFixed(2)}
                                  </div>
                                </div>
                              ))}
                            </div>
                            
                            <Separator className="my-4" />
                            
                            <div className="flex justify-between font-medium text-lg">
                              <div>Total</div>
                              <div>RM {order.total.toFixed(2)}</div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default Admin;
