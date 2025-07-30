## QuizApp

A full-stack quiz game built collaboratively by:

- Eusan – Backend (Node.js, Express, MongoDB) & Deployment
- Maria – Frontend HTML/CSS (UI & layout)
- Tasfia – Frontend JavaScript (Logic, API, interactivity)

---

## Project Description

This is an interactive trivia game where users can:

- Sign up / log in
- Select how many questions they want (5, 10, 15, 20)
- Take a 120-second timed quiz
- See their score and time
- View leaderboard and personal quiz history

---

## Backend by Eusan (Node.js + MongoDB)

## Setup
- Built with Node.js + Express
- Uses MongoDB Atlas via Mongoose
- `.env` holds the DB URI
- Serves static frontend from `public/`

## API Endpoints

#### `GET /api/start?amount=N`
- Fetches N quiz questions (default 10) from OpenTrivia API
- Generates a unique `gameId`
- Starts a 120-second timer
- Stores session in memory
- Returns: `{ gameId, questions }`

#### `POST /api/submit`
- Receives: `{ gameId, username, userAnswers }`
- Checks if user submitted within 120 seconds
- Compares answers
- Saves: `{ username, score, timeTaken, numQuestions }` to MongoDB
- Returns: `{ score, timeTaken }`

#### `GET /api/history/:username`
- Returns quiz history for that user (most recent first)

#### `GET /api/leaderboard`
- Returns top 10 players by:
  - Highest score
  - Fastest time (tie-breaker)

#### `POST /api/user/signup`
- Validates input and checks for unique username
- Stores new user in DB

#### `POST /api/user/signin`
- Validates existing user credentials

---

## Frontend Logic by Tasfia (JavaScript)

### 💻 `script.js` Features

#### `startQuiz()`
- Gets question count from dropdown
- Calls `/api/start?amount=N`
- Starts timer
- Renders first question

#### `nextQuestion()`
- Validates selected answer
- Plays correct/wrong sound
- Moves to next question or submits at the end

#### `submitQuiz()`
- Sends gameId + userAnswers + username to `/api/submit`
- Receives score and time, stores in localStorage
- Redirects to `results.html`

#### `showFinalResult()`
- Displays score and time taken from localStorage

#### `startTimer()`
- Starts a 120s countdown
- Submits automatically when time runs out

---

##  HTML/CSS by Maria (UI Design)

### Pages:
- `index.html` – Home page with Start Quiz button
- `quiz.html` – Quiz interface
- `results.html` – Final score + play again
- `signin.html` – User login
- `leaderboard.html` – Top 10 players
- `profile.html` – User's past quiz attempts

###  Navbar:
```html
<a href="index.html">Home</a>
<a href="quiz.html">Take Quiz</a>
<a href="results.html">Results</a>
<a href="leaderboard.html">Leaderboard</a>
<a href="profile.html">Profile</a>
