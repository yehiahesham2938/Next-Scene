const express = require('express');
const Movie = require('../models/Movie');

const router = express.Router();

// GET /api/movies/search?q=<query> -> search movies
router.get('/search', async (req, res) => {
	try {
		const query = req.query.q;
		
		if (!query || query.trim() === '') {
			return res.json([]);
		}

		// Search in title, director, genre, and description
		const movies = await Movie.find({
			$or: [
				{ title: { $regex: query, $options: 'i' } },
				{ director: { $regex: query, $options: 'i' } },
				{ genre: { $regex: query, $options: 'i' } },
				{ description: { $regex: query, $options: 'i' } }
			]
		}).sort({ createdAt: -1 });

		res.json(movies);
	} catch (error) {
		console.error('Error searching movies:', error);
		res.status(500).json({ message: 'Failed to search movies' });
	}
});

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

// POST /api/movies -> create a new movie
router.post('/', async (req, res) => {
	try {
		const {
			title,
			director,
			releaseYear,
			runtime,
			genre,
			rating,
			poster,
			trailerUrl,
			description,
			mainCast
		} = req.body;

		console.log('Received movie data:', {
			title,
			director,
			releaseYear,
			genre,
			hasPoster: !!poster,
			posterSize: poster ? poster.length : 0
		});

		// Basic validation
		if (!title || !director || !releaseYear || !genre) {
			return res.status(400).json({ 
				message: 'Missing required fields',
				missing: {
					title: !title,
					director: !director,
					releaseYear: !releaseYear,
					genre: !genre
				}
			});
		}

		const newMovie = new Movie({
			title: title.trim(),
			director: director.trim(),
			releaseYear: String(releaseYear).trim(),
			runtime: runtime ? parseInt(runtime) : undefined,
			genre: genre.trim(),
			rating: rating ? parseFloat(rating) : undefined,
			poster: poster || undefined,
			trailerUrl: trailerUrl ? trailerUrl.trim() : undefined,
			description: description ? description.trim() : undefined,
			mainCast: mainCast ? mainCast.trim() : undefined,
			source: 'local' // Mark as locally added
		});

		const savedMovie = await newMovie.save();
		console.log('Movie saved successfully:', savedMovie._id);
		res.status(201).json(savedMovie);
	} catch (error) {
		console.error('Error creating movie:', error);
		// Return more detailed error message
		if (error.name === 'ValidationError') {
			return res.status(400).json({ 
				message: error.message || 'Validation error',
				errors: error.errors
			});
		}
		res.status(500).json({ 
			message: error.message || 'Failed to create movie',
			error: process.env.NODE_ENV === 'development' ? error.stack : undefined
		});
	}
});

// PUT /api/movies/:id -> update a movie
router.put('/:id', async (req, res) => {
	try {
		const { id } = req.params;
		const {
			title,
			director,
			releaseYear,
			runtime,
			genre,
			rating,
			poster,
			trailerUrl,
			description,
			mainCast
		} = req.body;

		const movie = await Movie.findById(id);
		if (!movie) {
			return res.status(404).json({ message: 'Movie not found' });
		}

		// Update fields
		if (title !== undefined) movie.title = title.trim();
		if (director !== undefined) movie.director = director.trim();
		if (releaseYear !== undefined) movie.releaseYear = String(releaseYear).trim();
		if (runtime !== undefined) movie.runtime = runtime ? parseInt(runtime) : undefined;
		if (genre !== undefined) movie.genre = genre.trim();
		if (rating !== undefined) movie.rating = rating ? parseFloat(rating) : undefined;
		if (poster !== undefined) movie.poster = poster || undefined;
		if (trailerUrl !== undefined) movie.trailerUrl = trailerUrl ? trailerUrl.trim() : undefined;
		if (description !== undefined) movie.description = description ? description.trim() : undefined;
		if (mainCast !== undefined) movie.mainCast = mainCast ? mainCast.trim() : undefined;

		const updatedMovie = await movie.save();
		console.log('Movie updated successfully:', updatedMovie._id);
		res.json(updatedMovie);
	} catch (error) {
		console.error('Error updating movie:', error);
		if (error.name === 'ValidationError') {
			return res.status(400).json({ 
				message: error.message || 'Validation error',
				errors: error.errors
			});
		}
		res.status(500).json({ message: error.message || 'Failed to update movie' });
	}
});

// DELETE /api/movies/:id -> delete a movie
router.delete('/:id', async (req, res) => {
	try {
		const { id } = req.params;
		
		const movie = await Movie.findById(id);
		if (!movie) {
			return res.status(404).json({ message: 'Movie not found' });
		}

		await Movie.findByIdAndDelete(id);
		console.log('Movie deleted successfully:', id);
		res.json({ message: 'Movie deleted successfully' });
	} catch (error) {
		console.error('Error deleting movie:', error);
		res.status(500).json({ message: error.message || 'Failed to delete movie' });
	}
});

module.exports = router;


