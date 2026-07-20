const { buildQuestion } = require('../server');

module.exports = async function handler(req, res) {
  const selectedTenses = Array.isArray(req.query?.tense)
    ? req.query.tense
    : req.query?.tense
      ? [req.query.tense]
      : null;

  const question = buildQuestion(selectedTenses);

  res.setHeader('Content-Type', 'application/json');
  res.status(200).json(question);
};
