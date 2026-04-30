require('dotenv').config();
const app = require('./src/app');
const db = require('./src/config/database');
const redis = require('./src/config/redis');
const PORT = process.env.PORT || 3000;

// Test database connection
db.query('SELECT NOW()')
  .then(() => {
    console.log('Database connected successfully');
    if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
    }
  })
  .catch((err) => {
    console.error('Database connection failed:', err);
    process.exit(1);
  });

module.exports = app;