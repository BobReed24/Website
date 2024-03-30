const express = require('express');
const bodyParser = require('body-parser');
const { userExists, addUser, authenticateUser } = require('./account-info');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Enable CORS middleware to allow requests from any origin
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

// Logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Serve static files from the 'public' directory
const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath, {
    setHeaders: (res, filePath) => {
        if (filePath.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript');
        }
    }
}));

// Redirect users to login page if not logged in
app.get('/', (req, res, next) => {
    // Check if the user is logged in (you can implement your own logic here)
    const isLoggedIn = req.session && req.session.user; // Example session-based check

    if (!isLoggedIn) {
        // User is not logged in, redirect to login page
        return res.redirect('/login.html');
    }

    // User is logged in, proceed to the homepage
    next();
});

// Handle user registration (signup) endpoint for both POST and GET requests
app.route('/register')
    .post((req, res) => {
        const { username, password } = req.body;

        // Check if the username already exists
        if (userExists(username)) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        // Add the new user
        addUser(username, password);
        res.status(200).json({ message: 'User registered successfully' });
    })
    .get((req, res) => {
        // Redirect to the signup page
        const signupFilePath = path.join(publicPath, 'signup.html');
        res.sendFile(signupFilePath, (err) => {
            if (err) {
                console.error('Error sending signup.html:', err);
                res.status(500).send('Internal Server Error');
            }
        });
    });

// Handle user authentication (login) endpoint for both POST and GET requests
app.route('/login')
    .post((req, res) => {
        const { username, password } = req.body;

        // Authenticate the user
        const isAuthenticated = authenticateUser(username, password);
        if (isAuthenticated) {
            req.session.user = username; // Example session-based authentication
            return res.status(200).json({ authenticated: true });
        } else {
            return res.status(401).json({ authenticated: false });
        }
    })
    .get((req, res) => {
        // Redirect to the login page
        const loginFilePath = path.join(publicPath, 'login.html');
        res.sendFile(loginFilePath, (err) => {
            if (err) {
                console.error('Error sending login.html:', err);
                res.status(500).send('Internal Server Error');
            }
        });
    });

// Example of adding a new route
app.get('/example', (req, res) => {
    res.send('This is an example route');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
