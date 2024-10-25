// server.js
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3002;

app.use(bodyParser.json());

// Endpoint to demonstrate SSRF
app.post('/ssrf', (req, res) => {
    const { url } = req.body;

    // Basic validation to prevent open redirects
    if (!url || !url.startsWith('http')) {
        return res.status(400).json({ success: false, message: 'Invalid URL' });
    }

    // Make a request to the provided URL
    fetch(url)
        .then(response => response.text())
        .then(data => {
            res.json({ success: true, data });
        })
        .catch(error => {
            console.error('Error fetching URL:', error);
            res.status(500).json({ success: false, message: 'Error fetching URL' });
        });
});

// Start the server
app.listen(PORT, () => {
    console.log(`SSRF Demo Server running on http://localhost:${PORT}`);
});

