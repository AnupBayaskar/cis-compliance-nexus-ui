
import React, { useState } from 'react';
import { 
  Home, 
  Shield, 
  FileText, 
  User, 
  CheckSquare, 
  Moon, 
  Sun,
  Menu,
  X,
  ExternalLink
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ isOpen, setIsOpen, isDark, setIsDark }) => {
  const location = useLocation();

  const navigationItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: FileText, label: 'View Benchmarks', path: '/benchmarks' },
    { icon: CheckSquare, label: 'Compliance Check', path: '/compliance' },
    { icon: User, label: 'User Profile', path: '/profile' },
  ];

  const isActivePath = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-80 bg-sidebar border-r border-sidebar-border z-50
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
        glass-effect shadow-2xl
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-sidebar-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-brand rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-sidebar-foreground">CIS Compliance</h2>
              <p className="text-xs text-sidebar-foreground/60">Security First</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-2 hover:bg-sidebar-accent rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-sidebar-foreground" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider mb-3">
              Navigation
            </h3>
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`
                    flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200
                    ${isActivePath(item.path) 
                      ? 'bg-brand-green text-white shadow-lg shadow-brand-green/20' 
                      : 'text-sidebar-foreground hover:bg-sidebar-accent'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Separator */}
          <div className="border-t border-sidebar-border my-6"></div>

          {/* External Links */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider mb-3">
              External
            </h3>
            <a
              href="https://smartedge.in"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-3 px-4 py-3 rounded-xl text-sidebar-foreground hover:bg-sidebar-accent transition-all duration-200"
            >
              <ExternalLink className="w-5 h-5" />
              <span className="font-medium">SmartEdge.in</span>
            </a>
          </div>

          {/* Theme Toggle */}
          <div className="border-t border-sidebar-border pt-6">
            <h3 className="text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider mb-3">
              Preferences
            </h3>
            <button
              onClick={() => setIsDark(!isDark)}
              className="flex items-center space-x-3 px-4 py-3 rounded-xl text-sidebar-foreground hover:bg-sidebar-accent transition-all duration-200 w-full"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              <span className="font-medium">{isDark ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
          </div>
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-sidebar-border bg-sidebar/80">
          <div className="text-center">
            <p className="text-xs text-sidebar-foreground/60">
              © 2024 SmartEdge Technologies
            </p>
            <p className="text-xs text-sidebar-foreground/40 mt-1">
              Secured by CIS Standards
            </p>
          </div>
        </div>
      </aside>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 z-30 lg:hidden p-3 bg-sidebar border border-sidebar-border rounded-xl shadow-lg glass-effect"
      >
        <Menu className="w-6 h-6 text-sidebar-foreground" />
      </button>
    </>
  );
};

export default Sidebar;
