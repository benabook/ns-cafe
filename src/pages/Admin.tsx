
import React, { useState, useEffect } from 'react';
import AnimatedPage from '@/components/ui/AnimatedPage';
import { motion } from 'framer-motion';
import { Order, OrderStatus } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  CheckCircle, 
  XCircle,
  Utensils,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const Admin: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  useEffect(() => {
    // Get orders from localStorage
    const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    setOrders(savedOrders);
  }, []);
  
  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter(order => order.status === statusFilter));
    }
  }, [statusFilter, orders]);
  
  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    const updatedOrders = orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
  };
  
  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'preparing':
        return <Utensils className="h-4 w-4" />;
      case 'ready':
        return <CheckCircle className="h-4 w-4" />;
      case 'completed':
        return <Check className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };
  
  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'preparing':
        return 'bg-blue-100 text-blue-800';
      case 'ready':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-emerald-100 text-emerald-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const statusOptions: { value: OrderStatus; label: string }[] = [
    { value: 'pending', label: 'Pending' },
    { value: 'preparing', label: 'Preparing' },
    { value: 'ready', label: 'Ready' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
  ];
  
  const getNextStatus = (currentStatus: OrderStatus): OrderStatus => {
    switch (currentStatus) {
      case 'pending':
        return 'preparing';
      case 'preparing':
        return 'ready';
      case 'ready':
        return 'completed';
      default:
        return currentStatus;
    }
  };
  
  return (
    <AnimatedPage>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          </div>
          
          <Tabs defaultValue="all" className="w-full mb-8">
            <TabsList className="grid grid-cols-5 mb-6">
              <TabsTrigger 
                value="all" 
                onClick={() => setStatusFilter('all')}
              >
                All
              </TabsTrigger>
              <TabsTrigger 
                value="pending" 
                onClick={() => setStatusFilter('pending')}
              >
                Pending
              </TabsTrigger>
              <TabsTrigger 
                value="preparing" 
                onClick={() => setStatusFilter('preparing')}
              >
                Preparing
              </TabsTrigger>
              <TabsTrigger 
                value="ready" 
                onClick={() => setStatusFilter('ready')}
              >
                Ready
              </TabsTrigger>
              <TabsTrigger 
                value="completed" 
                onClick={() => setStatusFilter('completed')}
              >
                Completed
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No orders found.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredOrders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <h2 className="font-medium">Order #{order.id.substring(0, 8)}</h2>
                            <Badge 
                              variant="secondary"
                              className={`flex items-center gap-1 ${getStatusColor(order.status)}`}
                            >
                              {getStatusIcon(order.status)}
                              <span className="capitalize">{order.status}</span>
                            </Badge>
                          </div>
                          <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                            <p>{format(new Date(order.date), 'MMM d, yyyy h:mm a')}</p>
                            <p>Table: {order.tableNumber}</p>
                            <p>Customer: {order.customerName}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Select
                            value={order.status}
                            onValueChange={(value) => updateOrderStatus(order.id, value as OrderStatus)}
                          >
                            <SelectTrigger className="w-[160px]">
                              <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                              {statusOptions.map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          
                          {order.status !== 'completed' && order.status !== 'cancelled' && (
                            <Button 
                              variant="outline"
                              size="icon"
                              onClick={() => updateOrderStatus(order.id, getNextStatus(order.status))}
                            >
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex justify-between text-sm">
                            <span>
                              {item.quantity}x {item.name}
                              {item.selectedOption ? ` (${item.selectedOption.name})` : ''}
                              {item.specialInstructions && (
                                <span className="text-xs italic ml-2 text-muted-foreground">
                                  "{item.specialInstructions}"
                                </span>
                              )}
                            </span>
                            <span>RM {(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex justify-between items-center pt-3 border-t border-border">
                        <span className="font-medium">Total:</span>
                        <span className="font-medium">RM {order.total.toFixed(2)}</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AnimatedPage>
  );
};

export default Admin;
