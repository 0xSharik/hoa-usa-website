import React, { useState, useEffect } from 'react';

const AdvertiserManagement = ({ 
  onSave, 
  onCancel,
  editingAdvertiser,
  isLoading = false
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    website: '',
    logo: null,
    logoPreview: '',
    contact: {
      name: '',
      email: '',
      phone: ''
    },
    isActive: true
  });
  const [isUploading, setIsUploading] = useState(false);

  // Set form data when editing
  useEffect(() => {
    if (editingAdvertiser) {
      setFormData({
        name: editingAdvertiser.name || '',
        description: editingAdvertiser.description || '',
        website: editingAdvertiser.website || '',
        logo: editingAdvertiser.logo || null,
        logoPreview: editingAdvertiser.logo || '',
        contact: {
          name: editingAdvertiser.contact?.name || '',
          email: editingAdvertiser.contact?.email || '',
          phone: editingAdvertiser.contact?.phone || ''
        },
        isActive: editingAdvertiser.isActive !== undefined ? editingAdvertiser.isActive : true
      });
    } else {
      setFormData({
        name: '',
        description: '',
        website: '',
        logo: null,
        logoPreview: '',
        contact: {
          name: '',
          email: '',
          phone: ''
        },
        isActive: true
      });
    }
  }, [editingAdvertiser]);

  const uploadLogo = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
    
    try {
      setIsUploading(true);
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );
      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let logoUrl = formData.logoPreview;
      
      // Only upload if it's a new file (not a URL)
      if (formData.logo && typeof formData.logo !== 'string') {
        logoUrl = await uploadLogo(formData.logo);
      }
      
      const advertiserData = {
        ...formData,
        logo: logoUrl
      };
      
      onSave(advertiserData);
    } catch (error) {
      console.error('Error saving advertiser:', error);
      // Handle error (e.g., show error message to user)
    }
  };

  const handleLogoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({
        ...prev,
        logo: file,
        logoPreview: reader.result
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      contact: {
        ...prev.contact,
        [name]: value
      }
    }));
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          {editingAdvertiser ? 'Edit Advertiser' : 'Add New Advertiser'}
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          {editingAdvertiser ? 'Update the advertiser details below' : 'Fill in the advertiser details below'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="divide-y divide-gray-200">
          <div className="px-4 py-5 sm:p-6 space-y-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-6">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Company Name *
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                  Website
                </label>
                <input
                  type="url"
                  name="website"
                  id="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div className="sm:col-span-6">
                <h3 className="text-lg font-medium text-gray-900">Contact Information</h3>
                <p className="mt-1 text-sm text-gray-500">Primary contact for this advertiser</p>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="contact.name" className="block text-sm font-medium text-gray-700">
                  Contact Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="contact.name"
                  value={formData.contact.name}
                  onChange={handleContactChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="contact.email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="contact.email"
                  value={formData.contact.email}
                  onChange={handleContactChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="contact.phone" className="block text-sm font-medium text-gray-700">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  id="contact.phone"
                  value={formData.contact.phone}
                  onChange={handleContactChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div className="sm:col-span-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Logo
                </label>
                <div className="flex items-center space-x-6">
                  <div className="shrink-0">
                    {formData.logoPreview ? (
                      <img
                        className="h-24 w-24 object-cover rounded-full"
                        src={formData.logoPreview}
                        alt="Advertiser logo preview"
                      />
                    ) : (
                      <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500">Logo</span>
                      </div>
                    )}
                  </div>
                  <label className="block">
                    <span className="sr-only">Choose logo</span>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-indigo-50 file:text-indigo-700
                        hover:file:bg-indigo-100"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="px-4 py-4 sm:px-6 flex justify-end space-x-3 bg-gray-50">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Cancel button clicked');
                if (onCancel) {
                  onCancel();
                }
              }}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || isUploading}
              className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 min-w-[100px]"
            >
{isLoading || isUploading ? (
                <div className="inline-flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {isUploading ? 'Uploading...' : 'Saving...'}
                </div>
              ) : (
                'Save'
              )}
            </button>
          </div>
        </form>
    </div>
  );
};

export default AdvertiserManagement;
