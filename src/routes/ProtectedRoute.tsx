import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: ("USER" | "ADMIN")[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roles }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles && user) {
    // mapear user.is_admin -> "ADMIN" o "USER"
    const role = user.is_admin ? "ADMIN" : "USER";

    if (!roles.includes(role)) {
      return <Navigate to="/main" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
