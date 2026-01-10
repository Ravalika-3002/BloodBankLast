import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("hospital");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password || !role) {
      alert("All fields are required");
      return;
    }

    try {
      const decoded = await login(email, password, role);

      // ✅ ROLE BASED REDIRECT
      if (decoded.role === "admin") navigate("/admin");
      else if (decoded.role === "hospital") navigate("/hospital");
      else if (decoded.role === "donor") navigate("/donor");
      else navigate("/user");

    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Login</h2>
        <p className="subtitle">Access your dashboard</p>

        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="user">User</option>
          <option value="donor">Donor</option>
          <option value="hospital">Hospital</option>
          <option value="admin">Admin</option>
        </select>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="login-btn" onClick={handleLogin}>
          Login
        </button>

        <div className="signup-text">
          Don’t have an account? <span>Register</span>
        </div>
      </div>
    </div>
  );
}

export default Login;
