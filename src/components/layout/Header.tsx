
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const Header: React.FC = () => {
  const { getItemCount } = useCart();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const itemCount = getItemCount();
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    // Close mobile menu when navigating
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navItems = [
    { name: 'Menu', path: '/' },
    { name: 'Orders', path: '/orders' },
  ];

  const isAdmin = location.pathname === '/admin';
  
  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "py-3" : "py-5",
        isScrolled 
          ? "bg-white/70 backdrop-blur-xl border-b border-border/50"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link 
          to="/" 
          className="text-xl font-bold text-foreground z-20 flex items-center"
        >
          <span className="gradient-text">NS</span>
          <span className="ml-1 text-foreground/80">Café</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {!isAdmin && navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                location.pathname === item.path
                  ? "bg-primary/10 text-primary"
                  : "hover:bg-secondary text-muted-foreground hover:text-foreground"
              )}
            >
              {item.name}
            </Link>
          ))}
          
          {isAdmin ? (
            <Link 
              to="/"
              className="px-4 py-2 rounded-lg bg-primary/10 text-primary text-sm font-medium"
            >
              Exit Admin
            </Link>
          ) : (
            <Link
              to="/admin"
              className="px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-secondary text-muted-foreground hover:text-foreground"
            >
              Admin
            </Link>
          )}
          
          {!isAdmin && (
            <Link to="/cart" className="relative ml-2">
              <Button 
                variant={itemCount > 0 ? "default" : "ghost"} 
                size="icon"
                className="rounded-full h-10 w-10"
              >
                <ShoppingBag className="h-[1.2rem] w-[1.2rem]" />
                
                <AnimatePresence>
                  {itemCount > 0 && (
                    <motion.div
                      key="cart-badge"
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.6, opacity: 0 }}
                      className="absolute -top-1 -right-1"
                    >
                      <Badge className="h-5 min-w-[20px] flex items-center justify-center">
                        {itemCount}
                      </Badge>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </Link>
          )}
        </nav>
        
        {/* Mobile Navigation Toggle */}
        <div className="flex items-center md:hidden gap-2 z-20">
          {!isAdmin && (
            <Link to="/cart" className="relative mr-1">
              <Button 
                variant={itemCount > 0 ? "default" : "ghost"} 
                size="icon"
                className="rounded-full h-10 w-10"
              >
                <ShoppingBag className="h-[1.2rem] w-[1.2rem]" />
                
                <AnimatePresence>
                  {itemCount > 0 && (
                    <motion.div
                      key="cart-badge"
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.6, opacity: 0 }}
                      className="absolute -top-1 -right-1"
                    >
                      <Badge className="h-5 min-w-[20px] flex items-center justify-center">
                        {itemCount}
                      </Badge>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </Link>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
        
        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-10 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="absolute top-0 right-0 bottom-0 w-3/4 max-w-sm bg-background p-6 pt-20 shadow-lg"
                onClick={(e) => e.stopPropagation()}
              >
                <nav className="flex flex-col space-y-4">
                  {!isAdmin && navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={cn(
                        "px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                        location.pathname === item.path
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-secondary text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {item.name}
                    </Link>
                  ))}
                  
                  {isAdmin ? (
                    <Link 
                      to="/"
                      className="px-4 py-3 rounded-xl bg-primary/10 text-primary text-sm font-medium"
                    >
                      Exit Admin
                    </Link>
                  ) : (
                    <Link
                      to="/admin"
                      className="px-4 py-3 rounded-xl text-sm font-medium transition-colors hover:bg-secondary text-muted-foreground hover:text-foreground"
                    >
                      Admin
                    </Link>
                  )}
                </nav>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;
