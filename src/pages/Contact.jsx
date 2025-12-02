import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Send, 
  CheckCircle, 
  MessageSquare,
  Clock,
  ArrowRight,
  Building2
} from 'lucide-react';
import ComplaintForm from '../components/ComplaintForm/ComplaintForm';
import ContactForm from '../components/ContactForm/ContactForm';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    try {
      // Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      
      // Reset status after 5 seconds
      setTimeout(() => {
        setSubmitStatus(null);
      }, 5000);
    }
  };

  const contactMethods = [
    {
      icon: <Phone className="w-6 h-6 text-indigo-600" />,
      title: 'Call Us',
      details: ['+1 (800) 123-4567', 'Mon-Fri: 9am-6pm EST'],
      link: 'tel:+18001234567',
      linkText: 'Call Now'
    },
    {
      icon: <Mail className="w-6 h-6 text-indigo-600" />,
      title: 'Email Us',
      details: ['info@the-ridge.com', 'support@the-ridge.com'],
      link: 'mailto:info@the-ridge.com',
      linkText: 'Send Email'
    },
    {
      icon: <MapPin className="w-6 h-6 text-indigo-600" />,
      title: 'Visit Us',
      details: ['123 HOA Center', 'Suite 100', 'Raleigh, NC 27601'],
      link: 'https://maps.google.com',
      linkText: 'Get Directions',
      target: '_blank'
    }
  ];

  const faqs = [
    {
      question: 'What are your customer service hours?',
      answer: 'Our customer service team is available Monday through Friday, 9:00 AM to 6:00 PM EST.'
    },
    {
      question: 'How can I update my account information?',
      answer: 'You can update your account information by logging into your account and accessing the profile settings.'
    },
    {
      question: 'Do you offer support for HOA board members?',
      answer: 'Yes, we offer dedicated support for HOA board members. Please contact our support team for assistance.'
    },
    {
      question: 'How do I report a website issue?',
      answer: 'Please use the contact form above to report any website issues you encounter.'
    }
  ];

  return (
    <div className="min-h-screen pt-24">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-indigo-600 to-purple-700 text-white py-20 overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80)'
          }}
        ></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
              <MessageSquare className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
            <p className="text-xl text-indigo-100 max-w-3xl mx-auto">
              We're here to help. Get in touch with our team for any questions or support.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Contact Methods */}
      <section className="py-16 bg-gradient-to-br from-gray-50 via-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Get in Touch</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the most convenient way to reach our support team
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {contactMethods.map((method, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="bg-gradient-to-br from-gray-50 via-indigo-50 to-purple-50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 text-center group"
                whileHover={{ y: -5 }}
              >
                <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-indigo-200 transition-colors">
                  {method.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{method.title}</h3>
                <div className="space-y-2 mb-6">
                  {method.details.map((detail, i) => (
                    <p key={i} className="text-gray-600">{detail}</p>
                  ))}
                </div>
                <a 
                  href={method.link} 
                  target={method.target || '_self'}
                  rel={method.target ? 'noopener noreferrer' : ''}
                  className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-semibold group-hover:gap-3 transition-all"
                >
                  {method.linkText}
                  <ArrowRight className="w-4 h-4" />
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Address and Image Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 via-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Visit Our Office</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Stop by our headquarters or reach out to us through any of the contact methods
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Map */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="order-2 lg:order-1"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl h-96">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5433.286814341842!2d-122.464838!3d48.7648!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5485e9f5c5e5e5e5%3A0x8c3e2e9a3a3e3e1a!2sBlaine%2C%20WA%2098231!5e0!3m2!1sen!2s!4v1620000000000!5m2!1sen!2s"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  title="Our Location"
                ></iframe>
              </div>
            </motion.div>
            
            {/* Right Side - Address */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="order-1 lg:order-2 space-y-8"
            >
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">The Ridge – East Maple Ridge Community Association</h3>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <MapPin className="w-5 h-5 text-indigo-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Address</h4>
                      <p className="text-gray-600 leading-relaxed">
                        P.O. Box 1022<br />
                        Blaine, WA 98231
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <Mail className="w-5 h-5 text-indigo-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Email</h4>
                      <p className="text-gray-600 leading-relaxed">
                        emrcommunityHOA@gmail.com
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <Building2 className="w-5 h-5 text-indigo-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Officers</h4>
                      <p className="text-gray-600 leading-relaxed">
                        President: Navneet Toor<br />
                        Vice President: Paul Oglesbee<br />
                        Treasurer/Secretary: Drew Henrie-McWilliams
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <Building2 className="w-5 h-5 text-indigo-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Manager</h4>
                      <p className="text-gray-600 leading-relaxed">
                        Letha Nelson
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t border-indigo-200">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <a
                      href="mailto:emrcommunityHOA@gmail.com"
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                      Email Us
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      
      
      
      {/* Forms Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 via-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Get in Touch</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Use the forms below to send us a message or file a complaint. We'll respond as soon as possible.
            </p>
          </motion.div>
          
          <div className="space-y-16">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              <ContactForm />
            </motion.div>
            
            {/* Complaint Form */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <ComplaintForm />
            </motion.div>
          </div>
        </div>
      </section>
      {/* FAQ Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 via-indigo-50 to-purple-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center mb-12"
          >
            <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-indigo-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Find answers to common questions below</p>
          </motion.div>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-gradient-to-br from-gray-50 via-indigo-50 to-purple-50 rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                <button className="w-full px-6 py-4 text-left focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-inset">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
                    <ArrowRight className="h-5 w-5 text-indigo-600 transform rotate-90" />
                  </div>
                </button>
                <div className="px-6 pb-4">
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              </motion.div>
            ))}
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-12 text-center"
          >
            <p className="text-gray-600 mb-6">Still have questions?</p>
            <a
              href="#contact-form"
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors"
            >
              Contact Support
              <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default Contact;
