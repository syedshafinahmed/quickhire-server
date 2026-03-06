# HireBD Backend API

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
  "title": "Frontend Developer",
  "company": "TechCorp",
  "category": "Engineering",
  "location": "Dhaka",
  "salary": "60000",
  "description": "We are looking for a skilled frontend developer..."
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
  "name": "Jane Doe",
  "email": "jane@example.com",
  "photoURL": "https://example.com/photo.jpg"
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
  "jobTitle": "Frontend Developer",
  "company": "TechCorp",
  "applicantName": "Jane Doe",
  "applicantEmail": "jane@example.com",
  "resumeLink": "https://drive.google.com/my-resume",
  "coverLetter": "I am excited to apply for this role..."
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