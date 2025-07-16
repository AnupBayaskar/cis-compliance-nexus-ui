import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";

interface AuthContextType {
  user: { user_id: string; name: string; email: string } | null;
  token: string | null;
  login: (
    email: string,
    password: string
  ) => Promise<{ user: { user_id: string; name: string; email: string } }>;
  register: (
    name: string,
    email: string,
    password: string,
    phone?: string
  ) => Promise<{ user: { user_id: string; name: string; email: string } }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<{
    user_id: string;
    name: string;
    email: string;
  } | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const API_BASE_URL = "http://localhost:3000";

  useEffect(() => {
    const storedToken = localStorage.getItem("governer-token");
    const storedUser = localStorage.getItem("governer-user");
    console.log(
      "[AuthContext] useEffect: storedToken",
      storedToken,
      "storedUser",
      storedUser
    );
    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(parsedUser);
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${storedToken}`;
        console.log(
          "[AuthContext] Restored user and token from localStorage:",
          parsedUser,
          storedToken
        );
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("governer-token");
        localStorage.removeItem("governer-user");
      }
    } else if (storedToken && !storedUser) {
      // If only token is present, fetch user profile from backend
      setToken(storedToken);
      axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
      axios
        .get("http://localhost:3000/auth/profile")
        .then((res) => {
          setUser(res.data);
          localStorage.setItem("governer-user", JSON.stringify(res.data));
          console.log(
            "[AuthContext] Profile fetched and user restored:",
            res.data
          );
        })
        .catch((err) => {
          setUser(null);
          localStorage.removeItem("governer-token");
          localStorage.removeItem("governer-user");
          console.error(
            "[AuthContext] Failed to fetch profile with token:",
            err
          );
        });
    } else {
      setUser(null);
      setToken(null);
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem("governer-token");
      localStorage.removeItem("governer-user");
      console.log("[AuthContext] No stored token/user found on mount.");
    }
  }, []);

  const login = async (email: string, password: string) => {
    const response = await axios.post<{
      accessToken: string;
      user: { user_id: string; name: string; email: string };
    }>(`${API_BASE_URL}/auth/login`, { email, password });
    const { accessToken, user } = response.data;
    setToken(accessToken);
    setUser(user);
    axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    localStorage.setItem("governer-token", accessToken);
    localStorage.setItem("governer-user", JSON.stringify(user));
    return { user };
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    phone?: string
  ) => {
    const response = await axios.post<{
      accessToken: string;
      user: { user_id: string; name: string; email: string };
    }>(`${API_BASE_URL}/auth/register`, { name, email, password, phone });
    const { accessToken, user } = response.data;
    setToken(accessToken);
    setUser(user);
    axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    localStorage.setItem("governer-token", accessToken);
    localStorage.setItem("governer-user", JSON.stringify(user));
    return { user };
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    delete axios.defaults.headers.common["Authorization"];
    localStorage.removeItem("governer-token");
    localStorage.removeItem("governer-user");
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
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
