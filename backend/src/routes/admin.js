const express = require('express');
const User = require('../models/User');
const Movie = require('../models/Movie');
const Watchlist = require('../models/Watchlist');

const router = express.Router();

// GET /api/admin/stats - Get admin dashboard statistics
router.get('/stats', async(req, res) => {
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
router.get('/users', async(req, res) => {
    try {
        const users = await User.find()
            .select('-password') // Exclude password field
            .sort({ createdAt: -1 });

        // For each user, count their watchlists
        const usersWithWatchlistCount = await Promise.all(
            users.map(async(user) => {
                const watchlistCount = await Watchlist.countDocuments({ userId: user._id });
                return {
                    id: user._id,
                    fullName: user.fullName,
                    email: user.email,
                    role: user.role,
                    createdAt: user.createdAt,
                    lastActivity: user.updatedAt,
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
router.get('/most-watchlisted', async(req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit, 10) : 4;

        // Aggregate to count how many times each movie has been added to watchlists
        const mostWatchlisted = await Watchlist.aggregate([{
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
router.get('/genre-stats', async(req, res) => {
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

// DELETE /api/admin/users/:id - Delete a user
router.delete('/users/:id', async(req, res) => {
    try {
        const userId = req.params.id;
        await User.findByIdAndDelete(userId);
        // Also delete associated watchlists
        await Watchlist.deleteMany({ userId: userId });
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Failed to delete user' });
    }
});

// PATCH /api/admin/users/:id/role - Update user role
router.patch('/users/:id/role', async(req, res) => {
    try {
        const userId = req.params.id;
        const { role } = req.body;

        if (!['user', 'admin'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role' });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId, { role }, { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(updatedUser);
    } catch (error) {
        console.error('Error updating user role:', error);
        res.status(500).json({ message: 'Failed to update user role' });
    }
});

// GET /api/admin/user-growth - Get user growth statistics (users per month)
router.get('/user-growth', async(req, res) => {
    try {
        const userGrowth = await User.aggregate([{
                $group: {
                    _id: {
                        month: { $month: "$createdAt" },
                        year: { $year: "$createdAt" }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1 }
            }
        ]);

        // Format data for chart (e.g., "Jan 2023")
        const formattedGrowth = userGrowth.map(item => {
            const date = new Date(item._id.year, item._id.month - 1);
            return {
                label: date.toLocaleString('default', { month: 'short', year: 'numeric' }),
                count: item.count
            };
        });

        res.json(formattedGrowth);
    } catch (error) {
        console.error('Error fetching user growth stats:', error);
        res.status(500).json({ message: 'Failed to fetch user growth statistics' });
    }
});

// GET /api/admin/user-activity - Get user activity statistics
router.get('/user-activity', async(req, res) => {
    try {
        const now = new Date();
        const last24Hours = new Date(now - 24 * 60 * 60 * 1000);
        const last7Days = new Date(now - 7 * 24 * 60 * 60 * 1000);
        const last30Days = new Date(now - 30 * 24 * 60 * 60 * 1000);

        // Count active users in different timeframes (using updatedAt as last activity)
        const activeIn24Hours = await User.countDocuments({ updatedAt: { $gte: last24Hours } });
        const activeIn7Days = await User.countDocuments({ updatedAt: { $gte: last7Days } });
        const activeIn30Days = await User.countDocuments({ updatedAt: { $gte: last30Days } });

        const dailyActivity = await User.aggregate([{
                $match: {
                    updatedAt: { $gte: last7Days }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        // Format daily activity for chart
        const formattedActivity = dailyActivity.map(item => ({
            date: item._id,
            count: item.count
        }));

        res.json({
            activeIn24Hours,
            activeIn7Days,
            activeIn30Days,
            dailyActivity: formattedActivity
        });
    } catch (error) {
        console.error('Error fetching user activity stats:', error);
        res.status(500).json({ message: 'Failed to fetch user activity statistics' });
    }
});

// POST /api/admin/movies - Add a new movie
router.post('/movies', async (req, res) => {
    try {
        const { title, director, releaseYear, runtime, genre, rating, poster, trailerUrl, description, mainCast } = req.body;

        // Validate required fields
        if (!title || !director || !releaseYear || !genre || !description) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const newMovie = new Movie({
            title,
            director,
            releaseYear,
            runtime,
            genre,
            rating,
            poster,
            trailerUrl,
            description,
            mainCast: mainCast || ''
        });

        await newMovie.save();
        res.status(201).json({ message: 'Movie added successfully', movie: newMovie });
    } catch (error) {
        console.error('Error adding movie:', error);
        res.status(500).json({ message: 'Failed to add movie', error: error.message });
    }
});

// PUT /api/admin/movies/:id - Update a movie
router.put('/movies/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const updatedMovie = await Movie.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedMovie) {
            return res.status(404).json({ message: 'Movie not found' });
        }

        res.json({ message: 'Movie updated successfully', movie: updatedMovie });
    } catch (error) {
        console.error('Error updating movie:', error);
        res.status(500).json({ message: 'Failed to update movie', error: error.message });
    }
});

// DELETE /api/admin/movies/:id - Delete a movie
router.delete('/movies/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const deletedMovie = await Movie.findByIdAndDelete(id);

        if (!deletedMovie) {
            return res.status(404).json({ message: 'Movie not found' });
        }

        // Also remove from all watchlists
        await Watchlist.deleteMany({ movieId: id });

        res.json({ message: 'Movie deleted successfully' });
    } catch (error) {
        console.error('Error deleting movie:', error);
        res.status(500).json({ message: 'Failed to delete movie', error: error.message });
    }
});

// PATCH /api/admin/users/:id/role - Update user role (toggle admin)
router.patch('/users/:id/role', async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        if (!role || (role !== 'admin' && role !== 'user')) {
            return res.status(400).json({ message: 'Valid role required (admin or user)' });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.role = role;
        await user.save();

        res.json({ message: 'User role updated successfully', user: { id: user._id, role: user.role } });
    } catch (error) {
        console.error('Error updating user role:', error);
        res.status(500).json({ message: 'Failed to update user role', error: error.message });
    }
});

// DELETE /api/admin/users/:id - Delete a user account
router.delete('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Delete user's watchlist entries
        await Watchlist.deleteMany({ userId: id });

        // Delete the user
        await User.findByIdAndDelete(id);

        res.json({ message: 'User account deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Failed to delete user', error: error.message });
    }
});

module.exports = router;