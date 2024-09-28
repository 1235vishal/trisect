const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your_jwt_secret_key';

// Middleware to protect routes
const verifyToken = (req, res, next) => {
    const token = req.cookies.jwt;
    
    if (!token) {
        return res.redirect('/admin/login');
    }

    // Verify token
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.redirect('/admin/login');
        }
        
        // Token is valid, proceed to next middleware or route handler
        req.user = decoded; // Attach decoded token info (admin id) to request
        next();
    });
};


// module.exports = verifyToken;
// middleware/auth.js
module.exports = verifyToken;