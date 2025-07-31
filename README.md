# 🎯 Quiz App — Full Stack Project

A timed trivia quiz application that allows users to sign up, play dynamic quizzes, view results, track play history, and compete on a leaderboard.



## Team Roles

### Eusan Mahatab — Backend + MongoDB (Server & Database) & deployment 
**Setup:**
- Built backend server using Node.js + Express
- Serves static files from the `public/` folder
- Handles all API endpoints and logic
- Connected MongoDB Atlas using `mongoose` and `.env`

**Endpoints:**

- `GET /api/start?amount=N`  
  - Fetches N questions (default 10) from the Trivia API  
  - Generates a unique `gameId`  
  - Starts a 120-second quiz timer  
  - Stores session in memory  
  - Returns: `{ gameId, questions }`

- `POST /api/submit`  
  - Receives: `{ gameId, username, userAnswers }`  
  - Verifies if the 120s time limit was exceeded  
  - Compares answers and calculates score  
  - Deletes session  
  - Saves `{ username, score, timeTaken, numQuestions }` in MongoDB  
  - Returns: `{ score, timeTaken }`

- `GET /api/history/:username`  
  - Fetches all quiz attempts by a specific user  
  - Returns full quiz history sorted by date

- `GET /api/leaderboard`  
  - Returns top 10 players sorted by:
    - Highest score
    - Fastest time (as tiebreaker)

- `POST /api/user/signup`  
  - Registers new user with validation  
  - Checks for unique username

- `POST /api/user/signin`  
  - Validates existing user credentials

---

### Tasfia Shaheba — Frontend JavaScript (Quiz Logic and API Integration)

**Setup:**
- Developed `script.js` to control quiz behavior
- Integrated with backend endpoints for starting games, submitting answers, leaderboard, and history
- Used `localStorage` to store username and result summaries
- Handled game session memory, score tracking, and sound effects
- Applied dynamic DOM rendering for quiz flow

**Key Features:**

- `startQuiz()`  
  - Starts a quiz with selected question amount (`/api/start?amount=N`)  
  - Retrieves question amount using `localStorage.getItem("questionAmount")`
  - Initializes 120-second countdown  
  - Stores `gameId` and questions
  - Renamed HTML call to safely use `if (window.startQuiz) window.startQuiz();`  
  - Resolved conflict from double declarations of `startQuiz()`

- `nextQuestion()`  
  - Validates answer selection  
  - Provides feedback with audio and visual cues (Correct! / Wrong!)
  - Displays centered alert boxes that auto-fade
  - Updates DOM elements like question count and category
  - Navigates through questions and scores
  - Ends quiz and triggers submission on last question

- `submitQuiz()`  
  - Sends game data to `/api/submit` including: `gameId`, `userAnswers`, `username`, and `totalQuestions`  
  - Receives and displays `score` and `timeTaken`  
  - Shows friendly "Time's Up!" screen if timer runs out  
  - Stores results in `localStorage` and redirects to `results.html`  
  - Added alerts and error handling if score saving fails

- `showFinalResult()`  
  - Displays score, time, and timestamp  
  - Pulls from `localStorage`

- `startTimer()`  
  - Starts and manages 120s countdown  
  - Auto-submits quiz on timeout  
  - Locks interaction and updates UI

- **UI/UX Improvements:**
  - Connected question amount buttons to script logic instead of relying on missing dropdowns
  - Saved question amount from `quiz.html` using `localStorage.setItem("questionAmount", N)`
  - Improved layout with `centerQuizLayout()` for all screen sizes
  - Cleaned up spacing and alignment for quiz text, buttons, and containers
  - Removed unused/legacy elements and dropdowns
  - Ensured state consistency across screens (quiz → results)


---

### Maria Parache — Frontend HTML & CSS (UI Design & Structure)

**Setup:**
- Designed and structured all HTML views:
  - `index.html` — Main login/signup portal
  - `home.html` — Welcome screen with quiz description
  - `quiz.html` — Question interface
  - `results.html` — Final results
  - `profile.html` — Play history for user
  - `leaderboard.html` — Top 10 players
  - `signin.html` — Optional standalone login page

**Styling (`style.css`):**
- Soft pastel color palette: `#EDA9A9`, `#fcd6dc`, `#ffeef2`
- Responsive layout with `.container`, `.auth-box`, and `.site-header/footer`
- Input fields and buttons designed for mobile-friendliness
- Quiz UI styled for clarity and accessibility
- Leaderboard styled with hover effects and clean ranking rows

---

## 🔄 Application Flow

1. **Sign In / Sign Up**  
   - Users can create or log into accounts
   - Stored in MongoDB with validation

2. **User Profile Page**  
   - Displays personalized welcome and play history

3. **Quiz Selection**  
   - User chooses number of questions: 5 / 10 / 15 / 20

4. **Gameplay**  
   - All questions must be answered within 120 seconds  
   - Score and time are tracked

5. **Results**  
   - Score and time shown
   - Stored in MongoDB and localStorage

6. **Leaderboard**  
   - Ranks top 10 players by:
     - Highest score
     - Fastest time as tiebreaker

---

## 🧭 Navigation Bar

- `Home` — index.html
- `Quiz` — quiz.html
- `Result` — results.html
- `Leaderboard` — leaderboard.html

---

## 💻 How to Run Locally

1. **Clone the repository**
```bash
git clone https://github.com/your-username/quizApp.git
cd quizApp
npm install
MONGO_URI=your_mongo_atlas_connection_string
node server.js
# or use nodemon if installed
nodemon server.js
http://localhost:3000

