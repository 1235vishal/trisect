// Load environment variables from .env file
require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();
const cookieParser = require('cookie-parser');

const JobEnquiry = require('../models/JobEnquiry');

const fs = require('fs');
const path = require('path');

router.use(cookieParser()); // to handle cookies

// Middleware to check if JWT is valid
const verifyToken = (req, res, next) => {
    const token = req.cookies.jwt;
    if (!token) return res.redirect('/admin/login');
    
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.redirect('/admin/login');
        req.user = decoded;
        next();
    });
};

// GET - Render login form
router.get('/login', (req, res) => {
    res.render('login', { message: req.flash('error') });
});

// POST - Handle login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            req.flash('error', 'Invalid email or password');
            return res.redirect('/admin/login');
        }

        // Generate JWT
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('jwt', token, { httpOnly: true, maxAge: 3600000 }); // 1-hour JWT cookie
        req.flash('success', 'Logged in successfully');
        res.redirect('/admin/dashboard');
    } catch (err) {
        console.error(err);
        req.flash('error', 'Server error');
        res.redirect('/admin/login');
    }
});

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '../public/uploads/resumes');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// GET - Show job enquiries
router.get('/job-enquiries', async (req, res) => {
    try {
        const enquiries = await JobEnquiry.find().sort({ createdAt: -1 });
        res.render('admin/adminJobEnquiries', { enquiries, title: 'Job Enquiries' });
    } catch (error) {
        console.error('Error fetching job enquiries:', error);
        res.status(500).send('Error fetching job enquiries');
    }
});

// GET - Render registration form
router.get('/register', (req, res) => {
    res.render('register', { message: req.flash('error') });
});

// POST - Handle registration
router.post('/register', async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        req.flash('error', 'Passwords do not match');
        return res.redirect('/admin/register');
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        req.flash('error', 'Email already exists');
        return res.redirect('/admin/register');
    }

    // Create new user
    const newUser = new User({ username, email, password });
    await newUser.save();

    // Generate JWT and log in the user immediately after registration
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('jwt', token, { httpOnly: true, maxAge: 3600000 });
    req.flash('success', 'User registered successfully! You are now logged in.');
    res.redirect('/admin/dashboard');
});

// GET - Admin Dashboard (Protected route)
router.get('/dashboard', verifyToken, (req, res) => {
    res.render('dashboard', { user: req.user });
});

// GET - Logout
router.get('/logout', (req, res) => {
    // Clear the JWT cookie
    res.clearCookie('jwt');

    // Destroy session if using express-session
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
            return res.redirect('/admin/dashboard');
        }

        // Optionally, clear the session cookie as well
        res.clearCookie('connect.sid'); // This clears the session cookie

        // Flash a success message and redirect to login
        res.redirect('/admin/login');
    });
});

module.exports = router;
