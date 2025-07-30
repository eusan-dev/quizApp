let gameId;
let questions = [];
let currentQuestionIndex = 0;
let userAnswers = [];
let score = 0;
let timeLeft = 90;
let timer;

// Sound effects
const correctSound = new Audio('correct.wav');
const wrongSound = new Audio('wrong.ogg');
const timesUpSound = new Audio('ring.mp3'); // updated filename

async function startQuiz() {
  try {
const amount = document.getElementById('question-amount')?.value || 10;
const res = await fetch(`/api/start?amount=${amount}`);    const data = await res.json();
    gameId = data.gameId;
    questions = data.questions;

    document.getElementById('setup-screen').style.display = 'none';
    document.getElementById('quiz-card').style.display = 'block';

    renderQuestion();
    startTimer();
     } catch (err) {
    console.error('Error starting quiz:', err);
  }
}

    // Center layout
    const quizContainer = document.getElementById('quiz-container');
    Object.assign(quizContainer.style, {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      minHeight: '60vh',
      textAlign: 'center',
      marginTop: '40px',
      marginBottom: '40px',
      padding: '20px',
      width: '100%',
      maxWidth: '600px',
      marginLeft: 'auto',
      marginRight: 'auto',
    });

    document.body.style.overflowY = 'auto';

    document.getElementById('quiz-form').style.width = '100%';

    const optionsDiv = document.getElementById('quiz-options');
    optionsDiv.style.display = 'flex';
    optionsDiv.style.flexDirection = 'column';
    optionsDiv.style.gap = '12px';
    optionsDiv.style.marginTop = '15px';

    document.getElementById('timer').style.margin = '15px 0';
    document.getElementById('next-btn').style.marginTop = '30px';
  } catch (err) {
    console.error('Error fetching quiz:', err);
  }
}

function renderQuestion() {
  const q = questions[currentQuestionIndex];
  const container = document.getElementById('quiz-options');
  const questionText = document.getElementById('quiz-question');
  const counter = document.getElementById('quiz-counter');
  counter.textContent = `Question ${currentQuestionIndex + 1} of ${questions.length}`;

  questionText.textContent = q.question;
  container.innerHTML = '';

  ['A', 'B', 'C', 'D'].forEach(opt => {
    const label = document.createElement('label');
    label.innerHTML = `
      <input type="radio" name="answer" value="${opt}">
      <strong>${opt}.</strong> ${q[opt]}
    `;
    container.appendChild(label);
  });
}

function startTimer() {
  const timerBox = document.getElementById('timer');
  timerBox.textContent = `Time Left: ${timeLeft} seconds`;

  timer = setInterval(() => {
    timeLeft--;
    timerBox.textContent = `Time Left: ${timeLeft} seconds`;

    if (timeLeft <= 0) {
      clearInterval(timer);
      timesUpSound.play();
      showTimesUp();
    }
  }, 1000);
}

function showTimesUp() {
  const box = document.createElement('div');
  box.innerHTML = `
    <p style="margin-bottom: 15px;">⏰ Time's Up!</p>
    <button onclick="restartQuiz()" style="
      padding: 10px 20px;
      background-color: #ff9999;
      color: white;
      border: none;
      border-radius: 10px;
      font-size: 1rem;
      cursor: pointer;
    ">Restart Quiz</button>
  `;

  Object.assign(box.style, {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#ffe6e6',
    padding: '30px',
    borderRadius: '15px',
    fontWeight: 'bold',
    fontSize: '1.2rem',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
    zIndex: '9999',
    textAlign: 'center',
    opacity: '1',
  });

  document.body.appendChild(box);
}

function restartQuiz() {
  location.reload(); // reload the page to restart quiz
}
function restartQuiz() {
  window.location.href = "quiz.html";
}


function nextQuestion() {
  const selected = document.querySelector('input[name="answer"]:checked');

  if (!selected) {
    alert('Please select an answer.');
    return;
  }

  const selectedVal = selected.value;
  const correct = questions[currentQuestionIndex].answer;

  userAnswers.push(selectedVal);

  if (selectedVal === correct) {
    score++;
    correctSound.play();
    alertBox("Correct!");
  } else {
    wrongSound.play();
    alertBox(`Wrong! Correct answer was: ${correct}`);
  }

  currentQuestionIndex++;

  if (currentQuestionIndex < questions.length) {
    renderQuestion();
  } else {
    submitQuiz();
  }
}

function alertBox(message) {
  const box = document.createElement('div');
  box.textContent = message;

  Object.assign(box.style, {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: message.includes('Correct') ? '#d4edda' : '#f8d7da',
    color: '#333',
    padding: '20px 30px',
    borderRadius: '15px',
    fontWeight: 'bold',
    fontSize: '1.2rem',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
    zIndex: '9999',
    textAlign: 'center',
    maxWidth: '90%',
    opacity: '1',
    transition: 'opacity 0.5s ease'
  });

  document.body.appendChild(box);

  setTimeout(() => {
    box.style.opacity = '0';
    setTimeout(() => box.remove(), 500);
  }, 1500);
}

async function submitQuiz() {
  clearInterval(timer);

  try {
    const username = localStorage.getItem("username");

    const res = await fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gameId, userAnswers, username })
    });

    const data = await res.json();

    if (res.ok) {
      showFinalResult(data.score, data.timeTaken);
    } else {
      alert(data.error);
    }
  } catch (err) {
    console.error('Error submitting:', err);
  }
}

// Result Page
function showFinalResult(score, timeTaken) {
  const result = {
    score,
    timeTaken: Math.round(timeTaken),
    timestamp: new Date().toLocaleString()
  };

  const pastResults = JSON.parse(localStorage.getItem("quizResults")) || [];
  pastResults.push(result);
  localStorage.setItem("quizResults", JSON.stringify(pastResults));

  // Also redirect to results page (optional):
  window.location.href = "results.html";
  
}

