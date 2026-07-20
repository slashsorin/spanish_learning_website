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
    res.status(200).json(question);
  } catch (error) {
    console.error('question handler failed', error);
    res.setHeader('Content-Type', 'application/json');
    res.status(500).json({ error: 'Failed to generate question' });
  }
};
