 const express = require('express');
 const User = require('../models/User');
 
 const router = express.Router();

// Server-side password validation: starts with uppercase, min 8 chars, includes special char
const validatePassword = (password) => {
	if (!password || typeof password !== 'string') return { valid: false, message: 'Password is required' };
	if (password.length < 8) return { valid: false, message: 'Password must be at least 8 characters' };
	if (!/^[A-Z]/.test(password)) return { valid: false, message: 'Password must begin with an uppercase letter' };
	if (!/[^A-Za-z0-9]/.test(password)) return { valid: false, message: 'Password must include at least one special character' };
	return { valid: true };
};
  

 
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

		const pwdCheck = validatePassword(password);
		if (!pwdCheck.valid) {
			return res.status(400).json({ message: pwdCheck.message });
		}

		const user = await User.create({ fullName, email, password });
		return res.status(201).json({
			id: user._id.toString(),
			fullName: user.fullName,
			firstName: user.firstName,
			lastName: user.lastName,
			email: user.email,
			dob: user.dob,
			profilePicture: user.profilePicture,
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
			firstName: user.firstName,
			lastName: user.lastName,
			email: user.email,
			dob: user.dob,
			profilePicture: user.profilePicture,
			role: user.role,
			createdAt: user.createdAt,
		});
	} catch (err) {
		console.error('Signin error:', err);
		return res.status(500).json({ message: 'Internal server error' });
	}
});

// PUT /api/auth/profile - Update user profile
router.put('/profile', async (req, res) => {
	try {
		const { userId, firstName, lastName, dob, profilePicture, email } = req.body;
		
		if (!userId) {
			return res.status(400).json({ message: 'User ID is required' });
		}

		const updateData = {};
		if (firstName !== undefined) updateData.firstName = firstName.trim();
		if (lastName !== undefined) updateData.lastName = lastName.trim();
		if (dob !== undefined) updateData.dob = dob;
		if (profilePicture !== undefined) updateData.profilePicture = profilePicture;
		if (email !== undefined) updateData.email = email.toLowerCase().trim();

		const user = await User.findByIdAndUpdate(
			userId,
			updateData,
			{ new: true, runValidators: true }
		);

		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}

		return res.status(200).json({
			id: user._id.toString(),
			fullName: user.fullName,
			firstName: user.firstName,
			lastName: user.lastName,
			email: user.email,
			dob: user.dob,
			profilePicture: user.profilePicture,
			role: user.role,
			createdAt: user.createdAt,
		});
	} catch (err) {
		console.error('Profile update error:', err);
		return res.status(500).json({ message: 'Internal server error' });
	}
});

// PUT /api/auth/password - Update user password
router.put('/password', async (req, res) => {
	try {
		const { userId, currentPassword, newPassword } = req.body;
		
		if (!userId || !currentPassword || !newPassword) {
			return res.status(400).json({ message: 'User ID, current password, and new password are required' });
		}

		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}

		if (user.password !== currentPassword) {
			return res.status(401).json({ message: 'Current password is incorrect' });
		}

		const pwdCheck = validatePassword(newPassword);
		if (!pwdCheck.valid) {
			return res.status(400).json({ message: pwdCheck.message });
		}

		user.password = newPassword;
		await user.save();

		return res.status(200).json({ message: 'Password updated successfully' });
	} catch (err) {
		console.error('Password update error:', err);
		return res.status(500).json({ message: 'Internal server error' });
	}
});

module.exports = router;

