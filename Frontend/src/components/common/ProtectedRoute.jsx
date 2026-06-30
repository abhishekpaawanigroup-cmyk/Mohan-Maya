import { Navigate, useLocation } from "react-router-dom";
import { useApp } from "../../context/AppContext";

/**
 * Gates its children behind authentication. Unauthenticated users are sent to
 * the auth page with the intended destination preserved in `location.state.from`,
 * so they land back where they meant to go after signing in.
 */
export default function ProtectedRoute({ children }) {
  const { user } = useApp();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/auth?mode=login" replace state={{ from: location.pathname + location.search }} />;
  }
  return children;
}
