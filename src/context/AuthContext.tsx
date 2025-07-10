
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  user: { user_id: string; name: string; email: string; role: string } | null;
  token: string | null;
  login: (email: string, password: string) => Promise<{ user: { user_id: string; name: string; email: string; role: string } }>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<{ user: { user_id: string; name: string; email: string; role: string } }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<{ user_id: string; name: string; email: string; role: string } | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // Ensure role exists, default to 'user' if not present for backward compatibility
        if (!parsedUser.role) {
          parsedUser.role = 'user';
        }
        setToken(storedToken);
        setUser(parsedUser);
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Check if user exists in localStorage
    const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const existingUser = existingUsers.find((u: any) => u.email === email && u.password === password);
    
    if (!existingUser) {
      throw new Error('Invalid email or password');
    }

    const mockToken = 'mock-jwt-token-' + Date.now();
    const userData = {
      user_id: existingUser.user_id,
      name: existingUser.name,
      email: existingUser.email,
      role: existingUser.role || 'user' // Default to 'user' role if not set
    };

    setToken(mockToken);
    setUser(userData);
    localStorage.setItem('token', mockToken);
    localStorage.setItem('user', JSON.stringify(userData));
    
    return { user: userData };
  };

  const register = async (name: string, email: string, password: string, phone?: string) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Check if user already exists
    const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const userExists = existingUsers.find((u: any) => u.email === email);
    
    if (userExists) {
      throw new Error('User with this email already exists');
    }

    const mockToken = 'mock-jwt-token-' + Date.now();
    const userData = {
      user_id: 'user-' + Date.now(),
      name,
      email,
      role: 'user' // Default role for new registrations
    };

    // Store user in registered users list
    const newUser = { ...userData, password, phone };
    existingUsers.push(newUser);
    localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));

    setToken(mockToken);
    setUser(userData);
    localStorage.setItem('token', mockToken);
    localStorage.setItem('user', JSON.stringify(userData));
    
    return { user: userData };
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
