# HQ — A Modern Educational Website

This project is a modern, responsive educational website (frontend + Express backend) designed to provide a premium look and smooth UX. It includes a registration flow that silently notifies the site owner via email using Nodemailer.

Theme: White + Dark Cyan (#0F766E). No external UI frameworks used.

## Project Structure

- public/
  - index.html (Landing)
  - home.html (Choose Class)
  - class.html (Select Subject)
  - register.html (Register to Continue)
  - payment.html (Complete Payment)
  - style.css
  - script.js
- server.js (Express backend)
- package.json
- .env.example
- README.md

## Features

- Landing page occupying exactly one screen (100vh), centered with animated background.
- Home page with class cards and "Why Choose HQ" feature list.
- Class page with subject cards.
- Registration form with client + server validation.
- Backend sends an email to `skand_is_here@outlook.com` using Nodemailer when registration occurs.
- Payment placeholder page and final confirmation message.
- Smooth transitions, ripple effects, hover-lift cards, loading UI.
- Google Fonts (Poppins).
- Responsive using CSS Grid and Flexbox.
- No external CSS frameworks.

## Setup

1. Clone or copy the project files.
2. Install dependencies:
   npm install

3. Create a `.env` file in project root from `.env.example` and fill:
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-email-password-or-app-password
   PORT=3000

Note: If using Gmail, create an App Password or enable appropriate access (Gmail may block "less secure apps").

4. Run:
   npm start
   or for development:
   npm run dev

5. Open http://localhost:3000 in your browser.

## How it works

- The frontend posts registration data to `POST /api/register`.
- The server validates input and uses Nodemailer to send an email to `skand_is_here@outlook.com`.
- The visitor is redirected client-side to `payment.html` after a successful response.
- No credentials are exposed to the visitor.

## Notes & Customization

- If you prefer SMTP with a different provider, modify `createTransporter()` in `server.js` accordingly.
- Replace the QR placeholder in `payment.html` with your real QR image.
- Improve validations or add database storage as required.

## Security

- Do not commit `.env` or real credentials.
- Use environment variables for EMAIL_USER and EMAIL_PASS.
- For production, use secure SMTP credentials with TLS and ensure proper access controls.

---

If you want, I can:
- Add server-side storage (MongoDB / SQLite).
- Add admin interface to view registrations.
- Replace the QR placeholder with a generated QR image.
- Prepare a deploy script (Heroku / Vercel / Railway) and environment variable instructions.

Enjoy building HQ!