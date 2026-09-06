import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useNavigate, useParams } from "react-router-dom";
import AssignmentCard from "../../components/AssignmentCard";

const ClassDetailStudent = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { classId } = useParams();
  const navigate = useNavigate();

  const fetchAssignments = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axiosInstance.get(`/assignment/${classId}/list`);
      setAssignments(response.data.assignments);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Something went wrong";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  useEffect(()=>{
    fetchAssignments();
  },[]);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Assignments</h1>

        {/* loading state */}
        {loading && (
          <p className="text-gray-500 text-center mt-10">Loading assignments...</p>
        )}

        {/* error state */}
        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* empty state */}
        {!loading && assignments.length === 0 && (
          <p className="text-gray-500 text-center mt-10">
            No assignments posted yet.
          </p>
        )}

        <div className="space-y-3">
          {assignments.map((assignment) => (
            <AssignmentCard
              key={assignment._id}
              assignment={assignment}
              onClick={() => navigate(`/student/assignment/${assignment._id}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClassDetailStudent;