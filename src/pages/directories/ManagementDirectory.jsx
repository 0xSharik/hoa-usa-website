import React from 'react';

const ManagementDirectory = () => {
  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Management Directory</h1>
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Professional HOA Management Companies</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Find trusted HOA management companies in your area.</p>
          </div>
          <div className="border-t border-gray-200">
            <p className="p-4 text-gray-500">Directory content will be displayed here.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagementDirectory;
