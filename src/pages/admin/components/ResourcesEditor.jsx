import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Eye, Calendar, Clock, BookOpen, FileText, Video, PlayCircle } from 'lucide-react';
import { 
  getResources, 
  createResource, 
  updateResource, 
  deleteResource 
} from '../../../firebase/services';
import { uploadImage } from '../../../utils/cloudinary';

const ResourcesEditor = () => {
  const [activeTab, setActiveTab] = useState('articles');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for resources
  const [articles, setArticles] = useState([]);
  const [videos, setVideos] = useState([]);
  const [newsletters, setNewsletters] = useState([]);

  // Load data from Firebase on component mount
  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    try {
      setLoading(true);
      setError(null);
      const resourcesData = await getResources();
      setArticles(resourcesData.articles);
      setVideos(resourcesData.videos);
      setNewsletters(resourcesData.newsletters);
    } catch (error) {
      console.error('Error loading resources:', error);
      setError('Failed to load resources');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'articles', label: 'Articles', icon: BookOpen, count: articles.length },
    { id: 'videos', label: 'Videos', icon: Video, count: videos.length },
    { id: 'newsletters', label: 'Newsletters', icon: FileText, count: newsletters.length }
  ];

  const handleView = (item, type) => {
    if (type === 'videos' && item.youtubeUrl) {
      // Open YouTube video in new tab
      window.open(item.youtubeUrl, '_blank');
    } else {
      // For articles and newsletters, open in new tab (could be expanded to show detail page)
      const url = `/resources/${type}s/${item.id}`;
      window.open(url, '_blank');
    }
  };

  const handleDelete = async (id, type) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        setError(null);
        await deleteResource(type, id);
        await loadResources();
      } catch (error) {
        console.error('Error deleting resource:', error);
        setError('Failed to delete resource');
      }
    }
  };

  const handleEdit = (item, type) => {
    setEditingItem({ ...item, type });
    setShowAddForm(true);
  };

  const handleSave = async (formData) => {
    try {
      setError(null);
      
      // Handle image upload if file provided
      let finalData = { ...formData };
      if (formData.imageFile) {
        const imageUrl = await uploadImage(formData.imageFile);
        if (imageUrl) {
          finalData.thumbnail = imageUrl;
        }
        delete finalData.imageFile;
      }
      
      // Auto-generate thumbnail from YouTube URL if not provided
      if (activeTab === 'videos' && finalData.youtubeUrl && !finalData.thumbnail) {
        const videoId = extractYouTubeId(finalData.youtubeUrl);
        if (videoId) {
          finalData.thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        }
      }
      
      // Auto-generate duration and views for videos if not provided
      if (activeTab === 'videos') {
        if (!finalData.duration) {
          const minutes = Math.floor(Math.random() * 16) + 5;
          const seconds = Math.floor(Math.random() * 60);
          finalData.duration = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
        
        if (!finalData.views) {
          const baseViews = Math.floor(Math.random() * 9000) + 100;
          finalData.views = baseViews < 1000 ? `${baseViews}` : `${(baseViews / 1000).toFixed(1)}K`;
        }
      }
      
      if (editingItem) {
        // Update existing item
        await updateResource(activeTab, editingItem.id, finalData);
      } else {
        // Create new item
        await createResource(activeTab, finalData);
      }
      
      // Reload data
      await loadResources();
      
      // Close form
      setShowAddForm(false);
      setEditingItem(null);
    } catch (error) {
      console.error('Error saving resource:', error);
      setError('Failed to save resource');
    }
  };

  const extractYouTubeId = (url) => {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const currentItems = activeTab === 'articles' ? articles : activeTab === 'videos' ? videos : newsletters;

  // Show loading state
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading resources...</p>
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Resources Management</h1>
        <p className="text-gray-600">Manage articles, videos, and newsletters for the HOA-USA resource center.</p>
      </div>

      <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-lg">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center px-4 py-2 rounded-md font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <tab.icon className="w-4 h-4 mr-2" />
            {tab.label}
            <span className="ml-2 bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      <div className="mb-6 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          {currentItems.length} {activeTab === 'articles' ? 'articles' : 'newsletters'} total
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
          Add {activeTab === 'articles' ? 'Article' : activeTab === 'videos' ? 'Video' : 'Newsletter'}
        </motion.button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {currentItems.length === 0 ? (
          <div className="text-center py-12">
            {activeTab === 'videos' ? (
              <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            ) : (
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            )}
            <p className="text-gray-500">No {activeTab} found.</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="mt-4 text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Add your first {activeTab === 'articles' ? 'article' : activeTab === 'videos' ? 'video' : 'newsletter'}
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {currentItems.map((item, index) => (
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
                      {activeTab === 'videos' ? item.description : item.excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      {item.date && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {item.date}
                        </div>
                      )}
                      {item.readTime && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {item.readTime}
                        </div>
                      )}
                      {item.duration && (
                        <div className="flex items-center gap-1">
                          <PlayCircle className="w-4 h-4" />
                          {item.duration}
                        </div>
                      )}
                      {item.views && (
                        <span>{item.views} views</span>
                      )}
                      {item.issue && (
                        <span>{item.issue}</span>
                      )}
                      {item.downloads && (
                        <span>{item.downloads} downloads</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleView(item, activeTab)}
                      className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="View"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEdit(item, activeTab)}
                      className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id, activeTab)}
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
        <ResourceForm
          item={editingItem}
          type={activeTab}
          onSave={handleSave}
          onCancel={() => {
            setShowAddForm(false);
            setEditingItem(null);
          }}
        />
      )}
    </div>
  );
};

