const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const publicDir = path.join(__dirname, 'public');

const regularVerbs = [
  { infinitive: 'hablar', ending: 'ar' },
  { infinitive: 'comer', ending: 'er' },
  { infinitive: 'vivir', ending: 'ir' },
  { infinitive: 'estudiar', ending: 'ar' },
  { infinitive: 'aprender', ending: 'er' },
  { infinitive: 'escribir', ending: 'ir' }
];

const tenseOptions = [
  { value: 'present', label: 'Present' },
  { value: 'preterite', label: 'Preterite' },
  { value: 'imperfect', label: 'Imperfect' },
  { value: 'future', label: 'Future' },
  { value: 'conditional', label: 'Conditional' },
  { value: 'subjunctive', label: 'Present subjunctive' },
  { value: 'imperfect_subjunctive', label: 'Imperfect subjunctive' },
  { value: 'imperative', label: 'Imperative' },
  { value: 'present_perfect', label: 'Present perfect' },
  { value: 'past_perfect', label: 'Past perfect' },
  { value: 'future_perfect', label: 'Future perfect' },
  { value: 'conditional_perfect', label: 'Conditional perfect' }
];

const pronouns = ['yo', 'tú', 'él/ella/usted', 'nosotros', 'vosotros', 'ellos/ellas/ustedes'];

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getStem(infinitive) {
  return infinitive.slice(0, -2);
}

function getVerbEnding(infinitive) {
  return infinitive.endsWith('ar') ? 'ar' : infinitive.endsWith('er') ? 'er' : 'ir';
}

function addAccents(word) {
  return word.replace(/([aeiou])([aeiou])/, '$1');
}

function conjugateRegularVerb(infinitive, tense, pronoun) {
  const stem = getStem(infinitive);
  const ending = getVerbEnding(infinitive);
  const participle = ending === 'ar' ? `${stem}ado` : `${stem}ido`;

  const forms = {
    present: {
      yo: `${stem}o`,
      tú: `${stem}${ending === 'ar' ? 'as' : ending === 'er' ? 'es' : 'es'}`,
      'él/ella/usted': `${stem}${ending === 'ar' ? 'a' : ending === 'er' ? 'e' : 'e'}`,
      nosotros: `${stem}${ending === 'ar' ? 'amos' : ending === 'er' ? 'emos' : 'imos'}`,
      vosotros: `${stem}${ending === 'ar' ? 'áis' : ending === 'er' ? 'éis' : 'ís'}`,
      'ellos/ellas/ustedes': `${stem}${ending === 'ar' ? 'an' : ending === 'er' ? 'en' : 'en'}`
    },
    preterite: {
      yo: `${stem}${ending === 'ar' ? 'é' : ending === 'er' ? 'í' : 'í'}`,
      tú: `${stem}${ending === 'ar' ? 'aste' : ending === 'er' ? 'iste' : 'iste'}`,
      'él/ella/usted': `${stem}${ending === 'ar' ? 'ó' : ending === 'er' ? 'ió' : 'ió'}`,
      nosotros: `${stem}${ending === 'ar' ? 'amos' : ending === 'er' ? 'imos' : 'imos'}`,
      vosotros: `${stem}${ending === 'ar' ? 'asteis' : ending === 'er' ? 'isteis' : 'isteis'}`,
      'ellos/ellas/ustedes': `${stem}${ending === 'ar' ? 'aron' : ending === 'er' ? 'ieron' : 'ieron'}`
    },
    imperfect: {
      yo: `${stem}${ending === 'ar' ? 'aba' : ending === 'er' ? 'ía' : 'ía'}`,
      tú: `${stem}${ending === 'ar' ? 'abas' : ending === 'er' ? 'ías' : 'ías'}`,
      'él/ella/usted': `${stem}${ending === 'ar' ? 'aba' : ending === 'er' ? 'ía' : 'ía'}`,
      nosotros: `${stem}${ending === 'ar' ? 'ábamos' : ending === 'er' ? 'íamos' : 'íamos'}`,
      vosotros: `${stem}${ending === 'ar' ? 'abais' : ending === 'er' ? 'íais' : 'íais'}`,
      'ellos/ellas/ustedes': `${stem}${ending === 'ar' ? 'aban' : ending === 'er' ? 'ían' : 'ían'}`
    },
    future: {
      yo: `${infinitive}é`,
      tú: `${infinitive}ás`,
      'él/ella/usted': `${infinitive}á`,
      nosotros: `${infinitive}emos`,
      vosotros: `${infinitive}éis`,
      'ellos/ellas/ustedes': `${infinitive}án`
    },
    conditional: {
      yo: `${infinitive}ía`,
      tú: `${infinitive}ías`,
      'él/ella/usted': `${infinitive}ía`,
      nosotros: `${infinitive}íamos`,
      vosotros: `${infinitive}íais`,
      'ellos/ellas/ustedes': `${infinitive}ían`
    },
    subjunctive: {
      yo: `${stem}${ending === 'ar' ? 'e' : 'a'}`,
      tú: `${stem}${ending === 'ar' ? 'es' : 'as'}`,
      'él/ella/usted': `${stem}${ending === 'ar' ? 'e' : 'a'}`,
      nosotros: `${stem}${ending === 'ar' ? 'emos' : 'amos'}`,
      vosotros: `${stem}${ending === 'ar' ? 'éis' : 'áis'}`,
      'ellos/ellas/ustedes': `${stem}${ending === 'ar' ? 'en' : 'an'}`
    },
    imperfect_subjunctive: {
      yo: `${stem}${ending === 'ar' ? 'ara' : 'iera'}`,
      tú: `${stem}${ending === 'ar' ? 'aras' : 'ieras'}`,
      'él/ella/usted': `${stem}${ending === 'ar' ? 'ara' : 'iera'}`,
      nosotros: `${stem}${ending === 'ar' ? 'áramos' : 'iéramos'}`,
      vosotros: `${stem}${ending === 'ar' ? 'arais' : 'ierais'}`,
      'ellos/ellas/ustedes': `${stem}${ending === 'ar' ? 'aran' : 'ieran'}`
    },
    imperative: {
      yo: `${stem}${ending === 'ar' ? 'o' : ending === 'er' ? 'o' : 'o'}`,
      tú: `${stem}${ending === 'ar' ? 'a' : ending === 'er' ? 'e' : 'e'}`,
      'él/ella/usted': `${stem}${ending === 'ar' ? 'e' : ending === 'er' ? 'a' : 'a'}`,
      nosotros: `${stem}${ending === 'ar' ? 'emos' : ending === 'er' ? 'amos' : 'amos'}`,
      vosotros: `${stem}${ending === 'ar' ? 'ad' : ending === 'er' ? 'ed' : 'id'}`,
      'ellos/ellas/ustedes': `${stem}${ending === 'ar' ? 'en' : ending === 'er' ? 'an' : 'an'}`
    },
    present_perfect: {
      yo: `he ${participle}`,
      tú: `has ${participle}`,
      'él/ella/usted': `ha ${participle}`,
      nosotros: `hemos ${participle}`,
      vosotros: `habéis ${participle}`,
      'ellos/ellas/ustedes': `han ${participle}`
    },
    past_perfect: {
      yo: `había ${participle}`,
      tú: `habías ${participle}`,
      'él/ella/usted': `había ${participle}`,
      nosotros: `habíamos ${participle}`,
      vosotros: `habíais ${participle}`,
      'ellos/ellas/ustedes': `habían ${participle}`
    },
    future_perfect: {
      yo: `habré ${participle}`,
      tú: `habrás ${participle}`,
      'él/ella/usted': `habrá ${participle}`,
      nosotros: `habremos ${participle}`,
      vosotros: `habréis ${participle}`,
      'ellos/ellas/ustedes': `habrán ${participle}`
    },
    conditional_perfect: {
      yo: `habría ${participle}`,
      tú: `habrías ${participle}`,
      'él/ella/usted': `habría ${participle}`,
      nosotros: `habríamos ${participle}`,
      vosotros: `habríais ${participle}`,
      'ellos/ellas/ustedes': `habrían ${participle}`
    }
  };

  return forms[tense][pronoun];
}

