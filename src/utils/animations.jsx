import React from 'react';
import { motion } from 'framer-motion';

// Advanced animation variants
export const animations = {
  // Stagger container animations
  staggerContainer: {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  },

  // Fade and slide up with spring
  fadeInUpSpring: {
    hidden: { 
      opacity: 0, 
      y: 60,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        mass: 1
      }
    }
  },

  // Fade and slide from left
  slideInLeft: {
    hidden: { 
      opacity: 0, 
      x: -100,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      x: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 15
      }
    }
  },

  // Fade and slide from right
  slideInRight: {
    hidden: { 
      opacity: 0, 
      x: 100,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      x: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 15
      }
    }
  },

  // Scale and rotate entrance
  scaleInRotate: {
    hidden: { 
      opacity: 0, 
      scale: 0,
      rotate: -180
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20
      }
    }
  },

  // Text reveal animation
  textReveal: {
    hidden: { 
      opacity: 0,
      y: 50
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  },

  // Glow effect
  glowPulse: {
    initial: { 
      boxShadow: "0 0 0 0 rgba(79, 70, 229, 0.4)"
    },
    animate: {
      boxShadow: [
        "0 0 0 0 rgba(79, 70, 229, 0.4)",
        "0 0 0 20px rgba(79, 70, 229, 0)",
        "0 0 0 0 rgba(79, 70, 229, 0)"
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatDelay: 1
      }
    }
  },

  // Floating animation
  float: {
    initial: { y: 0 },
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  },

  // Typewriter effect for text
  typewriter: {
    hidden: { width: 0 },
    visible: {
      width: "auto",
      transition: {
        duration: 2,
        ease: "easeInOut"
      }
    }
  }
};

// Custom animated components
export const AnimatedSection = ({ children, className = "", variants = "fadeInUpSpring" }) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={animations[variants]}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const AnimatedCard = ({ children, className = "", delay = 0 }) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={animations.fadeInUpSpring}
      transition={{ delay }}
      whileHover={{ 
        y: -8, 
        scale: 1.02,
        boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
        transition: { duration: 0.3 }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const AnimatedGradient = ({ children, className = "" }) => {
  return (
    <motion.div
      animate={{
        background: [
          "linear-gradient(45deg, #667eea, #764ba2)",
          "linear-gradient(45deg, #764ba2, #f093fb)",
          "linear-gradient(45deg, #f093fb, #f5576c)",
          "linear-gradient(45deg, #f5576c, #667eea)"
        ]
      }}
      transition={{
        duration: 10,
        repeat: Infinity,
        ease: "linear"
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const AnimatedText = ({ text, className = "", delay = 0 }) => {
  return (
    <motion.h1
      initial="hidden"
      animate="visible"
      variants={animations.textReveal}
      transition={{ delay }}
      className={className}
    >
      {text}
    </motion.h1>
  );
};

// Particle background component
export const ParticleBackground = () => {
  const particles = Array.from({ length: 50 }, (_, i) => i);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-primary opacity-20 rounded-full"
          animate={{
            x: [0, Math.random() * 100],
            y: [0, Math.random() * 100],
            scale: [1, 0, 1],
            opacity: [0.2, 0.8, 0.2]
          }}
          transition={{
            duration: 10 + Math.random() * 20,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeInOut"
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`
          }}
        />
      ))}
    </div>
  );
};

// Morphing shape component
export const MorphingShape = ({ className = "" }) => {
  return (
    <motion.div
      className={className}
      animate={{
        borderRadius: [
          "20% 80% 30% 70% / 60% 40% 60% 40%",
          "80% 20% 70% 30% / 40% 60% 40% 60%",
          "30% 70% 20% 80% / 60% 40% 60% 40%",
          "70% 30% 80% 20% / 40% 60% 40% 60%"
        ]
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  );
};

export default animations;
