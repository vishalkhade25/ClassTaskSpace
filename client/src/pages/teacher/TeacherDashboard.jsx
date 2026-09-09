import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import ClassCard from '../../components/ClassCard';

const TeacherDashboard = () => {
  const [classes,  setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [empty, setEmpty] = useState(false);
  const navigate = useNavigate();

  const fetchClasses = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axiosInstance.get("/class/teacher");
      setClasses(response.data.classes);
      if(response.data.classes.length === 0){
        setEmpty(true);
      }else{
        setEmpty(false);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Something Went Wrong";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  const filteredClasses = classes.filter((cls) =>
    cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(()=>{
    fetchClasses();
  },[]);
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">My Classes</h1>
          <button
            onClick={() => navigate("/teacher/class/create")}
            className="bg-blue-600 text-white font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            + Create Class
          </button>
        </div>

        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search classes..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

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

        {/* genuinely empty state — no classes at all */}
        {!loading && empty && (
          <p className="text-gray-500 text-center mt-10">
            You haven't created any classes yet.
          </p>
        )}

        {/* has classes, but search matched nothing */}
        {!loading && !empty && filteredClasses.length === 0 && (
          <p className="text-gray-500 text-center mt-10">
           No classes match your search.
          </p>
        )}

        <div className="grid sm:grid-cols-2 gap-4">
          { !empty && !loading && filteredClasses.length > 0 &&
            filteredClasses.map((cls)=>(
              <ClassCard key={cls._id} classData={cls} onClick={()=>navigate(`/teacher/class/${cls._id}`)}/>
            ))
          }
        </div>
      </div>
    </div>
);
}

export default TeacherDashboard;
