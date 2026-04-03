# Job Tracker – Backend

The Node.js/Express REST API for the Job Tracker application. Handles authentication, job data persistence, and email-based password reset.

## Related Repositories

- [**Frontend**](https://github.com/Trev-B/jobs-app-frontend) — React UI
- **Backend** (this repo) — Node.js/Express REST API
- [**Chrome Extension**](https://github.com/Trev-B/jobs-app-chrome-extension) — Save jobs directly from job boards

## Tech Stack

- **Node.js 16** / **Express**
- **MongoDB** with Mongoose
- **JWT** authentication with bcrypt password hashing
- **Nodemailer** for password reset emails
- **Joi** for request validation
- **Helmet** + **xss-clean** + **express-rate-limit** for security
- **Swagger UI** for API documentation
- **xlsx** for Excel export support
- Deployed via **AWS Elastic Beanstalk**

## Features

- User registration and login with JWT authentication
- Full CRUD for job applications
- Password reset via email confirmation
- Rate limiting and XSS protection
- Swagger API documentation

## Getting Started

### Prerequisites

- Node.js 16+
- A MongoDB instance (local or MongoDB Atlas)
- An SMTP email account for password reset emails (e.g. Gmail, Mailtrap)

### Installation

```bash
git clone https://github.com/Trev-B/jobs-app-backend.git
cd jobs-app-backend
npm install
```

### Configuration

Create a `.env` file in the root directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_LIFETIME=1d
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
```

### Running Locally

```bash
# Development (with hot reload)
npm run dev

# Production
npm start
```

The API will be available at `http://localhost:5000`.

### API Documentation

Once running, visit `http://localhost:5000/api-docs` for the Swagger UI documentation.
