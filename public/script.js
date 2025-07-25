let gameId;
let questions = [];
let timer;
let timeLeft = 120;

// DOM elements
const quizContainer = document.getElementById('quiz-container');
const timerDisplay = document.getElementById('timer');
const resultContainer = document.getElementById('result');

// Start Quiz
async function startQuiz() {
  try {
    const response = await fetch('/api/start');
    const data = await response.json();
    gameId = data.gameId;
    questions = data.questions;
    renderQuestions(questions);
    startTimer();
  } catch (error) {
    console.error('Error starting quiz:', error);
  }
}

// Render Questions Dynamically
function renderQuestions(questions) {
  quizContainer.innerHTML = '';
  questions.forEach((q, index) => {
    const questionBlock = document.createElement('div');
    questionBlock.className = 'question-block';

    questionBlock.innerHTML = `
      <h3>${index + 1}. ${q.question}</h3>
      ${q.choices.map((choice, i) => `
        <label>
          <input type="radio" name="q${index}" value="${choice}">
          ${choice}
        </label><br>
      `).join('')}
    `;

    quizContainer.appendChild(questionBlock);
  });

  // Submit Button
  const submitBtn = document.createElement('button');
  submitBtn.textContent = 'Submit Answers';
  submitBtn.onclick = submitAnswers;
  quizContainer.appendChild(submitBtn);
}

// Start Countdown Timer
function startTimer() {
  timerDisplay.textContent = `Time left: ${timeLeft}s`;
  timer = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = `Time left: ${timeLeft}s`;

    if (timeLeft <= 0) {
      clearInterval(timer);
      submitAnswers();
    }
  }, 1000);
}

