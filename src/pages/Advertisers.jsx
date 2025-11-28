import React, { useState, useEffect } from 'react';
import { getActiveAdvertisers } from '../firebase/services/advertiserService';

const Advertisers = () => {
  const [advertisers, setAdvertisers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadAdvertisers = async () => {
      try {
        const activeAds = await getActiveAdvertisers();
        setAdvertisers(activeAds);
      } catch (err) {
        console.error('Error loading advertisers:', err);
        setError('Failed to load advertisers. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    loadAdvertisers();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 my-4" role="alert">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Our Advertisers</h1>
      
      {advertisers.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No advertisers found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {advertisers.map((advertiser) => (
            <div key={advertiser.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              {advertiser.logo && (
                <div className="h-48 bg-gray-100 flex items-center justify-center p-4">
                  <img 
                    src={advertiser.logo} 
                    alt={advertiser.name} 
                    className="max-h-full max-w-full object-contain"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x150?text=Logo+Not+Available';
                    }}
                  />
                </div>
              )}
              
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">{advertiser.name}</h2>
                
                {advertiser.description && (
                  <p className="text-gray-600 mb-4">{advertiser.description}</p>
                )}
                
                {(advertiser.website || advertiser.contact) && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                      Contact
                    </h3>
                    
                    {advertiser.website && (
                      <div className="flex items-center mb-2">
                        <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                        </svg>
                        <a 
                          href={advertiser.website.startsWith('http') ? advertiser.website : `https://${advertiser.website}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:text-indigo-800"
                        >
                          {advertiser.website.replace(/^https?:\/\//, '')}
                        </a>
                      </div>
                    )}
                    
                    {advertiser.contact?.email && (
                      <div className="flex items-center mb-2">
                        <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <a href={`mailto:${advertiser.contact.email}`} className="text-gray-600 hover:text-gray-800">
                          {advertiser.contact.email}
                        </a>
                      </div>
                    )}
                    
                    {advertiser.contact?.phone && (
                      <div className="flex items-center">
                        <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <a href={`tel:${advertiser.contact.phone}`} className="text-gray-600 hover:text-gray-800">
                          {advertiser.contact.phone}
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Advertisers;
