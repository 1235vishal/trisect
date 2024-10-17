// middleware/auth.js

// Load environment variables from .env file
// require('dotenv').config();
// const jwt = require('jsonwebtoken');

// // Middleware to protect routes
// const verifyToken = (req, res, next) => {
//     const token = req.cookies.jwt;

//     if (!token) {
//         return res.redirect('/admin/login');
//     }

//     // Verify token
//     jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//         if (err) {
//             return res.redirect('/admin/login');
//         }
        
//         // Token is valid, proceed to next middleware or route handler
//         req.user = decoded; // Attach decoded token info (user id) to request
//         next();
//     });
// };

// module.exports = verifyToken;
// middlewares/auth.js
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.cookies.jwt;
    if (!token) {
        return res.redirect('/admin/login');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use the JWT secret from environment variables
        req.admin = decoded; // Attach admin info to request
        next();
    } catch (err) {
        console.error('Invalid Token:', err);
        res.redirect('/admin/login');
    }
};


module.exports = verifyToken;
