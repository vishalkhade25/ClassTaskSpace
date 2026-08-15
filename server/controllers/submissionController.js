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

const getSubmissions = async (req, res) => {
    try {
        const { assignmentId } = req.params;
        const assignmentData = await assignmentModel.findById(assignmentId);
        if(!assignmentData){
            return res.status(404).json({ success: false, message : "No assignment foud" });
        }
        const isTeacher = assignmentData.teacher.toString() === req.user.userId ? true : false;
        if(!isTeacher){
            return res.status(403).json({ success: false, message: "You are not allowed to see submission details of this assg" })
        }
        const submissions = await submissionModel.find({assignment : assignmentId}).populate("student","name email");
        if(submissions.length === 0){
            return res.status(200).json({ success: true,message:"Currently submission list is empty" });
        }
        const classData = await classModel.findById(assignmentData.class);
        if(!classData){
            return res.status(404).json({ success: false, message: "Class not found" });
        }
        const submittedStudentIds = submissions.map((sub)=> sub.student._id.toString());
        const notSubmitted = classData.students.filter((studentId)=> !submittedStudentIds.includes(studentId.toString()));
        return res.status(200).json({ success:true, message: "List fetched", submissions, notSubmitted });
    } catch (error) {
        return res
            .status(500)
            .json({ message: "Server Error", error: error.message });
    }
}

const gradeSubmission = async (req, res) => {
    try {
        const { submissionId } = req.params;
        const { marks } = req.body;
        if(marks === undefined || marks === null){
            return res.status(400).json({ success:false, message:"Please enter the marks" });
        }
        const submissionData = await submissionModel.findById(submissionId);
        if(!submissionData){
            return res.status(404).json({ success: false, message: "Submission not found" });
        }
        const assignmentData = await assignmentModel.findById(submissionData.assignment);
        if(!assignmentData){
            return res.status(404).json({ success: false,message: "Assignment Not Found" });
        }
        const isTeacher = assignmentData.teacher.toString() === req.user.userId ? true : false;
        if(!isTeacher){
            return res.status(403).json({ success: false, message: "You are not allowed to grade this submission" });
        }
        await submissionModel.findByIdAndUpdate(submissionId, { marks, gradedAt : new Date() });
        return res.status(200).json({ success: true, message: "Submission graded successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
}

export { submitAssignment, getSubmissions, gradeSubmission };