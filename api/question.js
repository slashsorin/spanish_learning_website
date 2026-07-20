const { buildQuestion } = require('../lib/questions');

module.exports = async function handler(req, res) {
  try {
    const query = req.query || {};
    const selectedTenses = Array.isArray(query.tense)
      ? query.tense
      : query.tense
        ? [query.tense]
        : null;

    const question = buildQuestion(selectedTenses);

    if (res.setHeader) {
      res.setHeader('Content-Type', 'application/json');
    }

    if (res.status) {
      res.status(200).json(question);
      return;
    }

    res.json(question);
  } catch (error) {
    console.error('question handler failed', error);

    if (res.setHeader) {
      res.setHeader('Content-Type', 'application/json');
    }

    if (res.status) {
      res.status(500).json({ error: 'Failed to generate question' });
      return;
    }

    res.json({ error: 'Failed to generate question' });
  }
};
