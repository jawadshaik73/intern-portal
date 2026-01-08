const mongoose = require('mongoose');

const internshipSchema = new mongoose.Schema({
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    type: { type: String, enum: ['Remote', 'On-site', 'Hybrid'], required: true },
    partTime: { type: Boolean, default: false },
    stipend: { type: String, required: true },
    duration: { type: String, required: true },
    startDate: { type: String, required: true },
    deadline: { type: Date, required: true },
    openings: { type: Number, default: 1 },
    description: { type: String, required: true },
    skillsRequired: [String],
    perks: [String], // Certificate, Letter of Recommendation, etc.
    questions: [String], // Custom questions for applicants
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['active', 'closed', 'rejected', 'pending'], default: 'active' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Internship', internshipSchema);
