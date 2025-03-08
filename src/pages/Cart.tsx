
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AnimatedPage from '@/components/ui/AnimatedPage';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { ShoppingCart, ChevronLeft, Trash2, Plus, Minus } from 'lucide-react';
import { motion } from 'framer-motion';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { v4 as uuidv4 } from 'uuid';

const pickupTimes = [
  { id: 'time-10', label: '10 minutes', value: 10 },
  { id: 'time-15', label: '15 minutes', value: 15 },
  { id: 'time-20', label: '20 minutes', value: 20 },
  { id: 'time-30', label: '30 minutes', value: 30 },
];

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart();
  const [selectedPickupTime, setSelectedPickupTime] = useState(pickupTimes[0].id);

  const handleCheckout = () => {
    const pickupTime = pickupTimes.find(time => time.id === selectedPickupTime)?.value || 10;
    navigate('/order-confirmation', { 
      state: { 
        orderId: uuidv4(), 
        pickupTime,
        total: getCartTotal()
      } 
    });
    clearCart();
  };

  if (cart.length === 0) {
    return (
      <AnimatedPage>
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
            <p className="text-muted-foreground mb-6">
              Add some delicious items from our menu to get started.
            </p>
            <Button onClick={() => navigate('/')}>
              Browse Menu
            </Button>
          </div>
        </div>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-sm text-muted-foreground mb-6 hover:text-foreground transition-colors"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Continue Shopping
          </button>

          <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

          <div className="bg-card rounded-lg p-6 shadow-sm mb-6">
            <ul className="divide-y divide-border">
              {cart.map((item) => (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="py-4 first:pt-0 last:pb-0"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-medium">
                        {item.name}
                        {item.selectedOption && (
                          <span className="text-sm text-muted-foreground ml-1">
                            ({item.selectedOption.name})
                          </span>
                        )}
                      </h3>
                      
                      {item.specialInstructions && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Note: {item.specialInstructions}
                        </p>
                      )}
                      
                      <div className="flex items-center mt-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        
                        <span className="mx-2 w-8 text-center">
                          {item.quantity}
                        </span>
                        
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end">
                      <span className="font-medium">
                        RM {(item.price * item.quantity).toFixed(2)}
                      </span>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 mt-2 text-muted-foreground"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>

          <div className="bg-card rounded-lg p-6 shadow-sm mb-6">
            <h2 className="text-lg font-medium mb-4">Select Pickup Time</h2>
            <RadioGroup 
              value={selectedPickupTime} 
              onValueChange={setSelectedPickupTime}
              className="flex flex-wrap gap-2"
            >
              {pickupTimes.map((time) => (
                <div key={time.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={time.id} id={time.id} />
                  <Label htmlFor={time.id}>{time.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="bg-card rounded-lg p-6 shadow-sm mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-muted-foreground">Subtotal</span>
              <span>RM {getCartTotal().toFixed(2)}</span>
            </div>
            
            <Separator className="my-4" />
            
            <div className="flex justify-between font-medium text-lg">
              <span>Total</span>
              <span>RM {getCartTotal().toFixed(2)}</span>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <Button 
              variant="outline" 
              onClick={() => clearCart()}
            >
              Clear Cart
            </Button>
            
            <Button 
              size="lg"
              onClick={handleCheckout}
              disabled={cart.length === 0}
            >
              Checkout
            </Button>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default Cart;
