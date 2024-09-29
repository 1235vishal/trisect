// routes/pages.js
const express = require('express');
const router = express.Router();
const Testimonial = require('../models/Testimonial');

// Home route
router.get('/', async (req, res) => {
  const testimonials = await Testimonial.find(); // Fetch testimonials from the database
  const images = testimonials.map(testimonial => ({ src: testimonial.image, alt: testimonial.name })); // Extract image paths
  res.render('website/home', { testimonials, images }); // Pass both testimonials and images
});


// About route
router.get('/about', (req, res) => {
  res.render('website/about'); // Updated path to point to views/website/about.ejs
  
});

// Contact route
router.get('/contact', (req, res) => {
  res.render('website/contact'); // Updated path to point to views/website/contact.ejs
});

// Services route and sub-routes
router.get('/executive', (req, res) => {
  res.render('website/executive'); // Updated path to point to views/website/services/executive.ejs
});

router.get('/human-resource', (req, res) => {
  res.render('website/human-resource'); // Updated path
});

router.get('/placement', (req, res) => {
  res.render('website/placement'); // Updated path
});

module.exports = router;
