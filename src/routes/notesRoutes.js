const express = require('express');
const noteService = require('../services/noteService');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    res.json(await noteService.list({ search: req.query.search, sort: req.query.sort }));
  } catch (error) { next(error); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const note = await noteService.getById(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note not found.' });
    res.json(note);
  } catch (error) { next(error); }
});

router.post('/', async (req, res, next) => {
  try {
    const result = await noteService.add(req.body);
    if (result.errors) return res.status(422).json({ message: 'Please correct the fields below.', errors: result.errors });
    res.status(201).json(result.note);
  } catch (error) { next(error); }
});

router.put('/:id', async (req, res, next) => {
  try {
    const result = await noteService.update(req.params.id, req.body);
    if (result.notFound) return res.status(404).json({ message: 'Note not found.' });
    if (result.errors) return res.status(422).json({ message: 'Please correct the fields below.', errors: result.errors });
    res.json(result.note);
  } catch (error) { next(error); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const result = await noteService.softDelete(req.params.id);
    if (result.notFound) return res.status(404).json({ message: 'Note not found.' });
    res.json({ message: 'Note deleted.', note: result.note });
  } catch (error) { next(error); }
});

module.exports = router;
