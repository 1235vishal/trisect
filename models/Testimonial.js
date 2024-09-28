const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
    // name: { type: String, required: true },
    // text: { type: String, required: true },
    image: { type: String, required: true }, // This will store the image file path
    createdAt: { type: Date, default: Date.now }
});

const Testimonial = mongoose.model('Testimonial', testimonialSchema);
module.exports = Testimonial;
