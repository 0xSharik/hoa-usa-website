import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getAllVendors } from '../../firebase/services/vendorService';

const VendorDirectory = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const vendorsPerPage = 10;
  const navigate = useNavigate();
  const { vendorId } = useParams();

  // Fetch vendors from database
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const vendorData = await getAllVendors();
        setVendors(vendorData);
      } catch (error) {
        console.error('Error fetching vendors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, []);

  // Get unique categories from vendors
  const categories = ['all', ...new Set(vendors.map(v => v.specialty).filter(Boolean))];

  // Filter and search vendors
  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         vendor.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || vendor.specialty === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get current vendors for pagination
  const indexOfLastVendor = currentPage * vendorsPerPage;
  const indexOfFirstVendor = indexOfLastVendor - vendorsPerPage;
  const currentVendors = filteredVendors.slice(indexOfFirstVendor, indexOfLastVendor);
  const totalPages = Math.ceil(filteredVendors.length / vendorsPerPage);

  // Handle vendor click
  const handleVendorClick = (id) => {
    navigate(`/vendors/${id}`);
  };

  // Render vendor card
  const renderVendorCard = (vendor) => (
    <div 
      key={vendor.id}
      onClick={() => handleVendorClick(vendor.id)}
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300"
    >
      <div className="p-4">
        <div className="flex items-center space-x-4">
          {vendor.logo && (
            <img 
              src={vendor.logo?.startsWith('http') ? vendor.logo : `https://res.cloudinary.com/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload/${vendor.logo}`}
              alt={vendor.name} 
              className="w-16 h-16 object-cover rounded-full border border-gray-200"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/64';
              }}
            />
          )}
          <div>
            <h3 className="font-semibold text-lg">{vendor.name}</h3>
            {vendor.specialty && (
              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mt-1">
                {vendor.specialty}
              </span>
            )}
          </div>
        </div>
        {vendor.description && (
          <p className="mt-3 text-gray-600 text-sm line-clamp-2">
            {vendor.description}
          </p>
        )}
      </div>
    </div>
  );

  // Render detailed view when a vendor is selected
  if (vendorId) {
    const vendor = vendors.find(v => v.id === vendorId);
    if (!vendor) return <div>Vendor not found</div>;

    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <button 
          onClick={() => navigate(-1)} 
          className="mb-6 flex items-center text-blue-600 hover:text-blue-800"
        >
          ← Back to Directory
        </button>
        
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:flex-shrink-0 p-8">
              {vendor.logo && (
                <img 
                  src={vendor.logo?.startsWith('http') ? vendor.logo : `https://res.cloudinary.com/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload/${vendor.logo}`}
                  alt={vendor.name} 
                  className="h-48 w-48 object-contain"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/192';
                  }}
                />
              )}
            </div>
            <div className="p-8">
              <div className="uppercase tracking-wide text-sm text-indigo-600 font-semibold">
                {vendor.specialty}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mt-2">{vendor.name}</h1>
              
              {vendor.website && (
                <a 
                  href={vendor.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline block mt-2"
                >
                  {vendor.website}
                </a>
              )}

              <div className="mt-6 space-y-4">
                {vendor.email && (
                  <div className="flex items-center">
                    <span className="text-gray-600 w-24">Email:</span>
                    <a 
                      href={`mailto:${vendor.email}`} 
                      className="text-blue-600 hover:underline"
                    >
                      {vendor.email}
                    </a>
                  </div>
                )}
                
                {vendor.phone && (
                  <div className="flex items-center">
                    <span className="text-gray-600 w-24">Phone:</span>
                    <a 
                      href={`tel:${vendor.phone}`} 
                      className="text-gray-800"
                    >
                      {vendor.phone}
                    </a>
                  </div>
                )}

                {vendor.serviceArea && (
                  <div className="flex items-start">
                    <span className="text-gray-600 w-24">Service Area:</span>
                    <span className="text-gray-800">{vendor.serviceArea}</span>
                  </div>
                )}
              </div>

              {vendor.description && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">About</h3>
                  <p className="text-gray-600">{vendor.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main directory view
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Vendor Directory</h1>
          <p className="text-xl text-gray-600">Find trusted vendors for your community</p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Search Vendors
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="search"
                  placeholder="Search by name or description..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-surface text-text placeholder-textMuted"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Category
              </label>
              <select
                id="category"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setCurrentPage(1);
                }}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* Vendors Grid */}
            {currentVendors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentVendors.map(renderVendorCard)}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-xl shadow-md">
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
                <h3 className="mt-2 text-lg font-medium text-gray-900">No vendors found</h3>
                <p className="mt-1 text-gray-500">
                  {searchTerm || selectedCategory !== 'all' 
                    ? 'Try adjusting your search or filter criteria.' 
                    : 'No vendors are currently available.'}
                </p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <nav className="inline-flex rounded-md shadow">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <div className="flex">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-4 py-2 border-t border-b border-r border-gray-300 bg-white text-sm font-medium ${
                            currentPage === pageNum
                              ? 'bg-blue-50 text-blue-600 border-blue-500'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-r-md border border-l-0 border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default VendorDirectory;