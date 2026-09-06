import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axiosInstance from '../../api/axiosInstance';
import { useAuth } from '../../context/AuthContext';
import { jwtDecode } from 'jwt-decode';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email : "",
    password : ""
  });

  const handleChange = (e) => {
    setError("");
    setFormData({
      ...formData,
      [e.target.name] : e.target.value
    })
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axiosInstance.post("/auth/login", formData);
      const decoded = jwtDecode(response.data.token);
      login(response.data.token);
      if(decoded.role === "teacher") {
        navigate("/teacher/dashboard");
      } else if(decoded.role === "student") {
        navigate("/student/dashboard");
      } else {
        setError("Role is not defined");
      }
    } catch (error) {
      const message = error.response?.data?.message || "Something went wrong";
      setError(message);
    }finally{
      setLoading(false);
    }
  }

  const handleGoogleSuccess = async (credentialResponse) =>{
    setError("");
    setLoading(true);
    try {
      const response = await axiosInstance.post("/auth/google",{
        idToken : credentialResponse.credential
      });
      if(response.data.needsRole) {
        sessionStorage.setItem("googleTempToken",response.data.tempToken);
        navigate("/complete-profile")
      }else{
        login(response.data.token);
        const decoded = jwtDecode(response.data.token);
        navigate(decoded.role === "teacher" ? "/teacher/dashboard" : "/student/dashboard");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message ||"Google login failed";
      setError(errorMessage);
    }finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Welcome back</h1>
        <p className="text-gray-500 text-sm mb-6">Log in to your account</p>

        {/* error message area — conditionally rendered */}
        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-sm text-blue-600 mt-1 hover:underline"
            >
              {showPassword ? "Hide" : "Show"} Password
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Logging In...":"Login"}
          </button>
        </form>

        <div className="mt-4 flex justify-center">
            <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError("Google login failed")}
            />
        </div>

        <p className="text-sm text-gray-500 mt-6 text-center">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-600 font-medium hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login;