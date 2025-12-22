const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { connectToDatabase } = require('./setup/db');
const authRouter = require('./routes/auth');
const moviesRouter = require('./routes/movies');
const adminRouter = require('./routes/admin');
const watchlistRouter = require('./routes/watchlist');

const app = express();

const corsOptions = {
  origin: [
    'http://localhost:5173',
    'https://your-vercel-url.vercel.app'  // Replace with your actual Vercel URL
  ],
  credentials: true
};

app.use(cors(corsOptions));
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
const host = process.env.HOST || '0.0.0.0';

// Connect to database immediately
connectToDatabase()
	.then(() => {
		console.log('Database connected successfully');
		// Start server after DB connection
		app.listen(port, host, () => {
			console.log(`Backend server listening on http://${host}:${port}`);
		});
	})
	.catch((error) => {
		console.error('Failed to connect to database:', error);
		process.exit(1);
	});

module.exports = app;

