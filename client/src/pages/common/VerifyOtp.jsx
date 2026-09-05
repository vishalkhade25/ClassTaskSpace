import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';

const VerifyOtp = () => {
  const navigate = useNavigate();
  const email = sessionStorage.getItem("email");

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (!email) {
      navigate("/register");
    }
  }, [email, navigate]);

  useEffect(() => {
    if (cooldown === 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleChange = (e) => {
    setError("");
    setOtp(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await axiosInstance.post("/auth/verify-email", { email, otp });
      sessionStorage.removeItem("email");
      navigate("/login");
    } catch (error) {
      const message = error.response?.data?.message || "Something went wrong";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setSuccess("");
    setResendLoading(true);
    try {
      await axiosInstance.post("/auth/resend-otp", { email });
      setSuccess("A new OTP has been sent to your email.");
      setCooldown(60);
    } catch (error) {
      const message = error.response?.data?.message || "Something went wrong";
      setError(message);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Verify your email</h1>
        <p className="text-gray-500 text-sm mb-6">
          Enter the 6-digit code sent to <span className="font-medium">{email}</span>
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded-lg mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 text-green-600 text-sm px-4 py-2 rounded-lg mb-4">
            {success}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              OTP Code
            </label>
            <input
              type="text"
              name="otp"
              value={otp}
              onChange={handleChange}
              maxLength={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-center tracking-widest text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify Email"}
          </button>
        </form>

        <button
          onClick={handleResend}
          disabled={resendLoading || cooldown > 0}
          className="w-full mt-4 text-sm text-blue-600 hover:underline disabled:text-gray-400 disabled:no-underline"
        >
          {cooldown > 0
            ? `Resend OTP in ${cooldown}s`
            : resendLoading
            ? "Resending..."
            : "Resend OTP"}
        </button>

        <p className="text-sm text-gray-500 mt-6 text-center">
          Wrong email?{" "}
          <Link to="/register" className="text-blue-600 font-medium hover:underline">
            Go back
          </Link>
        </p>
      </div>
    </div>
  );
};

export default VerifyOtp;