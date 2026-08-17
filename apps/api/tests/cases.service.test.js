// Minimal example test — run with: npm run test --workspace=apps/api
// Extend this with real DB-backed tests (e.g. against a throwaway test
// database in CI) as the Cases module grows.
const test = require('node:test');
const assert = require('node:assert');

test('placeholder: case_type validation shape', () => {
  const CASE_TYPES = ['grievance', 'disciplinary', 'union'];
  assert.ok(CASE_TYPES.includes('grievance'));
  assert.strictEqual(CASE_TYPES.length, 3);
});
