const test = require('node:test');
const assert = require('node:assert/strict');
const handler = require('../api/question');

test('handler returns JSON for a normal request', async () => {
  const req = { query: {} };
  const res = {
    headers: {},
    statusCode: 200,
    setHeader(name, value) {
      this.headers[name] = value;
    },
    end(body) {
      this.body = body;
    }
  };

  await handler(req, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.headers['Content-Type'], 'application/json');

  const payload = JSON.parse(res.body);
  assert.ok(payload.prompt);
  assert.ok(payload.correctAnswer);
});
