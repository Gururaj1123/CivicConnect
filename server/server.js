require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const complaintRoutes = require('./routes/complaintRoutes');
const authRoutes = require('./routes/authRoutes');
const citizenRoutes = require('./routes/citizenRoutes');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'CivicConnect API is running.' });
});

app.use('/api/complaints', complaintRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/citizens', citizenRoutes);

// Catch-all error handler - never leak stack traces to the client
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Unexpected server error. Please try again.' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`CivicConnect server running on port ${PORT}`));
