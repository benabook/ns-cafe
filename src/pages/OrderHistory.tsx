
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AnimatedPage from '@/components/ui/AnimatedPage';
import { motion } from 'framer-motion';
import { Order } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ShoppingBag, ClipboardList, Clock, CheckCircle, XCircle } from 'lucide-react';
import CustomButton from '@/components/ui/CustomButton';

const OrderHistory: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  
  useEffect(() => {
    // Get orders from localStorage
    const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    setOrders(savedOrders);
  }, []);
  
  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'preparing':
        return <Clock className="h-4 w-4" />;
      case 'ready':
        return <CheckCircle className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
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
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  if (orders.length === 0) {
    return (
      <AnimatedPage>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <div className="bg-muted/50 rounded-full h-24 w-24 flex items-center justify-center mx-auto mb-6">
              <ClipboardList className="h-10 w-10 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold mb-4">No orders yet</h1>
            <p className="text-muted-foreground mb-8">
              You haven't placed any orders yet. Start by browsing our delicious menu.
            </p>
            <Link to="/">
              <CustomButton>Browse Menu</CustomButton>
            </Link>
          </div>
        </div>
      </AnimatedPage>
    );
  }
  
  return (
    <AnimatedPage>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Your Orders</h1>
          
          <div className="space-y-6">
            {orders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h2 className="font-medium">Order #{order.id.substring(0, 8)}</h2>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(order.date), 'MMM d, yyyy h:mm a')}
                        </p>
                      </div>
                      <Badge 
                        variant="secondary"
                        className={`flex items-center gap-1 ${getStatusColor(order.status)}`}
                      >
                        {getStatusIcon(order.status)}
                        <span className="capitalize">{order.status}</span>
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span>
                            {item.quantity}x {item.name}
                            {item.selectedOption ? ` (${item.selectedOption.name})` : ''}
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
        </div>
      </div>
    </AnimatedPage>
  );
};

export default OrderHistory;
