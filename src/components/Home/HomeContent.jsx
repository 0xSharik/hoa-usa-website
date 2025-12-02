import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Users, 
  Building2,
  ArrowRight
} from 'lucide-react';
import AnnouncementsSection from '../Announcements/AnnouncementsSection';

// --- Main HomeContent Component ---
const HomeContent = () => {
  return (
    <div className="py-16 bg-gradient-to-br from-indigo-200/40 via-indigo-300/40 to-purple-500/45">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        

        {/* Key Features */}
       

        {/* Announcements Section */}
        <AnnouncementsSection />

        
      </div>
    </div>
  );
};

export default HomeContent;


 