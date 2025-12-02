import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Hero from './components/Hero/Hero';
import HomeContent from './components/Home/HomeContent';
import Resources from './pages/Resources';
import Contact from './pages/Contact';
import AdminDashboard from './pages/admin/NewAdminDashboard';
import Login from './pages/admin/Login';
import { AuthProvider, ProtectedRoute } from './hooks/useAuth.jsx';
import { ThemeProvider } from './contexts/ThemeContext';
import PageTransition from './components/UI/PageTransition';
import './App.css';

const Layout = ({ children }) => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-grow">{children}</main>
    <Footer />
  </div>
);

const AppContent = () => {
  const location = useLocation();
  
  return (
    <PageTransition>
      <Routes location={location}>
        <Route path="/" element={<Layout><Home /></Layout>} />

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
        
        <Route path="/contact" element={<Layout><Contact /></Layout>} />
        
        {/* 404 fallback */}
        <Route path="*" element={<Layout><Home /></Layout>} />
      </Routes>
    </PageTransition>
  );
};

const Home = () => (
  <>
    <Hero />
    <HomeContent />
  </>
);

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
