import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// Generate JWT Helper
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// REGISTER
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body; // <-- Accept name

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ error: 'User already exists' });

    const user = await User.create({ name, email, password }); // <-- Save name
    
    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      user: { name: user.name, email: user.email } // <-- Send user info back
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    res.status(200).json({
      success: true,
      token: generateToken(user._id),
      user: { name: user.name, email: user.email } // <-- Send user info back
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error during login' });
  }
});
export default router;