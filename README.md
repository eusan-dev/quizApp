# 🎯 Quiz App — Full Stack Project

A timed trivia quiz application that allows users to sign up, play dynamic quizzes, view results, track play history, and compete on a leaderboard.



## Team Roles

### Eusan Mahatab — Backend + MongoDB (Server & Database) & Deployment Lead

**Responsibilities:**
- Built the entire backend server using **Node.js**, **Express**, and **MongoDB**
- Initialized project and managed GitHub repository as the **repo owner**
- Wrote and formatted the full `README.md` documentation
- Handled all backend logic, routes, data models, and API integration
- Created **two separate MongoDB databases**:
  - `users` collection for authentication
  - `userScores` collection for tracking quiz results
- Fully deployed the live app on **Render** including environment setup and domain
- Connected the backend with MongoDB Atlas using `.env` securely

---

**API Endpoints:**

- **`GET /api/start?amount=N`**  
  - Fetches `N` quiz questions from the Trivia API (default 10)  
  - Generates a unique `gameId`  
  - Starts a 120-second quiz timer  
  - Stores session in memory  
  - Returns: `{ gameId, questions }`

- **`POST /api/submit`**  
  - Receives: `{ gameId, username, userAnswers }`  
  - Checks if submission is within the time limit  
  - Compares answers, calculates score  
  - Saves: `{ username, score, timeTaken, numQuestions }` to `userScores` in MongoDB  
  - Returns: `{ score, timeTaken }`

- **`GET /api/history/:username`**  
  - Retrieves full quiz attempt history for a user from the `userScores` collection  
  - Returns data sorted by date/time

- **`GET /api/leaderboard`**  
  - Returns top 10 players  
  - Sorted by:
    - Highest score
    - Fastest time (as tiebreaker)

- **`POST /api/user/signup`**  
  - Creates a new user account  
  - Validates inputs and ensures unique usernames  
  - Stores users in the `users` collection in MongoDB

- **`POST /api/user/signin`**  
  - Authenticates an existing user based on stored credentials  
  - Used for login and access to profile/play history

---

**Deployment:**
- Deployed the entire full-stack app (backend and frontend) on **Render**
- Managed `.env` configuration securely in the Render dashboard
- Handled MongoDB URI integration and ensured live server is connected
- Verified all endpoints, session handling, and frontend/backend integration work live

Live App: `https://quizapp-enwg.onrender.com/`


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
- Created the frontend using **HTML** and **CSS**. Each `.html` file corresponds to a specific section of the application and is styled using `style.css`.

**HTML Files & Structure:**

- **`index.html`**  
  - Acts as the main authentication portal  
  - Includes Sign Up and Log In forms within toggleable containers  
  - Input fields are validation-ready for username, email, and password  
  - Redirects to the quiz on successful authentication (via JavaScript)  
  - Contains site-wide header and footer with branding  

- **`home.html`**  
  - Welcome/start page with a quiz description and timer warning  
  - Central “Start Quiz” button linked to `quiz.html`  
  - Structured using `.container` class for spacing and alignment  

- **`quiz.html`**  
  - Quiz setup interface where users choose number of questions (5–20)  
  - Hidden main quiz UI includes:
    - `#timer` element (styled for visibility)
    - Category and question tracker
    - `#quiz-question` and dynamically generated options
    - Sticky “Next” button  

- **`results.html`**  
  - Displays final quiz results:
    - Score in `X/10` format
    - Time taken in seconds
  - Includes a “Restart Quiz” button with soft hover transitions  
  - Uses centered `.container` layout with large headings  

- **`profile.html`**  
  - Displays a personalized welcome using the logged-in username  
  - Lists user’s past attempts using dynamically generated rows inside `#history-container`  

- **`leaderboard.html`**  
  - Shows top 10 players sorted by score and time  
  - Dynamically updates with rank, username, score, and time  
  - Styled using `#leaderboard-container` with hover effects and responsive layout  

- **`signin.html`**  
  - Standalone login screen for users  
  - Consistent UI with `index.html` using the same `.container` layout and form styling  

---

**Styling (`style.css`):**

- **Color & Typography:**
  - Soft pastel palette: `#EDA9A9`, `#fcd6dc`, `#ffeef2`
  - Clean sans-serif font stack for a modern, readable look  

- **Layout & Components:**
  - `.container` sets max-width and centers content  
  - `.auth-box`, `.signup-container`: card-style containers with rounded corners and shadows  
  - `.site-header` and `.site-footer`: styled with spacing and consistent branding  

- **Forms & Inputs:**
  - Inputs styled with padding, border-radius, and interactive hover feedback  
  - Buttons are rounded-pill style with transitions on hover  
  - Responsive full-width layout for mobile  

- **Quiz-Specific Styles:**
  - `.question`, `.label`, `.options`: block-style with background and margin for mobile-friendly design  
  - `#timer`: large, bold, and color-highlighted (`#d6788d`)  
  - Quiz layout is touch-friendly and vertically stacked  

- **Results & Leaderboard:**
  - Score/time outputs use enlarged fonts and spacing  
  - `.results-title`, `.score-line`, `.time-line`: center-aligned for visibility  
  - `#leaderboard-container`: boxed layout with shadows and hover interaction for ranked players  


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

