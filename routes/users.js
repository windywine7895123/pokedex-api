var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/userSchema');
const jwt = require('jsonwebtoken')
require('dotenv').config();
const secretKey = process.env.SECRET_KEY

// Route for user registration
router.post('/register', async (req, res) => {
  const { username, password, firstname, lastname, rank, email } = req.body;

  try {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
          return res.status(400).json({ message: 'Username already exists' });
      }
      // Hash the password using bcrypt
      const hashedPassword = await bcrypt.hash(password, 10); // Salt rounds = 10
      // Create a new user with hashed password
      const newUser = new User({
          username,
          password: hashedPassword,
          firstname,
          lastname,
          rank,
          email
      });

      // Save the user to the database
      const savedUser = await newUser.save();
      res.status(201).json(savedUser);
  } catch (error) {
      res.status(400).json({ message: error.message });
  }
});

// Route for user login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
      // Find the user by username
      const user = await User.findOne({ username });

      // Check if the user exists
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Compare the provided password with the hashed password stored in the database
      const isPasswordMatch = await bcrypt.compare(password, user.password);

      if (!isPasswordMatch) {
          return res.status(401).json({ message: 'Invalid credentials' });
      }

      // If password matches, generate a JSON Web Token (JWT) for authentication
      const token = jwt.sign({ userId: user._id ,username:user.username, role: user.role}, `${secretKey}`, { expiresIn: '1h' });
      console.log ('sign with secretKey:',secretKey)
      // Return the token and user information (you may choose not to include sensitive data)
      res.json({ token, user: { username: user.username, firstname: user.firstname, rank:user.rank },loginStatus:'success' });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});

module.exports = router;
