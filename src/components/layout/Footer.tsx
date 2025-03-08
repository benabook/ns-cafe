
import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="py-8 border-t border-border bg-card">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="text-xl font-bold text-foreground flex items-center">
              <span className="gradient-text">NS</span>
              <span className="ml-1 text-foreground/80">Café</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Healthy, nutritious food made fresh daily.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 items-center text-sm text-muted-foreground">
            <span>&copy; {currentYear} NS Café. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
