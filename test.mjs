// Run with: node test.mjs
import assert from 'node:assert/strict';
import { norm, dayKey, dayNumber, pickPrompts, score } from './game.js';

assert.equal(norm('  The Cancún! '), 'cancun');
assert.equal(norm('A tire'), 'tire');
assert.equal(norm('Ask your   mother'), 'ask your mother');
assert.equal(norm('!!!'), '');

assert.equal(dayKey('UTC', new Date('2026-11-23T23:30:00Z')), '2026-11-23');
assert.equal(dayKey('Europe/Amsterdam', new Date('2026-11-23T23:30:00Z')), '2026-11-24');
assert.equal(dayNumber('2026-11-23', '2026-11-23'), 1);
assert.equal(dayNumber('2026-11-23', '2027-03-30'), 128); // across a DST change

const lines = Array.from({ length: 15 }, (_, i) => `p${i}`);
assert.deepEqual(pickPrompts(lines, 1), ['p0', 'p1', 'p2', 'p3', 'p4', 'p5', 'p6']);
assert.deepEqual(pickPrompts(lines, 2)[0], 'p7');
assert.deepEqual(pickPrompts(lines, 3)[0], 'p0'); // only 2 full sets, starts over

const { prompts, totals } = score([
  { idx: 0, prompt: 'Q', answer: 'Cancún', name: 'Mom' },
  { idx: 0, prompt: 'Q', answer: 'cancun', name: 'Dad' },
  { idx: 0, prompt: 'Q', answer: 'The bear campsite', name: 'Sofi' },
  { idx: 1, prompt: 'R', answer: 'Coffee', name: 'Mom' },
  { idx: 1, prompt: 'R', answer: 'coffee', name: 'Dad' },
  { idx: 1, prompt: 'R', answer: 'Coffee!', name: 'Sofi' },
]);
assert.deepEqual(prompts[0].groups.map(g => g.who.length), [2, 1]);
assert.deepEqual(totals, { Mom: 3, Dad: 3, Sofi: 4 });

console.log('All checks passed');
