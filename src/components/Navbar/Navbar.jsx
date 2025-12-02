import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import logo from '../../assets/logo.png';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const location = useLocation();

  // Custom Link component that scrolls to top
  const ScrollToTopLink = ({ to, onClick, children, className, ...props }) => {
    const handleClick = (e) => {
      // Immediate scroll for faster perceived navigation
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      if (onClick) onClick(e);
    };

    return (
      <Link to={to} className={className} onClick={handleClick} {...props}>
        {children}
      </Link>
    );
  };

  const navItems = [
    { name: "Home" },
    { name: "Resources" },
    { name: "Contact" },
  ];

  const toggleMenu = () => setIsMenuOpen((v) => !v);

  const isActive = (path) => location.pathname === path;
  const isActiveSubmenu = (basePath) =>
    location.pathname.startsWith(basePath);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navbarVariants = {
    initial: { y: -80, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 120, damping: 22 },
    },
  };

  const mobileMenuVariants = {
    closed: { opacity: 0, height: 0 },
    open: {
      opacity: 1,
      height: "auto",
      transition: { duration: 0.15 },
    },
  };

  return (
    <>
      {/* FLOATING GLOSSY NAVBAR */}
      <motion.nav
        initial="initial"
        animate="animate"
        variants={navbarVariants}
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl rounded-2xl border backdrop-blur-xl transition-all"
        style={{
          background: scrolled
            ? "linear-gradient(180deg, rgba(255,255,255,0.95), rgba(245,247,255,0.9))"
            : "linear-gradient(180deg, rgba(255,255,255,0.85), rgba(255,255,255,0.65))",
          boxShadow: scrolled
            ? "0 14px 45px rgba(0,0,0,0.18)"
            : "0 6px 22px rgba(0,0,0,0.1)",
          borderColor: "rgba(0,0,0,0.08)",
        }}
      >
        {/* Gloss Highlight */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent" />

        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between h-16 items-center">
            {/* LOGO */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3"
            >
              {/* Logo Image */}
              <ScrollToTopLink to="/" className="flex items-center gap-3">
                <img 
                  src={logo} 
                  alt="The Ridge" 
                  className="h-10 w-auto object-contain"
                  style={{ maxHeight: '40px' }}
                />
                <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-sm">
                  The Ridge
                </span>
              </ScrollToTopLink>
            </motion.div>

            {/* DESKTOP NAV */}
            <div className="hidden md:flex items-center space-x-6">
              {navItems.map((item, index) => {
                const path = `/${item.name.toLowerCase().replace(/\s+/g, "-")}`;

                return (
                  <motion.div
                    key={item.name}
                    className="relative"
                    initial={{ opacity: 0, y: -12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08 * index }}
                  >
                    <ScrollToTopLink
                      to={path}
                      className={`relative px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-150 ${
                        isActive(path) || isActiveSubmenu(path)
                          ? "text-indigo-600 bg-indigo-500/10"
                          : "text-gray-700 hover:text-indigo-600 hover:bg-indigo-500/5"
                      }`}
                    >
                      {item.name}
                    </ScrollToTopLink>
                  </motion.div>
                );
              })}
            </div>

            {/* MOBILE BUTTON */}
            <div className="md:hidden">
              <motion.button
                onClick={toggleMenu}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-xl text-gray-700 hover:bg-indigo-500/10"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={
                      isMenuOpen
                        ? "M6 18L18 6M6 6l12 12"
                        : "M4 6h16M4 12h16M4 18h16"
                    }
                  />
                </svg>
              </motion.button>
            </div>
          </div>
        </div>

        {/* MOBILE MENU */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="md:hidden mt-4 mx-4 rounded-2xl border backdrop-blur-xl shadow-2xl overflow-hidden"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.95), rgba(245,247,255,0.9))",
                borderColor: "rgba(0,0,0,0.08)",
              }}
            >
              <div className="px-4 py-4 space-y-2">
                {navItems.map((item) => {
                  const path = `/${item.name.toLowerCase().replace(/\s+/g, "-")}`;

                  return (
                    <ScrollToTopLink
                      key={item.name}
                      to={path}
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-3 py-2 rounded-lg text-sm font-semibold text-gray-700 hover:bg-indigo-500/10 hover:text-indigo-600 transition duration-150"
                    >
                      {item.name}
                    </ScrollToTopLink>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
};

export default Navbar;
