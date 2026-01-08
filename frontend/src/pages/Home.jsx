import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
    const { user } = useAuth();

    return (
        <div className="home-container">
            <header className="hero">
                <h1>Find Your Dream Internship</h1>
                <p>Connect with top companies and kickstart your career.</p>
                <div className="cta-buttons">
                    {user ? (
                        <Link to="/dashboard" className="btn-primary">Go to Dashboard</Link>
                    ) : (
                        <>
                            <Link to="/signup" className="btn-primary">Get Started</Link>
                            <Link to="/login" className="btn-secondary">Login</Link>
                        </>
                    )}
                </div>
            </header>

            <section className="features">
                <div className="feature-card">
                    <h3>For Students</h3>
                    <p>Apply to thousands of verified internships.</p>
                </div>
                <div className="feature-card">
                    <h3>For Employers</h3>
                    <p>Hire the best talent from top universities.</p>
                </div>
            </section>
        </div>
    );
};

export default Home;
