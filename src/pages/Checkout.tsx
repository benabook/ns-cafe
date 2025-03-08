
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import AnimatedPage from '@/components/ui/AnimatedPage';
import CustomButton from '@/components/ui/CustomButton';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { ArrowRight, Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { v4 as uuidv4 } from 'uuid';

const Checkout: React.FC = () => {
  const { cart, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [paymentStarted, setPaymentStarted] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  
  const cartTotal = getCartTotal();
  const serviceTax = cartTotal * 0.06; // 6% service tax
  const finalTotal = cartTotal + serviceTax;
  
  // Mock crypto payment address
  const paymentAddress = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';
  
  const handleCopyAddress = () => {
    navigator.clipboard.writeText(paymentAddress);
    toast.success('Payment address copied to clipboard');
  };
  
  const handleStartPayment = () => {
    if (!name.trim()) {
      toast.error('Please enter your name');
      return;
    }
    
    if (!tableNumber.trim()) {
      toast.error('Please enter your table number');
      return;
    }
    
    setPaymentStarted(true);
  };
  
  const handleConfirmPayment = () => {
    setPaymentConfirmed(true);
    
    // Simulate payment processing
    setTimeout(() => {
      const orderId = uuidv4();
      
      // Save order to localStorage for history
      const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      const newOrder = {
        id: orderId,
        items: cart,
        status: 'pending',
        total: finalTotal,
        date: new Date(),
        tableNumber,
        customerName: name,
        paymentMethod: 'crypto',
        paymentStatus: 'paid'
      };
      
      localStorage.setItem('orders', JSON.stringify([newOrder, ...existingOrders]));
      
      clearCart();
      navigate(`/order-confirmation/${orderId}`);
    }, 2000);
  };
  
  return (
    <AnimatedPage>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Checkout</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              {!paymentStarted ? (
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
                    
                    <div className="space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          placeholder="Enter your name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="table">Table Number</Label>
                        <Input
                          id="table"
                          placeholder="Enter your table number"
                          value={tableNumber}
                          onChange={(e) => setTableNumber(e.target.value)}
                        />
                      </div>
                      
                      <div className="pt-4">
                        <CustomButton 
                          withShine 
                          size="lg" 
                          className="w-full"
                          onClick={handleStartPayment}
                        >
                          <span>Continue to Payment</span>
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </CustomButton>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Crypto Payment</h2>
                    
                    {!paymentConfirmed ? (
                      <div className="space-y-6">
                        <div className="bg-muted p-4 rounded-lg">
                          <p className="text-sm text-muted-foreground mb-2">Please send exact amount in cryptocurrency to:</p>
                          <div className="flex items-center justify-between bg-background border border-border rounded-lg p-3">
                            <span className="text-sm font-mono overflow-x-scroll no-scrollbar">
                              {paymentAddress}
                            </span>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={handleCopyAddress}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-center text-sm text-muted-foreground mb-4">
                            Send <span className="font-semibold">RM {finalTotal.toFixed(2)}</span> equivalent in crypto
                          </p>
                          
                          <CustomButton 
                            withShine 
                            size="lg" 
                            className="w-full"
                            onClick={handleConfirmPayment}
                          >
                            <span>I've Sent the Payment</span>
                            <Check className="ml-2 h-4 w-4" />
                          </CustomButton>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center py-6">
                        <div className="w-16 h-16 rounded-full border-4 border-t-primary border-muted animate-spin mb-4"></div>
                        <h3 className="text-lg font-medium">Processing Your Payment</h3>
                        <p className="text-muted-foreground mt-2 text-center">
                          Please wait while we confirm your transaction...
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
            
            <div>
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      {cart.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            {item.quantity}x {item.name}
                            {item.selectedOption ? ` (${item.selectedOption.name})` : ''}
                          </span>
                          <span>RM {(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="space-y-2 pt-4 border-t border-border">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>RM {cartTotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Service Tax (6%)</span>
                        <span>RM {serviceTax.toFixed(2)}</span>
                      </div>
                      <div className="pt-2 border-t border-border flex justify-between font-medium">
                        <span>Total</span>
                        <span>RM {finalTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default Checkout;
