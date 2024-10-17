const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/auth');



// GET - Admin Dashboard (protected route)
router.get('/', verifyToken, (req, res) => {
    res.render('dashboard', { admin: req.admin });
});




// GET - Job Enquiries (protected route)
router.get('/admin/enquiries', verifyToken, async (req, res) => {
    const JobEnquiry = require('../models/JobEnquiry');
    const enquiries = await JobEnquiry.find().sort({ createdAt: -1 });
    res.render('adminJobEnquiries', { enquiries });
});

// GET - Admin Logout
router.get('/logout', (req, res) => {
    res.clearCookie('jwt'); // Clear the JWT token
    res.redirect('/admin/login');
});

module.exports = router;
