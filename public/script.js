let gameId;
let questions = [];
let timer;
let timeLeft = 120; // in seconds

// Start quiz when page loads
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

// Render questions to the page
function renderQuestions(questions) {
  const container = document.getElementById('quiz-container');
  container.innerHTML = '';

  questions.forEach((q, i) => {
    const qDiv = document.createElement('div');
    qDiv.innerHTML = `
      <p>${i + 1}. ${q.question}</p>
      ${q.choices.map((choice, j) =>
        `<label>
          <input type="radio" name="q${i}" value="${choice}" />
          ${choice}
        </label><br>`).join('')}
    `;
    container.appendChild(qDiv);
  });
}

// Timer logic
function startTimer() {
  const timerDiv = document.getElementById('timer');
  timerDiv.textContent = `Time left: ${timeLeft} seconds`;

  timer = setInterval(() => {
    timeLeft--;
    timerDiv.textContent = `Time left: ${timeLeft} seconds`;

    if (timeLeft <= 0) {
      clearInterval(timer);
      submitQuiz(); // auto submit
    }
  }, 1000);
}

// Collect and submit answers
async function submitQuiz() {
  clearInterval(timer);

  const userAnswers = [];
  for (let i = 0; i < questions.length; i++) {
    const selected = document.querySelector(`input[name="q${i}"]:checked`);
    userAnswers.push(selected ? selected.value : null);
  }

  try {
    const response = await fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gameId, userAnswers })
    });

    const result = await response.json();

    if (response.ok) {
      showScore(result.score, result.timeTaken);
    } else {
      alert(result.error);
    }
  } catch (error) {
    console.error('Error submitting quiz:', error);
  }
}

// Show the final score
function showScore(score, timeTaken) {
  const container = document.getElementById('quiz-container');
  container.innerHTML = `
    <h2>Quiz Completed!</h2>
    <p>Your Score: ${score}/10</p>
    <p>Time Taken: ${Math.round(timeTaken)} seconds</p>
  `;

  document.getElementById('timer').textContent = '';
}
