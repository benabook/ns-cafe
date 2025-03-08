
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import AnimatedPage from '@/components/ui/AnimatedPage';
import CustomButton from '@/components/ui/CustomButton';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, ArrowRight } from 'lucide-react';
import { Order } from '@/types';

const OrderConfirmation: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  
  useEffect(() => {
    // Get order from localStorage
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const foundOrder = orders.find((o: Order) => o.id === orderId);
    
    if (foundOrder) {
      setOrder(foundOrder);
    }
  }, [orderId]);
  
  if (!order) {
    return (
      <AnimatedPage>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Order not found</h1>
            <p className="text-muted-foreground mb-8">
              We couldn't find the order you're looking for.
            </p>
            <Link to="/">
              <CustomButton>Back to Menu</CustomButton>
            </Link>
          </div>
        </div>
      </AnimatedPage>
    );
  }
  
  return (
    <AnimatedPage>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-6 inline-flex"
            >
              <div className="bg-primary/10 text-primary rounded-full h-24 w-24 flex items-center justify-center">
                <CheckCircle className="h-12 w-12" />
              </div>
            </motion.div>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
              <p className="text-muted-foreground">
                Your order has been placed successfully.
              </p>
            </motion.div>
          </div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-card border border-border rounded-xl p-6 mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium">Order #{orderId.substring(0, 8)}</h2>
              <div className="bg-primary/10 text-primary text-xs font-medium px-3 py-1 rounded-full flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                <span>Preparing</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Customer</p>
                <p className="font-medium">{order.customerName}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground mb-1">Table</p>
                <p className="font-medium">{order.tableNumber}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground mb-1">Date & Time</p>
                <p className="font-medium">
                  {new Date(order.date).toLocaleDateString()} at {new Date(order.date).toLocaleTimeString()}
                </p>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-card border border-border rounded-xl p-6 mb-8"
          >
            <h2 className="text-lg font-medium mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <div>
                    <p className="font-medium">
                      {item.quantity}x {item.name}
                    </p>
                    {item.selectedOption && (
                      <p className="text-sm text-muted-foreground">
                        Option: {item.selectedOption.name}
                      </p>
                    )}
                  </div>
                  <p>RM {(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            
            <div className="pt-3 border-t border-border">
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>RM {order.total.toFixed(2)}</span>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="flex flex-col items-center"
          >
            <p className="text-muted-foreground mb-4 text-center">
              Your order is being prepared and will be ready soon. You can check the status of your order in the Orders page.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/orders">
                <CustomButton variant="outline">View Order Status</CustomButton>
              </Link>
              
              <Link to="/">
                <CustomButton>
                  <span>Back to Menu</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </CustomButton>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default OrderConfirmation;
