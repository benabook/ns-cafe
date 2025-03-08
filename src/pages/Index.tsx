
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AnimatedPage from '@/components/ui/AnimatedPage';
import MenuCard from '@/components/ui/MenuCard';
import { menuItems } from '@/data/menuData';
import { MenuItem } from '@/types';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Shield } from 'lucide-react';

const MenuPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const categories = [
    { id: 'all', name: 'All' },
    { id: 'salads-bowls', name: 'Salads & Bowls' },
    { id: 'mains-sandwiches', name: 'Mains & Sandwiches' },
    { id: 'espresso-drinks', name: 'Espresso Drinks' },
    { id: 'non-coffee', name: 'Non-Coffee' },
    { id: 'smoothies', name: 'Smoothies' },
    { id: 'cold-pressed', name: 'Cold-Pressed Juices' },
    { id: 'add-ons', name: 'Add Ons' },
  ];
  
  const filteredItems = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);
    
  const staggerAnimation = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.05 
      } 
    },
  };
  
  return (
    <AnimatedPage>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-center mb-4">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1"
                onClick={() => navigate('/login')}
              >
                <Shield className="h-4 w-4" />
                Admin Login
              </Button>
            </div>
            <span className="bg-primary/10 text-primary text-xs font-medium px-3 py-1 rounded-full">
              NS Café Menu
            </span>
            <h1 className="text-4xl font-bold mt-4 mb-4">Fresh & Nutritious</h1>
            <p className="text-muted-foreground">
              Browse our menu of healthy, nutritious food and beverage options made with fresh, high-quality ingredients.
            </p>
          </motion.div>
        </div>
        
        <Tabs defaultValue="all" className="w-full mb-10">
          <div className="flex justify-center overflow-x-auto pb-2">
            <TabsList className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8">
              {categories.map(category => (
                <TabsTrigger 
                  key={category.id} 
                  value={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className="px-3 whitespace-nowrap"
                >
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          
          {categories.map(category => (
            <TabsContent key={category.id} value={category.id} className="mt-6">
              <motion.div 
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={staggerAnimation}
                initial="initial"
                animate="animate"
              >
                {(category.id === 'all' ? menuItems : menuItems.filter(item => item.category === category.id))
                  .map(item => (
                    <MenuCard key={item.id} item={item} />
                  ))
                }
              </motion.div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </AnimatedPage>
  );
};

export default MenuPage;
