
import React, { createContext, useState, useContext, useEffect } from 'react';
import { CartContextType, CartItem } from '@/types';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    // Load cart from localStorage on initial render
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: CartItem) => {
    // Ensure the item has an ID
    const itemWithId = {
      ...item,
      id: item.id || uuidv4()
    };

    setCart((prevCart) => {
      // Check if item already exists with same options
      const existingItemIndex = prevCart.findIndex(
        (cartItem) => 
          cartItem.menuItemId === itemWithId.menuItemId && 
          JSON.stringify(cartItem.selectedOption) === JSON.stringify(itemWithId.selectedOption) &&
          cartItem.specialInstructions === itemWithId.specialInstructions
      );
      
      if (existingItemIndex !== -1) {
        // Update quantity if item exists
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += itemWithId.quantity;
        
        toast.success(`${itemWithId.name} quantity updated in cart`);
        return updatedCart;
      } else {
        // Add new item if it doesn't exist
        toast.success(`${itemWithId.name} added to cart`);
        return [...prevCart, itemWithId];
      }
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prevCart) => {
      const itemToRemove = prevCart.find(item => item.id === id);
      if (itemToRemove) {
        toast.success(`${itemToRemove.name} removed from cart`);
      }
      return prevCart.filter((item) => item.id !== id);
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(id);
      return;
    }
    
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    toast.success('Cart cleared');
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const itemTotal = item.price * item.quantity;
      return total + itemTotal;
    }, 0);
  };

  const getItemCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
