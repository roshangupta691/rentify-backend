// routes/user.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

router.post('/register', async (req, res) => {
  const { firstName, lastName, email, phone, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ firstName, lastName, email, phone, password: hashedPassword, role });
  
  try {
    await user.save();
    res.status(201).send('User registered');
  } catch (error) {
    res.status(400).send('Error registering user');
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  
  if (user && await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ id: user._id, role: user.role }, 'secret_key');
    res.json({ token });
  } else {
    res.status(400).send('Invalid credentials');
  }
});

module.exports = router;
