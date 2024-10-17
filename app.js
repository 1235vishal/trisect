// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const bodyParser = require('body-parser'); 
const path = require('path');

// Import your route modules directly
const jobEnquiryRoutes = require('./routes/jobEnquiryRoutes');
const contactRoutes = require('./routes/contactRoutes'); // Admin contact routes
const userContactRoutes = require('./routes/userContactRoutes'); // User contact form routes
const adminRoutes = require('./routes/admin');
const publicTestimonialRoutes = require('./routes/publicTestimonials');

// Import other admin routes
const pages = require('./routes/pages');
const adminAuthRoutes = require('./routes/admin');
const adminDashboardRoutes = require('./routes/adminDashboard');
const testimonialAdminRoutes = require('./routes/adminTestimonials'); 

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB without deprecated options
mongoose.connect('mongodb://localhost:27017/admin-dashboard')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Middleware
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: process.env.JWT_SECRET || 'your_secret_key', // Use JWT secret from .env
    resave: false,
    saveUninitialized: true
}));

app.use(flash());
app.use(express.static('public'));
app.use(express.json());

// Static files (CSS, images)
app.use(express.static(path.join(__dirname, 'public')));

// Main website routes
app.use('/', pages);

// Admin routes
app.use('/admin', adminRoutes);
app.use('/admin', adminDashboardRoutes); // Protected admin dashboard
app.use('/admin', adminAuthRoutes); // Admin login, logout
app.use('/admin/testimonials', testimonialAdminRoutes); // Admin routes for testimonials

// Public testimonials display
app.use('/testimonials', publicTestimonialRoutes);

// Job Enquiry routes
app.use('/job', jobEnquiryRoutes); // Job enquiry routes

// Admin Contact routes
app.use('/contact', contactRoutes); // Admin contact leads routes

// User Contact routes
app.use('/', userContactRoutes); // User contact form routes at /contactus, /contactus/submit, etc.

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
