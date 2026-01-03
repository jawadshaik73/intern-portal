const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Dummy user data
const users = [
  {
    id: 1,
    name: "Alex Johnson",
    email: "alex@example.com",
    referralCode: "ALEX2025",
    totalDonations: 1250,
    rewards: ["Bronze Badge", "Early Access", "Mentor Session"]
  },
  {
    id: 2,
    name: "Sam Wilson",
    email: "sam@example.com",
    referralCode: "SAM2025",
    totalDonations: 2800,
    rewards: ["Gold Badge", "Swag Pack", "Conference Ticket", "Mentor Session"]
  }
];

// Leaderboard data
const leaderboard = [
  { name: "Sam Wilson", donations: 2800, referrals: 12 },
  { name: "Alex Johnson", donations: 1250, referrals: 8 },
  { name: "Taylor Swift", donations: 950, referrals: 5 },
  { name: "John Doe", donations: 750, referrals: 4 },
  { name: "Jane Smith", donations: 500, referrals: 3 }
];

// Routes
app.get('/api/user/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const user = users.find(u => u.id === userId) || users[0];
  res.json(user);
});

app.get('/api/leaderboard', (req, res) => {
  res.json(leaderboard);
});

// Update donations
app.put('/api/user/:id/donate', (req, res) => {
  const userId = parseInt(req.params.id);
  const { amount } = req.body;
  
  const userIndex = users.findIndex(u => u.id === userId);
  if (userIndex !== -1) {
    users[userIndex].totalDonations += amount;
    res.json({ 
      success: true, 
      newTotal: users[userIndex].totalDonations 
    });
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});