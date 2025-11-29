 const express = require('express');
 const User = require('../models/User');
 
 const router = express.Router();
  

 
router.post('/signup', async (req, res) => {
	try {
		const { fullName, email, password } = req.body;
		if (!fullName || !email || !password) {
			return res.status(400).json({ message: 'fullName, email and password are required' });
		}

		const existing = await User.findOne({ email: email.toLowerCase().trim() });
		if (existing) {
			return res.status(409).json({ message: 'User already exists' });
		}

		const user = await User.create({ fullName, email, password });
		return res.status(201).json({
			id: user._id.toString(),
			fullName: user.fullName,
			email: user.email,
			role: user.role,
			createdAt: user.createdAt,
		});
	} catch (err) {
		console.error('Signup error:', err);
		return res.status(500).json({ message: 'Internal server error' });
	}
});

router.post('/signin', async (req, res) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			return res.status(400).json({ message: 'Email and password are required' });
		}

		const user = await User.findOne({ email: email.toLowerCase().trim() });
		if (!user) {
			return res.status(401).json({ message: 'user does not have an account' });
		}
 
		if (user.password !== password) {
			return res.status(401).json({ message: 'user does not have an account' });
		}

		return res.status(200).json({
			id: user._id.toString(),
			fullName: user.fullName,
			email: user.email,
			role: user.role,
			createdAt: user.createdAt,
		});
	} catch (err) {
		console.error('Signin error:', err);
		return res.status(500).json({ message: 'Internal server error' });
	}
});

module.exports = router;

