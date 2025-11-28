import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Hero from './components/Hero/Hero';
import HomeContent from './components/Home/HomeContent';
import ComplaintForm from './components/ComplaintForm/ComplaintForm';
import ContactForm from './components/ContactForm/ContactForm';
import About from './pages/About';
import OurStory from './pages/about/OurStory';
import Team from './pages/about/Team';
import Careers from './pages/about/Careers';
import Resources from './pages/Resources';
import Directories from './pages/Directories';
import ArticleReader from './pages/resources/ArticleReader';
import HoaByState from './pages/directories/HoaByState';
import VendorDirectory from './pages/directories/VendorDirectory';
import StateLaws from './pages/StateLaws';
import Advertise from './pages/Advertise';
import Contact from './pages/Contact';
import Advertisers from './pages/Advertisers';
import AdminDashboard from './pages/admin/NewAdminDashboard';
import Login from './pages/admin/Login';
import Videos from './pages/resources/Videos';
import { AuthProvider, ProtectedRoute } from './hooks/useAuth.jsx';
import { ThemeProvider } from './contexts/ThemeContext';
import './App.css';

const Layout = ({ children }) => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-grow">{children}</main>
    <Footer />
  </div>
);

const Home = () => (
  <>
    <Hero />
    <HomeContent />
    <ComplaintForm />
    <ContactForm />

  </>
);

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout><Home /></Layout>} />

            <Route path="/about" element={<Layout><About /></Layout>}>
              
            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/admin/login" element={<Login />} />
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />

            {/* Resources Routes */}
            <Route path="/resources" element={<Layout><Resources /></Layout>}>
              <Route index element={<Navigate to="" replace />} />
              <Route path=":category" element={<Resources />} />
            </Route>

            {/* Article Reader Route */}
            <Route path="/resources/article/:articleId" element={<Layout><ArticleReader /></Layout>} />

            {/* Directories Routes */}
            
            <Route path="/directories/vendors" element={<Layout><VendorDirectory /></Layout>} />
            <Route path="/directories" element={<Layout><Directories /></Layout>} />
            
            <Route path="/advertise" element={<Layout><Advertise /></Layout>} />
            
            <Route path="/contact" element={<Layout><Contact /></Layout>} />
            <Route path="/vendors" element={<VendorDirectory />} />
            <Route path="/vendors/:vendorId" element={<VendorDirectory />} />
            {/* 404 fallback */}
            <Route path="*" element={<Layout><Home /></Layout>} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
