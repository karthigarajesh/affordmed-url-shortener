const express = require('express');
const router = express.Router();
const axios = require('axios');


const urlStore = {};


router.post('/log', async (req, res) => {
  const { stack, level, package: pkg, message } = req.body;

  if (!stack || !level || !pkg || !message) {
    return res.status(400).json({ error: 'Missing required log fields' });
  }

  try {
    const response = await axios.post(
      'http://20.244.56.144/evaluation-service/logs',
      { stack, level, package: pkg, message },
      {
        headers: {
          Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return res.status(200).json({
      status: 'Logged successfully',
      logId: response.data.logId,
    });
  } catch (err) {
    console.error('Logging failed:', err.response?.data || err.message);
    return res.status(500).json({
      error: 'Logging failed',
      message: err.response?.data || err.message,
    });
  }
});


router.post('/', (req, res) => {
  const { url, shortcode, expiry } = req.body;

  if (!url) return res.status(400).json({ error: 'URL is required' });

  const code = shortcode || Math.random().toString(36).substring(2, 8);
  const expiryDate = expiry || 'No Expiry';

  
  urlStore[code] = {
    url,
    expiry: expiryDate,
  };

  return res.status(200).json({
    shortUrl: `http://localhost:5000/${code}`,
    expiry: expiryDate,
  });
});


router.get('/:shortcode', (req, res) => {
  const { shortcode } = req.params;
  const entry = urlStore[shortcode];

  if (entry) {
    return res.redirect(entry.url);
  } else {
    return res.status(404).send('Short URL not found');
  }
});

module.exports = router;
