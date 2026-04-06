import { Navigate } from "react-router-dom";
import { useSubscription } from "../store/AuthStore";
import { SpinnerLocal } from "../components/ui/spinners/SpinnerLocal";

export const ProtectedRoute = ({ children, authenticated = true }) => {
  const { user, loading } = useSubscription();

  if (loading) return <SpinnerLocal />;

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
