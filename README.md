# Library Portal Frontend

> A role-based React application for managing books, borrowings, and fines.

[![Live on Render](https://img.shields.io/badge/Live-Render-46E3B7?style=for-the-badge&logo=render&logoColor=black)](https://library-portal-frontend.onrender.com/)
[![Backend Repository](https://img.shields.io/badge/Backend-GitHub-24292F?style=for-the-badge&logo=github&logoColor=white)](https://github.com/manna-rajan/library-portal-backend)

## Overview

Library Portal provides separate flows for admins and readers, including authentication, book management, borrowing workflows, and fine payment support.

## Table of Contents

- [Live Links](#live-links)
- [Feature Highlights](#feature-highlights)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Backend Setup (Required)](#backend-setup-required)
- [Scripts](#scripts)
- [Configuration Notes](#configuration-notes)

## Live Links

- Frontend (Render): https://library-portal-frontend.onrender.com/
- Backend repository: https://github.com/manna-rajan/library-portal-backend

## Feature Highlights

| Area | Details |
| --- | --- |
| Authentication | Separate admin and reader sign-up/sign-in flows |
| Admin Capabilities | Add books and manage library inventory |
| Reader Experience | Browse, borrow, and return books |
| Fines | Fine handling for overdue returns |
| Payments | Cashfree-based fine payment integration |

## Tech Stack

- React 19
- React Router
- Axios
- Cashfree React SDK
- Create React App (react-scripts)

## Project Structure

```text
library-portal-frontend/
  public/
  src/
    components/
    App.js
    index.js
```

## Quick Start

### 1. Clone and install

```bash
git clone <your-frontend-repo-url>
cd library-portal-frontend
npm install
```

### 2. Configure environment

Create a `.env` file in the frontend root:

```env
REACT_APP_BACKEND_URL=http://localhost:3001
```

### 3. Start development server

```bash
npm start
```

App runs at http://localhost:3000.

## Backend Setup (Required)

Frontend requires the backend API from:

- https://github.com/manna-rajan/library-portal-backend

Minimum setup:

1. Install dependencies in backend:

   ```bash
   npm install
   ```

2. Create `fine.env` in backend root:

   ```env
   MONGO_URL=mongodb://localhost:27017/library-portal
   FRONTEND_URL=http://localhost:3000
   PORT=3001
   CASHFREE_APP_ID=YOUR_CASHFREE_APP_ID
   CASHFREE_SECRET_KEY=YOUR_CASHFREE_SECRET_KEY
   CASHFREE_API_URL=https://sandbox.cashfree.com/pg
   ```

3. Start backend server:

   ```bash
   node app.js
   ```

## Scripts

- `npm start`: Run frontend in development mode
- `npm test`: Run test suite
- `npm run build`: Create production build

## Configuration Notes

- Keep backend `FRONTEND_URL` and frontend `REACT_APP_BACKEND_URL` aligned for CORS and API access.
- Use Cashfree sandbox keys while testing payments.
