const mongoose = require('mongoose');

const TestimonialSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: false
    }
});

module.exports = mongoose.model('Testimonial', TestimonialSchema);
