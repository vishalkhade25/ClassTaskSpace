import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import AssignmentCard from "../../components/AssignmentCard";

const ClassDetailTeacher = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const { classId } = useParams();
  const navigate = useNavigate();

  const fetchAssignments = async () => {
    setError("");
    setLoading(false);
    try {
      const response = await axiosInstance.get(`/assignment/${classId}/list`);
      setAssignments(response.data.assignments)
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Something went wrong";
      setError(errorMessage)
    }finally{
      setLoading(false);
    }
  }

  const handleDeleteAssignment = async (assignmentId, assignmentTitle) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${assignmentTitle}"?`
    );

    if (!confirmed) return;

    try {
      await axiosInstance.delete(`/assignment/${assignmentId}`);
      setAssignments((currentAssignments) =>
        currentAssignments.filter((assignment) => assignment._id !== assignmentId)
      );
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Unable to delete assignment";
      setError(errorMessage);
    }
  };

  const filterAssignments = assignments.filter((assg)=>
    assg.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(()=>{
    fetchAssignments();
  },[]);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Assignments</h1>
          <button
            onClick={() => navigate(`/teacher/class/${classId}/assignment/create`)}
            className="bg-blue-600 text-white font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            + New Assignment
          </button>
        </div>

        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search Assignments..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

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
        {!loading && assignments.length === 0 && !searchTerm && (
          <p className="text-gray-500 text-center mt-10">
            No assignments posted yet.
          </p>
        )}

        {(!loading && filterAssignments.length === 0 && searchTerm) ?
         <>
          <p className="text-gray-500 text-center mt-10">
           No Assignment match your search.
          </p>
         </> : 
        <div className="space-y-3">
          {filterAssignments.map((assignment) => (
            <AssignmentCard
              key={assignment._id}
              assignment={assignment}
              onClick={() => navigate(`/teacher/assignment/${assignment._id}`)}
              onDelete={() => handleDeleteAssignment(assignment._id, assignment.title)}
            />
            ))
          }
        </div>}
      </div>
    </div>
  );
};

export default ClassDetailTeacher;