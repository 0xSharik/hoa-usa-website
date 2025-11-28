import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SubpageLayout from '../components/Layout/SubpageLayout';
import { Building2, Users, BookOpen, Award, Target, Shield, TrendingUp, CheckCircle } from 'lucide-react';

const About = () => {
  return (
    <SubpageLayout 
      title="About HOA-USA"
      description="Supporting homeowner associations across the United States with resources and tools"
    >
      <div className="bg-white">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
              <motion.div 
                className="mb-8 lg:mb-0"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-indigo-200 font-medium">Leading HOA Resource Platform</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">About HOA-USA</h1>
                <p className="text-xl mb-8 leading-relaxed text-indigo-100">
                  There are over 370,000 homeowner associations in the United States. Collectively, this represents over 40 million households (over 53% of the owner occupied households in America).
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link 
                    to="/contact" 
                    className="bg-white text-indigo-700 hover:bg-gray-100 px-8 py-3 rounded-xl font-semibold text-center transition-all transform hover:scale-105 shadow-lg"
                  >
                    Contact Us
                  </Link>
                  <a 
                    href="#mission" 
                    className="border-2 border-white text-white hover:bg-white hover:bg-opacity-10 px-8 py-3 rounded-xl font-semibold text-center transition-all"
                  >
                    Our Mission
                  </a>
                </div>
              </motion.div>
              
              <motion.div 
                className="bg-white/10 p-2 rounded-xl backdrop-blur-sm"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className="bg-white/95 p-8 rounded-xl shadow-2xl">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                    <BookOpen className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Get Your FREE Guide to Understanding Homeowners Associations</h3>
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    Download our comprehensive guide to learn everything you need to know about HOAs, from board responsibilities to community management.
                  </p>
                  <motion.button 
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Download Free Guide
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Mission Section */}
        <div id="mission" className="py-20 bg-gradient-to-br from-gray-50 via-indigo-50 to-purple-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="w-8 h-8 text-indigo-600" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Mission: Education, Support & Referrals</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Empowering HOA communities with comprehensive resources and expert guidance
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {[
                {
                  icon: BookOpen,
                  title: "Education",
                  description: "Comprehensive guides, articles, and training materials for HOA board members and residents",
                  color: "from-indigo-600 to-indigo-700"
                },
                {
                  icon: Users,
                  title: "Support",
                  description: "Direct assistance and resources to help volunteers navigate HOA governance challenges",
                  color: "from-purple-600 to-purple-700"
                },
                {
                  icon: Building2,
                  title: "Referrals",
                  description: "Connecting communities with trusted vendors and professional service providers",
                  color: "from-indigo-600 to-indigo-700"
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * index, duration: 0.8 }}
                  className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200 hover:shadow-xl transition-all"
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center mb-6`}>
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                </motion.div>
              ))}
            </div>

            <motion.div 
              className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <div className="prose prose-lg text-gray-700 max-w-none">
                <p className="mb-6 text-lg leading-relaxed">
                  HOA-USA is dedicated to providing resources that promote a better understanding and governance of townhome, condominium, and single family homeowner associations.
                </p>
                
                <p className="mb-6 text-lg leading-relaxed">
                  It also represents millions of volunteers that serve on homeowner association boards and committees. HOA-USA was created to help those volunteers navigate the complexities of serving on boards of homeowner associations by providing the tools and resources they need in one convenient place to make their job as a volunteer as easy and stress-free as possible.
                </p>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  {[
                    "Promote synergistic cooperation among various stakeholders",
                    "Create and maintain the largest comprehensive HOA database",
                    "Produce educational content for our email subscribers",
                    "Provide resources and directories free of charge"
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" />
                      <p className="text-gray-700">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </SubpageLayout>
  );
};

export default About;