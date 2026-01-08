const express = require('express');
const Application = require('../models/Application');
const Internship = require('../models/Internship');
const { auth, checkRole } = require('../middleware/authMiddleware');
const router = express.Router();

// Apply for Internship (Student)
router.post('/', auth, checkRole(['student']), async (req, res) => {
    try {
        const { internshipId, coverLetter, answers } = req.body;

        // Check if already applied
        const existing = await Application.findOne({ internship: internshipId, student: req.user.id });
        if (existing) return res.status(400).json({ error: 'Already applied' });

        const application = new Application({
            internship: internshipId,
            student: req.user.id,
            coverLetter,
            answers
        });

        await application.save();
        res.json(application);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get My Applications (Student)
router.get('/my-applications', auth, checkRole(['student']), async (req, res) => {
    try {
        const applications = await Application.find({ student: req.user.id })
            .populate('internship', 'title company status type location stipend')
            .sort({ appliedAt: -1 });
        res.json(applications);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get Applicants for an Internship (Employer)
router.get('/internship/:id', auth, checkRole(['employer', 'admin']), async (req, res) => {
    try {
        const applications = await Application.find({ internship: req.params.id })
            .populate('student', 'name email skills resume')
            .populate('internship', 'title');
        res.json(applications);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Update Application Status (Employer)
router.put('/:id/status', auth, checkRole(['employer', 'admin']), async (req, res) => {
    try {
        const { status } = req.body;
        // status: 'shortlisted', 'hired', 'rejected'
        const application = await Application.findByIdAndUpdate(req.params.id, { status }, { new: true });
        res.json(application);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
