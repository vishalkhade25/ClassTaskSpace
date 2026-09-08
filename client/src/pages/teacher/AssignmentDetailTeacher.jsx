import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import { toDownloadUrl } from "../../utils/cloudinary";

const AssignmentDetailTeacher = () => {
  const { assignmentId } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [notSubmitted, setNotSubmitted] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axiosInstance.get(`/submission/${assignmentId}/list`);
      setAssignment(response.data.assignment);
      setSubmissions(response.data.submissions);
      setNotSubmitted(response.data.notSubmitted);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Something went wrong";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [assignmentId]);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* loading state */}
        {loading && (
          <p className="text-gray-500 text-center mt-10">Loading...</p>
        )}

        {/* error state */}
        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded-lg">
            {error}
          </div>
        )}

        {/* assignment info card */}
        {assignment && (
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">{assignment.title}</h1>
            <p className="text-gray-600 mb-4">{assignment.description}</p>
            <p className="text-sm text-gray-500 mb-4">
              Deadline: {new Date(assignment.deadline).toLocaleString()}
            </p>
            <a
              href={toDownloadUrl(assignment.pdfUrl)}
              download="assignment.pdf"
              className="inline-block text-blue-600 font-medium hover:underline text-sm"
            >
              Download Assignment PDF
            </a>
          </div>
        )}

        {/* not-submitted list */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Not Submitted ({notSubmitted.length})
          </h2>
          {notSubmitted.length === 0 ? (
            <p className="text-sm text-gray-500">Everyone has submitted.</p>
          ) : (
            <ul className="space-y-2">
              {notSubmitted.map((student) => (
                <li key={student._id} className="text-sm text-gray-600">
                  {student.name} — {student.email}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* submissions list */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Submissions ({submissions.length})
          </h2>
          <div className="space-y-3">
            {submissions.map((sub) => (
              <div key={sub._id} className="border border-gray-100 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-800">{sub.student.name}</p>
                    <p className="text-xs text-gray-500">{sub.student.email}</p>
                  </div>
                  {sub.isLate && (
                    <span className="text-xs text-red-500 font-medium">Late</span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Submitted: {new Date(sub.submittedAt).toLocaleString()}
                </p>
                <a
                  href={toDownloadUrl(sub.pdfUrl)}
                  download={`${sub.student.name}-submission.pdf`}
                  className="inline-block text-blue-600 hover:underline text-sm mt-2"
                >
                  View submission
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignmentDetailTeacher;