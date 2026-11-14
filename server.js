const express = require('express');
const path = require('path');
const studentRoutes = require('./routes/students');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware: parse JSON request bodies
app.use(express.json());

// Serve the frontend (public/index.html) at /
app.use(express.static(path.join(__dirname, 'public')));

// Mount student routes
app.use('/students', studentRoutes);

// 404 handler for unknown routes
app.use((req, res, next) => {
  res.status(404).json({ success: false, error: `Route ${req.method} ${req.originalUrl} not found` });
});

// Error-handling middleware (must have 4 params)
app.use((err, req, res, next) => {
  // Malformed JSON in request body
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ success: false, error: 'Invalid JSON in request body' });
  }
  console.error(err);
  res.status(err.status || 500).json({ success: false, error: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
