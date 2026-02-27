const router = require('express').Router();
const Assignment = require('../models/Assignment');

/* GET /api/assignments  – list all */
router.get('/', async (_req, res, next) => {
  try {
    const assignments = await Assignment.find()
      .select('title description difficulty tables createdAt')
      .sort({ createdAt: -1 });
    res.json(assignments);
  } catch (err) {
    next(err);
  }
});

/* GET /api/assignments/:id  – single assignment */
router.get('/:id', async (req, res, next) => {
  try {
    const assignment = await Assignment.findById(req.params.id)
      .select('-sampleQuery');   // never expose the reference answer
    if (!assignment) return res.status(404).json({ error: 'Assignment not found.' });
    res.json(assignment);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
