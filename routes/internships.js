const express = require('express');
const Internship = require('../models/Internship');
const { auth, checkRole } = require('../middleware/authMiddleware');
const router = express.Router();

// Get All Internships (Public) - Advanced Filters
router.get('/', async (req, res) => {
    try {
        const {
            role, location, type, minStipend,
            duration, partTime, search
        } = req.query;

        let query = { status: 'active' };

        // Search (Title or Company)
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { company: { $regex: search, $options: 'i' } }
            ];
        } else {
            if (role) query.title = { $regex: role, $options: 'i' };
        }

        // Exact Filters
        if (location) query.location = { $regex: location, $options: 'i' };
        if (type) query.type = type;
        if (partTime === 'true') query.partTime = true;
        if (duration) query.duration = { $regex: duration, $options: 'i' };

        // Stipend Logic (Simple check for now)
        // In production, stipend should be a number to support range queries ($gte)

        const internships = await Internship.find(query).sort({ createdAt: -1 });
        res.json(internships);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get Single Internship
router.get('/:id', async (req, res) => {
    try {
        const internship = await Internship.findById(req.params.id).populate('postedBy', 'name companyName');
        if (!internship) return res.status(404).json({ error: 'Internship not found' });
        res.json(internship);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Post Internship (Employer Only)
router.post('/', auth, checkRole(['employer', 'admin']), async (req, res) => {
    try {
        const {
            title, company, location, type, partTime, stipend,
            duration, startDate, deadline, openings, description,
            skillsRequired, perks, questions
        } = req.body;

        const internship = new Internship({
            title,
            company: req.user.role === 'admin' ? company : (req.body.company || 'Unknown'),
            location,
            type,
            partTime,
            stipend,
            duration,
            startDate,
            deadline,
            openings,
            description,
            skillsRequired,
            perks,
            questions,
            postedBy: req.user.id
        });

        await internship.save();
        res.json(internship);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete Internship (Employer/Admin)
router.delete('/:id', auth, checkRole(['employer', 'admin']), async (req, res) => {
    try {
        const internship = await Internship.findById(req.params.id);
        if (!internship) return res.status(404).json({ error: 'Not found' });

        // Check ownership
        if (internship.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied' });
        }

        await internship.deleteOne();
        res.json({ message: 'Removed' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
