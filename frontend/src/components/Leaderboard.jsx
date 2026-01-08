import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await axios.get('/api/leaderboard');
      setLeaderboardData(response.data);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      // Fallback dummy data
      setLeaderboardData([
        { name: "Sam Wilson", donations: 2800, referrals: 12 },
        { name: "Alex Johnson", donations: 1250, referrals: 8 },
        { name: "Taylor Swift", donations: 950, referrals: 5 },
        { name: "John Doe", donations: 750, referrals: 4 },
        { name: "Jane Smith", donations: 500, referrals: 3 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="leaderboard">
      <div className="leaderboard-header">
        <h1>Intern Leaderboard</h1>
        <Link to="/dashboard" className="btn-back">← Back to Dashboard</Link>
      </div>

      <div className="leaderboard-table">
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Intern Name</th>
              <th>Donations Raised</th>
              <th>Referrals</th>
            </tr>
          </thead>
          <tbody>
            {leaderboardData.map((user, index) => (
              <tr key={index} className={`rank-${index + 1}`}>
                <td className="rank">#{index + 1}</td>
                <td className="name">{user.name}</td>
                <td className="donations">${user.donations.toLocaleString()}</td>
                <td className="referrals">{user.referrals}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="leaderboard-notes">
        <h3>Top Performers Rewards</h3>
        <div className="rewards-list">
          <p>Top 3 interns get a paid internship opportunity.</p>
          <p>Raise $1000+ to unlock the mentorship program.</p>
          <p>Refer 10+ friends to get exclusive swag.</p>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;