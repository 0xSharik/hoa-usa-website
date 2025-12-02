import React, { useState } from 'react';

const states = [
  { name: 'Alabama', code: 'AL' },
  { name: 'Alaska', code: 'AK' },
  { name: 'Arizona', code: 'AZ' },
  { name: 'Arkansas', code: 'AR' },
  { name: 'California', code: 'CA' },
  { name: 'Colorado', code: 'CO' },
  { name: 'Connecticut', code: 'CT' },
  { name: 'Delaware', code: 'DE' },
  { name: 'Florida', code: 'FL' },
  { name: 'Georgia', code: 'GA' },
  { name: 'Hawaii', code: 'HI' },
  { name: 'Idaho', code: 'ID' },
  { name: 'Illinois', code: 'IL' },
  { name: 'Indiana', code: 'IN' },
  { name: 'Iowa', code: 'IA' },
  { name: 'Kansas', code: 'KS' },
  { name: 'Kentucky', code: 'KY' },
  { name: 'Louisiana', code: 'LA' },
  { name: 'Maine', code: 'ME' },
  { name: 'Maryland', code: 'MD' },
  { name: 'Massachusetts', code: 'MA' },
  { name: 'Michigan', code: 'MI' },
  { name: 'Minnesota', code: 'MN' },
  { name: 'Mississippi', code: 'MS' },
  { name: 'Missouri', code: 'MO' },
  { name: 'Montana', code: 'MT' },
  { name: 'Nebraska', code: 'NE' },
  { name: 'Nevada', code: 'NV' },
  { name: 'New Hampshire', code: 'NH' },
  { name: 'New Jersey', code: 'NJ' },
  { name: 'New Mexico', code: 'NM' },
  { name: 'New York', code: 'NY' },
  { name: 'North Carolina', code: 'NC' },
  { name: 'North Dakota', code: 'ND' },
  { name: 'Ohio', code: 'OH' },
  { name: 'Oklahoma', code: 'OK' },
  { name: 'Oregon', code: 'OR' },
  { name: 'Pennsylvania', code: 'PA' },
  { name: 'Rhode Island', code: 'RI' },
  { name: 'South Carolina', code: 'SC' },
  { name: 'South Dakota', code: 'SD' },
  { name: 'Tennessee', code: 'TN' },
  { name: 'Texas', code: 'TX' },
  { name: 'Utah', code: 'UT' },
  { name: 'Vermont', code: 'VT' },
  { name: 'Virginia', code: 'VA' },
  { name: 'Washington', code: 'WA' },
  { name: 'West Virginia', code: 'WV' },
  { name: 'Wisconsin', code: 'WI' },
  { name: 'Wyoming', code: 'WY' }
];

const lawCategories = [
  'Governing Documents', 'Assessments', 'Meetings', 'Elections',
  'Architectural Control', 'Enforcement', 'Rental Restrictions',
  'Dispute Resolution', 'Budgets & Finances', 'Insurance', 'Taxation'
];

