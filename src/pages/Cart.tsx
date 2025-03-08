
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import AnimatedPage from '@/components/ui/AnimatedPage';
import CartItem from '@/components/ui/CartItem';
import CustomButton from '@/components/ui/CustomButton';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ArrowRight } from 'lucide-react';

const Cart: React.FC = () => {
  const { cart, clearCart, getCartTotal } = useCart();
  const navigate = useNavigate();
  
  const handleCheckout = () => {
    navigate('/checkout');
  };
  
  const cartTotal = getCartTotal();
  const serviceTax = cartTotal * 0.06; // 6% service tax
  const finalTotal = cartTotal + serviceTax;
  
  if (cart.length === 0) {
    return (
      <AnimatedPage>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <div className="bg-muted/50 rounded-full h-24 w-24 flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="h-10 w-10 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
            <p className="text-muted-foreground mb-8">
              Looks like you haven't added any items to your cart yet.
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
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
          
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">{cart.length} {cart.length === 1 ? 'Item' : 'Items'}</h2>
                <button
                  onClick={clearCart}
                  className="text-sm text-muted-foreground hover:text-destructive"
                >
                  Clear all
                </button>
              </div>
              
              <motion.div 
                className="space-y-4"
                layout
              >
                <AnimatePresence>
                  {cart.map((item) => (
                    <CartItem key={item.id} item={item} />
                  ))}
                </AnimatePresence>
              </motion.div>
            </div>
            
            <div className="w-full md:w-80">
              <div className="bg-card rounded-xl border border-border p-6 sticky top-24">
                <h2 className="text-lg font-medium mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>RM {cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Service Tax (6%)</span>
                    <span>RM {serviceTax.toFixed(2)}</span>
                  </div>
                  <div className="pt-3 border-t border-border flex justify-between font-medium">
                    <span>Total</span>
                    <span>RM {finalTotal.toFixed(2)}</span>
                  </div>
                </div>
                
                <CustomButton 
                  withShine 
                  size="lg"
                  className="w-full"
                  onClick={handleCheckout}
                >
                  <span>Checkout</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </CustomButton>
                
                <div className="mt-4">
                  <Link 
                    to="/" 
                    className="text-sm text-center block text-primary hover:underline"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default Cart;
