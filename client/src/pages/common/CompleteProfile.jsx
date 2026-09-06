import { useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
const CompleteProfile = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [role, setRole] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const tempToken = sessionStorage.getItem("googleTempToken");

    const handleChange = (e) => {
        setRole(e.target.value);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!role){
            setError("Please select a role");
            return;
        }
        setError("");
        setLoading(true);
        try {
            const response = await axiosInstance.post("/auth/google/complete",{
                tempToken,
                role
            });
            sessionStorage.removeItem("googleTempToken");
            login(response.data.token);
            const decoded = jwtDecode(response.data.token);
            navigate(decoded.role === "teacher" ? "/teacher/dashboard" : "/student/dashboard");
        } catch (error) {
          const errorMessage = error.response?.data?.message || "Something went wrong";
            setError(errorMessage);
        } finally{
            setLoading(false);
        }
    }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-4 sm:p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Almost there</h1>
        <p className="text-gray-500 text-sm mb-6">Tell us who you are to finish setting up your account</p>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">I am a...</label>
            <select
              value={role}
              onChange={handleChange}
              className="block w-full min-w-0 max-w-full truncate px-3 py-2 text-sm sm:px-4 sm:text-base border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select your role</option>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Setting up..." : "Continue"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompleteProfile;