const express = require('express'); //import express framework
const fs = require('fs'); // import the file module to read files
const path = require('path'); // import path module to read path 

const app = express(); // express app
const PORT = process.env.PORT || 3000; //use port 3000

app.use(express.static(path.join(__dirname, 'public')));//for public folder's static files

app.use(express.json());//make JSON -> JS objects

let allQuestions = []; //load all questions from questions.json file when the server starts
try {
  const data = fs.readFileSync('questions.json', 'utf8'); //read the file
  allQuestions = JSON.parse(data); //make JSON into JS array
} catch (err) {
  console.error('Error reading questions.json:', err); //error check
}

function getRandomQuestions(count = 10) { //helper func
  const shuffled = [...allQuestions].sort(() => Math.random() - 0.5); // shuffle the questions
  return shuffled.slice(0, count); // return shuffled 10 questions
}

let gameSessions = {}; //store ongoing quiz sessions

app.get('/api/start', (req, res) => {
    const selectedQuestions = getRandomQuestions(); // Pick 10 questions
    const gameId = Date.now().toString(); // Use timestamp as unique ID
    const startTime = Date.now();//record quiz start time
  
    gameSessions[gameId] = { //save game session
      questions: selectedQuestions,
      startTime: startTime,
      score: 0
    };
  
    res.json({ gameId, questions: selectedQuestions, startTime }); //send session info
  });
  
  app.post('/api/submit', (req, res) => {
    const { gameId, userAnswers } = req.body;
  
    const session = gameSessions[gameId];
    if (!session) {
      return res.status(400).json({ error: 'Invalid or expired game session' });
    }
  
    const elapsedTime = (Date.now() - session.startTime) / 1000; //show time in secs
  
    if (elapsedTime > 120) {
      delete gameSessions[gameId]; //remove expired game sessions
      return res.status(403).json({ error: 'uhoh! Times up! u took all of 120 seconds' });
    }
  
    let score = 0;
    for (let i = 0; i < session.questions.length; i++) {
      if (userAnswers[i] === session.questions[i].answer) {
        score++;
      }
    }
  
    session.score = score;
    const finalScore = session.score;
  
    delete gameSessions[gameId]; //remove after quiz is done
  
    res.json({ score: finalScore, timeTaken: elapsedTime });
  });
  

app.listen(PORT, () => { //start server 
  console.log(`Server running at http://localhost:${PORT}`); 
});
