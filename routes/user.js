const express = require('express');
const router = express.Router();
const { getCollection } = require('../models/db');

// Signup
router.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  const users = getCollection('users');

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  const existing = await users.findOne({ username });
  if (existing) {
    return res.status(409).json({ error: 'Username already exists' });
  }

  await users.insertOne({ username, password });
  res.status(201).json({ message: 'Signup successful!' });
});

// Signin
router.post('/signin', async (req, res) => {
  const { username, password } = req.body;
  const users = getCollection('users');

  const user = await users.findOne({ username });
  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  res.status(200).json({ message: 'Signin successful!' });
});

module.exports = router;
