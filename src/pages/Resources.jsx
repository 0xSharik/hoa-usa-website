import React, { useEffect, useState, useMemo } from 'react';
import { Link, useParams, useNavigate, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Video, 
  FileText, 
  Calendar, 
  Clock, 
  ChevronRight,
  PlayCircle,
  Download,
  Share2,
  Bookmark,
  ArrowRight,
  Search,
  Filter,
  LayoutGrid
} from 'lucide-react';
import { getResources } from '../firebase/services';

// --- Reusable Card Component ---
const ResourceCard = ({ item }) => {
  const isVideo = item.type === 'video';
  const Icon = isVideo ? Video : item.type === 'newsletter' ? FileText : BookOpen;
  
  // Extract YouTube video ID for embed
  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
    const match = url.match(regex);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  };

  const embedUrl = isVideo && item.youtubeUrl ? getYouTubeEmbedUrl(item.youtubeUrl) : null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group bg-white rounded-xl border border-gray-200 hover:border-indigo-300 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full"
    >
      {isVideo && embedUrl ? (
        // Case 1: Video with YouTube embed
        <div className="relative h-48 bg-gray-100">
          <iframe
            src={embedUrl}
            title={item.title}
            className="w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        // Case 2: Non-video OR Video without embed (render clickable card)
        // FIX: Removed the extra curly braces { } that were here
        isVideo ? (
          // Case 2a: External Video Link
          <a 
            href={item.youtubeUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex flex-col h-full"
          >
            <div className="relative h-48 overflow-hidden bg-gray-100">
              <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/10 transition-colors">
                <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Video className="w-6 h-6 text-indigo-600 ml-1" />
                </div>
              </div>
              {item.duration && (
                <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded font-medium">
                  {item.duration}
                </span>
              )}
            </div>
            
            {/* Card Body */}
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-purple-100">
                  <Video className="w-5 h-5 text-purple-600" />
                </div>
                <span className="text-xs font-semibold px-2 py-1 rounded-full bg-purple-100 text-purple-700">
                  Video
                </span>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                {item.title}
              </h3>
              
              <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                {item.excerpt}
              </p>
              
              <div className="mt-auto pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                  {item.date && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {item.date}
                    </div>
                  )}
                  {item.duration && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {item.duration}
                    </div>
                  )}
                  {item.views && (
                    <span>{item.views} views</span>
                  )}
                </div>
                
                <div className="pt-4 border-t border-gray-100 flex items-center text-indigo-600 font-semibold text-sm group-hover:gap-2 transition-all">
                  <span>Watch Now</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            </div>
          </a>
        ) : (
          // Case 2b: Article or Newsletter (Internal Link)
          <Link to={`/resources/${item.type}/${item.id}`} className="flex flex-col h-full">
            <div className="h-2 bg-gradient-to-r from-indigo-500 to-purple-500" />
            
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.type === 'newsletter' ? 'bg-emerald-100' : 'bg-blue-100'}`}>
                  <Icon className={`w-5 h-5 ${item.type === 'newsletter' ? 'text-emerald-600' : 'text-blue-600'}`} />
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${item.type === 'newsletter' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                  {item.type === 'newsletter' ? 'Newsletter' : 'Article'}
                </span>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                {item.title}
              </h3>
              
              <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                {item.excerpt}
              </p>
              
              <div className="mt-auto pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
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
                </div>
                
                {item.issue && (
                  <div className="text-xs text-gray-500 mb-3">
                    Issue: {item.issue}
                  </div>
                )}
                
                <div className="pt-4 border-t border-gray-100 flex items-center text-indigo-600 font-semibold text-sm group-hover:gap-2 transition-all">
                  <span>Read Article</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            </div>
          </Link>
        )
      )}
      
      {/* Footer for Embedded Videos Only */}
      {isVideo && embedUrl && (
        <div className="p-4 border-t border-gray-100">
          <h4 className="font-semibold text-gray-900 mb-2">{item.title}</h4>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.excerpt}</p>
          <div className="flex items-center justify-between text-xs text-gray-500">
            {item.views && <span>{item.views} views</span>}
            {item.duration && <span>{item.duration}</span>}
            {item.date && <span>{item.date}</span>}
          </div>
        </div>
      )}
    </motion.div>
  );
};
// --- Main Component ---
const Resources = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [resourcesData, setResourcesData] = useState({ articles: [], videos: [], newsletters: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const currentCategory = category || 'all';
  const validCategories = ['all', 'articles', 'videos', 'newsletters'];

  // Load data from Firebase on component mount
  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getResources();
      setResourcesData(data);
    } catch (error) {
      console.error('Error loading resources:', error);
      setError('Failed to load resources');
    } finally {
      setLoading(false);
    }
  };

  // Validation redirect
  useEffect(() => {
    if (category && !validCategories.includes(category)) {
      navigate('/resources');
    }
  }, [category, navigate, validCategories]);

  // Combine and Filter Data - MOVED BEFORE EARLY RETURNS
  const filteredResources = useMemo(() => {
    let items = [];
    
    // 1. Flatten items based on category selection
    if (currentCategory === 'all') {
      Object.entries(resourcesData).forEach(([key, value]) => {
        items = [...items, ...value];
      });
    } else {
      items = resourcesData[currentCategory] || [];
    }

    // 2. Filter by Search Query
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      items = items.filter(item => 
        item.title.toLowerCase().includes(lowerQuery) || 
        item.excerpt.toLowerCase().includes(lowerQuery)
      );
    }

    return items;
  }, [currentCategory, searchQuery]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading resources...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
      </div>
    );
  }

  const navItems = [
    { id: 'all', label: 'All Resources', icon: LayoutGrid },
    { id: 'articles', label: 'Articles', icon: BookOpen },
    { id: 'videos', label: 'Videos', icon: Video },
    { id: 'newsletters', label: 'Newsletters', icon: FileText }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 pb-12 pt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6"
          >
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                Knowledge Hub
              </h1>
              <p className="mt-4 text-lg text-gray-500 max-w-2xl">
                Tools, guides, and insights to help you manage your community effectively.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-shadow shadow-sm"
                placeholder="Search titles, topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Navigation */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden sticky top-24">
              <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  <Filter className="w-3 h-3" /> Filters
                </h2>
              </div>
              <nav className="p-2 space-y-1">
                {navItems.map((item) => {
                  const isActive = currentCategory === item.id;
                  return (
                    <Link
                      key={item.id}
                      to={`/resources/${item.id === 'all' ? '' : item.id}`}
                      className={`
                        group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200
                        ${isActive 
                          ? 'bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-200' 
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                      `}
                    >
                      <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-500'}`} />
                      {item.label}
                      {isActive && <ChevronRight className="ml-auto w-4 h-4 text-indigo-400" />}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                {searchQuery ? `Search Results for "${searchQuery}"` : 
                 currentCategory === 'all' ? 'Latest Updates' : 
                 currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1)}
              </h2>
              <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm">
                {filteredResources.length} items found
              </span>
            </div>

            {filteredResources.length > 0 ? (
              <motion.div 
                layout
                className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
              >
                <AnimatePresence>
                  {filteredResources.map((item) => (
                    <ResourceCard key={item.id} item={item} />
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300"
              >
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 mb-4">
                  <Search className="h-6 w-6 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">No resources found</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Try adjusting your search or category filter.
                </p>
                <button 
                  onClick={() => { setSearchQuery(''); navigate('/resources'); }}
                  className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none"
                >
                  Clear all filters
                </button>
              </motion.div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Resources;