const express = require('express');
const Movie = require('../models/Movie');

const router = express.Router();

// GET /api/movies?limit=4 -> list movies (optionally limited), newest first
router.get('/', async (req, res) => {
	try {
		const limit = req.query.limit ? parseInt(req.query.limit, 10) : undefined;

		let query = Movie.find().sort({ createdAt: -1 });
		if (!Number.isNaN(limit) && limit > 0) {
			query = query.limit(limit);
		}

		const movies = await query.exec();
		res.json(movies);
	} catch (error) {
		console.error('Error fetching movies:', error);
		res.status(500).json({ message: 'Failed to fetch movies' });
	}
});

// GET /api/movies/:id -> single movie by id
router.get('/:id', async (req, res) => {
	try {
		const movie = await Movie.findById(req.params.id).exec();
		if (!movie) {
			return res.status(404).json({ message: 'Movie not found' });
		}
		res.json(movie);
	} catch (error) {
		console.error('Error fetching movie by id:', error);
		res.status(500).json({ message: 'Failed to fetch movie' });
	}
});

module.exports = router;


