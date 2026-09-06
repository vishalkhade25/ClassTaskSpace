import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import ClassCard from '../../components/ClassCard';

const StudentDashboard = () => {
  const [classes,  setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [empty, setEmpty] = useState(false);
  const navigate = useNavigate();

  const fetchClasses = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axiosInstance.get("/class/student");
      const fetchedClasses = response.data.classes;
      setClasses(fetchedClasses);
      if(fetchedClasses.length === 0){
        setEmpty(true);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Something Went Wrong";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  useEffect(()=>{
    fetchClasses();
  },[]);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">My Classes</h1>
          <button
            onClick={() => navigate("/student/class/join")}
            className="bg-blue-600 text-white font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            + Join Class
          </button>
        </div>

        {/* loading state */}
        {loading && (
          <p className="text-gray-500 text-center mt-10">Loading classes...</p>
        )}

        {/* error state */}
        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* empty state */}
        {!loading && empty && (
          <p className="text-gray-500 text-center mt-10">
            You haven't joined any classes yet.
          </p>
        )}

        <div className="grid sm:grid-cols-2 gap-4">
          { !empty && !loading && classes.length > 0 &&
          classes.map((cls) => (
            <ClassCard
              key={cls._id}
              classData={cls}
              onClick={() => navigate(`/student/class/${cls._id}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;