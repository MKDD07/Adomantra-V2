require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Serve static files from the root directory
app.use(express.static(path.join(__dirname)));

// --- Groq Proxy ---
app.post('/api/groq', async (req, res) => {
    try {
        const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', req.body, {
            headers: {
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Groq Proxy Error:', error.response ? error.response.data : error.message);
        res.status(error.response ? error.status : 500).json(error.response ? error.response.data : { error: 'Internal Server Error' });
    }
});

// --- Pexels Proxy ---
app.get('/api/pexels', async (req, res) => {
    try {
        const { query, per_page, page, orientation } = req.query;
        const response = await axios.get('https://api.pexels.com/v1/search', {
            params: { query, per_page, page, orientation },
            headers: {
                'Authorization': process.env.PEXELS_API_KEY
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Pexels Proxy Error:', error.response ? error.response.data : error.message);
        res.status(error.response ? error.status : 500).json(error.response ? error.response.data : { error: 'Internal Server Error' });
    }
});

// Default route to serve index.html for any other requests (SPA style, though this is mostly static)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
