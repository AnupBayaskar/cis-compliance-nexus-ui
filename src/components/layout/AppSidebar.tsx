
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useTheme } from '@/context/ThemeContext';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Home, FileText, CheckCircle, User, Moon, Sun } from 'lucide-react';

const navigationItems = [
  { title: 'Home', url: '/', icon: Home },
  { title: 'View Benchmarks', url: '/benchmarks', icon: FileText },
  { title: 'Compliance Check', url: '/compliance', icon: CheckCircle },
  { title: 'User Profile', url: '/profile', icon: User },
];

export function AppSidebar() {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  return (
    <Sidebar className="border-r border-border">
      <SidebarHeader className="p-4">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-brand-green to-brand-gray rounded-lg"></div>
          <span className="font-semibold text-sm">CIS Compliance</span>
        </Link>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    className={cn(
                      "transition-all duration-200",
                      location.pathname === item.url && "bg-primary text-primary-foreground"
                    )}
                  >
                    <Link to={item.url} className="flex items-center space-x-3">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <Separator className="my-4" />
        
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleTheme}
                  className="w-full justify-start space-x-3"
                >
                  {theme === 'light' ? (
                    <>
                      <Moon className="h-4 w-4" />
                      <span>Dark Mode</span>
                    </>
                  ) : (
                    <>
                      <Sun className="h-4 w-4" />
                      <span>Light Mode</span>
                    </>
                  )}
                </Button>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4">
        <div className="text-xs text-muted-foreground text-center">
          © 2024 SmartEdge
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
