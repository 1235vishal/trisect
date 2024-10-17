// routes/userContactRoutes.js
const express = require('express');
const ContactLead = require('../models/ContactLead');
const router = express.Router();

// GET route - Show contact form at /contactus
router.get('/contactus', (req, res) => {
    res.render('contactForm', { error_msg: req.flash('error_msg') });
});

// POST route - Handle form submission at /contactus/submit
router.post('/contactus/submit', async (req, res) => {
    const { fullName, email, message } = req.body;

    // Basic validation
    if (!fullName || !email || !message) {
        req.flash('error_msg', 'All fields are required.');
        return res.redirect('/contactus');
    }

    try {
        const newContactLead = new ContactLead({
            name: fullName,
            email,
            message,
            status: 'New',
        });
        await newContactLead.save();
        res.redirect('/contactus/success');
    } catch (error) {
        console.error('Error saving contact lead:', error);
        req.flash('error_msg', 'Error: Could not save your message. Please try again.');
        res.redirect('/contactus');
    }
});

// GET route - Show success page at /contactus/success
router.get('/contactus/success', (req, res) => {
    res.render('contactSuccess');
});

module.exports = router;
