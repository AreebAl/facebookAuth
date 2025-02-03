require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const authRoutes = require('./routes/auth.routes');
const httpsLocalhost = require('https-localhost')();
const https = require('https');


const app = express();

app.use(express.json());

// Middleware for sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your_secret_key',
    resave: false,
    saveUninitialized: true,
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Serve static files
app.use(express.static('public'));

// Use routes
app.use('/auth', authRoutes);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Start the server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));


httpsLocalhost.getCerts().then(({ key, cert }) => {
  https.createServer({ key, cert }, app).listen(3000, () => {
    console.log('HTTPS server is running on https://localhost:3000');
  });
}).catch((err) => {
  console.error('Error generating local HTTPS certificates:', err);
});