import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [hoveredLink, setHoveredLink] = useState(null);
  const [hoveredSocial, setHoveredSocial] = useState(null);

  return (
    <footer className="relative bg-gradient-to-b from-slate-900 via-slate-950 to-black text-white pt-20 pb-8 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1.5s'}}></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)',
        backgroundSize: '50px 50px'
      }}></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          {/* Address Section */}
          <div className="group">
            <div className="relative mb-8">
              <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Mailing Address
              </h3>
              <div className="h-1 w-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full group-hover:w-24 transition-all duration-500"></div>
            </div>
            <address className="not-italic">
              <div className="space-y-4">
                <p className="text-gray-300 text-lg leading-relaxed hover:text-white transition-colors duration-300">
                  P.O. Box 1022<br />
                  Blaine, WA 98231
                </p>
                
              </div>
              
              
                
            </address>
          </div>

          {/* Site Links */}
          <div className="group">
            <div className="relative mb-8">
              <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Site Links
              </h3>
              <div className="h-1 w-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full group-hover:w-24 transition-all duration-500"></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {['Home', 'Resources', 'Contact'].map((link, index) => (
                <Link
                  key={link}
                  to={link === 'Home' ? '/' : `/${link.toLowerCase().replace(' & ', '-').replace(' ', '-')}`}
                  className="relative group/link py-2"
                  onMouseEnter={() => setHoveredLink(link)}
                  onMouseLeave={() => setHoveredLink(null)}
                >
                  <span 
                    className="relative z-10 text-gray-300 group-hover/link:text-white transition-colors duration-300"
                    style={{
                      transform: hoveredLink === link ? 'translateX(4px)' : 'translateX(0)',
                      display: 'inline-block',
                      transition: 'all 0.3s ease-out'
                    }}
                  >
                    {link}
                  </span>
                  <div className="absolute left-0 bottom-0 h-0.5 w-0 bg-gradient-to-r from-blue-500 to-indigo-500 group-hover/link:w-full transition-all duration-300"></div>
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Contact */}
          <div className="group">
            <div className="relative mb-8">
              <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Quick Contact
              </h3>
              <div className="h-1 w-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full group-hover:w-24 transition-all duration-500"></div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-600/20 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <Link to="/contact" className="text-gray-300 hover:text-white transition-colors duration-300">
                    emrcommunityHOA@gmail.com
                  </Link>
                </div>
              </div>
              
              

              <div className="mt-6">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                >
                  Send Message
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        
      </div>
    </footer>
  );
};

export default Footer;