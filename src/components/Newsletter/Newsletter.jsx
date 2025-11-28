import React from 'react';
import { useState } from 'react';

const states = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
  'Connecticut', 'Delaware', 'District of Columbia', 'Florida', 'Georgia',
  'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
  'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
  'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
  'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
  'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island',
  'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
  'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
];

const Newsletter = () => {
  const [selectedState, setSelectedState] = useState('');
  const [email, setEmail] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ selectedState, email });
  };

  return (
    <section className="relative py-24 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-200 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div 
          className="relative group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            transform: isHovered ? 'scale(1.02) translateY(-8px)' : 'scale(1)',
            transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)'
          }}
        >
          {/* 3D Card effect with layers */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
          
          <div 
            className="relative bg-white rounded-3xl overflow-hidden"
            style={{
              boxShadow: isHovered 
                ? '0 30px 60px -12px rgba(59, 130, 246, 0.3), 0 18px 36px -18px rgba(99, 102, 241, 0.2)' 
                : '0 20px 40px -12px rgba(0, 0, 0, 0.1)'
            }}
          >
            {/* Glossy overlay effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            
            <div className="relative p-10 sm:p-12">
              <div className="relative">
                {/* Animated title with 3D effect */}
                <h2 
                  className="text-4xl sm:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent"
                  style={{
                    transform: isHovered ? 'translateZ(20px)' : 'translateZ(0)',
                    transition: 'transform 0.5s ease-out',
                    textShadow: isHovered ? '0 4px 8px rgba(59, 130, 246, 0.1)' : 'none'
                  }}
                >
                  Stay Informed with HOA-USA
                </h2>
                
                <p className="text-gray-600 text-center mb-10 text-lg leading-relaxed">
                  The best way for HOA board members, residents, and community managers to stay informed with constantly 
                  changing trends and best practices is to subscribe to the HOA-USA e-newsletter. Your information is 
                  never shared, and the content you receive will benefit your community.
                </p>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* State Select with 3D lift */}
                  <div 
                    className="relative"
                    style={{
                      transform: focusedField === 'state' ? 'translateY(-4px) rotateX(2deg)' : 'translateY(0)',
                      transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
                    }}
                  >
                    <div className={`absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400 to-indigo-400 transition-all duration-300 ${focusedField === 'state' ? 'blur-md opacity-40' : 'blur-sm opacity-0'}`}></div>
                    <select
                      value={selectedState}
                      onChange={(e) => setSelectedState(e.target.value)}
                      onFocus={() => setFocusedField('state')}
                      onBlur={() => setFocusedField(null)}
                      className="relative w-full px-5 py-4 bg-white border-2 border-gray-200 rounded-xl text-gray-700 font-medium shadow-lg hover:shadow-xl hover:border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 appearance-none cursor-pointer"
                      style={{
                        transform: focusedField === 'state' ? 'scale(1.02)' : 'scale(1)'
                      }}
                      required
                    >
                      <option value="">SELECT STATE</option>
                      {states.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Email Input with 3D lift */}
                  <div 
                    className="relative"
                    style={{
                      transform: focusedField === 'email' ? 'translateY(-4px) rotateX(2deg)' : 'translateY(0)',
                      transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
                    }}
                  >
                    <div className={`absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-400 to-blue-400 transition-all duration-300 ${focusedField === 'email' ? 'blur-md opacity-40' : 'blur-sm opacity-0'}`}></div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Enter your email"
                      className="relative w-full px-5 py-4 bg-white border-2 border-gray-200 rounded-xl text-gray-700 font-medium shadow-lg hover:shadow-xl hover:border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                      style={{
                        transform: focusedField === 'email' ? 'scale(1.02)' : 'scale(1)'
                      }}
                      required
                    />
                  </div>
                </div>
                
                {/* Animated submit button with 3D effects */}
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="relative w-full py-5 text-lg font-bold text-white overflow-hidden rounded-xl group/btn shadow-2xl"
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
                    transform: 'translateZ(0)',
                    transition: 'all 0.3s ease-out'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(59, 130, 246, 0.35)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = '0 10px 20px rgba(59, 130, 246, 0.2)';
                  }}
                >
                  {/* Animated gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Shine effect */}
                  <div className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-700">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
                  </div>
                  
                  {/* Button text */}
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Subscribe Now
                    <svg className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                  
                  {/* Ripple effect on click */}
                  <div className="absolute inset-0 group-active/btn:bg-white/20 transition-colors duration-150"></div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
