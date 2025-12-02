const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema(
	{
		title: String,
		director: String,
		releaseYear: String,
		runtime: Number,
		genre: String,
		rating: Number,
		poster: String,
		trailerUrl: String,
		description: String,
		mainCast: String,
		source: String,
		createdAt: {
			type: Date,
			default: Date.now,
		},
	},
	{
		collection: 'movies',
	}
);

module.exports = mongoose.model('Movie', movieSchema);


