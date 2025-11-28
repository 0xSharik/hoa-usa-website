import React, { useState, useEffect } from 'react';
import { getAllAdvertisers, saveAdvertiser, deleteAdvertiser, toggleAdvertiserStatus } from '../../../firebase/services/advertiserService';
import AdvertiserManagement from './AdvertiserManagement';

const AdvertisersEditor = () => {
  const [advertisers, setAdvertisers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingAdvertiser, setEditingAdvertiser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [stateFilter, setStateFilter] = useState('all');

  useEffect(() => {
    loadAdvertisers();
  }, []);

  const loadAdvertisers = async () => {
    try {
      setLoading(true);
      const data = await getAllAdvertisers();
      setAdvertisers(data);
      setError('');
    } catch (error) {
      setError('Failed to load advertisers');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAdvertiser = async (advertiserData) => {
    try {
      await saveAdvertiser(advertiserData, editingAdvertiser?.id);
      await loadAdvertisers();
      setShowForm(false);
      setEditingAdvertiser(null);
      setError('');
    } catch (error) {
      setError('Failed to save advertiser');
      console.error(error);
    }
  };

  const handleEditAdvertiser = (advertiser) => {
    setEditingAdvertiser(advertiser);
    setShowForm(true);
  };

  const handleDeleteAdvertiser = async (id) => {
    if (window.confirm('Are you sure you want to delete this advertiser? This action cannot be undone.')) {
      try {
        await deleteAdvertiser(id);
        await loadAdvertisers();
        setError('');
      } catch (error) {
        setError('Failed to delete advertiser');
        console.error(error);
      }
    }
  };

  const handleToggleStatus = async (advertiserId, currentStatus) => {
    try {
      await toggleAdvertiserStatus(advertiserId, !currentStatus);
      await loadAdvertisers();
      setError('');
    } catch (error) {
      setError('Failed to update advertiser status');
      console.error(error);
    }
  };

  const filteredAdvertisers = advertisers.filter(advertiser => {
    const matchesSearch = advertiser.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      advertiser.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesState = stateFilter === 'all' || advertiser.state === stateFilter;

    return matchesSearch && matchesState;
  });

  const states = [...new Set(advertisers.map(a => a.state))].filter(Boolean);

  if (showForm) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {editingAdvertiser ? 'Edit Advertiser' : 'Add New Advertiser'}
          </h2>
        </div>
        <AdvertiserManagement
          editingAdvertiser={editingAdvertiser}
          onSave={handleSaveAdvertiser}
          onCancel={() => {
            setShowForm(false);
            setEditingAdvertiser(null);
          }}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Advertisers Editor</h2>
        <button
          onClick={() => {
            setEditingAdvertiser(null);
            setShowForm(true);
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add New Advertiser
        </button>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Search and Filter */}
      <div className="bg-white shadow-sm rounded-xl border border-gray-200 mb-8 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Search by name or description"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
            <select
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="all">All States</option>
              {states.map((state) => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Advertisers Table */}
      <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Advertisers ({filteredAdvertisers.length})
          </h3>
        </div>
        
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading advertisers...</p>
          </div>
        ) : filteredAdvertisers.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-6xl mb-4">📢</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No advertisers found</h3>
            <p className="text-gray-600">Get started by adding a new advertiser.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Advertiser</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAdvertisers.map((advertiser) => (
                  <tr key={advertiser.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {advertiser.logo && (
                          <div className="flex-shrink-0 h-10 w-10">
                            <img className="h-10 w-10 rounded-lg object-cover" src={advertiser.logo} alt={advertiser.name} />
                          </div>
                        )}
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{advertiser.name}</div>
                          {advertiser.website && (
                            <a href={advertiser.website} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-600 hover:text-indigo-900">
                              Visit Website
                            </a>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">{advertiser.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{advertiser.state}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        advertiser.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {advertiser.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEditAdvertiser(advertiser)}
                          className="text-indigo-600 hover:text-indigo-900 font-medium px-2 py-1 rounded-md hover:bg-indigo-50"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleToggleStatus(advertiser.id, advertiser.isActive)}
                          className={`${
                            advertiser.isActive 
                              ? 'text-yellow-600 hover:text-yellow-900 hover:bg-yellow-50' 
                              : 'text-green-600 hover:text-green-900 hover:bg-green-50'
                          } font-medium px-2 py-1 rounded-md`}
                        >
                          {advertiser.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => handleDeleteAdvertiser(advertiser.id)}
                          className="text-red-600 hover:text-red-900 font-medium px-2 py-1 rounded-md hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvertisersEditor;
