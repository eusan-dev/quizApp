let gameId;
let questions = [];

async function startQuiz() {
  questions = await fetch('/api/start');
  const data = await questions.json();
  gameId = data.gameId;
  questions = data.questions;

  renderQuestions(questions); // implement this to show questions on page
  startTimer();               // starts countdown
}
