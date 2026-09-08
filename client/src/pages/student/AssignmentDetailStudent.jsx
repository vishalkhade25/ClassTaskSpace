import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import { toDownloadUrl } from "../../utils/cloudinary";

const AssignmentDetailStudent = () => {
  const [assignmentDetails, setAssignmentDetails] = useState(null);
  const [submissionDetail, setSubmissionDetails] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submissionError, setSubmissionError] = useState("");

  const { assignmentId } = useParams();

  const fetchDetails = async () => {
    setError("");
    setLoading(true);
    try {
      const assgResponse = await axiosInstance.get(`/assignment/${assignmentId}/detail`);
      const submissionResponse = await axiosInstance.get(`/submission/${assignmentId}/my-submission`)
      setAssignmentDetails(assgResponse.data.assignment);
      setSubmissionDetails(submissionResponse.data.mySubmissions);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Something went wrong";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  const handleChange = (e) => {
    setPdfFile(e.target.files[0]);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmissionError("");
    try {
      const formData = new FormData();
      formData.append("pdf", pdfFile);
      await axiosInstance.post(`/submission/${assignmentId}/submit`, formData);
      await fetchDetails();
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Something went wrong";
      setSubmissionError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  }

  useEffect(() => {
    fetchDetails();
  }, [assignmentId]);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* loading state */}
        {loading && (
          <p className="text-gray-500 text-center mt-10">Loading assignment...</p>
        )}

        {/* error state */}
        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded-lg mb-4">
            {error}
          </div>
        )}

        {assignmentDetails && (
          <>
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 border border-gray-100">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">{assignmentDetails.title}</h1>
              <p className="text-gray-600 mb-4">{assignmentDetails.description}</p>
              <p className="text-sm text-gray-500 mb-4">
                Deadline: {new Date(assignmentDetails.deadline).toLocaleString()}
              </p>
              <a
                href={toDownloadUrl(assignmentDetails.pdfUrl)}
                download="assignment.pdf"
                className="inline-block text-blue-600 font-medium hover:underline text-sm"
              >
                Download Assignment PDF
              </a>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              {submissionDetail ? (
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">Your Submission</h2>
                  <p className="text-sm text-gray-600">
                    Submitted at: {new Date(submissionDetail.submittedAt).toLocaleString()}
                    {submissionDetail.isLate && (
                      <span className="ml-2 text-red-500 font-medium">(Late)</span>
                    )}
                  </p>
                  <a
                    href={toDownloadUrl(submissionDetail.pdfUrl)}
                    download="my-submission.pdf"
                    className="inline-block text-blue-600 hover:underline text-sm mt-2"
                  >
                    View your submitted file
                  </a>

                  {submissionDetail.marks !== undefined && submissionDetail.marks !== null ? (
                    <div className="mt-4 bg-green-50 text-green-700 rounded-lg px-4 py-2 text-sm">
                      Marks: {submissionDetail.marks}
                    </div>
                  ) : (
                    <p className="mt-4 text-sm text-gray-500">Not graded yet</p>
                  )}

                  <p className="text-xs text-gray-400 mt-4">
                    Want to resubmit? Upload a new file below.
                  </p>
                </div>
              ) : (
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Submit your work</h2>
              )}

              {submissionError && (
                <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded-lg my-4">
                  {submissionError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleChange}
                  className="w-full text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer bg-white
             file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0
             file:text-sm file:font-medium file:bg-blue-50 file:text-blue-600
             hover:file:bg-blue-100"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : submissionDetail ? "Resubmit" : "Submit"}
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AssignmentDetailStudent;