import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ role, children }) {
  const { user } = useAuth();

  // Not logged in
  if (!user) {
    return <Navigate to="/" />;
  }

  // Logged in but wrong role
  if (role && user.role !== role) {
    return <Navigate to="/" />;
  }

  return children;
}

export default ProtectedRoute;
