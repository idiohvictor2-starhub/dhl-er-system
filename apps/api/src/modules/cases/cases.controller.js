const service = require('./cases.service');

async function list(req, res, next) {
  try {
    const cases = await service.listCases(req.user, req.query);
    res.json(cases);
  } catch (err) {
    next(err);
  }
}

async function getOne(req, res, next) {
  try {
    const found = await service.getCase(req.params.id);
    res.json(found);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const created = await service.createCase(req.body, req.user.id);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const updated = await service.updateCase(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

async function transitionStage(req, res, next) {
  try {
    const updated = await service.moveStage(req.params.id, req.body.stage, req.user.id);
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

module.exports = { list, getOne, create, update, transitionStage };
