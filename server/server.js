import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import dns from "dns";
import connectDB from "./config/db.js";
import authRouter from "./routes/authRoutes.js";
import classRouter from "./routes/classRoutes.js";
import assignmentRouter from "./routes/assignmentRoutes.js";
import submissionRouter from "./routes/submissionRoutes.js";

dotenv.config();

dns.setServers([
    '1.1.1.1',
    '8.8.8.8'
]);
const app = express();
app.use(cors({
    origin : "http://localhost:5173"
}))
app.use(express.json())
await connectDB();
app.use("/api/auth",authRouter);
app.use("/api/class",classRouter);
app.use("/api/assignment", assignmentRouter);
app.use("/api/submission", submissionRouter);

const port = process.env.PORT || 4000;

app.listen(port, ()=>{
    console.log(`Server running on Port : ${port}`);
    
})