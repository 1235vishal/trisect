const express = require('express');
const JobEnquiry = require('../models/JobEnquiry');
const router = express.Router();

// GET - Display all job enquiries to admin
router.get('/', async (req, res) => {
    try {
        // Fetch all job enquiries from the database
        const enquiries = await JobEnquiry.find().sort({ createdAt: -1 });

        // Render admin view with job enquiries
        res.render('adminJobEnquiries', { enquiries });
    } catch (err) {
        console.error(err);
        res.redirect('/admin');
    }
});

router.post('/delete/:id', async (req, res) => {
    console.log('Attempting to delete:', req.params.id);
    try {
        await JobEnquiry.findByIdAndDelete(req.params.id);
        console.log(`Deleted enquiry with ID: ${req.params.id}`);
        res.redirect('/admin');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error deleting enquiry');
    }
});


module.exports = router;
