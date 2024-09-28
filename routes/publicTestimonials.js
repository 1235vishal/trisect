const express = require('express');
const Testimonial = require('../models/Testimonial');
const router = express.Router();

// Public route to display testimonials
router.get('/', async (req, res) => {
    const testimonials = await Testimonial.find();
    res.render('publicTestimonials', { testimonials });
});

module.exports = router;
