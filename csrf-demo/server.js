// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const { DOMParser } = require('xmldom');

const app = express();
const PORT = 3000;

app.use(bodyParser.json()); // For parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
app.use(cookieParser());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

let users = {
    'user1': { balance: 1000, password: 'password1' },
    'user2': { balance: 1000, password: 'password2' }
};

// Simulate a logged-in user
let loggedInUser = null;

// Login endpoint
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (users[username] && users[username].password === password) {
        loggedInUser = username;
        res.cookie('session', username, { httpOnly: true, maxAge: 3600000 }); // Set cookie for 1 hour
        return res.json({ success: true, message: 'Login successful' });
    } else {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

// Middleware to check if user is logged in
const checkAuth = (req, res, next) => {
    const { session } = req.cookies;
    if (session && users[session]) {
        loggedInUser = session;
        next();
    } else {
        res.status(401).json({ success: false, message: 'Unauthorized' });
    }
};

// Endpoint to transfer money
app.post('/transfer', checkAuth, (req, res) => {
    let to = req.body.to;
    let amount = parseFloat(req.body.amount);

    // Check if the recipient exists
    if (!users[to]) {
        return res.status(400).json({ success: false, message: 'Recipient does not exist' });
    }

    // Check if the logged-in user has sufficient funds
    if (users[loggedInUser].balance >= amount) {
        users[loggedInUser].balance -= amount;
        users[to].balance += amount;
        return res.json({ success: true, message: 'Transfer successful' });
    } else {
        return res.status(400).json({ success: false, message: 'Insufficient funds' });
    }
});

// Endpoint to get user balance
app.get('/balance', checkAuth, (req, res) => {
    return res.json({ balance: users[loggedInUser].balance });
});

// Endpoint to get the username of the logged-in user
app.get('/username', checkAuth, (req, res) => {
    return res.json({ username: loggedInUser }); // Return the logged-in username
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
