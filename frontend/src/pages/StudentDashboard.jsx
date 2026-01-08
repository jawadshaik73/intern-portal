import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const StudentDashboard = () => {
    const { user } = useAuth();
    const [applications, setApplications] = useState([]);

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const res = await axios.get('/api/applications/my-applications');
            setApplications(res.data);
        } catch (err) { console.error(err); }
    };

    return (
        <div className="dashboard-container">
            <div className="welcome-banner">
                <h1>Hi, {user.name} 👋</h1>
                <p>Track your applications below.</p>
                <Link to="/internships" className="btn-primary" style={{ maxWidth: '200px' }}>Browse Internships</Link>
            </div>

            <h2 className="section-title">My Applications</h2>
            <div className="applications-grid">
                {applications.length === 0 ? <p>You haven't applied to any internships yet.</p> : (
                    applications.map(app => (
                        <div key={app._id} className="app-card">
                            <div className="app-header">
                                <h3>{app.internship.title}</h3>
                                <span className={`status ${app.status}`}>{app.status.toUpperCase()}</span>
                            </div>
                            <p className="company">{app.internship.company}</p>
                            <div className="app-meta">
                                <span>Applied on: {new Date(app.appliedAt).toLocaleDateString()}</span>
                                <span>{app.internship.type}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default StudentDashboard;
