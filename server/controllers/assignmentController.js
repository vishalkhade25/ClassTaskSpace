import assignmentModel from "../models/Assignment.js";
import classModel from "../models/Class.js";

const createAssignment = async (req, res) => {
    try {
        const { title, description, deadline } = req.body;
        const { classId } = req.params;
        const pdfUrl = req.file.path;
        if(!title || !deadline || !req.file ){
            return res.status(400).json({success : false, message : "Please enter all fields"});
        };
        const classData = await classModel.findById(classId);
        if(!classData){
            return res.status(404).json({ success: false, message: "Class not found" });
        }
        if(classData.teacher.toString() !== req.user.userId){
            return res.status(403).json({ success: false, message: "You do not own this class" });
        }
        const assignment = new assignmentModel({
            title,
            description,
            pdfUrl,
            class : classId,
            deadline,
            teacher : req.user.userId
        })
        await assignment.save();
        return res.status(201).json({ success: true, message: "Assignment Uploaded successfully" });
    } catch (error) {
        return res
            .status(500)
            .json({ message: "Server Error", error: error.message });
    }
};

export { createAssignment };