// server/index.js

const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Proxy Endpoint to call PageSpeed Insights
app.post('/api/audit', async (req, res) => {
  const { url, apiKey } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'Website URL is required' });
  }

  const key = apiKey || process.env.GOOGLE_API_KEY;
  const endpoint = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(
    url
  )}&category=SEO&key=${key}`;

  try {
    const response = await axios.get(endpoint);
    const seoScore =
      response.data.lighthouseResult.categories.seo.score * 100;
    const audits = response.data.lighthouseResult.audits;

    // Select a few actionable recommendations
    const suggestions = Object.values(audits)
      .filter(a => a.score !== 1 && a.scoreDisplayMode === 'binary')
      .map(a => ({ id: a.id, title: a.title, description: a.description }));

    res.json({ score: seoScore, suggestions });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({
      error: 'Failed to fetch SEO report',
      details: error.response?.data || error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
