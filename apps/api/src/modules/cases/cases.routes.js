const express = require('express');
const casesRepo = require('./cases.repository');
const { requireAuth } = require('../../middleware/auth');

const router = express.Router();

router.use(requireAuth);

router.get('/', async (req, res, next) => {
  try {
    const filters = req.query;
    const result = await casesRepo.findAll(filters, req.user);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const result = await casesRepo.findById(req.params.id);
    if (!result) return res.status(404).json({ error: 'Case not found' });
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const created = await casesRepo.create(req.body, req.user);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

router.post('/:id/stage', async (req, res, next) => {
  try {
    const { stage, notes } = req.body;
    if (!stage) return res.status(400).json({ error: 'Stage is required' });
    const updated = await casesRepo.transitionStage(req.params.id, stage, req.user, notes);
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

router.post('/:id/actions', async (req, res, next) => {
  try {
    const action = await casesRepo.addAction(req.params.id, req.body, req.user);
    res.status(201).json(action);
  } catch (err) {
    next(err);
  }
});

router.patch('/actions/:actionId', async (req, res, next) => {
  try {
    const { status } = req.body;
    const action = await casesRepo.toggleAction(req.params.actionId, status);
    res.json(action);
  } catch (err) {
    next(err);
  }
});

router.post('/:id/documents', async (req, res, next) => {
  try {
    const doc = await casesRepo.addDocument(req.params.id, req.body, req.user);
    res.status(201).json(doc);
  } catch (err) {
    next(err);
  }
});

router.post('/:id/communications', async (req, res, next) => {
  try {
    const comm = await casesRepo.addCommunication(req.params.id, req.body, req.user);
    res.status(201).json(comm);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
