
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getMenuItemById } from '@/data/menuData';
import AnimatedPage from '@/components/ui/AnimatedPage';
import { ChevronLeft, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

const ItemDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const menuItem = getMenuItemById(id || '');
  
  const [quantity, setQuantity] = useState(1);
  const [selectedOption, setSelectedOption] = useState(
    menuItem?.options ? menuItem.options[0] : undefined
  );
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  
  if (!menuItem) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center">
        <h2 className="text-xl font-semibold mb-4">Item not found</h2>
        <Button variant="outline" onClick={() => navigate('/')}>
          Return to Menu
        </Button>
      </div>
    );
  }
  
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  const incrementQuantity = () => {
    setQuantity(quantity + 1);
  };
  
  const calculateTotalPrice = () => {
    return (menuItem.price + (selectedOption?.price || 0)) * quantity;
  };
  
  const handleAddToCart = () => {
    toast.success(`${menuItem.name} added to cart`, {
      description: `${quantity} × ${selectedOption ? `${menuItem.name} (${selectedOption.name})` : menuItem.name}`
    });
    
    // In a real implementation, this would add the item to the cart
    // For now, just navigate back to the menu
    navigate('/');
  };
  
  return (
    <AnimatedPage>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-sm text-muted-foreground mb-6 hover:text-foreground transition-colors"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to menu
          </button>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative rounded-2xl overflow-hidden aspect-square md:aspect-auto">
              {!isImageLoaded && (
                <div className="absolute inset-0 bg-muted animate-pulse" />
              )}
              <motion.img
                src={`${menuItem.image}?auto=format&fit=crop&w=800&q=80`}
                alt={menuItem.name}
                className="w-full h-full object-cover rounded-2xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: isImageLoaded ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                onLoad={() => setIsImageLoaded(true)}
              />
            </div>
            
            <div>
              <div className="flex flex-col h-full">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <h1 className="text-3xl font-bold mb-2">{menuItem.name}</h1>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xl font-medium text-primary">
                      RM {menuItem.price.toFixed(2)}
                    </span>
                    {menuItem.usdPrice && (
                      <span className="text-sm text-muted-foreground">
                        ≈ USD {menuItem.usdPrice.toFixed(1)}
                      </span>
                    )}
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="mt-2 mb-6">
                    <h3 className="text-sm font-medium mb-2">Ingredients:</h3>
                    <p className="text-muted-foreground text-sm">
                      {menuItem.ingredients.length > 0 
                        ? menuItem.ingredients.join(', ')
                        : 'No ingredients listed'}
                    </p>
                  </div>
                  
                  {menuItem.options && menuItem.options.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-sm font-medium mb-3">Options:</h3>
                      <RadioGroup
                        value={selectedOption?.id}
                        onValueChange={(value) => {
                          const option = menuItem.options?.find(opt => opt.id === value);
                          setSelectedOption(option);
                        }}
                        className="flex flex-col space-y-2"
                      >
                        {menuItem.options.map((option) => (
                          <div key={option.id} className="flex items-center space-x-2">
                            <RadioGroupItem value={option.id} id={option.id} />
                            <Label htmlFor={option.id} className="flex items-center justify-between w-full">
                              <span>{option.name}</span>
                              {option.price > 0 && (
                                <span className="text-sm text-muted-foreground">
                                  +RM {option.price.toFixed(2)}
                                </span>
                              )}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  )}
                  
                  <div className="mb-6">
                    <h3 className="text-sm font-medium mb-2">Special Instructions:</h3>
                    <Textarea
                      placeholder="Any special requests or allergies?"
                      value={specialInstructions}
                      onChange={(e) => setSpecialInstructions(e.target.value)}
                      className="resize-none"
                    />
                  </div>
                  
                  <div className="flex items-center mb-6">
                    <h3 className="text-sm font-medium mr-4">Quantity:</h3>
                    <div className="flex items-center">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-l-md rounded-r-none"
                        onClick={decrementQuantity}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      
                      <div className="h-8 min-w-[3rem] flex items-center justify-center border-y border-x-0 border-input px-4 text-sm">
                        {quantity}
                      </div>
                      
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-r-md rounded-l-none"
                        onClick={incrementQuantity}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-auto">
                    <Button 
                      size="lg" 
                      className="w-full"
                      onClick={handleAddToCart}
                    >
                      Add to Cart • RM {calculateTotalPrice().toFixed(2)}
                    </Button>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default ItemDetail;
