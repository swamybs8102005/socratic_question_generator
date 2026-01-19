# Question Progression System

## Overview
The learning system now follows a **structured progression** through 8 different question types across 3 difficulty levels, ensuring comprehensive assessment and skill development.

## Progression Structure

### Total Questions: 24 (8 types × 3 levels)

```
BEGINNER LEVEL (Questions 1-8)
├── 1. MCQ Questions
├── 2. Fill in the Blanks
├── 3. Multiple Answers
├── 4. Puzzle Solving
├── 5. Confidence-Based Questions
├── 6. Evidence-Based Questions
├── 7. Critical Thinking Questions
└── 8. Clarification Questions

INTERMEDIATE LEVEL (Questions 9-16)
├── 9. MCQ Questions
├── 10. Fill in the Blanks
├── 11. Multiple Answers
├── 12. Puzzle Solving
├── 13. Confidence-Based Questions
├── 14. Evidence-Based Questions
├── 15. Critical Thinking Questions
└── 16. Clarification Questions

ADVANCED LEVEL (Questions 17-24)
├── 17. MCQ Questions
├── 18. Fill in the Blanks
├── 19. Multiple Answers
├── 20. Puzzle Solving
├── 21. Confidence-Based Questions
├── 22. Evidence-Based Questions
├── 23. Critical Thinking Questions
└── 24. Clarification Questions
```

## Question Type Details

### 1. MCQ (Multiple Choice Questions) 📝
- **Purpose**: Test factual knowledge and understanding
- **Format**: 4 options, select one correct answer
- **Skills**: Recognition, recall, basic comprehension
- **Example**: "What is the primary purpose of RAG systems?"

### 2. Fill in the Blanks ✍️
- **Purpose**: Test specific knowledge and terminology
- **Format**: Complete sentences with missing words
- **Skills**: Precise recall, conceptual understanding
- **Example**: "RAG bridges the gap between _____ and _____."

### 3. Multiple Answers ☑️
- **Purpose**: Test comprehensive understanding
- **Format**: Select ALL correct options (2-4 correct out of 4-6 options)
- **Skills**: Judgment, comprehensive knowledge, discrimination
- **Example**: "Which factors impact RAG effectiveness? (Select ALL)"

### 4. Puzzle Solving 🧩
- **Purpose**: Test problem-solving and application
- **Format**: Scenario-based challenges requiring logical reasoning
- **Skills**: Critical analysis, creative thinking, application
- **Example**: "Your RAG system fails at scale. Debug the architecture..."

### 5. Confidence-Based Questions 💪
- **Purpose**: Assess metacognition and self-awareness
- **Format**: Answer + rate your confidence (0-100%)
- **Skills**: Self-assessment, honest evaluation, awareness of knowledge gaps
- **Example**: "Explain RAG caching strategies. How confident are you?"

### 6. Evidence-Based Questions 🔍
- **Purpose**: Test ability to support claims with evidence
- **Format**: Make an argument and provide supporting evidence
- **Skills**: Research, citation, logical reasoning, proof
- **Example**: "Claim: RAG reduces hallucinations. Provide 3 pieces of evidence."

### 7. Critical Thinking Questions 🧠
- **Purpose**: Test higher-order thinking and analysis
- **Format**: Evaluate, critique, or defend a position
- **Skills**: Analysis, synthesis, evaluation, argumentation
- **Example**: "Critique RAG's fundamental architecture. What would you change?"

### 8. Clarification Questions 💡
- **Purpose**: Test deep understanding and teaching ability
- **Format**: Explain concepts clearly to different audiences
- **Skills**: Communication, simplification, analogy, teaching
- **Example**: "Explain RAG to someone who's never heard of it."

## Difficulty Progression

### Beginner Level (Green) 🟢
- **Focus**: Foundational concepts and basic understanding
- **Depth**: Surface-level knowledge
- **Complexity**: Simple, straightforward questions
- **Goal**: Build confidence and establish baseline knowledge

### Intermediate Level (Amber) 🟡
- **Focus**: Application and practical scenarios
- **Depth**: Moderate understanding with connections
- **Complexity**: Multi-step thinking, trade-offs
- **Goal**: Develop practical skills and deeper comprehension

### Advanced Level (Red) 🔴
- **Focus**: Expert-level analysis and innovation
- **Depth**: Deep understanding with critical evaluation
- **Complexity**: Complex scenarios, edge cases, design decisions
- **Goal**: Master the topic and think like an expert

## Visual Progress Tracking

### Progress Tracker Features
- **Overall Progress Bar**: Shows position in 24-question journey
- **Level Cards**: Separate sections for Beginner/Intermediate/Advanced
- **Question Type Pills**: Visual indicators for each question type
- **Current Question Highlight**: Glowing border around active question
- **Completion Checkmarks**: ✓ marks on completed questions
- **Next Question Preview**: Shows what's coming next

