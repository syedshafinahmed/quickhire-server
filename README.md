# QuickHire Backend API

A RESTful API server built with **Node.js**, **Express**, and **MongoDB** for a job board platform. It handles job listings, user registration, and job applications.

---

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB Atlas (via Mongoose-compatible driver)
- **Environment Config:** dotenv
- **Middleware:** CORS, express.json

---

## Getting Started

### Prerequisites

- Node.js v18+
- A MongoDB Atlas cluster
- A `.env` file with the following variables:

```env
DB_USER=your_mongodb_username
DB_PASS=your_mongodb_password
```

### Installation

```bash
npm install
node index.js
```

The server will start on **port 3000** by default.

---

## API Reference

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Returns a greeting message |

---

### Jobs

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/jobs` | Get all jobs (supports filters) |
| `GET` | `/jobs/:id` | Get a single job by ID |
| `POST` | `/jobs` | Create a new job posting |
| `PUT` | `/jobs/:id` | Update a job posting |
| `DELETE` | `/jobs/:id` | Delete a job posting |

#### Query Parameters for `GET /jobs`

| Param | Type | Description |
|-------|------|-------------|
| `search` | string | Filter by job title or company name (case-insensitive) |
| `category` | string | Filter by job category (`all` returns everything) |

#### Example Request Body for `POST /jobs`

```json
{
  "logo": "https://i.postimg.cc/htk3kLr3/l1.png"
  "title": "Associate Software Engineer",
  "company": "Qtec Solution Limited",
  "location": "Dhaka",
  "category": "Full-Time",
  "description": "We are looking for a skilled...",
  "created_at": "2026-03-04T15:23:31.578+00:00"
}
```

---

### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/users` | Register a new user |
| `GET` | `/users?email=` | Get a user by email |
| `GET` | `/users/all` | Get all registered users (sorted by newest) |

#### Example Request Body for `POST /users`

```json
{
  "name": "Syed Shafin Ahmed",
  "email": "shafinahmed.cse@gmail.com",
  "photoURL": "https://i.postimg.cc/kXRbFrbG/IMG-20240908-004438-350.jpg",
  "role": "applicant",
  "created_at": "2026-03-04T15:23:31.578+00:00"
}
```

---

### Applications

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/applications` | Submit a job application |
| `GET` | `/applications?email=` | Get all applications by a user's email |
| `GET` | `/applications/all` | Get all applications (admin view, sorted by newest) |

#### Example Request Body for `POST /applications`

```json
{
  "jobId": "64f1a2b3c4d5e6f7a8b9c0d1",
  "jobTitle": "Associate Software Engineer",
  "company": "Qtec Solution Limited",
  "applicantName": "Syed Shafin Ahmed",
  "applicantEmail": "shafinahmed.cse@gmail.com",
  "resumeLink": "https://drive.google.com/file/d/1jlxSo9RKw-zCk7Ry-uU-IHGvmLZj8POQ/view?usp=sharing",
  "coverLetter": "I am to applying for the role...",
  "created_at": "2026-03-04T15:23:31.578+00:00"
}
```

---

## Database

The server connects to a **MongoDB Atlas** cluster and uses the `hirebd` database with three collections:

| Collection | Purpose |
|------------|---------|
| `jobs` | Stores all job postings |
| `users` | Stores registered users |
| `applications` | Stores submitted job applications |

---

## Project Structure

```
├── index.js        # Main server entry point
├── .env            # Environment variables (not committed)
├── package.json
└── README.md
```

---

## Error Handling

All endpoints return structured JSON error responses:

```json
{ "error": "Error message here" }
```

Common HTTP status codes used:

| Code | Meaning |
|------|---------|
| `200` | Success |
| `201` | Resource created |
| `400` | Bad request / missing fields |
| `404` | Resource not found |
| `500` | Internal server error |
