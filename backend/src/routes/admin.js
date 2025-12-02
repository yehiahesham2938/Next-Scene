const express = require('express');
const User = require('../models/User');
const Movie = require('../models/Movie');
const Watchlist = require('../models/Watchlist');

const router = express.Router();

// GET /api/admin/stats - Get admin dashboard statistics
router.get('/stats', async (req, res) => {
    try {
        // Get total users count
        const totalUsers = await User.countDocuments();

        // Get total movies count
        const totalMovies = await Movie.countDocuments();

        // Get total watchlists count (unique user-movie pairs)
        const totalWatchlists = await Watchlist.countDocuments();

        // Get admin users count
        const adminUsers = await User.countDocuments({ role: 'admin' });

        res.json({
            totalUsers,
            totalMovies,
            totalWatchlists,
            adminUsers
        });
    } catch (error) {
        console.error('Error fetching admin stats:', error);
        res.status(500).json({ message: 'Failed to fetch admin statistics' });
    }
});

// GET /api/admin/users - Get all users
router.get('/users', async (req, res) => {
    try {
        const users = await User.find()
            .select('-password') // Exclude password field
            .sort({ createdAt: -1 });

        // For each user, count their watchlists
        const usersWithWatchlistCount = await Promise.all(
            users.map(async (user) => {
                const watchlistCount = await Watchlist.countDocuments({ userId: user._id });
                return {
                    id: user._id,
                    fullName: user.fullName,
                    email: user.email,
                    role: user.role,
                    createdAt: user.createdAt,
                    watchlistCount
                };
            })
        );

        res.json(usersWithWatchlistCount);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Failed to fetch users' });
    }
});

// GET /api/admin/most-watchlisted - Get most added to watchlist movies
router.get('/most-watchlisted', async (req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit, 10) : 4;

        // Aggregate to count how many times each movie has been added to watchlists
        const mostWatchlisted = await Watchlist.aggregate([
            {
                $group: {
                    _id: '$movieId',
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            },
            {
                $limit: limit
            },
            {
                $lookup: {
                    from: 'movies',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'movie'
                }
            },
            {
                $unwind: '$movie'
            },
            {
                $project: {
                    _id: '$movie._id',
                    title: '$movie.title',
                    poster: '$movie.poster',
                    releaseYear: '$movie.releaseYear',
                    rating: '$movie.rating',
                    count: 1
                }
            }
        ]);

        res.json(mostWatchlisted);
    } catch (error) {
        console.error('Error fetching most watchlisted movies:', error);
        res.status(500).json({ message: 'Failed to fetch most watchlisted movies' });
    }
});

// GET /api/admin/genre-stats - Get movies per genre statistics
router.get('/genre-stats', async (req, res) => {
    try {
        const movies = await Movie.find().select('genre');

        // Count movies per genre
        const genreCounts = {};
        movies.forEach(movie => {
            if (movie.genre) {
                const genres = movie.genre.split(',').map(g => g.trim());
                genres.forEach(genre => {
                    if (genre) {
                        genreCounts[genre] = (genreCounts[genre] || 0) + 1;
                    }
                });
            }
        });

        // Sort by count and get top 5
        const sortedGenres = Object.entries(genreCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([genre, count]) => ({ genre, count }));

        res.json(sortedGenres);
    } catch (error) {
        console.error('Error fetching genre stats:', error);
        res.status(500).json({ message: 'Failed to fetch genre statistics' });
    }
});

module.exports = router;
