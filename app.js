const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');



const adminRoutes = require('./routes/admin');
const jobRoutes = require('./routes/jobs');
const publicJobRoutes = require('./routes/publicJobs');
const publicTestimonialRoutes = require('./routes/publicTestimonials');
const path = require('path');

// Import job enquiry routes
const pages = require('./routes/pages');

const adminAuthRoutes = require('./routes/admin');
const adminDashboardRoutes = require('./routes/adminDashboard');
const jobEnquiryRoutes = require('./routes/jobEnquiry');
const testimonialAdminRoutes = require('./routes/adminTestimonials'); // Import testimonials routes
const adminJobEnquiriesRoutes = require('./routes/adminJobEnquiries');



const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/admin-dashboard', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Middleware
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());  // Make sure this is used



app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
}));
app.use(flash());
app.use(express.static('public'));


// Static files (CSS, images)
app.use(express.static(path.join(__dirname, 'public')));


//our main website routes



// Use the routes from pages.js
app.use('/', pages);

// Routes

app.use('/admin', adminRoutes);
app.use('/admin', adminDashboardRoutes); // Protected admin dashboard
app.use('/admin', adminAuthRoutes); // Admin login, logout

app.use('/admin/jobs', jobRoutes); // Add this line for job routes
// Add this line for public job routes
app.use('/jobs', publicJobRoutes);
app.use('/admin/testimonials', testimonialAdminRoutes); // Admin routes for testimonials
app.use('/testimonials', publicTestimonialRoutes);
// Job enquiry form route
app.use('/job-enquiry', jobEnquiryRoutes);
// Import routes




// Add this line for public testimonials display
app.use('/testimonials', publicTestimonialRoutes);
// Routes
app.use('/job-enquiry', jobEnquiryRoutes);
app.use('/admin/enquiries', adminJobEnquiriesRoutes); // Admin route for viewing job enquiries

// const jobEnquiryRoutes = require('./routes/jobEnquiry');






// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
