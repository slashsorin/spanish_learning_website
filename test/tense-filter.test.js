const test = require('node:test');
const assert = require('node:assert/strict');
const { getAvailableTenses, buildQuestion } = require('../server');

test('getAvailableTenses returns the configured Spanish tense options', () => {
  const tenses = getAvailableTenses();
  assert.ok(tenses.length > 0);
  assert.ok(tenses.some((tense) => tense.value === 'present'));
  assert.ok(tenses.some((tense) => tense.value === 'subjunctive'));
});

test('buildQuestion returns a challenge from the selected tense set', () => {
  const question = buildQuestion(['future', 'subjunctive']);
  assert.ok(['future', 'subjunctive'].includes(question.tense));
  assert.ok(question.correctAnswer);
});
