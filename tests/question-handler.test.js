const test = require('node:test');
const assert = require('node:assert/strict');
const apiHandler = require('../api/question');
const serverHandler = require('../server');
const { buildQuestion } = require('../lib/questions');

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

  await apiHandler(req, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.headers['Content-Type'], 'application/json');

  const payload = JSON.parse(res.body);
  assert.ok(payload.prompt);
  assert.ok(payload.correctAnswer);
});

test('buildQuestion returns an English translation for a known verb', () => {
  const question = buildQuestion(['present']);
  assert.ok(question.translation);
  assert.notEqual(question.translation, 'English translation unavailable');
});

test('server entrypoint handles /api/question requests', async () => {
  const req = { url: '/api/question?tense=present' };
  const res = {
    headers: {},
    statusCode: 200,
    setHeader(name, value) {
      this.headers[name] = value;
    },
    writeHead(statusCode, headers) {
      this.statusCode = statusCode;
      Object.entries(headers || {}).forEach(([name, value]) => {
        this.headers[name] = value;
      });
    },
    end(body) {
      this.body = body;
    }
  };

  await serverHandler(req, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.headers['Content-Type'], 'application/json');
  const payload = JSON.parse(res.body);
  assert.ok(payload.prompt);
});
