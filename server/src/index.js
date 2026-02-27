const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectMongo = require('./config/db');

const assignmentRoutes = require('./routes/assignments');
const queryRoutes = require('./routes/query');
const hintRoutes = require('./routes/hint');
const authRoutes = require('./routes/auth');

const app = express();

/* ── Middleware ─────────────────────────── */
app.use(helmet());
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:3000')
  .split(',')
  .map((s) => s.trim());
app.use(
  cors({
    origin: (origin, cb) => {
      // Allow requests with no origin (curl, Postman) or from allowed list
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      cb(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '100kb' }));

/* ── Routes ────────────────────────────── */
app.use('/api/assignments', assignmentRoutes);
app.use('/api/query', queryRoutes);
app.use('/api/hint', hintRoutes);
app.use('/api/auth', authRoutes);

/* ── Health check ──────────────────────── */
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

/* ── Global error handler ──────────────── */
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

/* ── Start ─────────────────────────────── */
const PORT = process.env.PORT || 5000;

connectMongo().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
