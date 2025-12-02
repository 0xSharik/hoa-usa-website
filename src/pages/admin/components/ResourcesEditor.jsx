import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Eye, Calendar, Clock, FileText, Download, Upload } from 'lucide-react';
import { 
  getResources, 
  createResource, 
  updateResource, 
  deleteResource,
  uploadDocument
} from '../../../firebase/services';

const ResourcesEditor = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [resources, setResources] = useState({
    articles: [],
    videos: []
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  
  // Helper function to format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  // Combine all resources for display
  const allDocuments = [
    ...resources.articles,
    ...resources.videos
  ].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

  // Load data from Firebase on component mount
  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    try {
      setLoading(true);
      setError(null);
      const resourcesData = await getResources();
      setResources(resourcesData);
    } catch (error) {
      console.error('Error loading resources:', error);
      setError('Failed to load resources');
    } finally {
      setLoading(false);
    }
  };

  const handleView = (item) => {
    // Open document in new tab
    const downloadUrl = item.fileUrl || item.imageUrl || item.documentUrl;
    if (downloadUrl) {
      window.open(downloadUrl, '_blank');
    } else {
      console.error('No download URL available for item:', item);
    }
  };

  const handleDelete = async (item) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        setError(null);
        // Determine the resource type based on the item
        // Since we're saving everything as 'articles', we delete from articles
        await deleteResource('articles', item.id);
        await loadResources();
      } catch (error) {
        console.error('Error deleting resource:', error);
        setError('Failed to delete resource');
      }
    }
  };

  const handleEdit = (item) => {
    setEditingItem({ ...item });
    setShowAddForm(true);
  };

  const handleSave = async (formData) => {
    if (isUploading) return; // Prevent multiple clicks
    
    try {
      setError(null);
      setIsUploading(true);
      setUploadProgress(0);
      
      let finalData = { ...formData };
      
      // Handle document upload if file provided
      if (formData.documentFile) {
        const documentData = await uploadDocument(formData.documentFile, 'documents', (progress) => {
          setUploadProgress(progress);
        });
        
        // Map the document data to match the article schema
        finalData = {
          ...finalData,
          title: finalData.title || documentData.name.replace(/\.[^/.]+$/, ''), // Use filename as title if not provided
          content: finalData.description || '',
          imageUrl: documentData.url, // Store the download URL as imageUrl
          fileUrl: documentData.url, // Also store it as fileUrl
          fileType: documentData.type,
          fileSize: documentData.size,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          status: 'published',
          author: 'Admin', // You might want to get this from auth
          category: finalData.category || 'documents',
          excerpt: finalData.description ? `${finalData.description.substring(0, 100)}...` : ''
        };
        
        delete finalData.documentFile;
      }
      
      // Determine the resource type based on the file type or form data
      let resourceType = 'articles'; // Default to articles
      
      if (editingItem) {
        // Update existing item
        await updateResource(resourceType, editingItem.id, finalData);
      } else {
        // Create new item
        await createResource(resourceType, finalData);
      }
      
      // Reload data
      await loadResources();
      
      // Close form
      setShowAddForm(false);
      setEditingItem(null);
    } catch (error) {
      console.error('Error saving resource:', error);
      setError('Failed to save resource');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading documents...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-red-800 font-semibold mb-2">Error</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={loadResources}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Documents Management</h1>
        <p className="text-gray-600">Upload and manage documents for the HOA resource center.</p>
      </div>

      <div className="mb-6 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          {allDocuments.length} documents total
        </div>
        <motion.button
          onClick={() => {
            setEditingItem(null);
            setShowAddForm(true);
          }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="w-4 h-4" />
          Add Document
        </motion.button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {allDocuments.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No documents found.</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="mt-4 text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Add your first document
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {allDocuments.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                      {item.featured && (
                        <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full text-xs font-medium">
                          Featured
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-3 line-clamp-2">
                      {item.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      {item.date && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {item.date}
                        </div>
                      )}
                      {item.fileSize && (
                        <div className="flex items-center gap-1">
                          <FileText className="w-4 h-4" />
                          {formatFileSize(item.fileSize)}
                        </div>
                      )}
                      {item.fileType && (
                        <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                          {item.fileType.split('/')[1]?.toUpperCase() || 'PDF'}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleView(item)}
                      className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="View Document"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {showAddForm && (
        <DocumentForm 
          item={editingItem} 
          onSave={handleSave} 
          onCancel={() => {
            setShowAddForm(false);
            setEditingItem(null);
          }}
          isUploading={isUploading}
          uploadProgress={uploadProgress}
        />
      )}
    </div>
  );
};

// Document Form Component
const DocumentForm = ({ item, onSave, onCancel, isUploading, uploadProgress }) => {
  const [formData, setFormData] = useState({
    title: item?.title || '',
    description: item?.description || '',
    category: item?.category || '',
    date: item?.date || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
    featured: item?.featured || false,
    documentFile: null
  });
  const [dragActive, setDragActive] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.documentFile && !item) {
      alert('Please select a document to upload');
      return;
    }
    onSave(formData);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFormData(prev => ({
        ...prev,
        documentFile: e.dataTransfer.files[0]
      }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">
            {item ? 'Edit Document' : 'Add Document'}
          </h2>
          <button 
            type="button" 
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Plus className="w-6 h-6 rotate-45" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter document title..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter document description..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., Guidelines, Forms"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date *
              </label>
              <input
                type="text"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Oct 15, 2023"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Document File {!item && '*'}
            </label>
            <div
              className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                dragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                name="documentFile"
                onChange={handleChange}
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="space-y-2">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="text-sm text-gray-600">
                  <span className="font-medium text-indigo-600 hover:text-indigo-500">
                    Click to upload
                  </span>
                  {' '}or drag and drop
                </div>
                <p className="text-xs text-gray-500">
                  PDF, Word, Excel, PowerPoint, or text files
                </p>
              </div>
              {formData.documentFile && (
                <div className="mt-4 text-sm text-gray-600">
                  Selected: {formData.documentFile.name}
                </div>
              )}
              {item && !formData.documentFile && (
                <div className="mt-4 text-sm text-gray-600">
                  Current file: {item.fileName}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="featured"
              id="featured"
              checked={formData.featured}
              onChange={handleChange}
              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <label htmlFor="featured" className="ml-2 text-sm text-gray-700">
              Feature this document
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
            <button
              type="button"
              onClick={onCancel}
              disabled={isUploading}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isUploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Uploading... {uploadProgress.toFixed(0)}%
                </>
              ) : (
                <>{item ? 'Update Document' : 'Upload Document'}</>
              )}
            </button>
          </div>
          
          {/* Upload Progress Bar */}
          {isUploading && (
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-2 text-center">
                Uploading... {uploadProgress.toFixed(1)}%
              </p>
            </div>
          )}
        </form>
      </motion.div>
    </div>
  );
};

export default ResourcesEditor;
