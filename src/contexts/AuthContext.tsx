import React, { createContext, useContext, useState, useEffect } from "react";
import { User, AuthContextType, UserRole } from "../types/auth";

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
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = "http://localhost:3000";

  // Helper to get token
  const getToken = () => localStorage.getItem("governer-token");

  useEffect(() => {
    // On mount, check for token and fetch profile
    const token = getToken();
    if (token) {
      fetch(`${API_BASE_URL}/auth/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Invalid token");
          return res.json();
        })
        .then((data) => {
          setUser(data);
        })
        .catch(() => {
          setUser(null);
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
      localStorage.setItem("governer-token", data.accessToken);
      setUser(data.user);
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
      // Default to super-admin if no role is provided (for initial setup)
      const regRole = role || "super-admin";
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          role: regRole,
          organizationId,
        }),
      });
      if (!res.ok) {
        const error = await res.text();
        throw new Error(error || "Registration failed");
      }
      // Optionally, auto-login after registration:
      // const data = await res.json();
      // localStorage.setItem('governer-token', data.accessToken);
      // setUser(data.user);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("governer-token");
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
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