function getAvailableTenses() {
  return tenseOptions;
}

function normalizeSelectedTenses(selectedTenses) {
  if (!Array.isArray(selectedTenses) || selectedTenses.length === 0) {
    return getAvailableTenses().map((tense) => tense.value);
  }

  const validValues = new Set(getAvailableTenses().map((tense) => tense.value));
  return selectedTenses.filter((value) => validValues.has(value));
}

function buildQuestion(selectedTenses = null) {
  const available = normalizeSelectedTenses(selectedTenses);
  const verb = pickRandom(regularVerbs);
  const tense = pickRandom(available);
  const pronoun = pickRandom(pronouns);
  const correctAnswer = conjugateRegularVerb(verb.infinitive, tense, pronoun);
  const tenseLabel = getAvailableTenses().find((item) => item.value === tense)?.label || tense;

  return {
    verb: verb.infinitive,
    tense,
    pronoun,
    prompt: `Conjugate ${verb.infinitive} for ${pronoun} in the ${tenseLabel.toLowerCase()} tense.`,
    correctAnswer
  };
}

function sendFile(res, filePath, contentType) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not found');
      return;
    }

    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
}

function handleRequest(req, res) {
  const parsedUrl = url.parse(req.url, true);

  if (parsedUrl.pathname === '/api/question') {
    const selectedTenses = Array.isArray(parsedUrl.query.tense)
      ? parsedUrl.query.tense
      : parsedUrl.query.tense
        ? [parsedUrl.query.tense]
        : null;

    res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
    res.end(JSON.stringify(buildQuestion(selectedTenses)));
    return;
  }

  const requestedPath = parsedUrl.pathname === '/' ? '/index.html' : parsedUrl.pathname;
  const safePath = path.normalize(requestedPath).replace(/^\.+/, '');
  const filePath = path.join(publicDir, safePath);

  if (!filePath.startsWith(publicDir)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Forbidden');
    return;
  }

  const extension = path.extname(filePath).toLowerCase();
  const contentType = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8'
  }[extension] || 'application/octet-stream';

  sendFile(res, filePath, contentType);
}

const server = http.createServer(handleRequest);

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`Spanish practice server is running on http://localhost:${PORT}`);
  });
}

module.exports = handleRequest;
