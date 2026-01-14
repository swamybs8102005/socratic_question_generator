# Quiz History Feature

## Overview
Added a comprehensive Quiz History system that tracks all completed quizzes with questions and answers, allowing users to review their past performance.

## Features Implemented

### 1. **History Tab in Profile Page**
- New tab added to profile page navigation
- Shows all completed quizzes with topic names
- Displays quiz statistics:
  - Questions answered
  - Average confidence
  - Duration
  - Session depth
- Clickable quiz cards to review details

### 2. **Quiz Review Page** (`/quiz-review`)
- Navigate through all questions from a past quiz
- See previously marked answers highlighted
- View confidence level for each question
- Navigation controls:
  - Previous/Next buttons
  - Progress dots for quick navigation
  - Question counter (X/Y)

### 3. **Answer Tracking in Session Store**
- **New Interface**: `AnsweredQuestion`
  - Stores question data
  - User's answer (string or array)
  - Confidence level
  - Timestamp
- **Session History Enhanced**:
  - Now includes all questions with answers
  - Persisted in local storage

## Technical Implementation

### Updated Files

#### 1. **Session Store** (`frontend/src/store/sessionStore.ts`)
```typescript
// New interface for answered questions
export interface AnsweredQuestion {
  question: Question;
  userAnswer: string | string[];
  confidence: number;
  timestamp: string;
}

// Enhanced SessionHistory
export interface SessionHistory {
  // ... existing fields
  questions: AnsweredQuestion[]; // Store all questions with answers
}

// New state property
currentSessionQuestions: AnsweredQuestion[];
```

**Changes:**
- Tracks all answered questions during active session
- Saves questions to history when session completes
- Clears on session reset

#### 2. **Profile Page** (`frontend/src/app/profile/page.tsx`)
- Added "History" tab
- Displays all past quizzes
- Shows quiz cards with stats
- Click to navigate to review page

#### 3. **Quiz Review Page** (`frontend/src/app/quiz-review/page.tsx`)
- New page for reviewing past quizzes
- Shows questions one at a time
- Highlights user's answers
- Navigation between questions
- Summary statistics at bottom

## User Journey

### Taking a Quiz
1. User starts a learning session
2. Answers questions with confidence levels
3. Each answer is automatically saved
4. Completes or ends the session
5. All questions + answers saved to history

### Reviewing a Quiz
1. User opens Profile → History tab
2. Sees list of all past quizzes
3. Clicks on any quiz card
4. Navigates to Quiz Review page
5. Reviews all questions with their answers
6. Can navigate forward/backward through questions

## UI Features

### History Tab
- **Quiz Cards**: Glass morphism design with hover effects
- **Topic Display**: Large, prominent topic name
- **Difficulty Badge**: Color-coded difficulty level
- **Stats Grid**: 4-column layout showing key metrics
- **Progress Bar**: Visual representation of session depth
- **Clickable**: Entire card is clickable to review

### Quiz Review Page
- **Question Display**: Same format as during quiz
- **Answer Highlighting**: User's answers shown with checkmarks
- **Confidence Bar**: Visual confidence indicator
- **Navigation**: Previous/Next buttons + progress dots
- **Session Stats**: Summary card at bottom
- **Back Button**: Return to profile

## Visual Design

### Colors & Styling
- **Glass morphism**: Translucent cards with backdrop blur
- **Gradients**: Cyan → Purple for progress bars
- **Difficulty Colors**:
  - Beginner: Green (#10b981)
  - Intermediate: Amber (#f59e0b)
  - Advanced: Red (#ef4444)
- **Hover Effects**: Scale transformation and border highlighting

### Animations
- **Page Transitions**: Smooth fade-in with slide
- **Card Hover**: Scale up effect
- **Progress Dots**: Width animation on active dot
- **Stats**: Staggered entrance animations

## Data Persistence

### Local Storage
- Session history saved automatically
- Persists across browser sessions
- Includes all answered questions
- Up to 20 most recent quizzes stored

### Structure
```typescript
sessionHistory: [
  {
    id: "session-1234567890",
    topic: "React Hooks",
    difficulty: "Intermediate",
    questionsAnswered: 10,
    avgConfidence: 75,
    date: "2026-01-05T...",
    duration: 15,
    questions: [
      {
        question: { /* Question object */ },
        userAnswer: "Option A",
        confidence: 80,
        timestamp: "2026-01-05T..."
      },
      // ... more questions
    ]
  },
  // ... more sessions
]
```

## Usage Examples

### Viewing History
```
1. Click profile avatar/button
2. Navigate to Profile page
3. Click "History" tab
4. See all past quizzes listed
```

### Reviewing Answers
```
1. In History tab, click any quiz card
2. Quiz Review page opens
3. See first question with your answer
4. Click "Next" to see more questions
5. Use progress dots to jump to specific questions
6. Click "Back to Profile" when done
```

## Benefits

### For Learners
- **Track Progress**: See all completed quizzes
- **Review Mistakes**: Look back at answers
- **Study Tool**: Use past quizzes for revision
- **Confidence Analysis**: See confidence trends
- **Memory Aid**: Recall what was learned

### For System
- **Data Collection**: Rich data about user performance
- **Analytics**: Can analyze answer patterns
- **Improvement**: Identify weak areas
- **Engagement**: Encourages review and learning

## Future Enhancements

### Potential Additions
1. **Filter/Search**: Filter history by topic, date, difficulty
2. **Correct Answers**: Show correct answers alongside user answers
3. **Score Display**: Calculate and show quiz scores
4. **Export**: Download quiz history as PDF
5. **Comparison**: Compare performance across topics
6. **Retake Quiz**: Option to retake same quiz
7. **Share Results**: Share quiz performance
8. **Statistics**: Detailed analytics and charts
9. **Notes**: Add notes to specific questions
10. **Bookmarks**: Mark questions for later review

## Technical Notes

### Performance
- Lazy loading of quiz history
- Efficient state management
- Optimized re-renders
- Smooth animations without lag

### Accessibility
- Keyboard navigation support
- Clear visual feedback
- Semantic HTML structure
- Screen reader compatible

### Browser Support
- Works in all modern browsers
- Local storage fallback
- Progressive enhancement

## Testing Checklist

- [x] Answer questions and complete session
- [x] Verify questions saved to history
- [x] Open History tab in profile
- [x] Click quiz card to navigate
- [x] Review questions with answers
- [x] Navigate between questions
- [x] Check progress dots work
- [x] Verify back button returns to profile
- [x] Test with multiple quizzes
- [x] Verify persistence after page reload

## Summary

The Quiz History feature provides a complete solution for tracking and reviewing past learning sessions. Users can see all their completed quizzes in one place and review their answers at any time, making it an excellent tool for learning reinforcement and self-assessment.
