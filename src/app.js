const express = require('express');
const path = require('node:path');
const notesRoutes = require('./routes/notesRoutes');

/**
 * Shared Express application.
 * Exporting the app lets Vercel invoke it as a Serverless Function, while the
 * local server entry point can still listen on a port during development.
 */
const app = express();

app.use(express.json());
app.use('/api/notes', notesRoutes);
app.use(express.static(path.join(__dirname, '../public')));

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ message: 'Something went wrong while handling your notes.' });
});

module.exports = app;
