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

This project is set up as a local demonstration and is structured for GitHub-based deployment workflows. It is not yet suitable for a public production blood-donation service: user, donor, request, and activity data are currently held in memory, and normal-user authentication returns a demo token. A deployment can be used for demonstration and review, but data will reset when the API restarts.

## Installation

1. Install dependencies from the project root:

   npm install

2. Create a production-ready environment file:

   Copy `.env.example` to `.env`.

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

### Quick college-demo link: GitHub Pages

This repository includes a workflow that publishes the frontend to GitHub Pages. Before the first deployment:

1. Deploy the demo API with Render using `render.yaml` and copy its HTTPS URL.
2. In the GitHub repository, open **Settings → Secrets and variables → Actions → Variables** and add `NEXT_PUBLIC_API_URL` with that URL (for example, `https://rakta-api.onrender.com`). Do not add `/api`.
3. Open **Settings → Pages**, choose **GitHub Actions** as the source, then push to `main` or run the **Deploy frontend to GitHub Pages** workflow.
4. GitHub will show the public site URL in the workflow result, usually `https://<github-user>.github.io/Project-phase-1-RAKTA/`.

The Pages link hosts only the frontend. The Render API must remain deployed for forms, registration, login, donor search, and requests to work.

### Deploy the live application

GitHub Pages cannot run this app's Node.js API or MongoDB database. Use GitHub to host the source and deploy the two services as follows.

1. Push the repository to GitHub.
2. In Render, create a new **Blueprint** from the repository. It will use `render.yaml` to deploy the backend. Add the backend environment variables shown below and copy the resulting API URL, for example `https://rakta-api.onrender.com`.
3. In Vercel, import the same repository. Set **Root Directory** to `frontend`, then deploy it. Add `NEXT_PUBLIC_API_URL` with the Render API URL; do not add `/api` to the end.
4. In Render, set `NODE_ENV=production`, `MONGODB_URI`, strong unique `JWT_SECRET`, `JWT_REFRESH_SECRET`, and `ADMIN_PASSWORD` values. Set both `CLIENT_URL` and `FRONTEND_URL` to the final Vercel URL. Optional email, Twilio, and Cloudinary variables may be left unset until those features are configured.
5. Redeploy the backend after its frontend URLs are set, then redeploy the frontend after `NEXT_PUBLIC_API_URL` is set.
6. Confirm `https://your-api-domain/api/health` returns a healthy response, then test registration, login, donor search, and blood requests on the Vercel URL.

Vercel automatically detects the Next.js app when `frontend` is selected as its Root Directory. Browser requests go directly to `NEXT_PUBLIC_API_URL`; do not configure a placeholder API rewrite.

### Before opening the service to real users

Do not collect real donor or patient information until the API has been upgraded to store all application records in MongoDB, has real JWT/session authentication and route-level authorization, and has been security-tested. The current in-memory data store and demo login are appropriate only for a portfolio or staging demonstration.

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