### Color Coding
- **Green (#10b981)**: Beginner level
- **Amber (#f59e0b)**: Intermediate level
- **Red (#ef4444)**: Advanced level
- **Glowing Ring**: Current question being answered

## Backend Implementation

### File: `src/orchestrator/route.ts`

The `pickQuestionType()` function now:
1. Calculates question number from working memory streak
2. Determines difficulty level (Beginner/Intermediate/Advanced)
3. Selects question type based on position in sequence
4. Logs detailed progress information
5. Shows next question type prediction

### Console Output Example
```
================================================================================
📚 QUESTION PROGRESSION
================================================================================
Question Number: 5 (Total)
Current Level: Beginner (Level 1)
Question Type: ConfidenceBased
Progress in Beginner Level: 5/8 (63%)
Overall Progress: 5/24 questions (21%)
Next Question Type: EvidenceBased (Beginner Level)
================================================================================
```

## Frontend Implementation

### Component: `QuestionProgressTracker.tsx`
- **Location**: `frontend/src/components/ui/`
- **Props**: 
  - `currentQuestionNumber` (1-24)
  - `totalQuestions` (default: 24)
- **Features**:
  - Animated progress bars
  - Interactive question type pills
  - Pulsing animation on current question
  - Completion indicators
  - Responsive grid layout

### Integration in Learn Page
The progress tracker is displayed above the question card, providing constant visibility of the learning journey.

## Benefits of This System

### For Learners
1. **Clear Path**: Know exactly where you are in the learning journey
2. **Motivation**: See progress and celebrate milestones
3. **Variety**: Different question formats prevent monotony
4. **Skill Development**: Each type builds different cognitive skills
5. **Gradual Challenge**: Natural progression from easy to hard

### For Educators
1. **Comprehensive Assessment**: 8 types × 3 levels = thorough evaluation
2. **Skill Mapping**: Identify which question types/levels are challenging
3. **Data Collection**: Track performance across all dimensions
4. **Standardization**: Consistent structure across all topics
5. **Predictability**: Know what's coming next in the sequence

## Customization Options

### Adjusting the Progression
To modify the progression, edit `src/orchestrator/route.ts`:

```typescript
const questionTypeOrder: QuestionType[] = [
  "MCQ",                  // 1. Change order here
  "FillInBlank",          // 2. Or add/remove types
  "MultipleAnswers",      // 3. System adapts automatically
  // ... more types
];
```

### Changing Questions per Level
```typescript
const questionsPerLevel = questionTypeOrder.length; // Default: 8
```

### Adding More Difficulty Levels
Currently supports 3 levels. To add more:
1. Add to `difficulties` array
2. Update color mapping
3. Adjust calculation logic

## Future Enhancements

### Potential Additions
1. **Adaptive Skipping**: Skip Beginner if learner shows mastery
2. **Bonus Rounds**: Extra questions for perfect scores
3. **Time Trials**: Timed questions for speed assessment
4. **Review Mode**: Re-attempt failed question types
5. **Custom Paths**: Let learners choose their progression
6. **Difficulty Adjustment**: Auto-adjust based on performance
7. **Topic Mastery**: Unlock new topics after completing 24 questions
8. **Badges & Achievements**: Rewards for completing levels
9. **Comparison**: See how you compare to others
10. **Export Progress**: Download learning report

## Performance Tracking

### Metrics Collected
- Questions answered per type
- Average confidence per type
- Time spent per question type
- Success rate at each difficulty level
- Weak areas identified
- Strong areas reinforced

### Working Memory Updates
The system tracks:
- `streak.correct`: Number of correct answers
- `streak.incorrect`: Number of incorrect answers
- Total questions: `correct + incorrect`
- Current position in progression

## Testing the System

### Manual Testing Steps
1. Start a new learning session
2. Answer questions in sequence
3. Observe progress tracker updates
4. Verify question type changes after each answer
5. Check console logs for progression details
6. Complete all 24 questions to see full cycle

### Expected Behavior
- Question 1: Beginner MCQ
- Question 2: Beginner Fill in Blanks
- Question 8: Beginner Clarification
- Question 9: Intermediate MCQ
- Question 16: Intermediate Clarification
- Question 17: Advanced MCQ
- Question 24: Advanced Clarification

## Troubleshooting

### Progress Not Updating
- Check `sessionData.questionsAnswered` value
- Verify working memory is being updated
- Check console for progression logs

### Wrong Question Type Shown
- Verify `questionCount` calculation
- Check `pickQuestionType()` logic
- Review question type order array

### Progress Tracker Not Displaying
- Ensure component is imported in Learn page
- Check `currentQuestionNumber` prop
- Verify Framer Motion is installed

## Conclusion

This structured progression system ensures:
- ✅ Comprehensive skill assessment
- ✅ Clear learning path
- ✅ Variety in question formats
- ✅ Gradual difficulty increase
- ✅ Visible progress tracking
- ✅ Motivation through achievement
- ✅ Data-driven insights

The system transforms learning from random questions to a structured journey, making progress visible and achievement tangible.
