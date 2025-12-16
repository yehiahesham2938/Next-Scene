const mongoose = require('mongoose');

const watchlistSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
        addedAt: { type: Date, default: Date.now },
        watched: { type: Boolean, default: false },
        watchedAt: { type: Date, default: null }
    },
    { timestamps: true }
);

// Create a compound index to prevent duplicate entries
watchlistSchema.index({ userId: 1, movieId: 1 }, { unique: true });

module.exports = mongoose.model('Watchlist', watchlistSchema);
