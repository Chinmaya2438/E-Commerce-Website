import { createContext, useContext, useState, useEffect } from "react";
import { loginUser, registerUser, getProfile } from "../services/api";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const { data } = await getProfile();
          setUser(data);
        } catch {
          localStorage.removeItem("token");
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };
    loadUser();
  }, [token]);

  const login = async (credentials) => {
    try {
      const { data } = await loginUser(credentials);
      localStorage.setItem("token", data.token);
      setToken(data.token);
      setUser(data);
      toast.success("Welcome back!");
      return { success: true };
    } catch (error) {
      const msg = error.response?.data?.message || "Login failed";
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  const signup = async (userData) => {
    try {
      const { data } = await registerUser(userData);
      localStorage.setItem("token", data.token);
      setToken(data.token);
      setUser(data);
      toast.success("Account created successfully!");
      return { success: true };
    } catch (error) {
      const msg = error.response?.data?.message || "Signup failed";
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    toast.success("Logged out");
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, token, loading, login, signup, logout, isAdmin: user?.role === "admin" }}
    >
      {children}
    </AuthContext.Provider>
  );
};
