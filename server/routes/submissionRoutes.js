import express from "express";
import auth from "../middleware/auth.js";
import role from "../middleware/role.js";
import upload from "../middleware/upload.js";
import { submitAssignment } from "../controllers/submissionController.js";

const submissionRouter = express.Router();

submissionRouter.post("/:assignmentId/submit",auth,role("student"),upload.single("pdf"),submitAssignment);

export default submissionRouter;