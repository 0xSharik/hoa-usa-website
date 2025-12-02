import React from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  Mail, 
  Phone, 
  CheckCircle, 
  TrendingUp, 
  Target, 
  Star
} from 'lucide-react';

const Advertise = () => {
  const advertisingOptions = [
    {
      title: 'Banner Ads',
      description: 'Premium banner placements on high-traffic pages',
      image: 'https://via.placeholder.com/400x200?text=Banner+Ad'
    },
    {
      title: 'Sponsored Content',
      description: 'Native advertising that engages your audience',
      image: 'https://via.placeholder.com/400x200?text=Sponsored+Content'
    },
    {
      title: 'Email Campaigns',
      description: 'Reach our subscribers with targeted email blasts',
      image: 'https://via.placeholder.com/400x200?text=Email+Campaigns'
    }
  ];

  return (
    <div className="min-h-screen pt-24">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
              <Target className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Advertise With Us</h1>
            <p className="text-xl text-indigo-100 max-w-3xl mx-auto">
              Reach thousands of HOA decision-makers and grow your business with targeted advertising solutions
            </p>
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 via-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { number: '370K+', label: 'HOA Communities', icon: Building2 },
              { number: '44K+', label: 'Email Subscribers', icon: Mail },
              { number: '93%', label: 'Partner Retention', icon: TrendingUp },
              { number: '15+', label: 'Years Experience', icon: Star }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * index, duration: 0.8 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-indigo-600" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Content Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-indigo-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">The Ridge Partner Program</h2>
            </div>
            <p className="text-gray-600 mb-8 leading-relaxed text-lg">
              The Ridge Partner Program is perfect for companies looking to market your products/services to the board members and decision makers of homeowner associations in your city, state or nationally. There are over 370,000 single family, townhome and condominium associations in the U.S. that spend billions of dollars annually. For over 15 years The Ridge has successfully helped companies like yours gain exposure to this hard-to-reach market.
            </p>
            
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Target className="w-6 h-6 text-indigo-600" />
                Why Advertise With Us?
              </h3>
              <div className="space-y-4">
                {[
                  'Over 44,000 HOA boards and managers subscribe to our emails!',
                  'Our website receives daily traffic from boards and managers in your area.',
                  'Minimal cost with very high return-on-investment potential!',
                  'We developed the first comprehensive HOA database in the U.S. of over 370,000 HOAs!',
                  'Being featured in our "Partner Showcase" email brings direct leads to you, almost immediately!'
                ].map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-1" />
                    <p className="text-gray-700">{benefit}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="mb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Star className="w-6 h-6 text-indigo-600" />
                Partner Benefits
              </h3>
              <div className="space-y-4">
                {[
                  'Banner Advertising on highly-visited pages throughout your state-specific sections',
                  'National companies have the opportunity to be featured on our home page',
                  'Banner Ad and Contact Info in the Vendor Directory',
                  'Inclusion in our "Partner Showcase" emails',
                  'Opportunity to purchase targeted lists of HOAs in your area',
                  'Sponsored content with full editorial credit',
                  'Management companies receive special placement',
                  'First opportunity to renew – 93% retention rate'
                ].map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-1" />
                    <p className="text-gray-700">{benefit}</p>
                  </motion.div>
                ))}
              </div>
            </div>

           
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Advertise;
