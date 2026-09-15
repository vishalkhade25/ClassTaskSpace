# ClassTaskSpace 📚

A full-stack classroom management platform built with the MERN stack — enabling teachers to create classes, post assignments, manage student submissions, grade work, export submission reports, and keep students updated through automated email notifications.

> Built as a learning project to solve a real classroom-management problem while exploring role-based authentication, OTP verification, Google OAuth, cloud file storage, automated email notifications, scheduled background tasks, PDF submissions, grading workflows, and CSV report generation.

---

## ✨ Features

* **Authentication** — JWT-based authentication with email/password, OTP email verification, and Google OAuth
* **Email Verification** — OTP verification with expiry, resend cooldown, and failed-attempt protection
* **Role-Based Access** — Separate Teacher and Student workflows with protected API routes
* **Teacher Classes** — Teachers can create classes with unique join codes
* **Student Classes** — Students can join classes using a class join code
* **Assignment Management** — Teachers can create assignments with descriptions, deadlines, and PDF attachments
* **Cloud File Storage** — Assignment and submission PDFs are stored using Cloudinary
* **Assignment Submissions** — Students can submit and resubmit PDF assignments
* **Late Submission Detection** — Submissions made after the deadline are automatically marked as late
* **Submission Management** — Teachers can view submitted and not-submitted students for each assignment
* **Grading** — Teachers can assign marks to student submissions
* **CSV Export** — Teachers can export assignment submission reports as CSV files
* **Email Notifications** — Automated emails for assignments, submissions, grading, and deadlines
* **Deadline Reminders** — Students receive an automated warning approximately 3 hours before an assignment deadline
* **Deadline Notifications** — Students are notified when an assignment deadline has passed
* **Scheduled Tasks** — `node-cron` periodically checks assignment deadlines
* **Search & Filtering** — Dashboard and class pages provide search/filter functionality
* **Google Sign-In** — New Google users can complete their profile by selecting their role
* **Responsive UI** — React and Tailwind CSS based interface for teacher and student workflows

---

## 🌐 Live Demo

**Frontend:** https://class-task-space.vercel.app/

> The application is deployed for demonstration purposes. Some features such as email notifications require the configured backend services and environment variables.

---

## 🛠️ Tech Stack

**Frontend:** React, Vite, Tailwind CSS, React Router, Axios, JWT Decode

**Backend:** Node.js, Express, MongoDB, Mongoose

**Authentication:** JWT, bcryptjs, Google Identity Services / Google OAuth

**Database:** MongoDB Atlas

**File Storage:** Cloudinary, Multer, Multer Storage Cloudinary

**Email:** Brevo Transactional Email API

**Scheduling:** Node-Cron

**CSV Generation:** json2csv

---

## 📁 Project Structure

```text
ClassTaskSpace/
├── .gitignore
├── server/
│   ├── .env
│   ├── package.json
│   ├── server.js
│   │
│   ├── config/
│   │   ├── cloudinary.js
│   │   ├── db.js
│   │   └── mailer.js
│   │
│   ├── controllers/
│   │   ├── assignmentController.js
│   │   ├── authController.js
│   │   ├── classController.js
│   │   └── submissionController.js
│   │
│   ├── cron/
│   │   └── assignmentDeadlineCron.js
│   │
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── role.js
│   │   └── upload.js
│   │
│   ├── models/
│   │   ├── Assignment.js
│   │   ├── Class.js
│   │   ├── EmailVerification.js
│   │   ├── Submission.js
│   │   └── User.js
│   │
│   ├── routes/
│   │   ├── assignmentRoutes.js
│   │   ├── authRoutes.js
│   │   ├── classRoutes.js
│   │   └── submissionRoutes.js
│   │
│   └── utils/
│       └── deadlineChecker.js
│
└── client/
    ├── .env
    ├── package.json
    ├── index.html
    ├── vite.config.js
    │
    ├── public/
    │   ├── favicon.svg
    │   └── icons.svg
    │
    └── src/
        ├── App.jsx
        ├── main.jsx
        ├── index.css
        │
        ├── api/
        │   └── axiosInstance.js
        │
        ├── components/
        │   ├── AssignmentCard.jsx
        │   ├── ClassCard.jsx
        │   ├── Footer.jsx
        │   ├── Navbar.jsx
        │   ├── ProtectedRoute.jsx
        │   └── SubmissionRow.jsx
        │
        ├── context/
        │   └── AuthContext.jsx
        │
        ├── pages/
        │   ├── common/
        │   │   ├── CompleteProfile.jsx
        │   │   ├── Login.jsx
        │   │   ├── Register.jsx
        │   │   ├── RootRedirect.jsx
        │   │   └── VerifyOtp.jsx
        │   │
        │   ├── student/
        │   │   ├── AssignmentDetailStudent.jsx
        │   │   ├── ClassDetailStudent.jsx
        │   │   ├── JoinClass.jsx
        │   │   └── StudentDashBoard.jsx
        │   │
        │   └── teacher/
        │       ├── AssignmentDetailTeacher.jsx
        │       ├── ClassDetailTeacher.jsx
        │       ├── CreateAssignment.jsx
        │       ├── CreateClass.jsx
        │       └── TeacherDashboard.jsx
        │
        └── utils/
            └── cloudinary.js
```

