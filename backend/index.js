const express = require('express');
const cors = require('cors');
const { pool, runMigrations } = require('./db/database');

const app = express();
app.use(cors());
app.use(express.json());


// Health check route
app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.status(200).json({ status: 'ok' });
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
});

// Auth routes
const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

// Bike routes
const bikeRoutes = require('./routes/bikes');
app.use('/bikes', bikeRoutes);

const PORT = process.env.PORT || 5001;

// Run migrations before starting the server
runMigrations()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to run migrations or start server:', err);
    process.exit(1);
  });
