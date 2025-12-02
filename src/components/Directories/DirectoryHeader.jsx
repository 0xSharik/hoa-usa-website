import React from 'react';
import { Link } from 'react-router-dom';

const DirectoryHeader = () => {
  return (
    <div className="bg-gradient-to-r from-primary to-secondary py-12 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">The Ridge Management Directory</h1>
          <p className="text-lg md:text-xl max-w-4xl mx-auto mb-8">
            The following list of management companies is provided as a convenient reference for board members, 
            closing attorneys, realtors, homebuyers, and association residents. Search the The Ridge Management 
            Company Directory for Association Managers in your region.
          </p>
          
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">HOA Management Company</h2>
            <p className="text-gray-700 mb-6">
              If your management company would like to be added to our FREE directory, or if you need to update your listing, please click below:
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                to="/contact" 
                className="bg-primary hover:bg-primary-dark text-white font-medium py-3 px-6 rounded-lg transition-colors text-center"
              >
                Add/Update Listing
              </Link>
              <Link 
                to="/advertise" 
                className="bg-white text-primary border-2 border-primary hover:bg-gray-50 font-medium py-3 px-6 rounded-lg transition-colors text-center"
              >
                Learn About Advertising
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DirectoryHeader;
