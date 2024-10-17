// models/ContactLead.js
const mongoose = require('mongoose');

const contactLeadSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ['New', 'Checked'], default: 'New' },
}, { timestamps: true });

module.exports = mongoose.model('ContactLead', contactLeadSchema);
