import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';

const ThemeToggle = () => {
  const { resolvedTheme, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
      style={{ 
        background: 'var(--surface)',
        border: '2px solid var(--border)'
      }}
      whileHover={{ rotate: 180 }}
      whileTap={{ scale: 0.9 }}
    >
      <motion.div
        className="absolute"
        initial={false}
        animate={{
          rotate: resolvedTheme === 'dark' ? 0 : 180,
          scale: resolvedTheme === 'dark' ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Moon Icon */}
        <svg 
          className="w-6 h-6" 
          fill="currentColor" 
          viewBox="0 0 24 24"
          style={{ color: 'var(--text)' }}
        >
          <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z"/>
        </svg>
      </motion.div>
      
      <motion.div
        className="absolute"
        initial={false}
        animate={{
          rotate: resolvedTheme === 'light' ? 0 : 180,
          scale: resolvedTheme === 'light' ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Sun Icon */}
        <svg 
          className="w-6 h-6" 
          fill="currentColor" 
          viewBox="0 0 24 24"
          style={{ color: 'var(--text)' }}
        >
          <path d="M12,2a1,1,0,0,1,1,1V4a1,1,0,0,1-2,0V3A1,1,0,0,1,12,2ZM21,11a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V12A1,1,0,0,0,21,11ZM12,20a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V21A1,1,0,0,0,12,20ZM3,11a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V12A1,1,0,0,0,3,11ZM5.64,5.64a1,1,0,0,0-1.42,0L3.64,6.22a1,1,0,0,0,0,1.41L4.78,8.78a1,1,0,0,0,1.42,0L7.22,7.78A1,1,0,0,0,7.22,6.36L5.64,5.64ZM18.36,18.36a1,1,0,0,0-1.42,0l-1.06,1.06a1,1,0,0,0,0,1.42l1.06,1.06a1,1,0,0,0,1.42,0l1.06-1.06A1,1,0,0,0,18.36,18.36ZM12,7a5,5,0,1,0,5,5A5,5,0,0,0,12,7Zm0,8a3,3,0,1,1,3-3A3,3,0,0,1,12,15ZM20.36,6.36l-1.06,1.06a1,1,0,0,0,0,1.42l1.06,1.06a1,1,0,0,0,1.42,0l1.06-1.06a1,1,0,0,0,0-1.42L21.78,6.36A1,1,0,0,0,20.36,6.36ZM6.36,18.36,5.3,19.42a1,1,0,0,0,0,1.42l1.06,1.06a1,1,0,0,0,1.42,0l1.06-1.06a1,1,0,0,0,0-1.42L7.78,18.36A1,1,0,0,0,6.36,18.36Z"/>
        </svg>
      </motion.div>

      {/* Animated ring */}
      <motion.div
        className="absolute inset-0 rounded-full border-2"
        style={{ borderColor: 'var(--primary)' }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0, 0.5]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.button>
  );
};

export default ThemeToggle;
