const express = require('express');
const app = express();

// USE PROXY SERVER TO REDIRECT THE INCOMING REQUESTS
const httpProxy = require('http-proxy');
const proxy = httpProxy.createProxyServer();

const jwt = require('jsonwebtoken');
require('dotenv').config();
const JWT_SECRETE = process.env.JWT_SECRETE;

// TARGET URLS FOR MICROSERVICES (Using env vars with fallbacks for local dev)
const REGISTRATION_URL = process.env.REGISTRATION_URL || 'http://localhost:5003';
const UPDATE_URL       = process.env.UPDATE_URL       || 'http://localhost:5004';

// ─── JWT Auth Middleware ───────────────────────────────────────────────────────
function authToken(req, res, next) {
    console.log('Authorization Header:', req.headers.authorization);
    const header = req?.headers.authorization;
    const token  = header && header.split(' ')[1];

    if (token == null) return res.status(401).json({ message: 'Please send token' });

    jwt.verify(token, JWT_SECRETE, (err, user) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Token has expired' });
            }
            return res.status(403).json({ message: 'Invalid token' });
        }
        req.user = user;
        next();
    });
}

// ─── Routes ───────────────────────────────────────────────────────────────────

// ROUTE 1 : Registration Service  (No auth required – public endpoint)
app.use('/Registration', (req, res) => {
    console.log('>> API Gateway → Registration Service');
    proxy.web(req, res, { target: REGISTRATION_URL });
});

// ROUTE 2 : Update Service  (Auth required)
app.use('/update', authToken, (req, res) => {
    console.log('>> API Gateway → Update Service');
    proxy.web(req, res, { target: UPDATE_URL });
});

// ─── Proxy error handler ──────────────────────────────────────────────────────
proxy.on('error', (err, req, res) => {
    console.error('Proxy Error:', err.message);
    res.status(502).json({ message: 'Bad Gateway – upstream service unavailable' });
});

// ─── Start Gateway ────────────────────────────────────────────────────────────
app.listen(4000, () => {
    console.log('API Gateway Service is running on PORT 4000');
});

