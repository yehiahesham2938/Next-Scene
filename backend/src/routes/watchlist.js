const express = require('express');
const Watchlist = require('../models/Watchlist');
const Movie = require('../models/Movie');
const User = require('../models/User');

const router = express.Router();

// GET /api/watchlist - Get user's watchlist
router.get('/', async (req, res) => {
    try {
        const userId = req.query.userId; // Get from query or session
        if (!userId) {
            return res.status(401).json({ message: 'User ID required' });
        }

        const watchlistItems = await Watchlist.find({ userId })
            .populate('movieId')
            .sort({ addedAt: -1 });

        res.json(watchlistItems);
    } catch (error) {
        console.error('Error fetching watchlist:', error);
        res.status(500).json({ message: 'Failed to fetch watchlist' });
    }
});

// POST /api/watchlist - Add movie to watchlist
router.post('/', async (req, res) => {
    try {
        const { userId, movieId } = req.body;
        
        if (!userId || !movieId) {
            return res.status(400).json({ message: 'User ID and Movie ID required' });
        }

        // Check if already exists
        const existing = await Watchlist.findOne({ userId, movieId });
        if (existing) {
            return res.status(400).json({ message: 'Movie already in watchlist' });
        }

        const watchlistItem = new Watchlist({ userId, movieId });
        await watchlistItem.save();
        
        const populated = await Watchlist.findById(watchlistItem._id).populate('movieId');
        res.status(201).json(populated);
    } catch (error) {
        console.error('Error adding to watchlist:', error);
        res.status(500).json({ message: 'Failed to add to watchlist' });
    }
});

// DELETE /api/watchlist/:id - Remove from watchlist
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.query; // Verify ownership
        
        const item = await Watchlist.findById(id);
        if (!item) {
            return res.status(404).json({ message: 'Watchlist item not found' });
        }

        if (item.userId.toString() !== userId) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        await Watchlist.findByIdAndDelete(id);
        res.json({ message: 'Removed from watchlist' });
    } catch (error) {
        console.error('Error removing from watchlist:', error);
        res.status(500).json({ message: 'Failed to remove from watchlist' });
    }
});

// GET /api/watchlist/search - Search watchlist
router.get('/search', async (req, res) => {
    try {
        const { userId, query } = req.query;
        if (!userId) {
            return res.status(401).json({ message: 'User ID required' });
        }

        const watchlistItems = await Watchlist.find({ userId })
            .populate('movieId')
            .sort({ addedAt: -1 });

        // Filter by search query (title, year)
        let filtered = watchlistItems;
        if (query) {
            const searchLower = query.toLowerCase();
            filtered = watchlistItems.filter(item => {
                const movie = item.movieId;
                if (!movie) return false;
                const titleMatch = movie.title?.toLowerCase().includes(searchLower);
                const yearMatch = movie.releaseYear?.toString().includes(query);
                return titleMatch || yearMatch;
            });
        }

        res.json(filtered);
    } catch (error) {
        console.error('Error searching watchlist:', error);
        res.status(500).json({ message: 'Failed to search watchlist' });
    }
});

module.exports = router;

