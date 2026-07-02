import { useEffect } from "react";
import { Navigate, Link, useLocation, useNavigate } from "react-router-dom";
import { FiLock } from "react-icons/fi";
import { useApp } from "../../context/AppContext";
import { isAdmin } from "../../utils/admin";

/**
 * Client-side gate for the admin area. Signed-out users are prompted to log in
 * (returning here afterwards) and sent home; signed-in non-admins see a notice.
 */
export default function AdminRoute({ children }) {
  const { user, requireAuth } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const dest = location.pathname + location.search;

  useEffect(() => {
    if (!user) requireAuth(() => navigate(dest, { replace: true }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, dest]);

  if (!user) return <Navigate to="/" replace />;

  if (!isAdmin(user)) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-[#fbfefb] px-5 dark:bg-[#0d0508]">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-[#fe4462]/10 text-[#fe4462]">
            <FiLock size={30} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin access only</h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            You don't have permission to view this page. If you believe this is a mistake,
            contact the store administrator.
          </p>
          <Link to="/" className="btn-primary mt-6 inline-flex">Back to Home</Link>
        </div>
      </section>
    );
  }

  return children;
}
