import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import dns from "dns";
import connectDB from "./config/db.js";


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

const port = process.env.PORT || 4000;

app.listen(port, ()=>{
    console.log(`Server running on Port : ${port}`);
    
})