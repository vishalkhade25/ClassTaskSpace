import express from "express";
import auth from "../middleware/auth.js";
import { getMyNotification, markAsRead } from "../controllers/notificationController.js";

const notificationRouter = express.Router();

notificationRouter.get("/my", auth, getMyNotification);
notificationRouter.patch("/:notificationId/read", auth, markAsRead);

export default notificationRouter;