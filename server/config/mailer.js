import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

console.log("EMAIL USER:", process.env.EMAIL_USER);
console.log("SMTP HOST:", "smtp.gmail.com");
console.log("SMTP PORT:", 587);

transporter.verify()
    .then(() => console.log("SMTP connection successful"))
    .catch((error) => console.error("SMTP connection failed:", error.message));

const sendEmail = async (to, subject, text) => {
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        text
    });
};

export default sendEmail;