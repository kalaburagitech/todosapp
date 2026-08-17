# Notespace

A modern, responsive notes and to-do application backed by a local `notes.json` file. Notes are soft-deleted so their records remain available in the file.

## Quick start

1. Install Node.js 18 or later.
2. Run `npm install`.
3. Run `npm start`.
4. Open `http://localhost:3000`.

For development with automatic server restarts, run `npm run dev`.

## Project structure

```
public/                 Responsive browser UI
  index.html
  styles.css
  app.js
src/
  models/noteModel.js   Note factory and unique ID generator
  routes/notesRoutes.js HTTP API endpoints
  services/noteService.js Validation and JSON persistence
  types/note.js         Note data-shape documentation
  server.js             Express application entry point
notes.json              Persistent application data
```

## API

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/api/notes?search=&sort=newest` | List active notes, with search and date sort |
| GET | `/api/notes/:id` | Read one active note |
| POST | `/api/notes` | Create a note |
| PUT | `/api/notes/:id` | Update a note |
| DELETE | `/api/notes/:id` | Soft-delete a note |

Create and update requests require `heading`, `description`, `date` (`YYYY-MM-DD`), and `time`. New IDs are generated as `NOTE001`, `NOTE002`, and so on. Every update, including soft deletion, refreshes `updatedAt`.

## Data safety

The service writes to a temporary JSON file and atomically renames it to `notes.json`, reducing the chance of corrupting data if a write is interrupted.
