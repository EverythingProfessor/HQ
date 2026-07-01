// server.js
// Express server for HQ - handles static files and registration endpoint.
// Sends notification email to site owner on each registration using Nodemailer.
// Do NOT hardcode credentials. Use environment variables (see .env.example).

const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Basic security: don't reveal detailed error info to client
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static front-end
app.use(express.static(path.join(__dirname, 'public')));

// Helper: create nodemailer transporter using EMAIL_USER and EMAIL_PASS env vars
function createTransporter(){
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  if(!user || !pass){
    console.warn('EMAIL_USER or EMAIL_PASS not defined. Mail will not be sent.');
    return null;
  }

  // Using Gmail service as example. You can change to your SMTP settings.
  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass }
  });
}

// API endpoint: receive registration and send email to owner
app.post('/api/register', async (req, res) => {
  try {
    const { fullName, phone, email, selectedClass, selectedSubject } = req.body || {};

    // Basic server-side validation
    if(!fullName || !phone || !email || !selectedClass || !selectedSubject){
      return res.status(400).json({ success:false, error:'Missing required fields' });
    }

    // build email content
    const ownerEmail = 'skand_is_here@outlook.com';
    const now = new Date().toISOString();
    const mailBody = `
New HQ Registration

Name: ${fullName}
Phone: ${phone}
Email: ${email}
Selected Class: ${selectedClass}
Selected Subject: ${selectedSubject}
Registration Time: ${now}
`;

    // send mail silently in backend
    const transporter = createTransporter();
    if(transporter){
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: ownerEmail,
        subject: 'New HQ Registration',
        text: mailBody
      };

      // send and await to ensure delivery attempt
      await transporter.sendMail(mailOptions);
      console.log('Registration email sent to owner for:', fullName);
    } else {
      // transporter not configured — log to server only (developer should check .env)
      console.log('Skipping email send (transporter not configured). Registration:', {
        fullName, phone, email, selectedClass, selectedSubject, time: now
      });
    }

    // Respond success to client (visitor is redirected to payment page client-side)
    return res.json({ success:true });
  } catch (err) {
    console.error('Error in /api/register:', err);
    // non-descriptive message to client
    return res.status(500).json({ success:false, error:'Internal server error' });
  }
});

// fallback to index for SPA-ish routing (optional)
app.get('*', (req, res) => {
  // if request expects JSON, return 404
  if(req.path.startsWith('/api')) return res.status(404).json({ error:'Not found' });
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`HQ server running at http://localhost:${PORT}`);
});