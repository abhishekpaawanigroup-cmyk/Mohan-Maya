import { useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";

/**
 * Gates its children behind authentication. For direct visits to a protected
 * URL while signed out, we open the auth modal (instead of navigating to a
 * separate auth page) and send the user home; once they sign in, the pending
 * action returns them to the page they were trying to reach.
 */
export default function ProtectedRoute({ children }) {
  const { user, requireAuth } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const dest = location.pathname + location.search;

  useEffect(() => {
    if (!user) {
      requireAuth(() => navigate(dest, { replace: true }));
    }
    // Only re-evaluate when auth state or destination changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, dest]);

  if (!user) return <Navigate to="/" replace />;
  return children;
}
