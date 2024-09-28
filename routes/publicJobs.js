const express = require('express');
const Job = require('../models/Job');
const router = express.Router();

// Public route to display jobs
router.get('/', async (req, res) => {
    const jobs = await Job.find();
    res.render('publicJobs', { jobs });
});

module.exports = router;
