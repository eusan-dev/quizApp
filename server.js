// server.js

// Import required modules
require('dotenv').config();
const express = require('express');
const path = require('path');
const axios = require('axios');
const { connect, getCollection } = require('./models/db');
const userRoutes = require('./routes/user');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
connect()
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection failed:", err));

// Mount auth routes
app.use('/api/user', userRoutes);

// In-memory session store
let gameSessions = {};

// ---------------------------
// Start Quiz - /api/start
// ---------------------------
app.get('/api/start', async (req, res) => {
  const amount = parseInt(req.query.amount) || 10;
  const category = req.query.category || 9;

  try {
    const response = await axios.get('https://opentdb.com/api.php', {
      params: {
        amount,
        category,
        type: 'multiple',
        encode: 'url3986'
      }
    });

    const rawQuestions = response.data.results;

    const formattedQuestions = rawQuestions.map(q => {
      const choices = [...q.incorrect_answers.map(decodeURIComponent)];
      const correctIndex = Math.floor(Math.random() * 4);
      choices.splice(correctIndex, 0, decodeURIComponent(q.correct_answer));

      return {
        question: decodeURIComponent(q.question),
        answer: String.fromCharCode(65 + correctIndex),
        A: choices[0],
        B: choices[1],
        C: choices[2],
        D: choices[3]
      };
    });

    const gameId = Date.now().toString();
    gameSessions[gameId] = {
      questions: formattedQuestions,
      startTime: Date.now(),
      score: 0
    };

    res.json({ gameId, questions: formattedQuestions });
  } catch (err) {
    console.error("Trivia API error:", err);
    res.status(500).json({ error: "Failed to fetch quiz questions" });
  }
});

// ---------------------------
// Submit Quiz - /api/submit
// ---------------------------
app.post('/api/submit', async (req, res) => {
  const { gameId, userAnswers, username } = req.body;

  const session = gameSessions[gameId];
  if (!session) {
    return res.status(400).json({ error: "Invalid or expired session" });
  }

  const elapsedTime = (Date.now() - session.startTime) / 1000;

  if (elapsedTime > 120) {
    delete gameSessions[gameId];
    return res.status(403).json({ error: "⏰ Time's up! Quiz expired." });
  }

  let score = 0;
  for (let i = 0; i < session.questions.length; i++) {
    if (userAnswers[i] === session.questions[i].answer) {
      score++;
    }
  }

  try {
    const userScores = getCollection('userScores');
    await userScores.insertOne({
      username,
      score,
      timeTaken: elapsedTime,
      numQuestions: userAnswers.length,
      timestamp: new Date()
    });

    delete gameSessions[gameId];

    res.json({ score, timeTaken: elapsedTime });
  } catch (err) {
    console.error("❌ Error saving score:", err.message);
    res.status(500).json({ error: "Failed to save score to database", detail: err.message });
  }
});

// ---------------------------
// User History - /api/history/:username
// ---------------------------
app.get('/api/history/:username', async (req, res) => {
  const username = req.params.username;

  try {
    const userScores = getCollection('userScores');
    const history = await userScores
      .find({ username })
      .sort({ timestamp: -1 })
      .toArray();

    res.json(history);
  } catch (err) {
    console.error("❌ Error fetching history:", err);
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

// ---------------------------
// Leaderboard - /api/leaderboard
// ---------------------------
app.get('/api/leaderboard', async (req, res) => {
  try {
    const userScores = getCollection('userScores');
    const topPlayers = await userScores
      .find({})
      .sort({ score: -1, timeTaken: 1 })
      .limit(10)
      .toArray();

    res.json(topPlayers);
  } catch (err) {
    console.error("❌ Error fetching leaderboard:", err);
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
});

// ---------------------------
// Start Server
// ---------------------------
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
