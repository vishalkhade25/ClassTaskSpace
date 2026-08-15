import express from "express";
import auth from "../middleware/auth.js";
import role from "../middleware/role.js";
import upload from "../middleware/upload.js";
import { createAssignment,getAssignments, getAssignmentById } from "../controllers/assignmentController.js";

const assignmentRouter = express.Router();

assignmentRouter.get("/:classId/list", auth, getAssignments);
assignmentRouter.get("/:assignmentId/detail", auth, getAssignmentById);
assignmentRouter.post("/:classId/upload",auth,role("teacher"),upload.single("pdf"),createAssignment);

export default assignmentRouter;