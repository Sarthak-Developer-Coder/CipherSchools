const router = require('express').Router();
const pool = require('../config/pg');
const validateQuery = require('../middleware/queryValidator');
const { optionalAuth } = require('../middleware/auth');
const Attempt = require('../models/Attempt');

/* POST /api/query/execute */
router.post('/execute', optionalAuth, validateQuery, async (req, res, next) => {
  try {
    const result = await pool.query(req.sanitizedSQL);

    // If logged-in, save attempt
    if (req.user && req.body.assignmentId) {
      await Attempt.create({
        userId: req.user.id,
        assignmentId: req.body.assignmentId,
        query: req.sanitizedSQL,
        success: true,
      });
    }

    res.json({
      columns: result.fields.map((f) => f.name),
      rows: result.rows,
      rowCount: result.rowCount,
    });
  } catch (err) {
    // Return PG error to the student so they can learn from it
    res.status(400).json({ error: err.message });
  }
});

/* GET /api/query/sample-data?table=tablename */
router.get('/sample-data', async (req, res) => {
  const { table } = req.query;
  if (!table || !/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(table)) {
    return res.status(400).json({ error: 'Invalid table name.' });
  }
  try {
    const result = await pool.query(`SELECT * FROM "${table}" LIMIT 50`);
    res.json({
      columns: result.fields.map((f) => f.name),
      rows: result.rows,
      rowCount: result.rowCount,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
