// middleware/auth.js

// Load environment variables from .env file
require('dotenv').config();
const jwt = require('jsonwebtoken');

// Middleware to protect routes
const verifyToken = (req, res, next) => {
    const token = req.cookies.jwt;

    if (!token) {
        return res.redirect('/admin/login');
    }

    // Verify token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.redirect('/admin/login');
        }
        
        // Token is valid, proceed to next middleware or route handler
        req.user = decoded; // Attach decoded token info (user id) to request
        next();
    });
};

module.exports = verifyToken;
