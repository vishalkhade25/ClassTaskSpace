import { useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";

const JoinClass = () => {
  const [classCode, setClassCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate()

  const handleChange = (e) => {
    setClassCode(e.target.value.toUpperCase());
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await axiosInstance.post("/class/join",{classCode});
      console.log(response);
      navigate("/student/dashboard")
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Something Went Wrong";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Join a Class</h1>
        <p className="text-gray-500 text-sm mb-6">Enter the class code your teacher shared</p>

        {/* error state */}
        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Class Code
            </label>
            <input
              type="text"
              name="classCode"
              value={classCode}
              onChange={handleChange}
              maxLength={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-center tracking-widest text-lg uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. A3F9K2"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Joining..." : "Join Class"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default JoinClass;