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

app.get('/api/start', (req, res) => { //start quiz
  const selectedQuestions = getRandomQuestions(); // pick 10 questions
  res.json({ questions: selectedQuestions }); //sned the questions to client
});


app.listen(PORT, () => { //start server 
  console.log(`Server running at http://localhost:${PORT}`); 
});
