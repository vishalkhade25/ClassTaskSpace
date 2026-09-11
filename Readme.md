# ClassTaskSpace

A MERN-based classroom management platform where teachers create classes, post assignments, and grade student submissions — with email notifications keeping everyone updated.

## Features

- **Auth:** Email/password with OTP verification, plus Google OAuth (with role selection for new Google sign-ups)
- **Classes:** Teachers create classes with a unique join code; students join using that code
- **Assignments:** Teachers upload assignment PDFs with deadlines; students can download and submit their work
- **Submissions:** Students submit/resubmit PDF work; late submissions are automatically flagged
- **Grading:** Teachers grade submissions; students see their marks
- **CSV Export:** Teachers can export a submitted/not-submitted student list per assignment
- **Email Notifications:** New assignment posted, submission received, marks assigned, deadline warnings (3 hours before) and deadline-passed notices — all automated
- **Search:** Filter classes and assignments from the dashboard/class pages

## Tech Stack

- **Frontend:** React (Vite), Tailwind CSS, React Router
- **Backend:** Node.js, Express
- **Database:** MongoDB (Atlas)
- **File Storage:** Cloudinary
- **Auth:** JWT, Google OAuth (Google Identity Services)
- **Email:** Nodemailer (Gmail SMTP)
- **Scheduling:** node-cron

## Project Structure

```
ClassTaskSpace/
├── server/      → Express API
└── client/      → React frontend
```

## Local Setup

### Backend
```bash
cd server
npm install
npm run dev
```
Create a `.env` file in `server/` with:
```
PORT=5000
MONGODB_URI=
JWT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
EMAIL_USER=
EMAIL_PASS=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

### Frontend
```bash
cd client
npm install
npm run dev
```
Create a `.env` file in `client/` with:
```
VITE_GOOGLE_CLIENT_ID=
```

## Roles

- **Teacher:** create classes, post assignments, grade submissions, export CSV reports
- **Student:** join classes, view assignments, submit/resubmit work, view grades

## License

This project was built for learning purposes.