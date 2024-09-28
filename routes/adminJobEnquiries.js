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





module.exports = router;
