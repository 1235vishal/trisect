// models/JobEnquiry.js
const mongoose = require('mongoose');

const jobEnquirySchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    resume: { type: String, required: true },
    status: { type: String, enum: ['New', 'Qualified', 'Rejected'], default: 'New' },
}, { timestamps: true });

module.exports = mongoose.model('JobEnquiry', jobEnquirySchema);