---

## 🚀 Getting Started

### Prerequisites

* Node.js
* npm
* MongoDB Atlas account
* Cloudinary account
* Brevo account
* Google Cloud project for Google OAuth

---

### Backend Setup

```bash
cd server
npm install
```

Create a `.env` file inside `server/`:

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

GOOGLE_CLIENT_ID=your_google_client_id

BREVO_API_KEY=your_brevo_api_key
BREVO_SENDER_EMAIL=your_verified_sender_email

CLIENT_URL=http://localhost:5173
```

Start the backend:

```bash
npm run dev
```

The backend will run on:

```text
http://localhost:5000
```

---

### Frontend Setup

Open a new terminal:

```bash
cd client
npm install
```

Create a `.env` file inside `client/`:

```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

Start the frontend:

```bash
npm run dev
```

The frontend will normally run on:

```text
http://localhost:5173
```

---

> ⚠️ **Important:** Never commit `.env` files or expose MongoDB credentials, JWT secrets, Cloudinary credentials, Google OAuth credentials, or Brevo API keys.

---

## 🔑 API Endpoints

### Auth — `/api/auth`

| Method | Endpoint           | Description                                   |
| ------ | ------------------ | --------------------------------------------- |
| POST   | `/register`        | Register a new user and send verification OTP |
| POST   | `/verify-email`    | Verify user's email using OTP                 |
| POST   | `/resend-otp`      | Resend email verification OTP                 |
| POST   | `/login`           | Login using email and password                |
| POST   | `/google`          | Authenticate using Google OAuth               |
| POST   | `/google/complete` | Complete profile for a new Google user        |

---

### Classes — `/api/class`

| Method | Endpoint   | Description                                    |
| ------ | ---------- | ---------------------------------------------- |
| POST   | `/create`  | Create a new class *(Teacher)*                 |
| POST   | `/join`    | Join a class using its unique code *(Student)* |
| GET    | `/student` | Get classes joined by the logged-in student    |
| GET    | `/teacher` | Get classes created by the logged-in teacher   |

---

### Assignments — `/api/assignment`

| Method | Endpoint                | Description                                      |
| ------ | ----------------------- | ------------------------------------------------ |
| GET    | `/:classId/list`        | Get assignments for a class                      |
| GET    | `/:assignmentId/detail` | Get assignment details                           |
| POST   | `/:classId/upload`      | Create an assignment with PDF upload *(Teacher)* |
| DELETE | `/:assignmentId`        | Delete an assignment *(Teacher)*                 |

---

### Submissions — `/api/submission`

| Method | Endpoint                       | Description                                              |
| ------ | ------------------------------ | -------------------------------------------------------- |
| GET    | `/:assignmentId/list`          | Get student submissions for an assignment *(Teacher)*    |
| GET    | `/:assignmentId/export-csv`    | Export submitted/not-submitted report as CSV *(Teacher)* |
| GET    | `/:assignmentId/my-submission` | Get logged-in student's submission *(Student)*           |
| POST   | `/:assignmentId/submit`        | Submit or resubmit an assignment PDF *(Student)*         |
| PATCH  | `/:submissionId/grade`         | Grade a student submission *(Teacher)*                   |

