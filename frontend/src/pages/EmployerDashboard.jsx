import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const EmployerDashboard = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('post'); // post, manage
    const [formData, setFormData] = useState({
        title: '', company: user.companyName || '', location: '', type: 'Remote',
        stipend: '', duration: '', description: '', skillsRequired: '',
        openings: 1, startDate: 'Immediately', partTime: false,
        question1: '', question2: ''
    });
    const [message, setMessage] = useState('');
    const [myInternships, setMyInternships] = useState([]);
    const [applicants, setApplicants] = useState([]);
    const [selectedInternship, setSelectedInternship] = useState(null);

    // Fetch Internships
    useEffect(() => {
        if (activeTab === 'manage') {
            // Since we don't have a specific API for "my internships" using filters yet, 
            // we will search by company name or fetch all and filter client side for MVP.
            // Better approach: endpoint /api/internships?postedBy=me
            axios.get(`/api/internships?search=${user.companyName}`)
                .then(res => setMyInternships(res.data))
                .catch(console.error);
        }
    }, [activeTab, user.companyName]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleCheckbox = (e) => setFormData({ ...formData, [e.target.name]: e.target.checked });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const skills = formData.skillsRequired.split(',').map(s => s.trim());
            const questions = [];
            if (formData.question1) questions.push(formData.question1);
            if (formData.question2) questions.push(formData.question2);

            await axios.post('/api/internships', {
                ...formData,
                skillsRequired: skills,
                questions
            });
            setMessage('Internship posted successfully!');
            // Reset form (partial)
            setFormData({ ...formData, title: '', description: '', skillsRequired: '' });
        } catch (error) {
            setMessage('Error posting internship');
        }
    };

    const viewApplicants = async (internshipId) => {
        setSelectedInternship(internshipId);
        try {
            const res = await axios.get(`/api/applications/internship/${internshipId}`);
            setApplicants(res.data);
        } catch (err) { console.error(err); }
    };

    const updateStatus = async (appId, status) => {
        try {
            await axios.put(`/api/applications/${appId}/status`, { status });
            // Refresh
            viewApplicants(selectedInternship);
        } catch (err) { alert('Failed to update status'); }
    };

    return (
        <div className="dashboard-container">
            <h1>Employer Dashboard</h1>
            <div className="tabs">
                <button className={`tab ${activeTab === 'post' ? 'active' : ''}`} onClick={() => setActiveTab('post')}>Post Internship</button>
                <button className={`tab ${activeTab === 'manage' ? 'active' : ''}`} onClick={() => setActiveTab('manage')}>Manage Internships</button>
            </div>

            {activeTab === 'post' && (
                <div className="card">
                    <h2>Post New Internship</h2>
                    {message && <p className="msg">{message}</p>}
                    <form onSubmit={handleSubmit} className="post-form">
                        <div className="form-row">
                            <input name="title" placeholder="Internship Title (e.g. Web Dev)" value={formData.title} onChange={handleChange} required />
                            <input name="company" placeholder="Company" value={formData.company} onChange={handleChange} required />
                        </div>
                        <div className="form-row">
                            <input name="location" placeholder="Location" value={formData.location} onChange={handleChange} required />
                            <select name="type" value={formData.type} onChange={handleChange}>
                                <option value="Remote">Remote</option>
                                <option value="On-site">On-site</option>
                                <option value="Hybrid">Hybrid</option>
                            </select>
                        </div>
                        <div className="form-row">
                            <input name="stipend" placeholder="Stipend (e.g. 10000/month)" value={formData.stipend} onChange={handleChange} required />
                            <input name="duration" placeholder="Duration (e.g. 3 Months)" value={formData.duration} onChange={handleChange} required />
                        </div>
                        <div className="form-row">
                            <input name="startDate" placeholder="Start Date" value={formData.startDate} onChange={handleChange} />
                            <input type="number" name="openings" placeholder="Openings" value={formData.openings} onChange={handleChange} />
                        </div>
                        <label>
                            <input type="checkbox" name="partTime" checked={formData.partTime} onChange={handleCheckbox} /> Part-time allowed
                        </label>
                        <textarea name="description" placeholder="Internship Description & Responsibilities" value={formData.description} onChange={handleChange} required />
                        <input name="skillsRequired" placeholder="Skills (comma separated)" value={formData.skillsRequired} onChange={handleChange} />

                        <h4>Custom Questions</h4>
                        <input name="question1" placeholder="Question 1 (e.g. Why should we hire you?)" value={formData.question1} onChange={handleChange} />
                        <input name="question2" placeholder="Question 2 (Optional link to portfolio)" value={formData.question2} onChange={handleChange} />

                        <button type="submit" className="btn-primary">Post Internship</button>
                    </form>
                </div>
            )}

            {activeTab === 'manage' && (
                <div className="manage-section">
                    <div className="internship-list">
                        <h3>Your Internships</h3>
                        {myInternships.map(intern => (
                            <div key={intern._id} className="card compact">
                                <h4>{intern.title}</h4>
                                <p>{intern.status} • {intern.stipend}</p>
                                <button className="btn-secondary" onClick={() => viewApplicants(intern._id)}>View Applicants</button>
                            </div>
                        ))}
                    </div>

                    {selectedInternship && (
                        <div className="applicants-list">
                            <h3>Applicants</h3>
                            {applicants.length === 0 ? <p>No applicants yet.</p> : (
                                applicants.map(app => (
                                    <div key={app._id} className="applicant-card">
                                        <h4>{app.student.name} <span className={`status ${app.status}`}>{app.status}</span></h4>
                                        <p>Email: {app.student.email}</p>
                                        <p className="cover-letter">"{app.coverLetter}"</p>
                                        <div className="answers">
                                            {app.answers.map((ans, i) => (
                                                <div key={i}><small>Q: {ans.question}</small><br />A: {ans.answer}</div>
                                            ))}
                                        </div>
                                        <div className="actions">
                                            <button className="btn-small success" onClick={() => updateStatus(app._id, 'shortlisted')}>Shortlist</button>
                                            <button className="btn-small danger" onClick={() => updateStatus(app._id, 'rejected')}>Reject</button>
                                            <button className="btn-small" onClick={() => updateStatus(app._id, 'hired')}>Hire</button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default EmployerDashboard;
