import express from "express";
import auth from "../middleware/auth.js";
import role from "../middleware/role.js";
import upload from "../middleware/upload.js";
import { submitAssignment, getSubmissions, gradeSubmission, exportSubmissionsCSV  } from "../controllers/submissionController.js";

const submissionRouter = express.Router();

submissionRouter.get("/:assignmentId/list",auth,role("teacher"),getSubmissions);
submissionRouter.get("/:assignmentId/export-csv", auth, role("teacher"), exportSubmissionsCSV);
submissionRouter.post("/:assignmentId/submit",auth,role("student"),upload.single("pdf"),submitAssignment);
submissionRouter.patch("/:submissionId/grade",auth,role("teacher"),gradeSubmission);

export default submissionRouter;