// routes/jobEnquiryRoutes.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const JobEnquiry = require('../models/JobEnquiry');
const fs = require('fs');

const router = express.Router();

// Ensure the uploads/resumes directory exists
const uploadDir = './public/uploads/resumes';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // Directory to store resumes
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 2000000 }, // Limit file size to 2MB
    fileFilter: (req, file, cb) => {
        // Allowed file types
        const filetypes = /pdf|doc|docx/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if(mimetype && extname){
            return cb(null, true);
        } else {
            cb('Error: Only PDF, DOC, and DOCX files are allowed!');
        }
    }
}).single('resume'); // 'resume' is the name attribute in the form

// GET route - Show job enquiry form
router.get('/', (req, res) => {
    res.render('jobEnquiryForm', { error_msg: req.flash('error_msg') });
});

// POST route - Handle form submission
router.post('/submit', (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            req.flash('error_msg', err);
            return res.redirect('/job');
        }
        if (req.file === undefined) {
            req.flash('error_msg', 'Error: No File Selected!');
            return res.redirect('/job');
        }

        const { fullName, email, phone } = req.body;
        const resumePath = '/uploads/resumes/' + req.file.filename; // Path to store in DB

        try {
            const newJobEnquiry = new JobEnquiry({
                fullName,
                email,
                phone,
                resume: resumePath,
                status: 'New'
            });
            await newJobEnquiry.save();
            res.redirect('/job/success'); // Redirect to success page after submission
        } catch (saveError) {
            console.error('Error saving job enquiry:', saveError);
            req.flash('error_msg', 'Error: Could not save your enquiry. Please try again.');
            res.redirect('/job');
        }
    });
});

// GET route - Show success page
router.get('/success', (req, res) => {
    res.render('success');
});

// GET route - Fetch job enquiries for admin with filtering and sorting
router.get('/enquiries', async (req, res) => {
    const statusFilter = req.query.status; // Get the status from the query parameters
    const sortBy = req.query.sortBy || 'createdAt'; // Default sort by createdAt

    try {
        let filter = {};
        if (statusFilter) {
            filter.status = statusFilter; // Filter by status if provided
        }

        let sortOption = { createdAt: -1 }; // Default sort: newest first
        if (sortBy === 'createdAt') {
            sortOption = { createdAt: -1 };
        } else if (sortBy === '-createdAt') {
            sortOption = { createdAt: 1 };
        }

        const enquiries = await JobEnquiry.find(filter).sort(sortOption); // Fetch job enquiries
        res.render('jobEnquiries', { enquiries, statusFilter, sortBy });
    } catch (error) {
        console.error('Error fetching job enquiries:', error);
        res.render('jobEnquiries', { enquiries: [], statusFilter, sortBy });
    }
});

// PUT route - Update status of a job enquiry
router.put('/enquiries/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        if (!['New', 'Qualified', 'Rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }
        await JobEnquiry.findByIdAndUpdate(req.params.id, { status });
        res.status(200).json({ message: 'Status updated successfully!' });
    } catch (error) {
        console.error('Error updating status:', error);
        res.status(500).json({ message: 'Error updating status' });
    }
});

// POST route - Delete a specific job enquiry (optional)
router.post('/enquiries/:id/delete', async (req, res) => {
    try {
        await JobEnquiry.findByIdAndDelete(req.params.id);
        res.redirect('/job/enquiries'); // Redirect back to the job enquiries page
    } catch (error) {
        console.error('Error deleting job enquiry:', error);
        res.status(500).send('Error deleting enquiry');
    }
});







// GET route - Fetch job enquiry statistics
router.get('/stats', async (req, res) => {
    try {
        const totalEnquiries = await JobEnquiry.countDocuments(); // Total Job Enquiries
        const totalRejected = await JobEnquiry.countDocuments({ status: 'Rejected' });
        const qualified = await JobEnquiry.countDocuments({ status: 'Qualified' });
        const newJobs = await JobEnquiry.countDocuments({ status: 'New' });

        res.json({ totalEnquiries, totalRejected, qualified, newJobs });
    } catch (error) {
        console.error('Error fetching job enquiry stats:', error);
        res.status(500).json({ error: 'Error fetching job enquiry stats' });
    }
});





module.exports = router;
