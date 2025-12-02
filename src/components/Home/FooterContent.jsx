import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Building2, Mail, Phone } from 'lucide-react';

const FooterContent = () => {
  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-white font-bold text-xl">The Ridge</h3>
            </div>
            <p className="text-gray-400 mb-4 leading-relaxed">
              Leading resource for HOA management excellence nationwide. Trusted by 50,000+ communities.
            </p>
            <div className="flex gap-3">
              {['facebook', 'twitter', 'linkedin'].map((social) => (
                <motion.a
                  key={social}
                  href={`https://${social}.com`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-indigo-600 transition-colors"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <span className="text-sm capitalize">{social[0]}</span>
                </motion.a>
              ))}
            </div>
          </div>

          {[
            { title: 'Company', links: ['About', 'Careers', 'Partners', 'Contact'] },
            { title: 'Resources', links: ['Articles', 'Videos', 'Guides', 'FAQs'] },
            { title: 'Legal', links: ['Privacy', 'Terms', 'Security', 'Cookies'] }
          ].map((column, i) => (
            <div key={i}>
              <h4 className="text-white font-semibold mb-4">{column.title}</h4>
              <ul className="space-y-2">
                {column.links.map((link) => (
                  <li key={link}>
                    <Link 
                      to={`/${link.toLowerCase()}`}
                      className="text-gray-400 hover:text-indigo-400 transition-colors"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600/20 rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <p className="text-white font-medium">Email Us</p>
                <Link to="/contact" className="text-gray-400 text-sm hover:text-indigo-400 transition-colors">
                  info@hoa-usa.com
                </Link>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600/20 rounded-lg flex items-center justify-center">
                <Phone className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <p className="text-white font-medium">Call Us</p>
                <Link to="tel:1-800-HOA-USA" className="text-gray-400 text-sm hover:text-indigo-400 transition-colors">
                  1-800-HOA-USA
                </Link>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600/20 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <p className="text-white font-medium">Location</p>
                <p className="text-gray-400 text-sm">Raleigh, NC 27614</p>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © 2024 The Ridge Inc. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link to="/directories/vendors" className="text-gray-500 hover:text-indigo-400 text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link to="/directories/vendors" className="text-gray-500 hover:text-indigo-400 text-sm transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterContent;
