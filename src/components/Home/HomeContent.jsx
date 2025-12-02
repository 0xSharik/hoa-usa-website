import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Users, 
  Building2,
  ArrowRight
} from 'lucide-react';
import AnnouncementsSection from '../Announcements/AnnouncementsSection';

// --- Main HomeContent Component ---
const HomeContent = () => {
  return (
    <div className="py-16 bg-gradient-to-br from-indigo-200/40 via-indigo-300/40 to-purple-500/45">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome to The Ridge
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your comprehensive resource for homeowners association management, community leadership, and property management solutions.
          </p>
        </motion.div>

        {/* Key Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            {
              title: 'Expert Resources',
              description: 'Access comprehensive guides, articles, and tools for effective HOA management.',
              icon: <BookOpen className="w-8 h-8 text-indigo-600" />
            },
            {
              title: 'Community Support',
              description: 'Connect with other HOA leaders and share best practices for community management.',
              icon: <Users className="w-8 h-8 text-indigo-600" />
            },
            {
              title: 'Professional Services',
              description: 'Find trusted vendors, service providers, and management companies for your community.',
              icon: <Building2 className="w-8 h-8 text-indigo-600" />
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center p-8 bg-white/10 border border-white/20 rounded-2xl hover:shadow-lg transition-shadow backdrop-blur"
            >
              <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Announcements Section */}
        <AnnouncementsSection />

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="bg-gradient-to-r from-indigo-700/40 via-indigo-600/30 to-purple-700/50 rounded-2xl p-8 text-center border border-white/20 mt-8 mb-8"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Get Started Today</h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Explore our resources, find service providers, or get in touch with our team for personalized assistance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/resources"
              className="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors"
            >
              Browse Resources
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link
              to="/directories/vendors"
              className="inline-flex items-center px-6 py-3 bg-white hover:bg-gray-50 text-indigo-600 font-semibold rounded-xl border border-indigo-200 transition-colors"
            >
              Find Vendor Services
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-colors"
            >
              Contact Us
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HomeContent;


 