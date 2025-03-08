
import React from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { CartItem as CartItemType } from '@/types';
import { useCart } from '@/context/CartContext';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <motion.div 
      className="flex items-start gap-4 p-4 rounded-xl border border-border bg-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      layout
    >
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-foreground">{item.name}</h3>
        
        {item.selectedOption && (
          <p className="text-sm text-muted-foreground mt-1">
            Option: {item.selectedOption.name}
            {item.selectedOption.price > 0 && ` (+RM ${item.selectedOption.price.toFixed(2)})`}
          </p>
        )}
        
        {item.specialInstructions && (
          <p className="text-xs text-muted-foreground mt-1 italic">
            "{item.specialInstructions}"
          </p>
        )}
        
        <p className="text-sm font-medium text-foreground mt-2">
          RM {item.price.toFixed(2)}
        </p>
      </div>
      
      <div className="flex flex-col items-end gap-2">
        <div className="flex items-center">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-l-md rounded-r-none border-r-0"
            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
          >
            <Minus className="h-3 w-3" />
          </Button>
          
          <div className="h-8 flex items-center justify-center border border-input px-3 text-sm">
            {item.quantity}
          </div>
          
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-r-md rounded-l-none border-l-0"
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-destructive"
          onClick={() => removeFromCart(item.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
};

export default CartItem;
