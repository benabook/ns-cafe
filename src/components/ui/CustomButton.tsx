
import React from 'react';
import { cn } from '@/lib/utils';
import { Button, ButtonProps } from '@/components/ui/button';

interface CustomButtonProps extends ButtonProps {
  children: React.ReactNode;
  withShine?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({ 
  children, 
  className, 
  withShine = false,
  ...props 
}) => {
  return (
    <Button
      className={cn(
        "rounded-xl font-medium transition-all duration-200 transform active:scale-95",
        withShine && "button-shine",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
};

export default CustomButton;
