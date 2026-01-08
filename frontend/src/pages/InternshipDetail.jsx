import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const InternshipDetail = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [internship, setInternship] = useState(null);
    const [showApplyModal, setShowApplyModal] = useState(false);
    const [answers, setAnswers] = useState({});
    const [coverLetter, setCoverLetter] = useState("I am interested in this role because...");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        axios.get(`/api/internships/${id}`)
            .then(res => {
                setInternship(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [id]);

    const handleApply = async () => {
        if (!user) return navigate('/login');

        const formattedAnswers = Object.keys(answers).map(key => ({
            question: key,
            answer: answers[key]
        }));

        try {
            await axios.post('/api/applications', {
                internshipId: id,
                coverLetter,
                answers: formattedAnswers
            });
            alert('✅ Application submitted successfully!');
            setShowApplyModal(false);
            navigate('/student-dashboard');
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to apply');
        }
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '5rem', minHeight: 'calc(100vh - 70px)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
                <p style={{ color: 'var(--text-light)' }}>Loading internship details...</p>
            </div>
        );
    }

    if (!internship) {
        return (
            <div style={{ textAlign: 'center', padding: '5rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>❌</div>
                <h2>Internship not found</h2>
                <Link to="/internships" className="btn-primary" style={{ marginTop: '1rem' }}>← Back to Internships</Link>
            </div>
        );
    }

    return (
        <div className="detail-page-container">
            {/* Breadcrumb */}
            <div style={{ marginBottom: '1rem', fontSize: '0.9rem', color: 'var(--text-light)' }}>
                <Link to="/internships" style={{ color: 'var(--primary)', textDecoration: 'none' }}>← Back to Internships</Link>
            </div>

            <div className="detail-header">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '2rem' }}>
                    <div style={{ flex: 1 }}>
                        <h1 style={{ margin: '0 0 0.5rem 0' }}>{internship.title}</h1>
                        <h3 style={{ margin: 0, fontWeight: 600 }}>{internship.company}</h3>
                    </div>
                    <div className="logo-placeholder" style={{ width: '60px', height: '60px', fontSize: '1.5rem' }}>
                        {internship.company.charAt(0).toUpperCase()}
                    </div>
                </div>

                <div className="tags" style={{ marginBottom: '1.5rem' }}>
                    <span className="tag">{internship.type}</span>
                    {internship.partTime && <span className="tag">⏰ Part-time</span>}
                    <span className="tag">📍 {internship.location}</span>
                </div>

                <div className="meta-grid">
                    <div>
                        <span className="label">💰 Stipend</span>
                        <p style={{ margin: 0 }}>{internship.stipend}</p>
                    </div>
                    <div>
                        <span className="label">⏱️ Duration</span>
                        <p style={{ margin: 0 }}>{internship.duration}</p>
                    </div>
                    <div>
                        <span className="label">📅 Start Date</span>
                        <p style={{ margin: 0 }}>{internship.startDate}</p>
                    </div>
                    <div>
                        <span className="label">👥 Openings</span>
                        <p style={{ margin: 0 }}>{internship.openings || 1}</p>
                    </div>
                </div>
            </div>

            <div className="detail-content">
                <section>
                    <h4>📝 About the Internship</h4>
                    <p style={{ lineHeight: '1.8', color: 'var(--text-dark)' }}>{internship.description}</p>
                </section>

                {internship.skillsRequired && internship.skillsRequired.length > 0 && (
                    <section>
                        <h4>🎯 Skills Required</h4>
                        <div className="tags">
                            {internship.skillsRequired.map((skill, i) => (
                                <span key={i} className="tag">{skill}</span>
                            ))}
                        </div>
                    </section>
                )}

                {internship.perks && internship.perks.length > 0 && (
                    <section>
                        <h4>🎁 Perks</h4>
                        <div className="tags">
                            {internship.perks.map((perk, i) => (
                                <span key={i} className="tag">✨ {perk}</span>
                            ))}
                        </div>
                    </section>
                )}

                <section>
                    <h4>✅ Who Can Apply</h4>
                    <p>Only those candidates can apply who:</p>
                    <ul style={{ color: 'var(--text-dark)', lineHeight: '1.8' }}>
                        <li>Are available for the <strong>{internship.type}</strong> internship</li>
                        <li>Can start {internship.startDate}</li>
                        <li>Are available for duration of <strong>{internship.duration}</strong></li>
                        {internship.partTime && <li>Can work part-time</li>}
                    </ul>
                </section>

                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                    {user?.role === 'employer' ? (
                        <div className="msg" style={{ display: 'inline-block' }}>
                            You posted this internship. Go to your dashboard to manage applicants.
                        </div>
                    ) : user?.role === 'student' ? (
                        <button
                            className="btn-primary"
                            onClick={() => setShowApplyModal(true)}
                            style={{ fontSize: '1.1rem', padding: '1rem 2.5rem' }}
                        >
                            🚀 Apply Now
                        </button>
                    ) : (
                        <div>
                            <p style={{ marginBottom: '1rem', color: 'var(--text-light)' }}>Please login to apply</p>
                            <Link to="/login" className="btn-primary">Login</Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Application Modal */}
            {showApplyModal && (
                <div className="modal-overlay" onClick={() => setShowApplyModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h2 style={{ marginTop: 0 }}>Apply for {internship.title}</h2>
                        <p style={{ color: 'var(--text-light)', marginBottom: '1.5rem' }}>
                            Fill in the details below to submit your application
                        </p>

                        <div className="form-group">
                            <label>📄 Cover Letter *</label>
                            <textarea
                                value={coverLetter}
                                onChange={(e) => setCoverLetter(e.target.value)}
                                rows="5"
                                placeholder="Tell us why you're interested in this role..."
                                required
                            />
                        </div>

                        {internship.questions && internship.questions.length > 0 && (
                            <>
                                <h4 style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>Additional Questions</h4>
                                {internship.questions.map((q, i) => (
                                    <div key={i} className="form-group">
                                        <label>{i + 1}. {q}</label>
                                        <textarea
                                            onChange={(e) => setAnswers({ ...answers, [q]: e.target.value })}
                                            placeholder="Your answer..."
                                            rows="3"
                                        />
                                    </div>
                                ))}
                            </>
                        )}

                        <div className="modal-actions">
                            <button className="btn-secondary" onClick={() => setShowApplyModal(false)}>
                                Cancel
                            </button>
                            <button className="btn-primary" onClick={handleApply}>
                                Submit Application →
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InternshipDetail;
