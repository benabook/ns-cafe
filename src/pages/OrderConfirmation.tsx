
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AnimatedPage from '@/components/ui/AnimatedPage';
import { Button } from '@/components/ui/button';
import { Check, Clock, ShoppingBag, User } from 'lucide-react';
import { motion } from 'framer-motion';

interface OrderConfirmationProps {}

const OrderConfirmation: React.FC<OrderConfirmationProps> = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId, pickupTime, total, customerName } = location.state || {};
  
  // If no order data, redirect to home
  useEffect(() => {
    if (!orderId) {
      navigate('/');
    }
  }, [orderId, navigate]);

  if (!orderId) {
    return null;
  }

  // Calculate pickup time display
  const calculatePickupTime = () => {
    const now = new Date();
    const pickupDate = new Date(now.getTime() + pickupTime * 60000);
    return pickupDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <AnimatedPage>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-primary/10 rounded-full p-4 w-24 h-24 mx-auto mb-6 flex items-center justify-center"
          >
            <Check className="h-12 w-12 text-primary" />
          </motion.div>
          
          <h1 className="text-3xl font-bold mb-2">Order Successful!</h1>
          {customerName && (
            <p className="text-lg mb-2">
              Thank you, <span className="font-medium">{customerName}</span>!
            </p>
          )}
          <p className="text-muted-foreground mb-6">
            Your order has been received and is being prepared.
          </p>
          
          <div className="bg-card rounded-lg p-6 shadow-sm mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <span className="text-lg font-medium">Pickup Time: {calculatePickupTime()}</span>
            </div>
            
            <div className="text-sm text-muted-foreground mb-4">
              Your order will be ready for pickup in approximately {pickupTime} minutes.
            </div>
            
            <div className="bg-muted p-4 rounded-md">
              <div className="text-sm mb-2">Order ID: {orderId.slice(0, 8)}</div>
              <div className="text-xl font-bold">RM {total.toFixed(2)}</div>
            </div>
          </div>
          
          <div className="flex flex-col gap-4">
            <Button 
              onClick={() => navigate('/')}
              className="w-full gap-2"
            >
              <ShoppingBag className="h-5 w-5" />
              Back to Menu
            </Button>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default OrderConfirmation;
