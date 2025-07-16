import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Home,
  Users,
  Monitor,
  Shield,
  CheckSquare,
  FileText,
  User,
  Building,
  Moon,
  Sun,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Team Space", href: "/team-space", icon: Users },
  { name: "Device Space", href: "/device-space", icon: Monitor },
  { name: "Compliance Space", href: "/compliance-space", icon: Shield },
  { name: "Validation Space", href: "/validation-space", icon: CheckSquare },
  { name: "Reports Space", href: "/reports-space", icon: FileText },
  { name: "Profile", href: "/profile", icon: User },
];

export function AppSidebar() {
  const { user } = useAuth();
  const location = useLocation();
  const [isDark, setIsDark] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  const orgLeaderNav =
    user?.role === "organization-lead"
      ? [
          {
            name: "Organization Space",
            href: "/organization-space",
            icon: Building,
          },
        ]
      : [];

  const allNavigation = [
    ...navigation.slice(0, -1),
    ...orgLeaderNav,
    navigation[navigation.length - 1],
  ];

  const isActivePath = (path: string) => location.pathname === path;

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 h-full bg-card border-r border-border z-50 flex flex-col transition-all duration-200",
        expanded ? "w-56" : "w-20"
      )}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      {/* Header */}
      <div className="flex items-center justify-center p-4 border-b border-border">
        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
          <Shield className="w-6 h-6 text-primary-foreground" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {allNavigation.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center w-full h-12 rounded-xl transition-all duration-200 group relative",
                isActivePath(item.href)
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <span className="flex items-center gap-3 w-full px-3">
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span
                  className={cn(
                    "overflow-hidden transition-all duration-200",
                    expanded ? "opacity-100 ml-2 w-auto" : "opacity-0 w-0 ml-0"
                  )}
                  style={{ display: expanded ? "inline" : "none" }}
                >
                  {item.name}
                </span>
              </span>
            </NavLink>
          );
        })}
      </nav>

      {/* Theme Toggle */}
      <div className="p-4 border-t border-border">
        <button
          onClick={toggleTheme}
          className="flex items-center justify-center w-12 h-12 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200 group relative"
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}

          <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-auto whitespace-nowrap z-50 shadow-lg">
            {isDark ? "Light Mode" : "Dark Mode"}
          </div>
        </button>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <a
          href="https://smartedge.in"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-12 h-12 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200 group relative"
        >
          <ExternalLink className="w-5 h-5" />

          <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-auto whitespace-nowrap z-50 shadow-lg">
            SmartEdge.in
          </div>
        </a>
      </div>
    </aside>
  );
}
