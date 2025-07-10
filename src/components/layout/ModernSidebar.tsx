
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useTheme } from '@/context/ThemeContext';
import { useRBAC } from '@/context/RBACContext';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Home, FileText, CheckCircle, User, Moon, Sun, Save, Settings } from 'lucide-react';

const ModernSidebar = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { currentUser } = useRBAC();

  // Define all navigation items with role requirements
  const allNavigationItems = [
    { title: 'Home', url: '/', icon: Home, roles: ['super_admin', 'admin', 'user'] },
    { title: 'View Benchmarks', url: '/benchmarks', icon: FileText, roles: ['super_admin', 'admin'] },
    { title: 'Compliance Check', url: '/compliance', icon: CheckCircle, roles: ['super_admin', 'admin'] },
    { title: 'Saved Configurations', url: '/saved-configurations', icon: Save, roles: ['super_admin', 'admin'] },
    { title: 'Admin Panel', url: '/admin', icon: Settings, roles: ['super_admin', 'admin'] },
    { title: 'User Profile', url: '/profile', icon: User, roles: ['super_admin', 'admin', 'user'] },
  ];

  // Filter navigation items based on current user's role
  const navigationItems = allNavigationItems.filter(item => 
    !currentUser || item.roles.includes(currentUser.role)
  );

  return (
    <TooltipProvider>
      <aside className="fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-20 bg-background/80 backdrop-blur-lg border-r border-border/50 supports-[backdrop-filter]:bg-background/60">
        <div className="flex flex-col h-full py-6">
          {/* Navigation Items */}
          <nav className="flex-1 space-y-2 px-3">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.url;
              return (
                <Tooltip key={item.title} delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Link
                      to={item.url}
                      className={cn(
                        "flex items-center justify-center w-14 h-14 rounded-xl transition-all duration-200 group relative",
                        isActive 
                          ? "bg-brand-green/10 text-brand-green shadow-lg" 
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      )}
                    >
                      <item.icon className={cn(
                        "h-6 w-6 transition-transform duration-200",
                        "group-hover:scale-110"
                      )} />
                      {isActive && (
                        <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-brand-green rounded-full" />
                      )}
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="ml-2">
                    <p>{item.title}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </nav>
          
          {/* Separator */}
          <div className="px-3 my-4">
            <div className="h-px bg-border/50" />
          </div>
          
          {/* Theme Toggle */}
          <div className="px-3">
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <button
                  onClick={toggleTheme}
                  className="flex items-center justify-center w-14 h-14 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200 group"
                >
                  {theme === 'light' ? (
                    <Moon className="h-6 w-6 transition-transform duration-200 group-hover:scale-110" />
                  ) : (
                    <Sun className="h-6 w-6 transition-transform duration-200 group-hover:scale-110" />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="ml-2">
                <p>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </aside>
    </TooltipProvider>
  );
};

export default ModernSidebar;
