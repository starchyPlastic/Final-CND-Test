const express = require('express');
const app = express();

// USE PROXY SERVER TO REDIRECT THE INCOMING REQUESTS
const httpProxy = require('http-proxy');
const proxy = httpProxy.createProxyServer();

require('dotenv').config();

// TARGET URLS FOR MICROSERVICES (Using env vars with fallbacks for local dev)
const REGISTRATION_URL = process.env.REGISTRATION_URL || 'http://localhost:5003';
const UPDATE_URL       = process.env.UPDATE_URL       || 'http://localhost:5004';

// ─── Routes ───────────────────────────────────────────────────────────────────

// ROUTE 1 : Registration Service  (No auth – public)
app.use('/Registration', (req, res) => {
    console.log('>> API Gateway → Registration Service');
    proxy.web(req, res, { target: REGISTRATION_URL });
});

// ROUTE 2 : Update Service  (No auth – public)
app.use('/update', (req, res) => {
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
