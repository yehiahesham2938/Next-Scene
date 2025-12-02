const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { connectToDatabase } = require('./setup/db');
const authRouter = require('./routes/auth');
const moviesRouter = require('./routes/movies');
const adminRouter = require('./routes/admin');
const watchlistRouter = require('./routes/watchlist');

const app = express();

app.use(cors());
// Increase body size limit to handle base64 images (10MB)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.get('/health', (req, res) => {
	res.json({ status: 'ok' });
});

app.use('/api/auth', authRouter);
app.use('/api/movies', moviesRouter);
app.use('/api/admin', adminRouter);
app.use('/api/watchlist', watchlistRouter);

const port = process.env.PORT || 4000;

connectToDatabase()
	.then(() => {
		app.listen(port, () => {
			console.log(`Backend server listening on http://localhost:${port}`);
		});
	})
	.catch((error) => {
		console.error('Failed to start server due to DB connection error:', error);
		process.exit(1);
	});

