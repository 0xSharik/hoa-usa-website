import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ComplaintManagement from './components/ComplaintManagement';
import ContactManagement from './components/ContactManagement';
import AnnouncementManagement from './components/AnnouncementManagement';
import ResourcesEditor from './components/ResourcesEditor';
import { getAllAnnouncements } from '../../firebase/services/announcementService';
import { getAllComplaints, getAllContacts } from '../../firebase/services/formService';
import { getResources } from '../../firebase/services';
import { Menu, X, BarChart3, Megaphone, BookOpen, MessageSquare, Mail, LogOut, Users, FileText, TrendingUp } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleLogout = async () => {
    // Simple logout - in production you'd want to properly clear auth state
    navigate('/admin/login');
  };

  const refreshDashboard = () => {
    setRefreshKey(prev => prev + 1);
  };

  const menuItems = [
    { id: 'overview', label: 'Dashboard Overview', icon: BarChart3 },
    { id: 'announcements', label: 'Announcements', icon: Megaphone },
    { id: 'resources', label: 'Resources', icon: BookOpen },
    { id: 'complaints', label: 'Concerns', icon: MessageSquare },
    { id: 'contacts', label: 'Contact Management', icon: Mail }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return <DashboardOverview key={refreshKey} />;
      case 'announcements':
        return <AnnouncementManagement onRefresh={refreshDashboard} />;
      case 'resources':
        return <ResourcesEditor onRefresh={refreshDashboard} />;
      case 'complaints':
        return <ComplaintManagement onRefresh={refreshDashboard} />;
      case 'contacts':
        return <ContactManagement onRefresh={refreshDashboard} />;
      default:
        return <DashboardOverview key={refreshKey} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl lg:hidden"
            >
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="w-64 bg-white shadow-lg">
          <SidebarContent />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Page Title */}
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-semibold text-gray-900 truncate">
                {menuItems.find(item => item.id === activeSection)?.label || 'Dashboard'}
              </h1>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogout}
                className="hidden sm:flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </button>
              <button
                onClick={handleLogout}
                className="sm:hidden p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="py-4 sm:py-6 lg:py-8">
            <div className="px-4 sm:px-6 lg:px-8">
              {renderContent()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );

  // Sidebar Component
  function SidebarContent() {
    return (
      <div className="h-full flex flex-col">
        {/* Logo */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-sm text-gray-500 mt-1">The Ridge</p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveSection(item.id);
                setSidebarOpen(false);
              }}
              className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 transition-all duration-200 ${activeSection === item.id
                  ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-700'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
            >
              <item.icon className={`h-5 w-5 ${activeSection === item.id ? 'text-indigo-700' : 'text-gray-400'}`} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Sign Out Button (Mobile) */}
        <div className="p-4 border-t border-gray-200 lg:hidden">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-4 py-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors duration-200"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </button>
        </div>
      </div>
    );
  }
};

// Dashboard Overview Component
const DashboardOverview = () => {
  const [stats, setStats] = useState({
    announcements: 0,
    documents: 0,
    pendingComplaints: 0,
    totalContacts: 0,
    loading: true
  });

  const fetchStats = async () => {
    try {
      const [announcements, resources, complaints, contacts] = await Promise.all([
        getAllAnnouncements().catch(err => {
          console.warn('Failed to fetch announcements:', err);
          return [];
        }),
        getResources().catch(err => {
          console.warn('Failed to fetch resources:', err);
          return { articles: [], videos: [] };
        }),
        getAllComplaints().catch(err => {
          console.warn('Failed to fetch complaints:', err);
          return [];
        }),
        getAllContacts().catch(err => {
          console.warn('Failed to fetch contacts:', err);
          return [];
        })
      ]);

      const totalDocuments = (resources?.articles?.length || 0) + (resources?.videos?.length || 0);
      const pendingComplaints = complaints?.filter(c => c.status === 'pending').length || 0;

      setStats({
        announcements: announcements?.length || 0,
        documents: totalDocuments,
        pendingComplaints,
        totalContacts: contacts?.length || 0,
        loading: false
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setStats({
        announcements: 0,
        documents: 0,
        pendingComplaints: 0,
        totalContacts: 0,
        loading: false
      });
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (stats.loading) {
    return (
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Dashboard Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Dashboard Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Announcements</p>
              <p className="text-2xl font-bold text-indigo-600">{stats.announcements}</p>
              <p className="text-xs text-gray-500 mt-1">Active announcements</p>
            </div>
            <div className="bg-indigo-100 p-3 rounded-lg">
              <Megaphone className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Documents</p>
              <p className="text-2xl font-bold text-green-600">{stats.documents}</p>
              <p className="text-xs text-gray-500 mt-1">Total resources</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Concerns</p>
              <p className="text-2xl font-bold text-orange-600">{stats.pendingComplaints}</p>
              <p className="text-xs text-gray-500 mt-1">Need attention</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <MessageSquare className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Contact Messages</p>
              <p className="text-2xl font-bold text-purple-600">{stats.totalContacts}</p>
              <p className="text-xs text-gray-500 mt-1">Total messages</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Mail className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
