import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PageTransition = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [displayChildren, setDisplayChildren] = useState(children);

  useEffect(() => {
    if (children !== displayChildren) {
      setIsLoading(true);
      
      // Very fast loading time for snappy transitions
      const timer = setTimeout(() => {
        setDisplayChildren(children);
        setIsLoading(false);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [children, displayChildren]);

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.08 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-surface"
        >
          <div className="flex flex-col items-center space-y-4">
            {/* Modern loading spinner */}
            <div className="relative">
              <div className="w-12 h-12 border-4 border-gray-200 rounded-full"></div>
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
            </div>
            <p className="text-sm text-textMuted font-medium animate-pulse">Loading...</p>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ 
            duration: 0.15, 
            ease: [0.4, 0.0, 0.2, 1] 
          }}
        >
          {displayChildren}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PageTransition;
