# ClassTaskSpace Backend Reference

Compact frontend handoff for the backend in `server/`.

## Stack and Run

- Node.js ES modules, Express, MongoDB/Mongoose.
- Local API: `http://localhost:5000`; CORS allows `http://localhost:5173`.
- Start: from `server/`, run `npm install`, then `npm run dev`.
- Packages: `express`, `mongoose`, `dotenv`, `cors`, `bcryptjs`, `jsonwebtoken`, `multer`, `multer-storage-cloudinary`, `cloudinary`, `nodemailer`, `node-cron`, `json2csv`.
- Route prefixes: `/api/auth`, `/api/class`, `/api/assignment`, `/api/submission`.
- `server.js` loads dotenv, enables JSON parsing, connects MongoDB, sets DNS to `1.1.1.1` and `8.8.8.8`, then starts on `PORT || 4000`.

## Environment

```env
PORT=4000
MONGODB_URI=<MongoDB URL>
JWT_SECRET=<JWT secret>
CLOUDINARY_CLOUD_NAME=<name>
CLOUDINARY_API_KEY=<key>
CLOUDINARY_API_SECRET=<secret>
EMAIL_USER=<Gmail sender>
EMAIL_PASS=<Gmail app password>
```

Never expose these values in the frontend.

## Auth

Local auth only: register -> verify email OTP -> login. Login returns a JWT valid for 7 days with payload:

```json
{ "userId": "...", "name": "...", "email": "...", "role": "teacher|student" }
```

Protected requests require `Authorization: Bearer <token>`. Decode the token for client auth state; there is no `/me` endpoint. Roles are exactly `teacher` and `student`.

| Method | Path | Body | Behavior |
|---|---|---|---|
| POST | `/api/auth/register` | JSON: `name,email,password,role` | Creates unverified local user and emails 6-digit OTP; `201` |
| POST | `/api/auth/verify-email` | JSON: `email,otp` | OTP expires in 10 minutes; max 5 failed attempts; `200` |
| POST | `/api/auth/resend-otp` | JSON: `email` | 60-second resend cooldown; `200` |
| POST | `/api/auth/login` | JSON: `email,password` | Requires verified email; returns `{ success,message,token }` |

Typical errors: missing input `400`, unknown user `401/404`, unverified login `403`, invalid OTP `400`, too many OTP attempts `429`, invalid/missing JWT `401`.

## Models

All models have `createdAt` and `updatedAt`. References are shown in parentheses.

```text
User: name, email(unique/lowercase), password(local only/hashed),
  role(teacher|student), authProvider(local|google), googleId(sparse),
  isEmailVerified(false by default)

EmailVerification: user(User), otpHash, expiresAt, attempts(0 by default)

Class: name, subject, classCode(unique), teacher(User), students[User]

Assignment: title, description?, pdfUrl, class(Class), deadline, teacher(User),
  warningEmailSent(false), deadlinePassedEmailSent(false)
  index: deadline + warningEmailSent

Submission: assignment(Assignment), student(User), pdfUrl, submittedAt,
  isLate(false), marks?, gradedAt?
  unique index: assignment + student
```

## Class API

| Method | Path | Auth | Body / Result |
|---|---|---|---|
| POST | `/api/class/create` | Teacher | JSON `name,subject`; generates uppercase 6-character `classCode`; returns code only |
| POST | `/api/class/join` | Student | JSON `classCode`; enrolls student if valid/not already enrolled |

## Assignment API

| Method | Path | Auth | Body / Result |
|---|---|---|---|
| GET | `/api/assignment/:classId/list` | Auth; teacher owns class or student enrolled | Returns `assignments`; empty response may omit the array |
| GET | `/api/assignment/:assignmentId/detail` | Auth; owner/enrolled | Returns `assignment` |
| POST | `/api/assignment/:classId/upload` | Teacher | Multipart: `title`, `description?`, `deadline`, PDF field `pdf`; emails students; returns message only |

## Submission API

| Method | Path | Auth | Body / Result |
|---|---|---|---|
| POST | `/api/submission/:assignmentId/submit` | Student | Multipart PDF field `pdf`; upserts one submission and calculates `isLate` |
| GET | `/api/submission/:assignmentId/list` | Assignment teacher | Returns `submissions` and `notSubmitted`, populated with student name/email |
| PATCH | `/api/submission/:submissionId/grade` | Assignment teacher | JSON `{ marks }`; sets `gradedAt`; emails student |
| GET | `/api/submission/:assignmentId/export-csv` | Assignment teacher | Downloads `submissions.csv` with `name,email,status` |

Assignment/submission PDFs use Cloudinary folder `assignments`, raw PDF format, and Multer field `pdf`. Use `FormData`; do not set the multipart boundary manually. Open returned `pdfUrl` links and download CSV as a blob.

## Email and Cron

Nodemailer/Gmail sends OTP, assignment, submission, grading, and deadline emails.

`assignmentDeadlineCron.js` is intended to run every 30 minutes. `deadlineChecker.js` sends warnings for assignments due within 3 hours and passed-deadline notices to missing students and the teacher. Assignment flags prevent repeats.

**Cron is disabled currently:** its import and `assignmentDeadlineCron()` call are commented out in `server.js`.

## Frontend Guidance

1. Registration collects role and routes to OTP verification.
2. Verification routes to login; login stores the JWT.
3. Attach the Bearer token to protected requests.
4. Render teacher/student UI from JWT `role`.
5. Handle `401` by clearing auth and redirecting to login; show API `message`.
6. Use `FormData` for PDFs and blob handling for CSV.

There are currently no endpoints for class lists/details, current user, profile, logout, refresh token, health check, or full dashboard data. Creation responses also do not return the created document/ID.

## Google OAuth Status

The `User` schema already has `authProvider` and `googleId`, but OAuth is not implemented: no Google package, route, callback, credential exchange, or OAuth JWT flow exists. Do not invent a Google endpoint yet. Build local Login/SignUp first; later decide OAuth flow, callback URLs, role selection, account linking, verified-email behavior, and JWT response.

## Caveats

- `createAssignment` reads `req.file.path` before checking `req.file`; missing PDFs may return `500`.
- Auth assumes the header is exactly `Bearer <token>`.
- Some empty-list responses omit empty arrays.
- Email failures can make requests return `500`.
- `npm test` is a placeholder; no automated tests exist.
