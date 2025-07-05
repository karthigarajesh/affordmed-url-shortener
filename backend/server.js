const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');
const urlRoutes = require('./routes/urlRoutes');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());


app.use(async (req, res, next) => {
  try {
    await axios.post(
      'http://20.244.56.144/evaluation-service/logs',
      {
        stack: 'backend',
        level: 'info',
        package: 'middleware',
        message: `${req.method} ${req.originalUrl}`,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log(`[LOGGED] ${req.method} ${req.originalUrl}`);
  } catch (err) {
    console.error('Auto-log failed:', err.response?.data || err.message);
  }
  next(); 
});


app.use('/', urlRoutes);


app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
