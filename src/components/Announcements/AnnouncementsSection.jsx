import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getAllAnnouncements } from '../../firebase/services/announcementService';
import { useTheme } from '../../contexts/ThemeContext';
import { AnimatedSection, AnimatedCard } from '../../utils/animations.jsx';
import { Bell, Calendar, AlertCircle, Info } from 'lucide-react';

const AnnouncementsSection = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const { theme, colors } = useTheme();

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    try {
      const data = await getAllAnnouncements();
      // Only show active announcements, sorted by priority and date
      const activeAnnouncements = data
        .filter(announcement => announcement.isActive)
        .sort((a, b) => {
          // Sort by priority first (high > medium > normal)
          const priorityOrder = { high: 3, medium: 2, normal: 1 };
          if (priorityOrder[b.priority] !== priorityOrder[a.priority]) {
            return priorityOrder[b.priority] - priorityOrder[a.priority];
          }
          // Then by date (newest first)
          return b.createdAt?.toDate() - a.createdAt?.toDate();
        });
      setAnnouncements(activeAnnouncements);
    } catch (error) {
      console.error('Error loading announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityBadgeColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'normal': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-gray-50 via-indigo-50 to-purple-50 rounded-3xl shadow-2xl border border-white/40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <motion.div
              className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"
            ></motion.div>
            <p className="mt-4 text-gray-600">Loading announcements...</p>
          </div>
        </div>
      </section>
    );
  }

  if (announcements.length === 0) {
    return (
      <section className="py-20 bg-gradient-to-br from-gray-50 via-indigo-50 to-purple-50 rounded-3xl shadow-2xl border border-white/40">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection className="text-center">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-indigo-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Announcements</h2>
            <p className="text-lg text-gray-600">No announcements at this time. Check back soon for updates!</p>
          </AnimatedSection>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-indigo-50 to-purple-50 rounded-3xl shadow-2xl border border-white/40">
      <div className="max-w-7xl mx-auto px-6">
        <AnimatedSection className="text-center mb-16">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Bell className="w-8 h-8 text-indigo-600" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Latest Announcements</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay updated with the latest news, updates, and important information from The Ridge.
          </p>
        </AnimatedSection>

        <div className="space-y-6">
          {announcements.map((announcement, index) => (
            <AnimatedCard
              key={announcement.id}
              delay={0.1 * index}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200"
              whileHover={{ y: -5 }}
            >
              <div className="p-8">
                <div className="flex flex-col lg:flex-row gap-8">
                  {announcement.image && (
                    <div className="lg:w-1/3">
                      <img
                        src={announcement.image}
                        alt={announcement.title}
                        className="w-full h-64 lg:h-48 object-cover rounded-xl"
                      />
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-4 mb-4">
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                        announcement.priority === 'high' 
                          ? 'bg-red-100 text-red-700 border border-red-200'
                          : announcement.priority === 'medium'
                          ? 'bg-amber-100 text-amber-700 border border-amber-200'
                          : 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                      }`}>
                        {announcement.priority === 'high' ? (
                          <AlertCircle className="w-4 h-4" />
                        ) : (
                          <Info className="w-4 h-4" />
                        )}
                        {announcement.priority.charAt(0).toUpperCase() + announcement.priority.slice(1)} Priority
                      </span>
                      
                      <span className="inline-flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        {formatDate(announcement.createdAt)}
                      </span>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      {announcement.title}
                    </h3>
                    
                    <div className="prose prose-gray max-w-none">
                      <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                        {announcement.content}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedCard>
          ))}
        </div>

        {announcements.length > 0 && (
          <AnimatedSection
            delay={0.3}
            className="mt-12 text-center"
          >
            <p className="text-sm" style={{ color: colors.textMuted }}>
              Showing {announcements.length} announcement{announcements.length !== 1 ? 's' : ''}
            </p>
          </AnimatedSection>
        )}
      </div>
    </section>
  );
};

export default AnnouncementsSection;
