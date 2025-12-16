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

// DELETE /api/watchlist/remove - Remove from watchlist by userId and movieId
// IMPORTANT: This route must come BEFORE /:id to avoid route conflicts
router.delete('/remove', async (req, res) => {
    try {
        // Accept from either body or query params (DELETE requests sometimes don't support body)
        const userId = req.body.userId || req.query.userId;
        const movieId = req.body.movieId || req.query.movieId;
        
        console.log('DELETE /api/watchlist/remove called with:', { 
            body: req.body, 
            query: req.query, 
            userId, 
            movieId 
        });
        
        if (!userId || !movieId) {
            console.log('Missing userId or movieId');
            return res.status(400).json({ message: 'User ID and Movie ID required' });
        }

        console.log('Searching for watchlist item:', { userId, movieId });
        const item = await Watchlist.findOne({ userId, movieId });
        
        if (!item) {
            console.log('Watchlist item not found');
            // Let's also check what items exist for this user
            const userItems = await Watchlist.find({ userId }).populate('movieId');
            console.log('User watchlist items:', userItems.map(i => ({ id: i._id, movieId: i.movieId?._id, movieTitle: i.movieId?.title })));
            return res.status(404).json({ message: 'Watchlist item not found', userId, movieId });
        }

        console.log('Found item to delete:', item);
        await Watchlist.findByIdAndDelete(item._id);
        console.log('Successfully deleted watchlist item');
        res.json({ message: 'Removed from watchlist', success: true });
    } catch (error) {
        console.error('Error removing from watchlist:', error);
        res.status(500).json({ message: 'Failed to remove from watchlist', error: error.message });
    }
});

// DELETE /api/watchlist/:id - Remove from watchlist by watchlist item ID
// IMPORTANT: This route must come AFTER /remove to avoid conflicts
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.query;
        
        if (!userId) {
            return res.status(400).json({ message: 'User ID required' });
        }

        // Verify the item belongs to the user before deleting
        const item = await Watchlist.findOne({ _id: id, userId });
        if (!item) {
            return res.status(404).json({ message: 'Watchlist item not found' });
        }

        await Watchlist.findByIdAndDelete(id);
        res.json({ message: 'Removed from watchlist' });
    } catch (error) {
        console.error('Error removing from watchlist:', error);
        res.status(500).json({ message: 'Failed to remove from watchlist' });
    }
});

// PATCH /api/watchlist/watched - Mark movie as watched/unwatched
router.patch('/watched', async (req, res) => {
    try {
        const { userId, movieId, watched } = req.body;
        
        if (!userId || !movieId) {
            return res.status(400).json({ message: 'User ID and Movie ID required' });
        }

        const item = await Watchlist.findOne({ userId, movieId });
        if (!item) {
            return res.status(404).json({ message: 'Watchlist item not found' });
        }

        // If watched boolean is provided, use it; otherwise toggle current state
        item.watched = watched !== undefined ? watched : !item.watched;
        
        if (item.watched) {
            item.watchedAt = new Date();
        } else {
            item.watchedAt = null;
        }
        
        await item.save();
        
        const populated = await Watchlist.findById(item._id).populate('movieId');
        res.json(populated);
    } catch (error) {
        console.error('Error updating watched status:', error);
        res.status(500).json({ message: 'Failed to update watched status' });
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

