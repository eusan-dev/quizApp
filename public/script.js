let gameId = null;
let questions = [];
let timerInterval;
let timeLeft = 120; // 2 minutes

async function startQuiz() {
  try {
    const res = await fetch('/api/start');
    const data = await res.json();
    gameId = data.gameId;
    questions = data.questions;
    renderQuestions(questions);
    startTimer();
  } catch (error) {
    console.error('Error starting quiz:', error);
  }
}

function renderQuestions(questions) {
  const container = document.getElementById('quiz-container');
  container.innerHTML = '';

  questions.forEach((q, index) => {
    const questionDiv = document.createElement('div');
    questionDiv.classList.add('question');

    const questionText = document.createElement('p');
    questionText.innerText = `${index + 1}. ${q.question}`;
    questionDiv.appendChild(questionText);

    q.options.forEach((opt, optIndex) => {
      const label = document.createElement('label');
      label.innerHTML = `
        <input type="radio" name="q${index}" value="${opt}"> ${opt}
      `;
      questionDiv.appendChild(label);
      questionDiv.appendChild(document.createElement('br'));
    });

    container.appendChild(questionDiv);
    container.appendChild(document.createElement('hr'));
  });
}

function collectAnswers() {
  const answers = [];
  questions.forEach((_, index) => {
    const selected = document.querySelector(`input[name="q${index}"]:checked`);
    answers.push(selected ? selected.value : null);
  });
  return answers;
}

async function submitQuiz() {
  clearInterval(timerInterval);
  const userAnswers = collectAnswers();

  try {
    const res = await fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gameId, userAnswers })
    });

    const result = await res.json();

    if (res.ok) {
      showScore(result.score, result.timeTaken);
    } else {
      alert(result.error || 'Something went wrong.');
    }
  } catch (error) {
    console.error('Error submitting quiz:', error);
  }
}

function showScore(score, timeTaken) {
  const container = document.getElementById('quiz-container');
  container.innerHTML = `
    <h2>Your Score: ${score} / ${questions.length}</h2>
    <p>Time Taken: ${Math.round(timeTaken)} seconds</p>
  `;
  document.getElementById('timer').innerText = '';
}

function startTimer() {
  const timerDisplay = document.getElementById('timer');
  timerDisplay.innerText = `Time left: ${timeLeft}s`;

  timerInterval = setInterval(() => {
    timeLeft--;
    timerDisplay.innerText = `Time left: ${timeLeft}s`;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      alert("Time's up! Submitting automatically...");
      submitQuiz();
    }
  }, 1000);
}
