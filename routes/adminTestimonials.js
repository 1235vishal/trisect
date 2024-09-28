// const express = require('express');
// const Testimonial = require('../models/Testimonial');
// const router = express.Router();
// const multer = require('multer');
// const path = require('path');

// // Configure multer for file uploads
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, path.join(__dirname, '../public/uploads/testimonials'));
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + '-' + file.originalname);
//     }
// });

// const upload = multer({ storage: storage });

// // GET all testimonials (Admin view)
// router.get('/', async (req, res) => {
//     const testimonials = await Testimonial.find();
//     res.render('adminTestimonials', { testimonials });
// });

// // GET form to create a new testimonial
// router.get('/new', (req, res) => {
//     res.render('newTestimonial');
// });

// // POST a new testimonial (with image upload)
// router.post('/', upload.single('image'), async (req, res) => {
//     try {
//         const image = req.file ? `/uploads/testimonials/${req.file.filename}` : null;

//         // Save new testimonial with image
//         const newTestimonial = new Testimonial({ image });
//         await newTestimonial.save();

//         res.redirect('/admin/testimonials');
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Server Error');
//     }
// });

// // DELETE a testimonial
// router.get('/delete/:id', async (req, res) => {
//     try {
//         await Testimonial.findByIdAndDelete(req.params.id);
//         res.redirect('/admin/testimonials');
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Error deleting testimonial');
//     }
// });

// module.exports = router;
const express = require('express');
const Testimonial = require('../models/Testimonial');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/uploads/testimonials'));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// GET all testimonials (Admin view)
router.get('/', async (req, res) => {
    const testimonials = await Testimonial.find();
    res.render('adminTestimonials', { testimonials });
});

// GET form to create a new testimonial
router.get('/new', (req, res) => {
    res.render('newTestimonial');
});

// POST a new testimonial (with image upload)
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const image = req.file ? `/uploads/testimonials/${req.file.filename}` : null;
        const newTestimonial = new Testimonial({ image });
        await newTestimonial.save();
        res.redirect('/admin/testimonials');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// **NEW: GET form to edit a testimonial**
router.get('/edit/:id', async (req, res) => {
    try {
        const testimonial = await Testimonial.findById(req.params.id);
        if (!testimonial) {
            return res.status(404).send('Testimonial not found');
        }
        res.render('editTestimonial', { testimonial });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching testimonial');
    }
});

// **NEW: POST request to update a testimonial**
router.post('/edit/:id', upload.single('image'), async (req, res) => {
    try {
        const testimonial = await Testimonial.findById(req.params.id);
        if (!testimonial) {
            return res.status(404).send('Testimonial not found');
        }

        // Update image if a new one is uploaded
        if (req.file) {
            testimonial.image = `/uploads/testimonials/${req.file.filename}`;
        }

        await testimonial.save();
        res.redirect('/admin/testimonials');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error updating testimonial');
    }
});

// DELETE a testimonial
router.get('/delete/:id', async (req, res) => {
    try {
        await Testimonial.findByIdAndDelete(req.params.id);
        res.redirect('/admin/testimonials');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error deleting testimonial');
    }
});

module.exports = router;
