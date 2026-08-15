import submissionModel from "../models/Submission.js";
import assignmentModel from "../models/Assignment.js";
import classModel from "../models/Class.js";

const submitAssignment = async (req, res) => {
    try {
        const { assignmentId } = req.params;
        if (!req.file) {
            return res.status(400).json({ success: false, message: "Please attach a PDF" });
        }
        const pdfUrl = req.file.path;
        const assignmentData = await assignmentModel.findById(assignmentId);
        if(!assignmentData){
            return res.status(404).json({ success: false, message : "No assignment foud" });
        }
        const classData = await classModel.findById(assignmentData.class);
        if(!classData.students.includes(req.user.userId)){
            return res.status(403).json({ success: false, message: "You are not enrolled in this class" });
        }
        const isLate = new Date() > assignmentData.deadline ? true : false;
        const submission = await submissionModel.findOneAndUpdate(
            { assignment: assignmentId, student: req.user.userId },
            { pdfUrl, submittedAt: new Date(), isLate },
            { upsert: true, new: true }
        );
        return res.status(201).json({ success: true, message : "Assignment submitted successfully" });
    } catch (error) {
        return res
            .status(500)
            .json({ message: "Server Error", error: error.message });
    }
}

export { submitAssignment };