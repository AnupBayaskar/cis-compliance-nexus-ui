import React, { createContext, useContext, useState, useEffect } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  organizationId?: string;
  organizationName?: string;
  teams?: string[];
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  login: (email: string, password: string) => Promise<{ user: User } | null>;
  logout: () => void;
  register: (name: string, email: string, password: string, role?: string, organizationId?: string) => Promise<{ user: User } | null>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for demonstration
const mockUsers: Record<string, User> = {
  "superadmin@example.com": {
    id: "0",
    name: "Super Admin",
    email: "superadmin@example.com",
    role: "super-admin",
    organizationId: "",
    organizationName: "",
    teams: [],
  },
  "member@example.com": {
    id: "1",
    name: "John Doe",
    email: "member@example.com",
    role: "member",
    organizationId: "org1",
    organizationName: "Acme Corporation",
    teams: ["team1", "team2"],
  },
  "validator@example.com": {
    id: "2",
    name: "Jane Smith",
    email: "validator@example.com",
    role: "validator",
    organizationId: "org1",
    organizationName: "Acme Corporation",
    teams: ["team1", "team3"],
  },
  "admin@example.com": {
    id: "3",
    name: "Mike Johnson",
    email: "admin@example.com",
    role: "team-lead",
    organizationId: "org1",
    organizationName: "Acme Corporation",
    teams: ["team1"],
  },
  "org-lead@example.com": {
    id: "4",
    name: "Sarah Wilson",
    email: "org-lead@example.com",
    role: "organization-lead",
    organizationId: "org1",
    organizationName: "Acme Corporation",
    teams: ["team1", "team2", "team3"],
  },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = "http://localhost:3000";

  // Helper to get token
  const getToken = () => localStorage.getItem("governer-token");

  useEffect(() => {
    // On mount, check for token and fetch profile
    const storedToken = getToken();
    if (storedToken) {
      setToken(storedToken);
      fetch(`${API_BASE_URL}/auth/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Invalid token");
          return res.json();
        })
        .then((data) => {
          // Ensure user has role property
          const userData = {
            ...data,
            role: data.role || 'user'
          };
          setUser(userData);
        })
        .catch(() => {
          setUser(null);
          setToken(null);
          localStorage.removeItem("governer-token");
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        throw new Error("Invalid credentials");
      }
      const data = await res.json();
      const accessToken = data.accessToken;
      localStorage.setItem("governer-token", accessToken);
      setToken(accessToken);
      
      // Ensure user has role property
      const userData = {
        ...data.user,
        role: data.user.role || 'user'
      };
      setUser(userData);
      return { user: userData };
    } finally {
      setLoading(false);
    }
  };

  // Registration function
  const register = async (
    name: string,
    email: string,
    password: string,
    role?: string,
    organizationId?: string
  ) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
          organizationId,
        }),
      });
      if (!res.ok) {
        const error = await res.text();
        throw new Error(error || "Registration failed");
      }
      const data = await res.json();
      const accessToken = data.accessToken;
      localStorage.setItem("governer-token", accessToken);
      setToken(accessToken);
      
      // Ensure user has role property
      const userData = {
        ...data.user,
        role: data.user.role || role || 'user'
      };
      setUser(userData);
      return { user: userData };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("governer-token");
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    token,
    login,
    logout,
    register,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
