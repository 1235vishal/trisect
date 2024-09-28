const express = require('express');
const Job = require('../models/Job');
const router = express.Router();

// GET all jobs
router.get('/', async (req, res) => {
    const jobs = await Job.find();
    res.render('jobs', { jobs });
});

// GET form to create a new job
router.get('/new', (req, res) => {
    res.render('newJob');
});

// POST a new job
router.post('/', async (req, res) => {
    const { title, description } = req.body;
    const newJob = new Job({ title, description });
    await newJob.save();
    res.redirect('/admin/jobs');
});

// DELETE a job
router.get('/delete/:id', async (req, res) => {
    await Job.findByIdAndDelete(req.params.id);
    res.redirect('/admin/jobs');
});

module.exports = router;
