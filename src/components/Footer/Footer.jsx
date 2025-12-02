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
                  14460 Falls of Neuse Rd, Suite 149-259
                </p>
                <p className="text-gray-300 text-lg hover:text-white transition-colors duration-300">
                  Raleigh, NC 27614
                </p>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-800">
                <span className="text-sm text-gray-400 uppercase tracking-wider mb-4 block">Stay In Touch</span>
                <div className="flex space-x-4">
                  {[
                    { icon: FaFacebook, name: 'facebook', color: 'from-blue-600 to-blue-400' },
                    { icon: FaTwitter, name: 'twitter', color: 'from-sky-600 to-sky-400' },
                    { icon: FaLinkedin, name: 'linkedin', color: 'from-blue-700 to-blue-500' }
                  ].map((social) => (
                    <a
                      key={social.name}
                      href={`https://${social.name}.com`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative group/social"
                      aria-label={social.name}
                      onMouseEnter={() => setHoveredSocial(social.name)}
                      onMouseLeave={() => setHoveredSocial(null)}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-r ${social.color} rounded-lg blur-lg opacity-0 group-hover/social:opacity-60 transition-opacity duration-300`}></div>
                      <div 
                        className="relative w-12 h-12 flex items-center justify-center bg-gray-800 rounded-lg border border-gray-700 group-hover/social:border-transparent transition-all duration-300"
                        style={{
                          transform: hoveredSocial === social.name ? 'translateY(-4px) scale(1.1)' : 'translateY(0) scale(1)',
                          background: hoveredSocial === social.name ? `linear-gradient(135deg, ${social.color.split(' ')[1]}, ${social.color.split(' ')[2]})` : ''
                        }}
                      >
                        <social.icon className="w-5 h-5 text-gray-400 group-hover/social:text-white transition-colors duration-300" />
                      </div>
                    </a>
                  ))}
                </div>
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
              {['Home', 'About', 'Articles', 'Vendor Directory', 'Advertise', 'Contact'].map((link, index) => (
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
                    info@hoa-usa.com
                  </Link>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-600/20 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <Link to="tel:1-800-HOA-USA" className="text-gray-300 hover:text-white transition-colors duration-300">
                    1-800-HOA-USA
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
        <div className="relative mt-12 pt-8 border-t border-gray-800/50">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
          <p className="text-center text-gray-500 text-sm">
            <span className="inline-block hover:text-gray-300 transition-colors duration-300">
              &copy; {currentYear} The Ridge. All rights reserved.
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;