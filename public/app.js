const promptEl = document.getElementById('prompt');
const translationEl = document.getElementById('translation');
const answerInput = document.getElementById('answer');
const feedbackEl = document.getElementById('feedback');
const checkBtn = document.getElementById('check-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const hintBtn = document.getElementById('hint-btn');
const tenseFilterContainer = document.getElementById('tense-filters');

let currentQuestion = null;
let questionHistory = [];
let currentIndex = -1;
let liveCheckTimer = null;
let autoAdvanceTimer = null;
let progressTimer = null;

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

function renderTenseFilters() {
  tenseFilterContainer.innerHTML = '';

  tenseOptions.forEach((tense) => {
    const label = document.createElement('label');
    label.className = 'filter-option';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = tense.value;
    checkbox.checked = tense.value === 'present';
    checkbox.addEventListener('change', () => {
      const selectedTenses = getSelectedTenses();
      if (selectedTenses.length > 0) {
        loadQuestion(selectedTenses);
      } else {
        feedbackEl.textContent = 'Select at least one tense to keep practicing.';
        feedbackEl.className = 'feedback error';
      }
    });

    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(tense.label));
    tenseFilterContainer.appendChild(label);
  });
}

function getSelectedTenses() {
  return Array.from(tenseFilterContainer.querySelectorAll('input:checked')).map((checkbox) => checkbox.value);
}

function normalizeAnswer(value) {
  return value.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function clearAutoAdvance() {
  if (autoAdvanceTimer) {
    clearTimeout(autoAdvanceTimer);
    autoAdvanceTimer = null;
  }
  if (progressTimer) {
    clearInterval(progressTimer);
    progressTimer = null;
  }
}

function startAutoAdvance() {
  clearAutoAdvance();

  const progressBar = document.getElementById('answer-progress');
  if (!progressBar) return;

  progressBar.style.width = '0%';
  progressBar.classList.add('active');

  let elapsed = 0;
  progressTimer = setInterval(() => {
    elapsed += 100;
    const progress = Math.min((elapsed / 1000) * 100, 100);
    progressBar.style.width = `${progress}%`;

    if (progress >= 100) {
      clearInterval(progressTimer);
      progressTimer = null;
    }
  }, 100);

  autoAdvanceTimer = setTimeout(() => {
    clearAutoAdvance();
    loadQuestion(getSelectedTenses());
  }, 1000);
}

function renderQuestion() {
  if (!currentQuestion) return;

  promptEl.textContent = currentQuestion.prompt;
  if (translationEl) {
    translationEl.textContent = currentQuestion.translation
      ? `Translation: ${currentQuestion.translation}`
      : '';
  }
  feedbackEl.textContent = '';
  feedbackEl.className = 'feedback';
  answerInput.value = '';
  answerInput.readOnly = false;
  answerInput.disabled = false;
  answerInput.classList.remove('answer-correct', 'answer-incorrect');
  const progressBar = document.getElementById('answer-progress');
  if (progressBar) {
    progressBar.style.width = '0%';
    progressBar.classList.remove('active');
  }
  clearAutoAdvance();
  if (hintBtn) {
    hintBtn.style.display = 'inline-flex';
    hintBtn.disabled = false;
    hintBtn.textContent = 'Hint';
  }
  answerInput.focus();
  prevBtn.disabled = currentIndex <= 0;
}

function storeQuestion(question) {
  questionHistory = questionHistory.slice(0, currentIndex + 1);
  questionHistory.push(question);
  currentIndex = questionHistory.length - 1;
  currentQuestion = question;
  renderQuestion();
}

async function loadQuestion(selectedTenses = getSelectedTenses()) {
  const query = selectedTenses.length > 0 ? `?${selectedTenses.map((tense) => `tense=${encodeURIComponent(tense)}`).join('&')}` : '';
  const requestUrl = `/api/question${query}${query ? '&' : '?'}_=${encodeURIComponent(Date.now().toString())}`;
  const response = await fetch(requestUrl, { cache: 'no-store' });
  const nextQuestion = await response.json();
  storeQuestion(nextQuestion);
}

function setAnswerState(isCorrect) {
  if (!answerInput) return;

  answerInput.classList.remove('answer-correct', 'answer-incorrect');
  if (isCorrect === true) {
    answerInput.classList.add('answer-correct');
  } else if (isCorrect === false) {
    answerInput.classList.add('answer-incorrect');
  }
}

function showResult(isCorrect) {
  if (!currentQuestion) return;

  if (isCorrect) {
    feedbackEl.textContent = `Correct! ${currentQuestion.correctAnswer} is the right answer.`;
    feedbackEl.className = 'feedback success';
    setAnswerState(true);
    answerInput.readOnly = true;
    answerInput.disabled = true;
    startAutoAdvance();
  } else {
    feedbackEl.textContent = `Not quite. The correct answer is ${currentQuestion.correctAnswer}.`;
    feedbackEl.className = 'feedback error';
    setAnswerState(false);
  }
}

function checkLiveAnswer() {
  if (!currentQuestion || !answerInput.value.trim()) {
    setAnswerState(null);
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';
    return;
  }

  const userAnswer = normalizeAnswer(answerInput.value);
  const correctAnswer = normalizeAnswer(currentQuestion.correctAnswer);
  const isCorrect = userAnswer === correctAnswer;

  setAnswerState(isCorrect);

  if (isCorrect) {
    feedbackEl.textContent = 'Correct form!';
    feedbackEl.className = 'feedback success';
    answerInput.readOnly = true;
    answerInput.disabled = true;
    startAutoAdvance();
  } else {
    feedbackEl.textContent = 'Keep going…';
    feedbackEl.className = 'feedback error';
  }
}

checkBtn.addEventListener('click', () => {
  if (!currentQuestion) return;

  const userAnswer = normalizeAnswer(answerInput.value);
  const correctAnswer = normalizeAnswer(currentQuestion.correctAnswer);
  showResult(userAnswer === correctAnswer);
});

prevBtn.addEventListener('click', () => {
  if (currentIndex <= 0) return;

  currentIndex -= 1;
  currentQuestion = questionHistory[currentIndex];
  renderQuestion();
});

hintBtn.addEventListener('click', () => {
  if (!currentQuestion) return;

  feedbackEl.textContent = `Hint: ${currentQuestion.correctAnswer}`;
  feedbackEl.className = 'feedback success';
  if (hintBtn) {
    hintBtn.textContent = currentQuestion.correctAnswer;
    hintBtn.disabled = true;
  }
});

nextBtn.addEventListener('click', () => loadQuestion(getSelectedTenses()));
answerInput.addEventListener('input', () => {
  clearTimeout(liveCheckTimer);
  liveCheckTimer = setTimeout(checkLiveAnswer, 500);
});
answerInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    checkBtn.click();
  }
});

renderTenseFilters();
loadQuestion(getSelectedTenses()).catch((error) => {
  console.error(error);
  promptEl.textContent = 'The practice engine could not load. Please refresh the page.';
  feedbackEl.textContent = 'Unable to connect to the question service.';
  feedbackEl.className = 'feedback error';
});
