const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    internship: { type: mongoose.Schema.Types.ObjectId, ref: 'Internship', required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    resume: { type: String }, // Link to resume file
    coverLetter: { type: String },
    answers: [{ question: String, answer: String }], // Answers to custom questions
    status: { type: String, enum: ['applied', 'viewed', 'shortlisted', 'hired', 'rejected'], default: 'applied' },
    appliedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Application', applicationSchema);
