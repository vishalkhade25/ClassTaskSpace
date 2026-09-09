import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  const navigate = useNavigate();

  return (
    <nav className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex flex-wrap items-center justify-between gap-3">
      <Link to="/" className="text-lg sm:text-xl font-bold text-blue-600">
        ClassTaskSpace
      </Link>

      <div className="flex flex-wrap items-center gap-2 sm:gap-4">
        {isAuthenticated ? (
          <>
            <Link
              to={user.role === "teacher" ? "/teacher/dashboard" : "/student/dashboard"}
              className="hidden text-gray-600 hover:text-blue-600 font-medium sm:inline"
            >
              Dashboard
            </Link>
            <span className="hidden text-gray-500 text-sm sm:inline">
              {user.name} ({user.role})
            </span>
            <button
              onClick={handleLogout}
              className="ml-auto shrink-0 whitespace-nowrap bg-red-50 text-red-600 font-medium px-4 py-1.5 rounded-lg hover:bg-red-100 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="text-blue-600 font-medium hover:underline">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;