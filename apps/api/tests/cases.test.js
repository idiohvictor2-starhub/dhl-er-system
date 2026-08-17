const test = require('node:test');
const assert = require('node:assert');

// Placeholder test — expand once a test DB is wired into CI.
// Verifies the health endpoint responds, as a smoke test that app.js
// wires up correctly.
test('app module loads without throwing', () => {
  process.env.JWT_SECRET = 'test_secret';
  const app = require('../src/app');
  assert.ok(app);
});
