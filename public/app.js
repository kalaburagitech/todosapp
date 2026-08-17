const state = { notes: [], pendingDeleteId: null, search: '', sort: 'newest' };
const $ = (selector) => document.querySelector(selector);
const list = $('#notes-list');
const noteDialog = $('#note-dialog');
const deleteDialog = $('#delete-dialog');

const formatDate = (date) => new Intl.DateTimeFormat(undefined, { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(`${date}T00:00:00`));
const formatTimestamp = (timestamp) => new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(timestamp));

async function request(url, options) {
  const response = await fetch(url, options);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) { const error = new Error(data.message || 'Request failed.'); error.details = data.errors; throw error; }
  return data;
}

function renderNotes() {
  list.replaceChildren();
  $('#note-count').textContent = state.notes.length ? `${state.notes.length} active ${state.notes.length === 1 ? 'note' : 'notes'}` : '';
  if (!state.notes.length) {
    list.innerHTML = `<div class="empty-state"><div class="empty-icon">✦</div><h2>${state.search ? 'No matching notes' : 'Nothing here yet'}</h2><p>${state.search ? 'Try another search term.' : 'Your next thought belongs here.'}</p>${state.search ? '' : '<button class="primary-button" type="button" id="empty-new-note">Create a note</button>'}</div>`;
    $('#empty-new-note')?.addEventListener('click', openNewDialog); return;
  }
  const template = $('#note-template');
  state.notes.forEach((note) => {
    const card = template.content.cloneNode(true);
    card.querySelector('.note-date').textContent = formatDate(note.date);
    card.querySelector('.note-heading').textContent = note.heading;
    card.querySelector('.note-description').textContent = note.description;
    card.querySelector('.note-time').textContent = note.time;
    card.querySelector('.timestamps').textContent = `Created ${formatTimestamp(note.createdAt)} · Edited ${formatTimestamp(note.updatedAt)}`;
    card.querySelector('.edit-button').addEventListener('click', () => openEditDialog(note));
    card.querySelector('.delete-button').addEventListener('click', () => { state.pendingDeleteId = note.id; deleteDialog.showModal(); });
    list.append(card);
  });
}

async function loadNotes() {
  list.innerHTML = '<div class="status-state">Loading your notes…</div>';
  try { state.notes = await request(`/api/notes?search=${encodeURIComponent(state.search)}&sort=${state.sort}`); renderNotes(); }
  catch (error) { $('#note-count').textContent = ''; list.innerHTML = `<div class="status-state">Could not load notes. <button class="retry-button" type="button">Try again</button></div>`; list.querySelector('button').addEventListener('click', loadNotes); }
}

function clearErrors() { ['heading','description','date','time'].forEach((name) => { $(`#${name}-error`).textContent = ''; }); $('#form-message').textContent = ''; }
function openNewDialog() { $('#note-form').reset(); $('#note-id').value = ''; $('#form-title').textContent = 'New note'; $('#save-button').textContent = 'Save note'; clearErrors(); $('#date').value = new Date().toISOString().slice(0,10); noteDialog.showModal(); $('#heading').focus(); }
function openEditDialog(note) { $('#note-id').value = note.id; $('#heading').value = note.heading; $('#description').value = note.description; $('#date').value = note.date; $('#time').value = note.time; $('#form-title').textContent = 'Edit note'; $('#save-button').textContent = 'Save changes'; clearErrors(); noteDialog.showModal(); $('#heading').focus(); }
function showErrors(errors = {}) { Object.entries(errors).forEach(([field, text]) => { const node = $(`#${field}-error`); if (node) node.textContent = text; }); }

$('#new-note-button').addEventListener('click', openNewDialog);
$('#close-dialog').addEventListener('click', () => noteDialog.close()); $('#cancel-button').addEventListener('click', () => noteDialog.close());
$('#note-form').addEventListener('submit', async (event) => { event.preventDefault(); clearErrors(); const form = event.currentTarget; const payload = Object.fromEntries(new FormData(form)); const id = $('#note-id').value; const save = $('#save-button'); save.disabled = true; save.textContent = 'Saving…';
  try { await request(id ? `/api/notes/${id}` : '/api/notes', { method: id ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }); noteDialog.close(); await loadNotes(); }
  catch (error) { showErrors(error.details); $('#form-message').textContent = error.message; }
  finally { save.disabled = false; save.textContent = id ? 'Save changes' : 'Save note'; }
});
$('#keep-button').addEventListener('click', () => deleteDialog.close());
$('#confirm-delete-button').addEventListener('click', async () => { const button = $('#confirm-delete-button'); button.disabled = true; button.textContent = 'Deleting…'; try { await request(`/api/notes/${state.pendingDeleteId}`, { method: 'DELETE' }); deleteDialog.close(); await loadNotes(); } catch (error) { alert(error.message); } finally { button.disabled = false; button.textContent = 'Delete note'; } });
let searchTimer; $('#search-input').addEventListener('input', (event) => { clearTimeout(searchTimer); searchTimer = setTimeout(() => { state.search = event.target.value; loadNotes(); }, 250); }); $('#sort-select').addEventListener('change', (event) => { state.sort = event.target.value; loadNotes(); });
loadNotes();
