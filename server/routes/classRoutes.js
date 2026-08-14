import express from "express";
import { createClass, joinClass} from "../controllers/classController.js";
import auth from "../middleware/auth.js";
import role from "../middleware/role.js";

const classRouter = express.Router();

classRouter.post("/create", auth, role("teacher"), createClass);
classRouter.post("/join", auth, role("student"), joinClass);

export default classRouter;