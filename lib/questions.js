const fs = require('fs');
const path = require('path');

const regularVerbs = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'data', 'regular-verbs.json'), 'utf8')
);

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

const translationLookup = {
  hablar: 'to speak',
  comer: 'to eat',
  vivir: 'to live',
  estudiar: 'to study',
  aprender: 'to learn',
  escribir: 'to write',
  abandonar: 'to abandon',
  aceptar: 'to accept',
  acordar: 'to agree',
  adaptar: 'to adapt',
  admirar: 'to admire',
  afirmar: 'to affirm',
  agregar: 'to add',
  ahorrar: 'to save',
  alcanzar: 'to reach',
  alimentar: 'to feed',
  aliviar: 'to relieve',
  analizar: 'to analyze',
  animar: 'to encourage',
  aparecer: 'to appear',
  aplicar: 'to apply',
  apoyar: 'to support',
  aprovechar: 'to take advantage of',
  asistir: 'to attend',
  atender: 'to attend to',
  aumentar: 'to increase',
  autorizar: 'to authorize',
  ayudar: 'to help',
  bailar: 'to dance',
  beneficiar: 'to benefit',
  brindar: 'to offer',
  cambiar: 'to change',
  cantar: 'to sing',
  captar: 'to capture',
  celebrar: 'to celebrate',
  cerrar: 'to close',
  cocinar: 'to cook',
  colaborar: 'to collaborate',
  combinar: 'to combine',
  comprar: 'to buy',
  comunicar: 'to communicate',
  conectar: 'to connect',
  conservar: 'to conserve',
  considerar: 'to consider',
  construir: 'to build',
  consumir: 'to consume',
  controlar: 'to control',
  convencer: 'to convince',
  cooperar: 'to cooperate',
  corregir: 'to correct',
  crear: 'to create',
  cultivar: 'to cultivate',
  debatir: 'to debate',
  declarar: 'to declare',
  defender: 'to defend',
  dejar: 'to leave',
  demostrar: 'to demonstrate',
  desarrollar: 'to develop',
  descubrir: 'to discover',
  describir: 'to describe',
  diseñar: 'to design',
  disfrutar: 'to enjoy',
  dividir: 'to divide',
  elegir: 'to choose',
  emitir: 'to emit',
  emplear: 'to employ',
  encargar: 'to entrust',
  encontrar: 'to find',
  enseñar: 'to teach',
  entender: 'to understand',
  entregar: 'to deliver',
  escalar: 'to climb',
  escuchar: 'to listen',
  esperar: 'to wait',
  estimular: 'to stimulate',
  evitar: 'to avoid',
  examinar: 'to examine',
  explicar: 'to explain',
  expresar: 'to express',
  fabricar: 'to manufacture',
  felicitar: 'to congratulate',
  fijar: 'to fix',
  firmar: 'to sign',
  formar: 'to form',
  funcionar: 'to function',
  ganar: 'to win',
  generar: 'to generate',
  guiar: 'to guide',
  identificar: 'to identify',
  ignorar: 'to ignore',
  imaginar: 'to imagine',
  importar: 'to import',
  indicar: 'to indicate',
  informar: 'to inform',
  iniciar: 'to begin',
  invitar: 'to invite',
  jugar: 'to play',
  limitar: 'to limit',
  llenar: 'to fill',
  llamar: 'to call',
  llevar: 'to carry',
  lograr: 'to achieve',
  mandar: 'to send',
  manejar: 'to handle',
  marcar: 'to mark',
  medir: 'to measure',
  mejorar: 'to improve',
  mezclar: 'to mix',
  migrar: 'to migrate',
  motivar: 'to motivate',
  nadar: 'to swim',
  necesitar: 'to need',
  nombrar: 'to name',
  notar: 'to note',
  ocupar: 'to occupy',
  ofrecer: 'to offer',
  ordenar: 'to order',
  organizar: 'to organize',
  pagar: 'to pay',
  participar: 'to participate',
  pasar: 'to pass',
  perder: 'to lose',
  permitir: 'to allow',
  personalizar: 'to personalize',
  planificar: 'to plan',
  practicar: 'to practice',
  preparar: 'to prepare',
  presentar: 'to present',
  prevenir: 'to prevent',
  producir: 'to produce',
  proteger: 'to protect',
  publicar: 'to publish',
  quedar: 'to stay',
  quitar: 'to remove',
  realizar: 'to carry out',
  recibir: 'to receive',
  recomendar: 'to recommend',
  recordar: 'to remember',
  recuperar: 'to recover',
  reducir: 'to reduce',
  reflejar: 'to reflect',
  reformar: 'to reform',
  regalar: 'to give',
  regresar: 'to return',
  reunir: 'to gather',
  revisar: 'to review',
  satisfacer: 'to satisfy',
  seguir: 'to follow',
  señalar: 'to signal',
  servir: 'to serve',
  simplificar: 'to simplify',
  solucionar: 'to solve',
  sorprender: 'to surprise',
  sostener: 'to sustain',
  subir: 'to climb',
  sugerir: 'to suggest',
  superar: 'to overcome',
  suspender: 'to suspend',
  terminar: 'to finish',
  trabajar: 'to work',
  traducir: 'to translate',
  transformar: 'to transform',
  transportar: 'to transport',
  tratar: 'to treat',
  usar: 'to use',
  utilizar: 'to use',
  valorar: 'to value',
  vender: 'to sell',
  verificar: 'to verify',
  visitar: 'to visit',
  volver: 'to return',
  votar: 'to vote',
  zumbar: 'to buzz',
  coordinar: 'to coordinate',
  visitar: 'to visit'
};

function pickRandom(arr) {
  if (!Array.isArray(arr) || arr.length === 0) {
    return null;
  }

  const index = Math.floor(Math.random() * arr.length);
  return arr[index];
}

function getStem(infinitive) {
  return infinitive.slice(0, -2);
}

function getVerbEnding(infinitive) {
  return infinitive.endsWith('ar') ? 'ar' : infinitive.endsWith('er') ? 'er' : 'ir';
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

function getEnglishTranslation(infinitive) {
  const normalized = String(infinitive || '').toLowerCase();
  if (!normalized) {
    return 'English translation unavailable';
  }

  if (translationLookup[normalized]) {
    return translationLookup[normalized];
  }

  if (normalized.endsWith('ar') || normalized.endsWith('er') || normalized.endsWith('ir')) {
    return `to ${normalized.slice(0, -2)}`;
  }

  return `to ${normalized}`;
}

function getRandomVerb() {
  return pickRandom(regularVerbs);
}

function buildQuestion(selectedTenses = null) {
  const available = normalizeSelectedTenses(selectedTenses);
  const verb = getRandomVerb();
  const tense = pickRandom(available);
  const pronoun = pickRandom(pronouns);
  const correctAnswer = conjugateRegularVerb(verb.infinitive, tense, pronoun);
  const tenseLabel = getAvailableTenses().find((item) => item.value === tense)?.label || tense;

  return {
    verb: verb.infinitive,
    translation: verb.translation || getEnglishTranslation(verb.infinitive),
    tense,
    pronoun,
    prompt: `Conjugate ${verb.infinitive} for ${pronoun} in the ${tenseLabel.toLowerCase()} tense.`,
    correctAnswer
  };
}

module.exports = {
  buildQuestion,
  getAvailableTenses
};
