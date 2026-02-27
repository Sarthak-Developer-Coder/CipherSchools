const router = require('express').Router();
const { generateHint } = require('../services/llm');

/* ── Simple in-memory rate limiter (per IP, 10 req / minute) ── */
const rateMap = new Map();
const RATE_WINDOW = 60_000;
const RATE_LIMIT = 10;

const rateLimiter = (req, res, next) => {
  const ip = req.ip;
  const now = Date.now();
  const entry = rateMap.get(ip) || { count: 0, start: now };

  if (now - entry.start > RATE_WINDOW) {
    entry.count = 1;
    entry.start = now;
  } else {
    entry.count += 1;
  }
  rateMap.set(ip, entry);

  if (entry.count > RATE_LIMIT) {
    return res.status(429).json({ error: 'Too many hint requests. Please wait a minute.' });
  }
  next();
};

/* POST /api/hint */
router.post('/', rateLimiter, async (req, res) => {
  const { question, userQuery, tables } = req.body;

  if (!question || typeof question !== 'string') {
    return res.status(400).json({ error: 'Assignment question is required.' });
  }
  if (question.length > 2000) {
    return res.status(400).json({ error: 'Question text is too long.' });
  }
  if (userQuery && typeof userQuery === 'string' && userQuery.length > 5000) {
    return res.status(400).json({ error: 'User query is too long.' });
  }

  try {
    const hint = await generateHint(question, userQuery || '', tables || []);
    res.json({ hint });
  } catch (err) {
    console.error('LLM error:', err.message);
    res.status(502).json({ error: 'Failed to generate hint. Please try again later.' });
  }
});

module.exports = router;
