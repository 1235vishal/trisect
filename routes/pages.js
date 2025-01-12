// routes/pages.js
const express = require('express');
const router = express.Router();
const Testimonial = require('../models/Testimonial');

// Home route
router.get('/', async (req, res) => {
  try {
      const testimonials = await Testimonial.find(); // Fetch testimonials from the database
      res.render('website/home', { testimonials }); // Pass testimonials data to the view
  } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
  }
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

router.get('/career', (req, res) => {
  res.render('website/career'); // Updated path
});

module.exports = router;
