import React, { useState, useEffect } from 'react';
import { 
  getAllAnnouncements, 
  submitAnnouncement, 
  updateAnnouncement, 
  deleteAnnouncement, 
  toggleAnnouncementStatus 
} from '../../../firebase/services/announcementService';
import { uploadImage as uploadToFirebase } from '../../../utils/firebaseStorage';

const AnnouncementManagement = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: null,
    imagePreview: '',
    isActive: true,
    priority: 'normal'
  });
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    try {
      setLoading(true);
      const data = await getAllAnnouncements();
      setAnnouncements(data);
      setError('');
    } catch (error) {
      setError('Failed to load announcements');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      image: null,
      imagePreview: '',
      isActive: true,
      priority: 'normal'
    });
  };

  const handleEdit = (announcement) => {
    setEditingAnnouncement(announcement);
    setFormData({
      title: announcement.title || '',
      content: announcement.content || '',
      image: announcement.image || null,
      imagePreview: announcement.image || '',
      isActive: announcement.isActive !== undefined ? announcement.isActive : true,
      priority: announcement.priority || 'normal'
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      try {
        await deleteAnnouncement(id);
        await loadAnnouncements();
        setError('');
      } catch (error) {
        setError('Failed to delete announcement');
        console.error(error);
      }
    }
  };

  const handleToggleStatus = async (id, isActive) => {
    try {
      await toggleAnnouncementStatus(id, !isActive);
      await loadAnnouncements();
      setError('');
    } catch (error) {
      setError('Failed to update announcement status');
      console.error(error);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({
        ...prev,
        image: file,
        imagePreview: reader.result
      }));
    };
    reader.readAsDataURL(file);
  };

  const uploadImage = async (file) => {
    try {
      setIsUploading(true);
      const result = await uploadToFirebase(file, 'announcements');
      return result.url;
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
      let imageUrl = formData.imagePreview;
      
      // Only upload if it's a new file (not a URL)
      if (formData.image && typeof formData.image !== 'string') {
        imageUrl = await uploadImage(formData.image);
      }
      
      const announcementData = {
        ...formData,
        image: imageUrl
      };

      if (editingAnnouncement) {
        await updateAnnouncement(editingAnnouncement.id, announcementData);
      } else {
        await submitAnnouncement(announcementData);
      }
      
      await loadAnnouncements();
      setShowForm(false);
      setEditingAnnouncement(null);
      resetForm();
      setError('');
    } catch (error) {
      console.error('Error saving announcement:', error);
      setError('Failed to save announcement');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingAnnouncement(null);
    resetForm();
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'normal': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (showForm) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {editingAnnouncement ? 'Edit Announcement' : 'Add New Announcement'}
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter announcement title"
              />
            </div>

            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                id="priority"
                value={formData.priority}
                onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="normal">Normal</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              Content *
            </label>
            <textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              required
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              placeholder="Enter announcement content"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Announcement Image
            </label>
            <div className="flex items-center space-x-6">
              <div className="shrink-0">
                {formData.imagePreview ? (
                  <img
                    className="h-32 w-32 object-cover rounded-lg"
                    src={formData.imagePreview}
                    alt="Announcement image preview"
                  />
                ) : (
                  <div className="h-32 w-32 rounded-lg bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">No Image</span>
                  </div>
                )}
              </div>
              <label className="block">
                <span className="sr-only">Choose image</span>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageChange}
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

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
              Active (show on homepage)
            </label>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              {isUploading ? 'Uploading...' : (editingAnnouncement ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Announcement Management</h2>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add New Announcement
        </button>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Announcements ({announcements.length})
          </h3>
        </div>
        
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading announcements...</p>
          </div>
        ) : announcements.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-6xl mb-4">📢</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No announcements found</h3>
            <p className="text-gray-600">Get started by creating a new announcement.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {announcements.map((announcement) => (
              <div key={announcement.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start space-x-4">
                  {announcement.image && (
                    <div className="shrink-0">
                      <img
                        className="h-20 w-20 object-cover rounded-lg"
                        src={announcement.image}
                        alt={announcement.title}
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900 truncate">
                        {announcement.title}
                      </h3>
                      <div className="flex items-center space-x-2 ml-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(announcement.priority)}`}>
                          {announcement.priority}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          announcement.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {announcement.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-gray-600 line-clamp-3">
                      {announcement.content}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {formatDate(announcement.createdAt)}
                      </span>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(announcement)}
                          className="text-sm text-indigo-600 hover:text-indigo-900"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleToggleStatus(announcement.id, announcement.isActive)}
                          className="text-sm text-yellow-600 hover:text-yellow-900"
                        >
                          {announcement.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => handleDelete(announcement.id)}
                          className="text-sm text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnnouncementManagement;