---

> All protected routes require authentication using a JWT token. Teacher and Student routes are additionally protected using role-based authorization middleware.

---

## 🔐 Authentication & Security

* JWT-based authentication for protected API routes
* Passwords are hashed using `bcryptjs`
* Email verification using OTP
* OTPs have an expiration period
* Failed OTP attempts are limited
* OTP resend requests have a cooldown period
* Google OAuth authentication is supported
* Teacher and Student roles are enforced using authorization middleware
* Protected frontend routes prevent unauthorized access
* Sensitive credentials are stored using environment variables
* File uploads are handled through authenticated routes

---

## 📧 Automated Email Notifications

ClassTaskSpace uses the **Brevo Transactional Email API** to send automated email notifications.

### Assignment Notifications

When a teacher posts an assignment, enrolled students receive an email containing assignment information such as:

* Assignment title
* Description
* Deadline
* Class information

### Submission Notifications

When a student submits an assignment, the teacher receives a notification.

### Grading Notifications

When a teacher assigns marks, the student receives a notification.

### Deadline Notifications

The application automatically checks assignment deadlines using `node-cron`.

The scheduler runs every **30 minutes** and checks for:

* Assignments approaching their deadline
* Assignments whose deadline has passed

Students receive appropriate email notifications based on the deadline status.

```text
node-cron
    │
    ▼
Deadline Checker
    │
    ├── 3-Hour Warning
    │
    └── Deadline Passed
            │
            ▼
      Brevo Email API
            │
            ▼
          Student
```

---

## 👥 User Roles

### 👨‍🏫 Teacher

Teachers can:

* Create classes
* Share class join codes
* Create assignments
* Upload assignment PDFs
* Set assignment deadlines
* View student submissions
* Track submitted/not-submitted students
* Grade submissions
* Export submission reports as CSV
* Receive submission notifications

### 👨‍🎓 Student

Students can:

* Create an account
* Verify their email
* Login using email/password or Google
* Join classes using a class code
* View assignments
* Download assignment PDFs
* Submit assignments
* Resubmit assignments
* View submission status
* View grades
* Receive assignment and deadline notifications

---

## ☁️ File Storage

Assignment and submission PDF files are handled using **Cloudinary**.

```text
Teacher
   │
   │ Upload Assignment PDF
   ▼
Cloudinary
   │
   ▼
Assignment stored with file URL
   │
   ▼
Student downloads assignment
```

Student submissions follow a similar workflow:

```text
Student
   │
   │ Submit PDF
   ▼
Cloudinary
   │
   ▼
Submission URL
   │
   ▼
Teacher reviews & grades
```

---

## 📊 CSV Export

Teachers can export assignment submission information as a CSV report.

The exported report can be used to identify:

* Students who submitted
* Students who did not submit
* Submission status
* Late submissions
* Assignment-wise student submission information

This makes it easier for teachers to maintain submission records outside the application.

---

## 📝 Project Notes

ClassTaskSpace was developed as an educational full-stack project to explore practical MERN development beyond basic CRUD operations.

The project focuses on:

* Full-stack application architecture
* Authentication and authorization
* OTP-based email verification
* Google OAuth
* Cloud-based file storage
* Role-based classroom workflows
* PDF upload and submission handling
* Automated background tasks
* Transactional email notifications
* Deadline monitoring
* CSV report generation

The project is intended for learning and demonstration purposes.

---

## 🔮 Future Enhancements

* Real-time in-app notifications
* Assignment comments/discussion
* Teacher announcements
* Student performance analytics
* Assignment statistics dashboard
* Online assignment preview
* Pagination for large classes
* More detailed teacher analytics
* Mobile application

---

## 👤 Author

**Vishal Khade**

BTech Information Technology Student

GitHub: [@vishalkhade25](https://github.com/vishalkhade25)

---

## 🌐 Live Demo

**ClassTaskSpace:** https://class-task-space.vercel.app/

---
