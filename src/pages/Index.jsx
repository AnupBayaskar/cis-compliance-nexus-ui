
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import AboutCISSection from '../components/AboutCISSection';
import HowItWorksSection from '../components/HowItWorksSection';
import SmartEdgeSection from '../components/SmartEdgeSection';

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // This will be managed by your auth system

  // Dark mode effect
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Close sidebar on route change or outside click
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-background w-full">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen}
        isDark={isDark}
        setIsDark={setIsDark}
      />

      {/* Main Content */}
      <div className="lg:ml-80 min-h-screen">
        {/* Navbar */}
        <Navbar isLoggedIn={isLoggedIn} />

        {/* Page Content */}
        <div className="pt-20">
          <HeroSection />
          <AboutCISSection />
          <HowItWorksSection />
          <SmartEdgeSection />
        </div>
      </div>
    </div>
  );
};

export default Index;