// Resource Form Component
// Resource Form Component
const ResourceForm = ({ item, type, onSave, onCancel }) => {
  // 1. Fixed: Properly closed the state object and added missing fields
  const [formData, setFormData] = useState({
    title: item?.title || '',
    excerpt: item?.excerpt || '',
    description: item?.description || '',
    category: item?.category || '',
    date: item?.date || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
    readTime: item?.readTime || '',
    duration: item?.duration || '',
    issue: item?.issue || '',
    youtubeUrl: item?.youtubeUrl || '',
    thumbnail: item?.thumbnail || '',
    views: item?.views || '',
    featured: item?.featured || false,
    imageFile: null // Needed for the image upload logic in handleSave
  });

  // 2. Fixed: Added the missing handleChange function
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value
    }));
  };

  // 3. Fixed: Added the missing handleSubmit function
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  // 4. Fixed: Added the return statement and Modal wrapper that was missing
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">
            {item ? 'Edit' : 'Add'} {type === 'articles' ? 'Article' : type === 'videos' ? 'Video' : 'Newsletter'}
          </h2>
          <button 
            type="button" 
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            {/* Using a rotated Plus icon as a close button since X isn't imported */}
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
              placeholder="Enter title..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {type === 'videos' ? 'Description *' : 'Excerpt *'}
            </label>
            <textarea
              name={type === 'videos' ? 'description' : 'excerpt'}
              value={type === 'videos' ? formData.description : formData.excerpt}
              onChange={handleChange}
              required
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder={type === 'videos' ? 'Enter description...' : 'Enter excerpt...'}
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
                placeholder="e.g., Management, Finance"
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

          {type === 'articles' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Read Time
              </label>
              <input
                type="text"
                name="readTime"
                value={formData.readTime}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., 5 min read"
              />
            </div>
          ) : type === 'videos' ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  YouTube URL *
                </label>
                <input
                  type="url"
                  name="youtubeUrl"
                  value={formData.youtubeUrl}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="https://www.youtube.com/watch?v=..."
                />
                <p className="mt-1 text-xs text-gray-500">YouTube video URL will auto-generate thumbnail</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (Optional)
                </label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Auto-generated or e.g., 8:45"
                />
                <p className="mt-1 text-xs text-gray-500">Will be auto-generated if left empty</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thumbnail URL (Optional)
                </label>
                <input
                  type="url"
                  name="thumbnail"
                  value={formData.thumbnail}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Auto-generated from YouTube or custom URL"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Views (Optional)
                </label>
                <input
                  type="text"
                  name="views"
                  value={formData.views}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Auto-generated or e.g., 1.2K"
                />
                <p className="mt-1 text-xs text-gray-500">Will be auto-generated if left empty</p>
              </div>
            </>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Issue
              </label>
              <input
                type="text"
                name="issue"
                value={formData.issue}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., Issue #12"
              />
            </div>
          )}

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
              Feature this item
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
            >
              {item ? 'Update' : 'Create'} {type === 'articles' ? 'Article' : type === 'videos' ? 'Video' : 'Newsletter'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
export default ResourcesEditor;
