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
import ComplaintForm from '../ComplaintForm/ComplaintForm';

// --- Main HomeContent Component ---
const HomeContent = () => {
  return (
    <div className="py-16 bg-gradient-to-br from-indigo-200/40 via-indigo-300/40 to-purple-500/45">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        

        {/* Key Features */}
       

        {/* Announcements Section */}
        <AnnouncementsSection />

        {/* Spacer */}
        <div className="py-12"></div>

        {/* Complaint Form Section */}
        <section className="py-20 bg-gradient-to-br from-gray-50 via-indigo-50 to-purple-50 rounded-3xl shadow-2xl border border-white/40">
          <ComplaintForm />
        </section>

        
      </div>
    </div>
  );
};

export default HomeContent;


 