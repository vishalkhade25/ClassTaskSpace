import { useState } from "react";
import { toDownloadUrl } from "../utils/cloudinary";
import axiosInstance from "../api/axiosInstance";

const SubmissionRow = ({ submission, onGrade }) => {
  const [marks, setMarks] = useState(submission.marks ?? "");

  return (
    <div className="border border-gray-100 rounded-xl p-4">
      <div className="flex items-center justify-between">
        <div>
            <p className="font-medium text-gray-800">{submission.student.name}</p>
            <p className="text-xs text-gray-500">{submission.student.email}</p>
        </div>
        <div className="flex items-center gap-2">
            {submission.isLate && (
                <span className="text-xs text-red-500 font-medium">Late</span>
            )}
            {submission.marks !== undefined && submission.marks !== null ? (
                <span className="text-xs bg-green-50 text-green-600 font-medium px-2 py-0.5 rounded-full">
                    Graded
                </span>
            ) : (
                <span className="text-xs bg-yellow-50 text-yellow-600 font-medium px-2 py-0.5 rounded-full">
                    Not Graded
                </span>
            )}
        </div>
    </div>
      <p className="text-xs text-gray-500 mt-2">
        Submitted: {new Date(submission.submittedAt).toLocaleString()}
      </p>
      
      <a 
       href={toDownloadUrl(submission.pdfUrl)}
        download={`${submission.student.name}-submission.pdf`}
        className="inline-block text-blue-600 hover:underline text-sm mt-2"
      >
        View submission
      </a>

      <div className="flex items-center gap-2 mt-3">
        <input
          type="number"
          min={0}
          max={10}
          value={marks}
          onChange={(e) => setMarks(e.target.value)}
          placeholder="Marks"
          className="w-24 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={()=>onGrade(submission._id, marks)}
          className="bg-blue-600 text-white text-sm font-medium px-4 py-1.5 rounded-lg hover:bg-blue-700 transition"
        >
            Save Grade
        </button>
      </div>
    </div>
  );
};

export default SubmissionRow;