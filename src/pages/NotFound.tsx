
import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AnimatedPage from "@/components/ui/AnimatedPage";
import CustomButton from "@/components/ui/CustomButton";
import { motion } from "framer-motion";

const NotFound: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <AnimatedPage>
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[80vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-9xl font-bold text-primary/20">404</h1>
          <h2 className="text-2xl font-bold mb-4 -mt-8">Page Not Found</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <CustomButton onClick={() => navigate("/")} withShine>
            Return to Menu
          </CustomButton>
        </motion.div>
      </div>
    </AnimatedPage>
  );
};

export default NotFound;
