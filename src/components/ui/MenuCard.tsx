
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MenuItem } from '@/types';
import { cn } from '@/lib/utils';

interface MenuCardProps {
  item: MenuItem;
  className?: string;
}

const MenuCard: React.FC<MenuCardProps> = ({ item, className }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // Function to handle retry loading images
  const handleRetry = () => {
    if (retryCount < 2) { // Max 2 retries
      setIsLoading(true);
      setHasError(false);
      setRetryCount(prevCount => prevCount + 1);
    }
  };

  return (
    <motion.div 
      className={cn(
        "relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300",
        "border border-border hover:border-primary/20 h-full flex flex-col",
        className
      )}
      whileHover={{ y: -4 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Link to={`/item/${item.id}`} className="flex flex-col h-full">
        <div className="relative aspect-video overflow-hidden">
          {isLoading && (
            <div className="absolute inset-0 bg-muted animate-pulse" />
          )}
          {hasError && (
            <div className="absolute inset-0 bg-muted flex items-center justify-center flex-col">
              <span className="text-muted-foreground text-sm">Image unavailable</span>
              {retryCount < 2 && (
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleRetry();
                  }}
                  className="text-xs text-primary mt-1 hover:underline"
                >
                  Retry
                </button>
              )}
            </div>
          )}
          <img
            src={item.image}
            alt={item.name}
            key={`${item.id}-${retryCount}`} // Force re-render on retry
            className={cn(
              "w-full h-full object-cover transition-opacity duration-700",
              (isLoading || hasError) ? "opacity-0" : "opacity-100"
            )}
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false);
              setHasError(true);
              console.error(`Failed to load image for: ${item.name}, URL: ${item.image}`);
            }}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 pt-12">
            <div className="flex flex-col gap-1">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-white/20 backdrop-blur-sm text-white">
                RM {item.price.toFixed(2)}
              </span>
              {item.usdPrice && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-white/10 backdrop-blur-sm text-white/80">
                  ≈ USD {item.usdPrice.toFixed(1)}
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex flex-col flex-grow p-4">
          <h3 className="font-semibold text-lg mb-1 text-foreground">{item.name}</h3>
          
          <p className="text-muted-foreground text-sm mb-4 line-clamp-2 flex-grow">
            {item.ingredients.join(', ')}
          </p>
          
          {item.options && item.options.length > 0 && (
            <div className="mt-auto">
              <span className="text-xs font-medium text-primary">
                Customizable options available
              </span>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
};

export default MenuCard;
