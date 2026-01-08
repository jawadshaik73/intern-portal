const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'employer', 'admin'], default: 'student' },
    // Student fields
    resume: { type: String }, // path to resume file
    skills: [String],
    // Employer fields
    companyName: { type: String },
    companyWebsite: { type: String },
    // Common
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
