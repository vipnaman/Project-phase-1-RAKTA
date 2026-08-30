# RAKTA

RAKTA is a production-ready blood donation platform designed to connect blood seekers with verified donors in a privacy-first, secure, and humanitarian way.

## Overview

- Donor registration and verification workflow
- Blood request creation and urgency management
- Donor matching by blood group, city, and availability
- Request-help communication flow without exposing private contact details
- Notification system and role-based access for donors, requesters, and admins
- Admin analytics dashboard and moderation tools
- MongoDB-backed persistence with Express API and Next.js frontend

## Tech Stack

- Frontend: Next.js, React, TypeScript, Tailwind CSS, Framer Motion
- Backend: Node.js, Express.js, TypeScript, Mongoose, JWT
- Database: MongoDB
- Auth: bcrypt, JWT, HTTP-only cookies
- Security: Helmet, CORS, rate limiting, validation

## Architecture

- frontend: app pages and UI components
- backend: API server, services, and routes
- database: MongoDB and seed scripts

## Project status

This project is set up to run as a local working application and is structured for GitHub-based deployment workflows.

## Installation

1. Install dependencies from the project root:

   npm install

2. Create a production-ready environment file:

   cp .env.example .env

3. Update the values in the file with your real MongoDB, JWT, and domain settings.
4. Start the project:

   npm run dev

## Environment variables

Configure the following before deployment:

- PORT
- MONGODB_URI
- JWT_SECRET
- JWT_REFRESH_SECRET
- CLIENT_URL
- SERVER_URL
- FRONTEND_URL
- NEXT_PUBLIC_API_URL
- EMAIL_HOST
- EMAIL_PORT
- EMAIL_USER
- EMAIL_PASSWORD
- CLOUDINARY_CLOUD_NAME
- CLOUDINARY_API_KEY
- CLOUDINARY_API_SECRET

## Available scripts

- npm run dev
- npm run build
- npm run start
- npm run lint
- npm run seed

## GitHub-ready deployment

GitHub is used to host the repository, while app deployment is handled by hosting platforms such as Vercel, Render, Railway, or Fly.io.

### Recommended deployment pattern

- Frontend: Vercel or Netlify
- Backend API: Render or Railway
- Database: MongoDB Atlas

### Typical production setup

1. Push this repository to GitHub.
2. Connect the GitHub repo to Vercel for the frontend.
3. Set environment variables in Vercel for the frontend, especially NEXT_PUBLIC_API_URL.
4. Deploy the backend to Render/Railway and set its environment variables.
5. Point the frontend to the live backend URL and configure CORS for the production domain.

### CI workflow

A GitHub Actions workflow is included under .github/workflows/ci.yml. It automatically runs lint and build checks on pushes and pull requests.

## Security notes

- Never expose exact donor addresses, phone numbers, or government IDs publicly.
- Treat blood compatibility as a matching aid and confirm medical suitability with a hospital or blood bank.
- Use verification and moderation workflows to reduce fraud.
- Use strong secrets in production and avoid committing real .env files.

## Production checklist

- Replace localhost URLs with production domains
- Use MongoDB Atlas or a managed MongoDB service
- Use HTTPS-only cookies and secure headers
- Set strong JWT secrets
- Review blood request permissions and admin access controls
- Validate all API routes before public launch
