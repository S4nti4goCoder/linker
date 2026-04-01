import { Navigate } from "react-router-dom";
import { useSubcription } from "../store/AuthStore";

export const ProtectedRoute = ({ children, authenticated = true }) => {
  const { user, loading } = useSubcription();

  if (loading) return null;

  if (authenticated === false) {
    if (!user) return children;
    return <Navigate to={"/"} replace />;
  }

  if (authenticated) {
    if (user) return children;
    return <Navigate to={"/login"} replace />;
  }

  return <Navigate to="/login" replace />;
};
