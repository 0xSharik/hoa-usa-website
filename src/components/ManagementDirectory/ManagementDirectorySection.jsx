import React from 'react';
import { Link } from 'react-router-dom';

const ManagementDirectorySection = () => {
  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center">
        <div className="lg:w-0 lg:flex-1">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            HOA-USA Management Directory
          </h2>
          <p className="mt-3 max-w-3xl text-lg leading-6 text-gray-500">
            The following list of management companies is provided as a convenient reference for board members, 
            closing attorneys, realtors, homebuyers and association residents.
          </p>
        </div>
        <div className="mt-8 lg:mt-0 lg:ml-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-3">HOA Management Company</h3>
            <p className="text-sm text-gray-500 mb-4">
              If your management company would like to be added to our FREE directory, or if you need to update your listing, please click below:
            </p>
            <div className="mt-3 flex flex-col sm:flex-row gap-3">
              <Link
                to="/directories/management"
                className="flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                View Directory
              </Link>
              <Link
                to="/contact"
                className="flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary bg-white border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Add/Update Listing
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagementDirectorySection;
