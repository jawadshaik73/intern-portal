import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';



const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
      const response = await axios.get('/api/user/1');
      setUserData(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Fallback dummy data
      setUserData({
        name: "Alex Johnson",
        referralCode: "ALEX2025",
        totalDonations: 1250,
        rewards: ["Bronze Badge", "Early Access", "Mentor Session"]
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDonate = async () => {
    try {
      const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
      const response = await axios.put('/api/user/1/donate', {
        amount: 100
      });
      if (response.data.success) {
        setUserData({
          ...userData,
          totalDonations: response.data.newTotal
        });
      }
    } catch (error) {
      console.error('Error updating donations:', error);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Intern Dashboard</h1>
        <nav>
          <Link to="/leaderboard" className="nav-link">Leaderboard</Link>
          <button className="btn-logout">Logout</button>
        </nav>
      </header>

      <main className="dashboard-content">
        <div className="welcome-section">
          <h2>Welcome, {userData.name}!</h2>
          <p>Track your impact and rewards</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>Referral Code</h3>
            <div className="referral-code">
              <code>{userData.referralCode}</code>
              <button className="btn-copy">Copy</button>
            </div>
            <p>Share this code with friends</p>
          </div>

          <div className="stat-card">
            <h3>Total Donations Raised</h3>
            <div className="donation-amount">
              ${userData.totalDonations.toLocaleString()}
            </div>
            <button onClick={handleDonate} className="btn-donate">
              + Add $100 (Demo)
            </button>
          </div>

          <div className="stat-card">
            <h3>Referrals</h3>
            <div className="referral-count">8 Friends Joined</div>
            <p>Keep inviting to unlock rewards</p>
          </div>
        </div>

        <div className="rewards-section">
          <h3>Your Rewards & Unlockables</h3>
          <div className="rewards-grid">
            {userData.rewards.map((reward, index) => (
              <div key={index} className="reward-card">
                <div className="reward-icon">🏆</div>
                <h4>{reward}</h4>
                <p>Unlocked!</p>
              </div>
            ))}
            <div className="reward-card locked">
              <div className="reward-icon">🔒</div>
              <h4>Executive Meeting</h4>
              <p>Raise $5000 to unlock</p>
            </div>
            <div className="reward-card locked">
              <div className="reward-icon">🔒</div>
              <h4>Paid Internship</h4>
              <p>Top 3 on leaderboard</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;