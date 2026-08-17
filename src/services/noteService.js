const fs = require('node:fs/promises');
const path = require('node:path');
const { createNote, createNoteId } = require('../models/noteModel');

const NOTES_FILE = path.resolve(__dirname, '../../notes.json');

class NoteService {
  /** Reads the JSON data file and protects callers from invalid storage data. */
  async readAll() {
    try {
      const data = await fs.readFile(NOTES_FILE, 'utf8');
      const notes = JSON.parse(data);
      if (!Array.isArray(notes)) throw new Error('notes.json must contain an array.');
      return notes;
    } catch (error) {
      if (error.code === 'ENOENT') {
        await this.writeAll([]);
        return [];
      }
      throw new Error(`Could not read notes data: ${error.message}`);
    }
  }

  /** Uses an atomic rename so a partial write cannot corrupt the data file. */
  async writeAll(notes) {
    const tempFile = `${NOTES_FILE}.tmp`;
    await fs.writeFile(tempFile, `${JSON.stringify(notes, null, 2)}\n`, 'utf8');
    await fs.rename(tempFile, NOTES_FILE);
  }

  validate(input) {
    const errors = {};
    if (!input.heading || !input.heading.trim()) errors.heading = 'Heading is required.';
    if (!input.description || !input.description.trim()) errors.description = 'Description is required.';
    if (!input.date || Number.isNaN(Date.parse(`${input.date}T00:00:00`))) errors.date = 'A valid date is required.';
    if (!input.time || !input.time.trim()) errors.time = 'Time is required.';
    return errors;
  }

  async list({ search = '', sort = 'newest' } = {}) {
    const notes = await this.readAll();
    const query = search.trim().toLowerCase();
    const activeNotes = notes.filter((note) => !note.isDeleted);
    const filtered = query
      ? activeNotes.filter((note) => `${note.heading} ${note.description}`.toLowerCase().includes(query))
      : activeNotes;

    return filtered.sort((a, b) => {
      const aDate = new Date(`${a.date}T00:00:00`).getTime();
      const bDate = new Date(`${b.date}T00:00:00`).getTime();
      return sort === 'oldest' ? aDate - bDate : bDate - aDate;
    });
  }

  async getById(id) {
    const note = (await this.readAll()).find((item) => item.id === id && !item.isDeleted);
    return note || null;
  }

  async add(input) {
    const errors = this.validate(input);
    if (Object.keys(errors).length) return { errors };
    const notes = await this.readAll();
    const note = createNote(input, createNoteId(notes));
    notes.push(note);
    await this.writeAll(notes);
    return { note };
  }

  async update(id, input) {
    const errors = this.validate(input);
    if (Object.keys(errors).length) return { errors };
    const notes = await this.readAll();
    const index = notes.findIndex((note) => note.id === id && !note.isDeleted);
    if (index === -1) return { notFound: true };
    const existing = notes[index];
    notes[index] = {
      ...existing,
      heading: input.heading.trim(),
      description: input.description.trim(),
      date: input.date,
      time: input.time.trim(),
      updatedAt: new Date().toISOString()
    };
    await this.writeAll(notes);
    return { note: notes[index] };
  }

  async softDelete(id) {
    const notes = await this.readAll();
    const index = notes.findIndex((note) => note.id === id && !note.isDeleted);
    if (index === -1) return { notFound: true };
    notes[index] = { ...notes[index], isDeleted: true, updatedAt: new Date().toISOString() };
    await this.writeAll(notes);
    return { note: notes[index] };
  }
}

module.exports = new NoteService();
