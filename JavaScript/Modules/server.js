"use strict";
// Accessing the Server with browser connected to the local network:
// http://192.168.1.109:3000    (use 'ifconfig' to find ip-address or use 'localhost')
const express = require('express');
const path = require('path');

const app = express();

// Serve shared static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve different HTML files based on the route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'about.html'));
});

app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'contact.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});