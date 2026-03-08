import { Navigate } from "react-router-dom";
import { useSubcription } from "../store/AuthStore";

export const ProtectedRoute = ({ children, authenticated = true }) => {
  const { user } = useSubcription();

  if (authenticated === false) {
    if (!user) return children;
    return <Navigate to={"/"} replace />;
  }

  if (authenticated) {
    if (user) return children;
    return <Navigate to={"/login"} replace />;
  }

  return <Navigate to="/login" replace />; // ✅ fix: era <navigate> en minúscula
};