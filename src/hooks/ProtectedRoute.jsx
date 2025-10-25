import { Navigate } from "react-router-dom";
import { useSubcription } from "../store/AuthStore";

export const ProtectedRoute = ({ children, authenticated = true }) => {
  const { user } = useSubcription();
  if (authenticated === false) {
    if (!user) {
      return children;
    } else {
      return <Navigate to={"/"} replace />;
    }
  }
  if (authenticated) {
    if (user) {
      return children;
    } else {
      return <Navigate to={"/login"} replace />;
    }
  }
  return <navigate to="/login" replace />;
};
