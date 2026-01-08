import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const PROFILES = [
    'Web Development',
    'Mobile App Development',
    'Data Science',
    'Machine Learning',
    'Content Writing',
    'Graphic Design',
    'Digital Marketing',
    'Social Media Marketing',
    'UI/UX Design',
    'Business Development',
    'Sales',
    'HR',
    'Finance',
    'Video Editing',
    'Photography',
    'SEO',
    'Backend Development',
    'Frontend Development',
    'Full Stack Development',
    'Software Testing'
];

const LOCATIONS = [
    'Delhi',
    'Mumbai',
    'Bangalore',
    'Hyderabad',
    'Pune',
    'Chennai',
    'Kolkata',
    'Ahmedabad',
    'Jaipur',
    'Lucknow',
    'Chandigarh',
    'Noida',
    'Gurgaon',
    'Indore',
    'Kochi',
    'Visakhapatnam',
    'Nagpur',
    'Coimbatore',
    'Bhopal',
    'Surat'
];

const InternshipList = () => {
    const { user } = useAuth();
    const [internships, setInternships] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [filters, setFilters] = useState({
        role: '',
        location: '',
        type: '',
        duration: '',
        partTime: false
    });

    useEffect(() => {
        fetchInternships();
    }, [filters]);

    const fetchInternships = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filters.role) params.append('role', filters.role);
            if (filters.location) params.append('location', filters.location);
            if (filters.type) params.append('type', filters.type);
            if (filters.duration) params.append('duration', filters.duration);
            if (filters.partTime) params.append('partTime', 'true');

            const res = await axios.get(`/api/internships?${params.toString()}`);
            setInternships(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const clearFilters = () => {
        setFilters({
            role: '',
            location: '',
            type: '',
            duration: '',
            partTime: false
        });
    };

    return (
        <div className="internship-page">
            <div className="filters-sidebar">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ margin: 0 }}>🔍 Filters</h3>
                    <button
                        onClick={clearFilters}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--primary)',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            fontWeight: '600'
                        }}
                    >
                        Clear All
                    </button>
                </div>

                <div className="filter-group">
                    <label>Profile / Role</label>
                    <select
                        name="role"
                        value={filters.role}
                        onChange={handleFilterChange}
                    >
                        <option value="">All Profiles</option>
                        {PROFILES.map(profile => (
                            <option key={profile} value={profile}>{profile}</option>
                        ))}
                    </select>
                </div>

                <div className="filter-group">
                    <label>Location</label>
                    <select
                        name="location"
                        value={filters.location}
                        onChange={handleFilterChange}
                    >
                        <option value="">All Locations</option>
                        {LOCATIONS.map(location => (
                            <option key={location} value={location}>{location}</option>
                        ))}
                    </select>
                </div>

                <div className="filter-group">
                    <label>Work Type</label>
                    <select name="type" value={filters.type} onChange={handleFilterChange}>
                        <option value="">All Types</option>
                        <option value="Remote">🏠 Work From Home</option>
                        <option value="On-site">🏢 In Office</option>
                        <option value="Hybrid">🔄 Hybrid</option>
                    </select>
                </div>

                <div className="filter-group">
                    <label>Duration</label>
                    <select name="duration" value={filters.duration} onChange={handleFilterChange}>
                        <option value="">Any Duration</option>
                        <option value="1 Month">1 Month</option>
                        <option value="2 Months">2 Months</option>
                        <option value="3 Months">3 Months</option>
                        <option value="6 Months">6 Months</option>
                    </select>
                </div>

                <div className="filter-group">
                    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                        <input
                            type="checkbox"
                            name="partTime"
                            checked={filters.partTime}
                            onChange={handleFilterChange}
                            style={{ marginRight: '0.5rem' }}
                        />
                        <span>Part-time Available</span>
                    </label>
                </div>

                {/* Active Filters Summary */}
                {(filters.role || filters.location || filters.type || filters.duration || filters.partTime) && (
                    <div style={{
                        marginTop: '1.5rem',
                        padding: '1rem',
                        background: 'var(--bg-light)',
                        borderRadius: '8px',
                        fontSize: '0.85rem'
                    }}>
                        <strong style={{ display: 'block', marginBottom: '0.5rem' }}>Active Filters:</strong>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                            {filters.role && <span>• {filters.role}</span>}
                            {filters.location && <span>• {filters.location}</span>}
                            {filters.type && <span>• {filters.type}</span>}
                            {filters.duration && <span>• {filters.duration}</span>}
                            {filters.partTime && <span>• Part-time</span>}
                        </div>
                    </div>
                )}
            </div>

            <div className="internship-feed">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ margin: 0 }}>
                        {loading ? 'Loading...' : `${internships.length} Internship${internships.length !== 1 ? 's' : ''} Available`}
                    </h2>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-light)' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
                        <p>Loading internships...</p>
                    </div>
                ) : internships.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '12px', border: '1px solid var(--border)' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
                        <h3>No internships found</h3>
                        <p style={{ color: 'var(--text-light)', marginBottom: '1.5rem' }}>Try adjusting your filters to see more results</p>
                        <button className="btn-primary" onClick={clearFilters}>Clear Filters</button>
                    </div>
                ) : (
                    <div className="internship-cards">
                        {internships.map(internship => (
                            <div key={internship._id} className="internship-card-wide">
                                <div className="card-header">
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{ margin: '0 0 0.5rem 0' }}>{internship.title}</h3>
                                        <p className="company-name" style={{ margin: 0 }}>{internship.company}</p>
                                    </div>
                                    <div className="logo-placeholder">
                                        {internship.company.charAt(0).toUpperCase()}
                                    </div>
                                </div>

                                <div className="card-meta">
                                    <span>📍 {internship.location}</span>
                                    <span>💰 {internship.stipend}</span>
                                    <span>📅 {internship.duration}</span>
                                </div>

                                <div className="tags">
                                    <span className="tag">{internship.type}</span>
                                    {internship.partTime && <span className="tag">⏰ Part-time</span>}
                                    {internship.openings && <span className="tag">{internship.openings} Opening{internship.openings > 1 ? 's' : ''}</span>}
                                </div>

                                <div className="card-actions">
                                    <Link to={`/internship/${internship._id}`} className="btn-secondary">View Details</Link>
                                    {user && user.role === 'student' && (
                                        <Link to={`/internship/${internship._id}`} className="btn-primary">Apply Now →</Link>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default InternshipList;
