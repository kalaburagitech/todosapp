/** @typedef {import('../types/note').Note} Note */

/**
 * Produces predictable human-readable note IDs, e.g. NOTE001.
 * IDs are never reused, including after a soft delete.
 * @param {Note[]} notes
 * @returns {string}
 */
function createNoteId(notes) {
  const largestId = notes.reduce((largest, note) => {
    const match = /^NOTE(\d+)$/.exec(note.id);
    return match ? Math.max(largest, Number(match[1])) : largest;
  }, 0);

  return `NOTE${String(largestId + 1).padStart(3, '0')}`;
}

/**
 * Shapes a persisted note. The service has already validated user input.
 * @param {{heading: string, description: string, date: string, time: string}} input
 * @param {string} id
 * @returns {Note}
 */
function createNote(input, id) {
  const timestamp = new Date().toISOString();
  return {
    id,
    heading: input.heading.trim(),
    description: input.description.trim(),
    date: input.date,
    time: input.time.trim(),
    createdAt: timestamp,
    updatedAt: timestamp,
    isDeleted: false
  };
}

module.exports = { createNoteId, createNote };
