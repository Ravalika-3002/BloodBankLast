import { createContext, useContext, useState } from "react";
import { jwtDecode } from "jwt-decode";
import API from "../api/axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    return token ? jwtDecode(token) : null;
  });

  // ✅ FIXED: role added
  const login = async (email, password, role) => {
    const res = await API.post("/auth/login", {
      email,
      password,
      role
    });

    localStorage.setItem("token", res.data.token);
    const decoded = jwtDecode(res.data.token);
    setUser(decoded);

    return decoded; // helpful for navigation
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
