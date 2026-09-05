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
    <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <Link to="/" className="text-xl font-bold text-blue-600">
        ClassTaskSpace
      </Link>

      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <>
            <Link
              to={user.role === "teacher" ? "/teacher/dashboard" : "/student/dashboard"}
              className="text-gray-600 hover:text-blue-600 font-medium"
            >
              Dashboard
            </Link>
            <span className="text-gray-500 text-sm">
              {user.name} ({user.role})
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-50 text-red-600 font-medium px-4 py-1.5 rounded-lg hover:bg-red-100 transition"
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