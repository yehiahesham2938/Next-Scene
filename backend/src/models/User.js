 const mongoose = require('mongoose');
 
const userSchema = new mongoose.Schema(
	{
		fullName: { type: String, required: true, trim: true },
		firstName: { type: String, trim: true },
		lastName: { type: String, trim: true },
		email: { type: String, required: true, unique: true, lowercase: true, trim: true },
		password: { type: String, required: true },
		dob: { type: Date },
		profilePicture: { type: String },
		role: { type: String, enum: ['user', 'admin'], default: 'user' },
	},
	{ timestamps: true }
);
 
 const User = mongoose.model('User', userSchema);
 
 module.exports = User;

