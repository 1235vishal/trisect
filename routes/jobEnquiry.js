
const express = require('express');
const multer  = require('multer');
const path = require('path');
const JobEnquiry = require('../models/JobEnquiry');
const router = express.Router();

// Set Storage Engine
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './public/uploads/resumes'); // Directory to store resumes
    },
    filename: function(req, file, cb){
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Initialize Upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 2000000 }, // Limit file size to 2MB
    fileFilter: function(req, file, cb){
        checkFileType(file, cb);
    }
}).single('resume'); // 'resume' is the name attribute in the form

// Check File Type
function checkFileType(file, cb){
    // Allowed extensions
    const filetypes = /pdf|doc|docx/;
    // Check extension
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check MIME type
    const mimetype = filetypes.test(file.mimetype);

    if(mimetype && extname){
        return cb(null, true);
    } else {
        cb('Error: Only PDF, DOC, and DOCX files are allowed!');
    }
}

// Ensure the uploads/resumes directory exists
const fs = require('fs');
const uploadDir = './public/uploads/resumes';

if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
}

// GET - Show job enquiry form
router.get('/', (req, res) => {
    res.render('jobEnquiryForm', { title: 'Job Enquiry Form' });
});

// POST - Handle form submission
router.post('/', (req, res) => {
    upload(req, res, async (err) => {
        if(err){
            // Render the form again with an error message
            return res.render('jobEnquiryForm', { 
                title: 'Job Enquiry Form',
                error_msg: err
            });
        } else {
            if(req.file == undefined){
                // No file selected
                return res.render('jobEnquiryForm', { 
                    title: 'Job Enquiry Form',
                    error_msg: 'Error: No File Selected!'
                });
            } else {
                // Everything went fine, proceed to save data
                const { name, email, mobile, subject, message } = req.body;
                const resumePath = '/uploads/resumes/' + req.file.filename; // Path to store in DB

                try {
                    const newJobEnquiry = new JobEnquiry({ 
                        name, 
                        email, 
                        mobile, 
                        subject, 
                        message,
                        resume: resumePath 
                    });
                    await newJobEnquiry.save();

                    // Render success page
                    res.render('jobEnquirySuccess', { 
                        title: 'Job Enquiry Success',
                        name 
                    });
                } catch (saveError) {
                    console.error('Error saving job enquiry:', saveError);
                    res.render('jobEnquiryForm', { 
                        title: 'Job Enquiry Form',
                        error_msg: 'Error: Could not save your enquiry. Please try again.'
                    });
                }
            }
        }
    });
});

module.exports = router;