const StateLaws = () => {
  const [selectedState, setSelectedState] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data for state laws
  const laws = [
    {
      id: 1,
      title: 'HOA Governance Act of 2023',
      state: 'California',
      category: 'Governing Documents',
      effectiveDate: '01/01/2023',
      summary: 'Updates to the governance structure and requirements for HOAs in California.'
    },
    {
      id: 2,
      title: 'Assessment Collection Procedures',
      state: 'Texas',
      category: 'Assessments',
      effectiveDate: '03/15/2023',
      summary: 'New procedures for assessment collection and payment plans.'
    },
    {
      id: 3,
      title: 'Virtual Meeting Guidelines',
      state: 'New York',
      category: 'Meetings',
      effectiveDate: '02/01/2023',
      summary: 'Guidelines for conducting virtual board and member meetings.'
    },
    {
      id: 4,
      title: 'Election Reform Act',
      state: 'Florida',
      category: 'Elections',
      effectiveDate: '01/01/2023',
      summary: 'Reforms to HOA election procedures and candidate requirements.'
    },
    {
      id: 5,
      title: 'Architectural Review Standards',
      state: 'Arizona',
      category: 'Architectural Control',
      effectiveDate: '04/01/2023',
      summary: 'Updated standards for architectural review and approval processes.'
    },
    {
      id: 6,
      title: 'Enforcement Procedures',
      state: 'Colorado',
      category: 'Enforcement',
      effectiveDate: '03/01/2023',
      summary: 'Revised procedures for enforcing HOA rules and regulations.'
    },
    {
      id: 7,
      title: 'Rental Restrictions Update',
      state: 'Nevada',
      category: 'Rental Restrictions',
      effectiveDate: '02/15/2023',
      summary: 'Changes to rental restrictions and tenant screening requirements.'
    },
    {
      id: 8,
      title: 'Dispute Resolution Process',
      state: 'Virginia',
      category: 'Dispute Resolution',
      effectiveDate: '01/01/2023',
      summary: 'New process for resolving disputes between HOAs and homeowners.'
    },
    {
      id: 9,
      title: 'Budget Transparency Act',
      state: 'Washington',
      category: 'Budgets & Finances',
      effectiveDate: '01/15/2023',
      summary: 'Requirements for budget preparation and financial disclosures.'
    },
    {
      id: 10,
      title: 'Insurance Requirements',
      state: 'Florida',
      category: 'Insurance',
      effectiveDate: '03/01/2023',
      summary: 'Updated insurance coverage requirements for HOAs.'
    },
    {
      id: 11,
      title: 'Taxation Guidelines',
      state: 'Texas',
      category: 'Taxation',
      effectiveDate: '01/01/2023',
      summary: 'Guidelines for HOA tax filings and exemptions.'
    },
    {
      id: 12,
      title: 'Emergency Powers Act',
      state: 'California',
      category: 'Governing Documents',
      effectiveDate: '02/01/2023',
      summary: 'Powers granted to HOAs during declared emergencies.'
    }
  ];

  // Filter laws based on search criteria
  const filteredLaws = laws.filter(law => {
    const matchesSearch = law.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        law.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesState = !selectedState || law.state === selectedState;
    const matchesCategory = !selectedCategory || law.category === selectedCategory;
    
    return matchesSearch && matchesState && matchesCategory;
  });

  const statesList = [...new Set(laws.map(law => law.state))].sort();
  const categoriesList = [...new Set(laws.map(law => law.category))].sort();

  return (
    <div className="min-h-screen pt-24">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">State HOA Laws</h1>
          <p className="text-xl text-gray-100 max-w-3xl mx-auto">
            Comprehensive guide to homeowners association laws and regulations by state
          </p>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-surface shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <input
                type="text"
                placeholder="Search laws and regulations..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-surface text-text placeholder-textMuted"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-surface text-text"
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
              >
                <option value="">All States</option>
                {statesList.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-surface text-text"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categoriesList.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-surface rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h2>
              <ul className="space-y-3">
                <li>
                  <a href="#recent-updates" className="text-primary hover:text-primary-dark">
                    Recent Updates
                  </a>
                </li>
                <li>
                  <a href="#popular-topics" className="text-primary hover:text-primary-dark">
                    Popular Topics
                  </a>
                </li>
                <li>
                  <a href="#state-resources" className="text-primary hover:text-primary-dark">
                    State Resources
                  </a>
                </li>
              </ul>
              
              <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-4">Categories</h2>
              <ul className="space-y-2">
                {lawCategories.map((category) => (
                  <li key={category}>
                    <button 
                      onClick={() => setSelectedCategory(selectedCategory === category ? '' : category)}
                      className={`text-left w-full px-3 py-2 rounded-md ${
                        selectedCategory === category 
                          ? 'bg-primary/10 text-primary font-medium' 
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {category}
                    </button>
                  </li>
                ))}
              </ul>
              
              <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-800 mb-2">Need Legal Help?</h3>
                <p className="text-sm text-blue-700 mb-3">
                  Our network of HOA attorneys can help you navigate complex legal issues.
                </p>
                <button className="w-full bg-blue-100 hover:bg-blue-200 text-blue-800 font-medium py-2 px-4 rounded-md text-sm transition-colors">
                  Find an Attorney
                </button>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-surface rounded-lg shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedState ? `${selectedState} HOA Laws` : 'HOA Laws by State'}
                </h2>
                <p className="text-gray-600 mt-2">
                  {filteredLaws.length} {filteredLaws.length === 1 ? 'result' : 'results'} found
                  {selectedState ? ` in ${selectedState}` : ''}
                  {selectedCategory ? ` for ${selectedCategory}` : ''}
                </p>
              </div>
              
              {filteredLaws.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {filteredLaws.map((law) => (
                    <li key={law.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{law.title}</h3>
                          <div className="mt-1 flex items-center text-sm text-gray-500">
                            <span className="mr-4">{law.state}</span>
                            <span className="mr-4">•</span>
                            <span>Effective: {law.effectiveDate}</span>
                          </div>
                          <p className="mt-2 text-gray-600">{law.summary}</p>
                        </div>
                        <div className="ml-4 flex-shrink-0">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                            {law.category}
                          </span>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <button className="text-sm font-medium text-primary hover:text-primary-dark">
                          View Details →
                        </button>
                        <div className="flex space-x-2">
                          <button className="p-1 text-gray-400 hover:text-gray-500">
                            <span className="sr-only">Save</span>
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                            </svg>
                          </button>
                          <button className="p-1 text-gray-400 hover:text-gray-500">
                            <span className="sr-only">Share</span>
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-12 text-center">
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
                  <h3 className="mt-2 text-lg font-medium text-gray-900">No laws found</h3>
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
              {filteredLaws.length > 0 && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <nav className="flex items-center justify-between">
                    <div className="flex-1 flex justify-between">
                      <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-surface hover:bg-gray-50">
                        Previous
                      </button>
                      <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-surface hover:bg-gray-50">
                        Next
                      </button>
                    </div>
                  </nav>
                </div>
              )}
            </div>
            
            {/* Additional Resources */}
            <div className="mt-8 bg-blue-50 rounded-lg overflow-hidden">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-3 flex-1 md:flex md:justify-between">
                    <p className="text-sm text-blue-700">
                      <span className="font-medium">Disclaimer:</span> The information provided on this page is for general informational purposes only and does not constitute legal advice. For specific legal advice regarding your HOA, please consult with a qualified attorney.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StateLaws;
