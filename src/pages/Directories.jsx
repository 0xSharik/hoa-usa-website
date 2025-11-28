import React, { useState } from 'react';

const states = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
  'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
  'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
  'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
  'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada',
  'New Hampshire', 'New Jersey', 'New Mexico', 'New York',
  'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon',
  'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington',
  'West Virginia', 'Wisconsin', 'Wyoming'
];

const categories = [
  'Property Management', 'Legal Services', 'Landscaping',
  'Maintenance', 'Security', 'Accounting', 'Insurance', 'Construction'
];

const Directories = () => {
  const [selectedState, setSelectedState] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data for directory listings
  const listings = [
    {
      id: 1,
      name: 'Premier Property Management',
      category: 'Property Management',
      state: 'California',
      rating: 4.8,
      reviews: 124,
      description: 'Full-service property management for HOAs and residential communities.',
      logo: 'https://via.placeholder.com/80'
    },
    {
      id: 2,
      name: 'Green Earth Landscaping',
      category: 'Landscaping',
      state: 'Texas',
      rating: 4.6,
      reviews: 89,
      description: 'Professional landscaping services with a focus on sustainable practices.',
      logo: 'https://via.placeholder.com/80'
    },
    {
      id: 3,
      name: 'Secure Living Security',
      category: 'Security',
      state: 'Florida',
      rating: 4.9,
      reviews: 156,
      description: '24/7 security solutions for residential communities and HOAs.',
      logo: 'https://via.placeholder.com/80'
    },
    {
      id: 4,
      name: 'HOA Legal Experts',
      category: 'Legal Services',
      state: 'New York',
      rating: 4.7,
      reviews: 203,
      description: 'Specialized legal services for homeowners associations.',
      logo: 'https://via.placeholder.com/80'
    },
    {
      id: 5,
      name: 'All Pro Maintenance',
      category: 'Maintenance',
      state: 'Arizona',
      rating: 4.5,
      reviews: 67,
      description: 'Complete maintenance solutions for residential communities.',
      logo: 'https://via.placeholder.com/80'
    },
    {
      id: 6,
      name: 'Community Financial Services',
      category: 'Accounting',
      state: 'Illinois',
      rating: 4.8,
      reviews: 112,
      description: 'Financial management and accounting services for HOAs.',
      logo: 'https://via.placeholder.com/80'
    }
  ];

  // Filter listings based on search criteria
  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        listing.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesState = !selectedState || listing.state === selectedState;
    const matchesCategory = !selectedCategory || listing.category === selectedCategory;
    
    return matchesSearch && matchesState && matchesCategory;
  });

  return (
    <div className="min-h-screen pt-24">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">HOA Directories</h1>
          <p className="text-xl text-gray-100 max-w-3xl mx-auto">
            Find trusted service providers for your Homeowners Association
          </p>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <input
                type="text"
                placeholder="Search by company name or service..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
              >
                <option value="">All States</option>
                {states.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Directory Listings */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">
            {filteredListings.length} {filteredListings.length === 1 ? 'Result' : 'Results'} Found
          </h2>
          <div className="flex items-center">
            <span className="text-gray-600 mr-2">Sort by:</span>
            <select className="border-0 bg-transparent font-medium text-primary focus:ring-0">
              <option>Highest Rated</option>
              <option>Most Reviews</option>
              <option>Alphabetical (A-Z)</option>
            </select>
          </div>
        </div>

        {filteredListings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredListings.map((listing) => (
              <div key={listing.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-start">
                    <img
                      src={listing.logo}
                      alt={listing.name}
                      className="w-16 h-16 rounded-lg object-cover mr-4"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{listing.name}</h3>
                      <div className="flex items-center mt-1">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${i < Math.floor(listing.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                          <span className="text-sm text-gray-600 ml-1">
                            {listing.rating} ({listing.reviews})
                          </span>
                        </div>
                      </div>
                      <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full mt-2">
                        {listing.category}
                      </span>
                    </div>
                  </div>
                  <p className="mt-4 text-gray-600">{listing.description}</p>
                  <div className="mt-6 flex justify-between items-center">
                    <span className="text-sm text-gray-500">{listing.state}</span>
                    <button className="text-primary hover:text-primary-dark font-medium">
                      View Details →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No results found</h3>
            <p className="mt-1 text-gray-500">
              Try adjusting your search or filter to find what you're looking for.
            </p>
            <div className="mt-6">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedState('');
                  setSelectedCategory('');
                }}
                className="btn btn-primary"
              >
                Clear all filters
              </button>
            </div>
          </div>
        )}

        {/* Pagination */}
        {filteredListings.length > 0 && (
          <div className="mt-12 flex justify-center">
            <nav className="flex items-center space-x-2">
              <button className="p-2 rounded-full border border-gray-300 text-gray-500 hover:bg-gray-50">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              {[1, 2, 3, 4, 5].map((page) => (
                <button
                  key={page}
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    page === 1 ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button className="p-2 rounded-full border border-gray-300 text-gray-500 hover:bg-gray-50">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </nav>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">List Your Business in Our Directory</h2>
          <p className="text-gray-600 mb-8">
            Reach thousands of HOA communities looking for your services. Get listed today and grow your business.
          </p>
          <button className="btn btn-primary">
            Add Your Listing
          </button>
        </div>
      </div>
    </div>
  );
};

export default Directories;
