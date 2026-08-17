const express = require('express');
const path = require('node:path');
const notesRoutes = require('./routes/notesRoutes');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/api/notes', notesRoutes);
app.use(express.static(path.join(__dirname, '../public')));

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ message: 'Something went wrong while handling your notes.' });
});

app.listen(port, () => console.log(`Notes app ready at http://localhost:${port}`));
