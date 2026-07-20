const { buildQuestion } = require('../lib/questions');

module.exports = async function handler(req, res) {
  try {
    const selectedTenses = Array.isArray(req.query?.tense)
      ? req.query.tense
      : req.query?.tense
        ? [req.query.tense]
        : null;

    const question = buildQuestion(selectedTenses);

    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 200;
    res.end(JSON.stringify(question));
  } catch (error) {
    console.error('question handler failed', error);
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 500;
    res.end(JSON.stringify({ error: 'Failed to generate question' }));
  }
};
