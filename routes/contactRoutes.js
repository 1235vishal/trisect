// routes/contactRoutes.js
const express = require('express');
const ContactLead = require('../models/ContactLead');
const router = express.Router();

// GET route - Admin: View contact leads with filtering at /contact/leads
router.get('/leads', async (req, res) => {
    const statusFilter = req.query.status;
    const sortBy = req.query.sortBy || 'createdAt';

    try {
        let filter = {};
        if (statusFilter) {
            filter.status = statusFilter;
        }

        let sortOption = { createdAt: -1 }; // Default: Newest first
        if (sortBy === 'createdAt') {
            sortOption = { createdAt: -1 };
        } else if (sortBy === '-createdAt') {
            sortOption = { createdAt: 1 };
        }

        const leads = await ContactLead.find(filter).sort(sortOption);
        res.render('contactLeads', { leads, statusFilter, sortBy });
    } catch (error) {
        console.error('Error fetching contact leads:', error);
        res.render('contactLeads', { leads: [], statusFilter, sortBy });
    }
});

// PUT route - Admin: Update status of a contact lead at /contact/leads/:id/status
router.put('/leads/:id/status', async (req, res) => {
    const { status } = req.body;
    if (!['New', 'Checked'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status value' });
    }

    try {
        await ContactLead.findByIdAndUpdate(req.params.id, { status });
        res.status(200).json({ message: 'Status updated successfully!' });
    } catch (error) {
        console.error('Error updating status:', error);
        res.status(500).json({ message: 'Error updating status' });
    }
});

// DELETE route - Admin: Delete a contact lead at /contact/leads/:id/delete
router.delete('/leads/:id/delete', async (req, res) => {
    try {
        await ContactLead.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Contact lead deleted successfully!' });
    } catch (error) {
        console.error('Error deleting contact lead:', error);
        res.status(500).json({ message: 'Error deleting contact lead' });
    }
});





// GET route - Fetch contact leads statistics
router.get('/stats', async (req, res) => {
    try {
        const totalContactLeads = await ContactLead.countDocuments(); // Total Contact Leads
        const newContacts = await ContactLead.countDocuments({ status: 'New' });
        const checkedContacts = await ContactLead.countDocuments({ status: 'Checked' });

        res.json({ totalContactLeads, newContacts, checkedContacts });
    } catch (error) {
        console.error('Error fetching contact lead stats:', error);
        res.status(500).json({ error: 'Error fetching contact lead stats' });
    }
});










module.exports = router;
