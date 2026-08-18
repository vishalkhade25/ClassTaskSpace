import express from "express";
import { register, verifyEmail, login, resendOtp } from "../controllers/authController.js";

const authRouter = express.Router();

authRouter.post("/register",register);
authRouter.post("/verify-email", verifyEmail);
authRouter.post("/resend-otp", resendOtp);
authRouter.post("/login",login);

export default authRouter;