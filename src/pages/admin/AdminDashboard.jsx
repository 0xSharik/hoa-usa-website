import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import {
getAllAdvertisers,
saveAdvertiser,
toggleAdvertiserStatus,
deleteAdvertiser
} from '../../firebase/services/advertiserService';
import {
getAllVendors,
saveVendor,
toggleVendorStatus,
deleteVendor
} from '../../firebase/services/vendorService';
import {
getAllVideos,
saveVideo
} from '../../firebase/services/contentService';
import AdvertiserManagement from './components/AdvertiserManagement';
import VendorForm from './components/VendorForm';
import VideoForm from './components/VideoForm';

const AdminDashboard = () => {
const [advertisers, setAdvertisers] = useState([]);
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState('');
const [isLoggedIn, setIsLoggedIn] = useState(false);
const [loginData, setLoginData] = useState({ email: '', password: '' });
const [editingAdvertiser, setEditingAdvertiser] = useState(null);
const [showVendorForm, setShowVendorForm] = useState(false);
const [editingVendor, setEditingVendor] = useState(null);
const [showAdvertiserForm, setShowAdvertiserForm] = useState(false);
const [vendors, setVendors] = useState([]);
const [searchTerm, setSearchTerm] = useState('');
const [stateFilter, setStateFilter] = useState('all');
const [categoryFilter, setCategoryFilter] = useState('all');
const [showVideoForm, setShowVideoForm] = useState(false);
const [editingVideo, setEditingVideo] = useState(null);
const [videos, setVideos] = useState([]);
const auth = getAuth();
const navigate = useNavigate();

// Check if user is logged in
useEffect(() => {
const unsubscribe = auth.onAuthStateChanged((user) => {
setIsLoggedIn(!!user);
if (!user) {
navigate('/admin/login');
}
});
return () => unsubscribe();
}, [auth, navigate]);

// Load data when logged in
useEffect(() => {
const loadAllData = async () => {
if (isLoggedIn) {
try {
setIsLoading(true);
const [ads, vendorData, videoData] = await Promise.all([
getAllAdvertisers(),
getAllVendors(),
getAllVideos()
]);
setAdvertisers(ads);
setVendors(vendorData);
setVideos(videoData);
} catch (error) {
setError('Failed to load data');
console.error(error);
} finally {
setIsLoading(false);
}
}
};


loadAllData();
}, [isLoggedIn]);

// Load vendors data
const loadVendors = async () => {
try {
const vendorData = await getAllVendors();
setVendors(vendorData);
} catch (error) {
setError('Failed to load vendors');
console.error(error);
}
};

// Load advertisers data
const loadData = async () => {
try {
const ads = await getAllAdvertisers();
setAdvertisers(ads);
} catch (error) {
setError('Failed to load advertisers');
console.error(error);
}
};

const handleSaveVendor = async (vendorData) => {
try {
setIsLoading(true);
await saveVendor(vendorData, editingVendor?.id);
await loadVendors();
setShowVendorForm(false);
setEditingVendor(null);
setError('');
} catch (error) {
setError('Failed to save vendor');
console.error(error);
} finally {
setIsLoading(false);
}
};

const handleEditVendor = (vendor) => {
setEditingVendor(vendor);
setShowVendorForm(true);
};

const handleDeleteVendor = async (id) => {
if (window.confirm('Are you sure you want to delete this vendor? This action cannot be undone.')) {
try {
setIsLoading(true);
await deleteVendor(id);
await loadVendors();
setError('');
} catch (error) {
setError('Failed to delete vendor');
console.error(error);
} finally {
setIsLoading(false);
}
}
};

const handleToggleVendorStatus = async (vendorId, currentStatus) => {
try {
setIsLoading(true);
await toggleVendorStatus(vendorId, !currentStatus);
await loadVendors();
setError('');
} catch (error) {
setError('Failed to update vendor status');
console.error(error);
} finally {
setIsLoading(false);
}
};

const handleSaveAdvertiser = async (advertiserData) => {
try {
setIsLoading(true);
await saveAdvertiser(advertiserData, editingAdvertiser?.id);
await loadData();
setShowAdvertiserForm(false);
setEditingAdvertiser(null);
setError('');
} catch (error) {
setError('Failed to save advertiser');
console.error(error);
} finally {
setIsLoading(false);
}
};

const handleEditAdvertiser = (advertiser) => {
setEditingAdvertiser(advertiser);
setShowAdvertiserForm(true);
};

const handleDeleteAdvertiser = async (id) => {
if (window.confirm('Are you sure you want to delete this advertiser? This action cannot be undone.')) {
try {
setIsLoading(true);
await deleteAdvertiser(id);
await loadData();
setError('');
} catch (error) {
setError('Failed to delete advertiser');
console.error(error);
} finally {
setIsLoading(false);
}
}
};

const handleToggleAdvertiserStatus = async (advertiserId, currentStatus) => {
try {
setIsLoading(true);
await toggleAdvertiserStatus(advertiserId, !currentStatus);
await loadData();
setError('');
} catch (error) {
setError('Failed to update advertiser status');
console.error(error);
} finally {
setIsLoading(false);
}
};

const handleSaveVideo = async (videoData) => {
try {
setIsLoading(true);
await saveVideo(videoData);
const updatedVideos = await getAllVideos();
setVideos(updatedVideos);
setShowVideoForm(false);
setEditingVideo(null);
setError('');
} catch (error) {
setError('Failed to save video');
console.error(error);
} finally {
setIsLoading(false);
}
};

const handleEditVideo = (video) => {
setEditingVideo(video);
setShowVideoForm(true);
};

const handleDeleteVideo = async (link) => {
if (window.confirm('Are you sure you want to delete this video? This action cannot be undone.')) {
try {
setIsLoading(true);
// Delete video logic here
setVideos(videos.filter((video) => video.link !== link));
setError('');
} catch (error) {
setError('Failed to delete video');
console.error(error);
} finally {
setIsLoading(false);
}
}
};

// Filter functions
const filteredVendors = vendors.filter(vendor => {
const matchesSearch = vendor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
vendor.specialty?.toLowerCase().includes(searchTerm.toLowerCase()) ||
vendor.serviceArea?.toLowerCase().includes(searchTerm.toLowerCase());


const matchesState = stateFilter === 'all' || vendor.state === stateFilter;
const matchesCategory = categoryFilter === 'all' || vendor.specialty === categoryFilter;

return matchesSearch && matchesState && matchesCategory;
});

const filteredAdvertisers = advertisers.filter(advertiser => {
const matchesSearch = advertiser.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
advertiser.description?.toLowerCase().includes(searchTerm.toLowerCase());


const matchesState = stateFilter === 'all' || advertiser.state === stateFilter;

return matchesSearch && matchesState;
});

// Get unique states and categories for filters
const states = [...new Set([...vendors.map(v => v.state), ...advertisers.map(a => a.state)])].filter(Boolean);
const categories = [...new Set(vendors.map(v => v.specialty))].filter(Boolean);

const handleLogin = async (e) => {
e.preventDefault();
try {
setIsLoading(true);
await signInWithEmailAndPassword(auth, loginData.email, loginData.password);
setIsLoggedIn(true);
setError('');
} catch (error) {
setError('Invalid email or password');
} finally {
setIsLoading(false);
}
};

const handleLogout = async () => {
try {
await signOut(auth);
setIsLoggedIn(false);
navigate('/admin/login');
} catch (error) {
console.error('Error signing out:', error);
}
};

// Render login form if not logged in
if (!isLoggedIn) {
return (
<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
<div className="max-w-md w-full space-y-8">
<div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
<div className="text-center">
<div className="mx-auto h-12 w-12 bg-indigo-600 rounded-full flex items-center justify-center">
<svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
</svg>
</div>
<h2 className="mt-6 text-3xl font-bold text-gray-900">
Admin Sign In
</h2>
<p className="mt-2 text-sm text-gray-600">
Enter your credentials to access the dashboard
</p>
</div>
<form className="mt-8 space-y-6" onSubmit={handleLogin}>
<div className="space-y-4">
<div>
<label htmlFor="email-address" className="block text-sm font-medium text-gray-700 mb-1">
Email address
</label>
<input
id="email-address"
name="email"
type="email"
autoComplete="email"
required
className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
placeholder="Enter your email"
value={loginData.email}
onChange={(e) => setLoginData({...loginData, email: e.target.value})}
/>
</div>
<div>
<label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
Password
</label>
<input
id="password"
name="password"
type="password"
autoComplete="current-password"
required
className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
placeholder="Enter your password"
value={loginData.password}
onChange={(e) => setLoginData({...loginData, password: e.target.value})}
/>
</div>
</div>

text
          {error && (
            <div className="rounded-lg bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{error}</h3>
                </div>
              </div>
            </div>
          )}


          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </div>
              ) : (
                'Sign in'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
);
}

// Render admin dashboard
return (
<div className="min-h-screen bg-gray-50 py-6">
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
{/* Header */}
<div className="mb-8">
<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
<div className="mb-4 sm:mb-0">
<h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
<p className="mt-1 text-sm text-gray-600">
Manage vendors, advertisers, and videos in your system
</p>
</div>
<div className="flex flex-wrap gap-3">
<button
onClick={() => {
setShowAdvertiserForm(true);
setEditingAdvertiser(null);
}}
className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
>
<svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
</svg>
Add Advertiser
</button>
<button
onClick={() => {
setShowVendorForm(true);
setEditingVendor(null);
}}
className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
>
<svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
</svg>
Add Vendor
</button>
<button
onClick={() => {
setShowVideoForm(true);
setEditingVideo(null);
}}
className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
>
<svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
</svg>
Add Video
</button>
<button onClick={handleLogout} className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200" >
<svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
</svg>
Sign Out
</button>
</div>
</div>
</div>

text
    {/* Error Alert */}
    {error && (
      <div className="mb-6 rounded-lg bg-red-50 p-4 border border-red-200">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">{error}</h3>
          </div>
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                onClick={() => setError('')}
                className="inline-flex rounded-md p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-50 focus:ring-red-600"
              >
                <span className="sr-only">Dismiss</span>
                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    )}


    {/* Search and Filter */}
    <div className="bg-white shadow-sm rounded-xl border border-gray-200 mb-8 p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">Search</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Search by name, specialty, or location"
            />
          </div>
        </div>
        <div>
          <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">State</label>
          <select
            id="state"
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="all">All States</option>
            {states.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            Category (Vendors)
          </label>
          <select
            id="category"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>


    {/* Vendor Form - Conditionally rendered */}
    {showVendorForm && (
      <div className="bg-white shadow-lg rounded-xl border border-gray-200 mb-8">
        <VendorForm 
          vendor={editingVendor}
          onSave={handleSaveVendor} 
          onCancel={() => {
            setShowVendorForm(false);
            setEditingVendor(null);
          }}
          isLoading={isLoading}
        />
      </div>
    )}


{/* Advertiser Form - Conditionally rendered */}
{showAdvertiserForm && (
  <div className="bg-white shadow-lg rounded-xl border border-gray-200 mb-8">
    <AdvertiserManagement 
      editingAdvertiser={editingAdvertiser}
      onSave={handleSaveAdvertiser}
      onCancel={() => {
        setShowAdvertiserForm(false);
        setEditingAdvertiser(null);
      }}
      isLoading={isLoading}
    />
  </div>
)}


{/* Video Form - Conditionally rendered */}
{showVideoForm && (
  <div className="bg-white shadow-lg rounded-xl border border-gray-200 mb-8">
    <VideoForm 
      video={editingVideo}
      onSave={handleSaveVideo}
      onCancel={() => {
        setShowVideoForm(false);
        setEditingVideo(null);
      }}
      isLoading={isLoading}
    />
  </div>
)}



    {/* Vendors Section */}
    <div className="bg-white shadow-sm rounded-xl border border-gray-200 mb-8 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Vendors
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              {filteredVendors.length} {filteredVendors.length === 1 ? 'vendor' : 'vendors'} found
            </p>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm rounded-lg text-indigo-600 bg-indigo-100">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading vendors...
            </div>
          </div>
        ) : filteredVendors.length === 0 ? (
          <div className="p-8 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No vendors found</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new vendor.</p>
            <div className="mt-6">
              <button
                onClick={() => {
                  setShowVendorForm(true);
                  setEditingVendor(null);
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add New Vendor
              </button>
            </div>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vendor
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredVendors.map((vendor) => (
                <tr key={vendor.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {vendor.logo && (
                        <div className="flex-shrink-0 h-10 w-10">
                          <img className="h-10 w-10 rounded-full object-cover" src={vendor.logo} alt={vendor.name} />
                        </div>
                      )}
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{vendor.name}</div>
                        <div className="text-sm text-gray-500">{vendor.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-medium">{vendor.specialty}</div>
                    <div className="text-sm text-gray-500">{vendor.serviceArea}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{vendor.state}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      vendor.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {vendor.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleEditVendor(vendor)}
                        className="text-indigo-600 hover:text-indigo-900 font-medium px-2 py-1 rounded-md hover:bg-indigo-50 transition-colors duration-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggleVendorStatus(vendor.id, vendor.isActive)}
                        className={`${
                          vendor.isActive 
                            ? 'text-yellow-600 hover:text-yellow-900 hover:bg-yellow-50' 
                            : 'text-green-600 hover:text-green-900 hover:bg-green-50'
                        } font-medium px-2 py-1 rounded-md transition-colors duration-200`}
                      >
                        {vendor.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleDeleteVendor(vendor.id)}
                        className="text-red-600 hover:text-red-900 font-medium px-2 py-1 rounded-md hover:bg-red-50 transition-colors duration-200"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>


    {/* Advertisers Section - Table View */}
    <div className="bg-white shadow-sm rounded-xl border border-gray-200 mb-8 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Advertisers
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              {filteredAdvertisers.length} {filteredAdvertisers.length === 1 ? 'advertiser' : 'advertisers'} found
            </p>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm rounded-lg text-indigo-600 bg-indigo-100">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading advertisers...
            </div>
          </div>
        ) : filteredAdvertisers.length === 0 ? (
          <div className="p-8 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No advertisers found</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new advertiser.</p>
            <div className="mt-6">
              <button
                onClick={() => {
                  setShowAdvertiserForm(true);
                  setEditingAdvertiser(null);
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add New Advertiser
              </button>
            </div>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Advertiser
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAdvertisers.map((advertiser) => (
                <tr key={advertiser.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {advertiser.image && (
                        <div className="flex-shrink-0 h-10 w-10">
                          <img className="h-10 w-10 rounded-lg object-cover" src={advertiser.image} alt={advertiser.name} />
                        </div>
                      )}
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{advertiser.name}</div>
                        {advertiser.link && (
                          <a href={advertiser.link} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-600 hover:text-indigo-900">
                            Visit Website
                          </a>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">{advertiser.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{advertiser.state}</div>
                  </td>
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
                        className="text-indigo-600 hover:text-indigo-900 font-medium px-2 py-1 rounded-md hover:bg-indigo-50 transition-colors duration-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggleAdvertiserStatus(advertiser.id, advertiser.isActive)}
                        className={`${
                          advertiser.isActive 
                            ? 'text-yellow-600 hover:text-yellow-900 hover:bg-yellow-50' 
                            : 'text-green-600 hover:text-green-900 hover:bg-green-50'
                        } font-medium px-2 py-1 rounded-md transition-colors duration-200`}
                      >
                        {advertiser.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleDeleteAdvertiser(advertiser.id)}
                        className="text-red-600 hover:text-red-900 font-medium px-2 py-1 rounded-md hover:bg-red-50 transition-colors duration-200"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>

    {/* Videos Section */}
    <div className="bg-white shadow-sm rounded-xl border border-gray-200 mb-8 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Videos
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              {videos.length} {videos.length === 1 ? 'video' : 'videos'} found
            </p>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm rounded-lg text-indigo-600 bg-indigo-100">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading videos...
            </div>
          </div>
        ) : videos.length === 0 ? (
          <div className="p-8 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No videos found</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by adding a new video.</p>
            <div className="mt-6">
              <button
                onClick={() => {
                  setShowVideoForm(true);
                  setEditingVideo(null);
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add New Video
              </button>
            </div>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Link
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {videos.map((video) => (
                <tr key={video.link} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{video.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <a href={video.link} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-600 hover:text-indigo-900">
                      View Video
                    </a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleEditVideo(video)}
                        className="text-indigo-600 hover:text-indigo-900 font-medium px-2 py-1 rounded-md hover:bg-indigo-50 transition-colors duration-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteVideo(video.link)}
                        className="text-red-600 hover:text-red-900 font-medium px-2 py-1 rounded-md hover:bg-red-50 transition-colors duration-200"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  </div>
</div>
);
};

export default AdminDashboard;