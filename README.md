# User Management (Next.js + MongoDB) - Command Prompt & PowerShell friendly

This scaffold implements a simple user-management system (CRUD + Auth) **without Supabase** using Next.js API routes and MongoDB.

Features:
- Register / Login (JWT)
- Role management (user / admin / manager)
- Password reset (email flow placeholder)
- Full CRUD for user profiles
- Activity log (basic)

Files include ready-to-run **Command Prompt (.cmd)** and **PowerShell (.ps1)** helper scripts.

## Quick start (Windows)

1. Copy `.env.local.example` to `.env.local` and set `MONGODB_URI` and `JWT_SECRET`.
2. In Command Prompt: `setup.cmd`
   - installs dependencies and starts dev server with `npm run dev`

PowerShell alternative: `.\setup.ps1`

## Notes
- Password reset email flow is a placeholder. Integrate an email provider (SendGrid/Mailgun) for production.
- For SQLite or JSON-file option, replace db utility.
- This scaffold uses simple JWT authentication for clarity — adapt for refresh tokens if needed.
