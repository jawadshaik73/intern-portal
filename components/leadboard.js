import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/leaderboard');
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
    }
  };

  return (
    <div className="leaderboard">
      <header className="leaderboard-header">
        <h1>Top Performers</h1>
        <Link to="/dashboard" className="btn-back">← Back to Dashboard</Link>
      </header>

      <div className="leaderboard-table">
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Donations Raised</th>
              <th>Referrals</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {leaderboardData.map((person, index) => (
              <tr key={index} className={index < 3 ? `rank-${index + 1}` : ''}>
                <td className="rank">#{index + 1}</td>
                <td className="name">{person.name}</td>
                <td className="donations">${person.donations.toLocaleString()}</td>
                <td className="referrals">{person.referrals}</td>
                <td>
                  <span className={`status ${index < 3 ? 'active' : 'pending'}`}>
                    {index < 3 ? 'Top Performer' : 'Active'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="leaderboard-notes">
        <h3>📊 Monthly Leaderboard</h3>
        <p>Top 3 performers get special rewards at the end of the month!</p>
        <div className="rewards-list">
          <p>🏆 1st Place: Paid Internship Offer</p>
          <p>🥈 2nd Place: $500 Bonus</p>
          <p>🥉 3rd Place: Swag Package</p>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;