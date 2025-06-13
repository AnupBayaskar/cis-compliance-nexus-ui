
import React from 'react';
import { Link } from 'react-router-dom';
import { User, LogIn, ExternalLink } from 'lucide-react';

const Navbar = ({ isLoggedIn = false, user = null }) => {
  return (
    <nav className="fixed top-0 right-0 left-0 lg:left-80 z-30 glass-effect border-b border-border">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left side - Company Link */}
        <div className="flex items-center space-x-4">
          <a
            href="https://smartedge.in"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-foreground/80 hover:text-foreground transition-colors group"
          >
            <ExternalLink className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span className="font-semibold">SmartEdge.in</span>
          </a>
        </div>

        {/* Right side - User Actions */}
        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <Link
              to="/profile"
              className="flex items-center space-x-2 px-4 py-2 bg-brand-green/10 text-brand-green rounded-lg hover:bg-brand-green/20 transition-colors"
            >
              <User className="w-4 h-4" />
              <span className="font-medium">{user?.name || 'Profile'}</span>
            </Link>
          ) : (
            <Link
              to="/login"
              className="flex items-center space-x-2 px-4 py-2 bg-brand-gray text-white rounded-lg hover:bg-brand-gray/90 transition-colors"
            >
              <LogIn className="w-4 h-4" />
              <span className="font-medium">Sign In</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
