const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { connectToDatabase } = require('./setup/db');
const authRouter = require('./routes/auth');
const moviesRouter = require('./routes/movies');
const adminRouter = require('./routes/admin');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
	res.json({ status: 'ok' });
});

app.use('/api/auth', authRouter);
app.use('/api/movies', moviesRouter);
app.use('/api/admin', adminRouter);

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

