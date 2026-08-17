const repo = require('./dashboard.repository');

async function getSummary(req, res, next) {
  try {
    const [snapshot, overdue] = await Promise.all([repo.getSnapshot(), repo.getOverdueCount()]);
    res.json({ snapshot, overdue_count: overdue });
  } catch (err) {
    next(err);
  }
}

module.exports = { getSummary };
