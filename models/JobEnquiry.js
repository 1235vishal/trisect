// const mongoose = require('mongoose');

// const jobEnquirySchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     email: { type: String, required: true },
//     mobile: { type: String, required: true },
//     subject: { type: String, required: true },
//     message: { type: String, required: true },
//     createdAt: { type: Date, default: Date.now }
// });

// const JobEnquiry = mongoose.model('JobEnquiry', jobEnquirySchema);
// module.exports = JobEnquiry;
// models/JobEnquiry.js
const mongoose = require('mongoose');

const JobEnquirySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    resume: {
        type: String, // Store the file path or filename
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('JobEnquiry', JobEnquirySchema);
