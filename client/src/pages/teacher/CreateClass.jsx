import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';

const CreateClass = () => {
  const [formData, setFormData] = useState({
    name : "",
    subject : ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [classCode, setClassCode] = useState(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name] : e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await axiosInstance.post("/class/create",formData);
      setClassCode(response.data.classCode);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Something Went Wrong";
      setError(errorMessage)
    } finally {
      setLoading(false);
    }
  }

 return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Create a Class</h1>
        <p className="text-gray-500 text-sm mb-6">Set up a new class for your students</p>

        {/* error state */}
        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* success state — shows the class code once created */}
        {classCode ? (
          <div className="text-center">
            <p className="text-gray-600 mb-2">Class created! Share this code with your students:</p>
            <div className="text-3xl font-bold tracking-widest text-blue-600 bg-blue-50 rounded-lg py-4 mb-6">
              {classCode}
            </div>
            <button
              onClick={() => navigate("/teacher/dashboard")}
              className="w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Go to Dashboard
            </button>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={handleSubmit} >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Class Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Physics 101"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Physics"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Class"}
            </button>
          </form>
        )}
      </div>
    </div>
);
}

export default CreateClass
