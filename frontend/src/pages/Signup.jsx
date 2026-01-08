import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'student', companyName: '' });
    const { register } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await register(formData);
        if (res.success) {
            navigate('/dashboard');
        } else {
            setError(res.error);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Sign Up</h2>
                {error && <p className="error">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Full Name</label>
                        <input name="name" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>I am a:</label>
                        <select name="role" value={formData.role} onChange={handleChange}>
                            <option value="student">Student</option>
                            <option value="employer">Employer</option>
                        </select>
                    </div>
                    {formData.role === 'employer' && (
                        <div className="form-group">
                            <label>Company Name</label>
                            <input name="companyName" value={formData.companyName} onChange={handleChange} required />
                        </div>
                    )}
                    <button type="submit" className="btn-primary">Register</button>
                </form>
                <p className="auth-link">Already have an account? <Link to="/login">Login</Link></p>
            </div>
        </div>
    );
};

export default Signup;
