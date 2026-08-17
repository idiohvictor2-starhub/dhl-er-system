const express = require('express');
const controller = require('./cases.controller');
const { requireAuth } = require('../../middleware/auth');
const { requireRole } = require('../../middleware/requireRole');

const router = express.Router();

router.use(requireAuth);

router.get('/', controller.list);
router.get('/:id', controller.getOne);
router.post('/', requireRole('er_manager', 'line_manager'), controller.create);
router.patch('/:id', requireRole('er_manager', 'line_manager'), controller.update);
router.patch('/:id/stage', requireRole('er_manager', 'line_manager'), controller.transitionStage);

module.exports = router;
