import React, { useState } from 'react';
import { uploadImage as uploadToFirebase } from '../../../utils/firebaseStorage';

const AdvertiserForm = ({ onSave, onCancel, advertiser = null }) => {
  const [formData, setFormData] = useState(() => ({
    name: advertiser?.name || '',
    description: advertiser?.description || '',
    state: advertiser?.state || '',
    website: advertiser?.website || '',
    phone: advertiser?.phone || '',
    email: advertiser?.email || '',
    logo: advertiser?.logo || null,
    logoPreview: advertiser?.logo || '',
    isActive: advertiser?.isActive !== undefined ? advertiser.isActive : true,
  }));
  const [isUploading, setIsUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({
        ...prev,
        logo: file,
        logoPreview: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const uploadLogo = async (file) => {
    const formPayload = new FormData();
    formPayload.append('file', file);
    formPayload.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
    try {
      setIsUploading(true);
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: 'POST', body: formPayload }
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
      if (formData.logo && typeof formData.logo !== 'string') {
        logoUrl = await uploadLogo(formData.logo);
      }
      const advertiserData = { ...formData, logo: logoUrl };
      onSave(advertiserData);
    } catch (error) {
      console.error('Error saving advertiser:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Advertiser Information</h2>
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
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
          </label>
        </div>
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div className="sm:col-span-6">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Advertiser Name *</label>
            <input
              type="text" name="name" id="name" value={formData.name} onChange={handleChange} required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div className="sm:col-span-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="description" name="description" rows={3} value={formData.description} onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div className="sm:col-span-3">
            <label htmlFor="state" className="block text-sm font-medium text-gray-700">State *</label>
            <select
              id="state" name="state" value={formData.state} onChange={handleChange} required
              className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">Select a state</option>
              <option value="CA">California</option>
              <option value="NY">New York</option>
              <option value="TX">Texas</option>
            </select>
          </div>
          <div className="sm:col-span-3">
            <label htmlFor="website" className="block text-sm font-medium text-gray-700">Website</label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">https://</span>
              <input
                type="text" name="website" id="website" value={formData.website} onChange={handleChange}
                className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="www.example.com"
              />
            </div>
          </div>
          <div className="sm:col-span-3">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="tel" name="phone" id="phone" value={formData.phone} onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div className="sm:col-span-3">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email *</label>
            <input
              type="email" name="email" id="email" value={formData.email} onChange={handleChange} required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >Cancel</button>
        <button
          type="submit" disabled={isUploading}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >{isUploading ? 'Saving...' : 'Save Advertiser'}</button>
      </div>
    </form>
  );
};

export default AdvertiserForm;
