import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { submitComplaint } from '../../firebase/services/formService';
import { AlertTriangle, User, Mail, Phone, Building, MessageSquare, Clock, CheckCircle } from 'lucide-react';

const initialFormData = {
  dateSubmitted: new Date().toISOString().split('T')[0],
  name: '',
  propertyAddress: '',
  mailingAddress: '',
  phone: '',
  email: '',
  complaintTypes: [],
  otherComplaintType: '',
  description: '',
  evidenceFiles: null,
  resolutionAttempted: '',
  resolutionDescription: '',
  desiredResolution: '',
  signature: '',
  signatureDate: new Date().toISOString().split('T')[0]
};

const ComplaintForm = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const complaintTypeOptions = [
    'Noise / Nuisance',
    'Property Maintenance / Violation',
    'Landscaping',
    'Parking / Vehicle Issue',
    'Pets / Animals',
    'Common Area Concern',
    'Other'
  ];

  const urgencyLevels = [
    { value: 'low', label: 'Low - Can wait for regular processing' },
    { value: 'normal', label: 'Normal - Standard processing time' },
    { value: 'high', label: 'High - Requires attention soon' },
    { value: 'urgent', label: 'Urgent - Immediate attention required' }
  ];

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'checkbox') {
      if (checked) {
        setFormData(prev => ({
          ...prev,
          complaintTypes: [...prev.complaintTypes, value]
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          complaintTypes: prev.complaintTypes.filter(type => type !== value)
        }));
      }
    } else if (type === 'file') {
      setFormData(prev => ({
        ...prev,
        [name]: files[0]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const sanitizedFormData = { ...formData };
      delete sanitizedFormData.evidenceFiles;
      await submitComplaint(sanitizedFormData);
      setSubmitted(true);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setSubmitted(false);
        setFormData(initialFormData);
      }, 3000);
    } catch (error) {
      console.error('Error submitting complaint:', error);
      setError('Failed to submit complaint. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  if (submitted) {
    return (
      <section className="bg-gradient-to-br from-gray-50 via-indigo-50 to-purple-50 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200"
          >
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Complaint Submitted Successfully!</h3>
            <p className="text-gray-600 mb-6">
              Thank you for bringing this matter to our attention. We have received your complaint and will review it promptly. You should receive a confirmation email shortly.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
              <AlertTriangle className="w-4 h-4" />
              Reference ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gradient-to-br from-gray-50 via-indigo-50 to-purple-50 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-8 h-8 text-indigo-600" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            File a Complaint
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Having issues with your HOA? We're here to help. Submit your complaint and we'll review it promptly to ensure your concerns are addressed.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200"
        >
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-3">
              <AlertTriangle className="w-5 h-5" />
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Date Submitted */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Date Submitted:
              </label>
              <input
                type="date"
                name="dateSubmitted"
                value={formData.dateSubmitted}
                onChange={handleChange}
                className="bg-transparent border-b-2 border-gray-300 focus:border-indigo-500 outline-none px-2 py-1"
                readOnly
              />
            </div>

            {/* 1. Homeowner Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 border-b-2 border-indigo-600 pb-2">
                1. Homeowner Information
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Name: 
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border-b-2 border-gray-300 focus:border-indigo-500 outline-none bg-transparent"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Phone Number: 
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border-b-2 border-gray-300 focus:border-indigo-500 outline-none bg-transparent"
                    placeholder="(123) 456-7890"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Property Address: 
                </label>
                <input
                  type="text"
                  name="propertyAddress"
                  value={formData.propertyAddress}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border-b-2 border-gray-300 focus:border-indigo-500 outline-none bg-transparent"
                  placeholder="123 Main St, Unit 4B"
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Mailing Address (if different): 
                </label>
                <input
                  type="text"
                  name="mailingAddress"
                  value={formData.mailingAddress}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border-b-2 border-gray-300 focus:border-indigo-500 outline-none bg-transparent"
                  placeholder="456 PO Box, City, State 12345"
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Email Address: 
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border-b-2 border-gray-300 focus:border-indigo-500 outline-none bg-transparent"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            {/* 2. Nature of Complaint */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 border-b-2 border-indigo-600 pb-2">
                2. Nature of Complaint
              </h3>
              
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-3">
                  Type of Complaint (check all that apply):
                </label>
                <div className="space-y-2">
                  {complaintTypeOptions.map((type) => (
                    <label key={type} className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
                      <input
                        type="checkbox"
                        name="complaintTypes"
                        value={type}
                        checked={formData.complaintTypes.includes(type)}
                        onChange={handleChange}
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <span className="text-gray-700"> {type}</span>
                    </label>
                  ))}
                  {formData.complaintTypes.includes('Other') && (
                    <input
                      type="text"
                      name="otherComplaintType"
                      value={formData.otherComplaintType}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border-b-2 border-gray-300 focus:border-indigo-500 outline-none bg-transparent ml-7"
                      placeholder="Please specify: ___________________________________________"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* 3. Description of Complaint */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 border-b-2 border-indigo-600 pb-2">
                3. Description of Complaint
              </h3>
              
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-3">
                  Please describe the issue in detail. Include specific dates, times, locations, and any individual involved (if known).
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-surface text-text placeholder-textMuted"
                  placeholder="Provide detailed description of the complaint..."
                />
              </div>
            </div>

            {/* 4. Evidence or Documentation */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 border-b-2 border-indigo-600 pb-2">
                4. Evidence or Documentation
              </h3>
              
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-3">
                  (Attach photos, letters, or other supporting materials if available.)
                </label>
                <input
                  type="file"
                  name="evidenceFiles"
                  onChange={handleChange}
                  accept="image/*,.pdf,.doc,.docx"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* 5. Have You Attempted to Resolve the Issue? */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 border-b-2 border-indigo-600 pb-2">
                5. Have You Attempted to Resolve the Issue?
              </h3>
              
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="resolutionAttempted"
                    value="yes"
                    checked={formData.resolutionAttempted === 'yes'}
                    onChange={handleChange}
                    className="w-4 h-4 text-indigo-600 border-gray-300"
                  />
                  <span className="text-gray-700"> Yes</span>
                </label>
                
                {formData.resolutionAttempted === 'yes' && (
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      If yes, please describe your efforts:
                    </label>
                    <textarea
                      name="resolutionDescription"
                      value={formData.resolutionDescription}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-surface text-text placeholder-textMuted"
                      placeholder="Describe your attempts to resolve the issue..."
                    />
                  </div>
                )}
                
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="resolutionAttempted"
                    value="no"
                    checked={formData.resolutionAttempted === 'no'}
                    onChange={handleChange}
                    className="w-4 h-4 text-indigo-600 border-gray-300"
                  />
                  <span className="text-gray-700"> No</span>
                </label>
              </div>
            </div>

            {/* 6. Desired Resolution */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 border-b-2 border-indigo-600 pb-2">
                6. Desired Resolution
              </h3>
              
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-3">
                  What would you like the HOA to do regarding this issue?
                </label>
                <textarea
                  name="desiredResolution"
                  value={formData.desiredResolution}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-surface text-text placeholder-textMuted"
                  placeholder="Describe your desired resolution..."
                />
              </div>
            </div>

            {/* 7. Signature */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 border-b-2 border-indigo-600 pb-2">
                7. Signature
              </h3>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 text-sm mb-4">
                  I certify that the information provided is true and accurate to the best of my knowledge.
                </p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Signature: 
                    </label>
                    <input
                      type="text"
                      name="signature"
                      value={formData.signature}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border-b-2 border-gray-300 focus:border-indigo-500 outline-none bg-transparent"
                      placeholder="Type your full name as signature"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Date: 
                    </label>
                    <input
                      type="date"
                      name="signatureDate"
                      value={formData.signatureDate}
                      onChange={handleChange}
                      className="bg-transparent border-b-2 border-gray-300 focus:border-indigo-500 outline-none px-2 py-1"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center pt-6">
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-lg transition duration-300 shadow-lg hover:shadow-xl flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-5 h-5" />
                    Submit Complaint
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default ComplaintForm;
