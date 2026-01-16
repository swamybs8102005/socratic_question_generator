import { Router } from 'express';

const router = Router();

// In-memory storage for quiz history (replace with database in production)
const quizHistory = new Map<string, Array<QuizAttempt>>();

interface QuizAttempt {
  id: string;
  learnerId: string;
  topic: string;
  startTime: Date;
  endTime: Date;
  questions: Array<{
    question: string;
    questionType: string;
    difficulty: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    timeSpent: number; // in seconds
  }>;
  score: number;
  totalQuestions: number;
  accuracy: number; // percentage
  averageTimePerQuestion: number;
}

interface PerformanceAnalysis {
  overallAccuracy: number;
  totalQuizzesCompleted: number;
  totalQuestionsAnswered: number;
  averageScore: number;
  difficultyBreakdown: {
    Beginner: { correct: number; total: number; accuracy: number };
    Intermediate: { correct: number; total: number; accuracy: number };
    Advanced: { correct: number; total: number; accuracy: number };
  };
  questionTypeBreakdown: Record<string, { correct: number; total: number; accuracy: number }>;
  recommendedDifficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  weakTopics: string[];
  strongTopics: string[];
  recentTrend: 'improving' | 'stable' | 'declining';
}

// Save quiz attempt
router.post('/save', (req, res) => {
  try {
    const attempt: QuizAttempt = req.body;
    
    if (!attempt.learnerId) {
      return res.status(400).json({ error: 'learnerId is required' });
    }

    if (!quizHistory.has(attempt.learnerId)) {
      quizHistory.set(attempt.learnerId, []);
    }

    const history = quizHistory.get(attempt.learnerId)!;
    history.push(attempt);

    console.log(`✅ Quiz saved for ${attempt.learnerId}: ${attempt.score}/${attempt.totalQuestions} (${attempt.accuracy}%)`);

    res.json({ success: true, attemptId: attempt.id });
  } catch (error) {
    console.error('Error saving quiz:', error);
    res.status(500).json({ error: 'Failed to save quiz' });
  }
});

// Get quiz history for a learner
router.get('/history/:learnerId', (req, res) => {
  try {
    const { learnerId } = req.params;
    const history = quizHistory.get(learnerId) || [];

    res.json({ history });
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// Analyze performance and get recommendations
router.get('/analyze/:learnerId', (req, res) => {
  try {
    const { learnerId } = req.params;
    const history = quizHistory.get(learnerId) || [];

    if (history.length === 0) {
      return res.json({
        overallAccuracy: 0,
        totalQuizzesCompleted: 0,
        totalQuestionsAnswered: 0,
        averageScore: 0,
        recommendedDifficulty: 'Beginner',
        difficultyBreakdown: {
          Beginner: { correct: 0, total: 0, accuracy: 0 },
          Intermediate: { correct: 0, total: 0, accuracy: 0 },
          Advanced: { correct: 0, total: 0, accuracy: 0 }
        },
        questionTypeBreakdown: {},
        weakTopics: [],
        strongTopics: [],
        recentTrend: 'stable'
      });
    }

    // Calculate overall statistics
    const totalQuestions = history.reduce((sum, attempt) => sum + attempt.totalQuestions, 0);
    const totalCorrect = history.reduce((sum, attempt) => sum + attempt.score, 0);
    const overallAccuracy = (totalCorrect / totalQuestions) * 100;
    const averageScore = totalCorrect / history.length;

    // Analyze by difficulty
    const difficultyBreakdown = {
      Beginner: { correct: 0, total: 0, accuracy: 0 },
      Intermediate: { correct: 0, total: 0, accuracy: 0 },
      Advanced: { correct: 0, total: 0, accuracy: 0 }
    };

    const questionTypeBreakdown: Record<string, { correct: number; total: number; accuracy: number }> = {};
    const topicPerformance: Record<string, { correct: number; total: number }> = {};

    history.forEach(attempt => {
      attempt.questions.forEach(q => {
        // Difficulty breakdown
        const diff = q.difficulty as keyof typeof difficultyBreakdown;
        if (difficultyBreakdown[diff]) {
          difficultyBreakdown[diff].total++;
          if (q.isCorrect) difficultyBreakdown[diff].correct++;
        }

        // Question type breakdown
        if (!questionTypeBreakdown[q.questionType]) {
          questionTypeBreakdown[q.questionType] = { correct: 0, total: 0, accuracy: 0 };
        }
        questionTypeBreakdown[q.questionType].total++;
        if (q.isCorrect) questionTypeBreakdown[q.questionType].correct++;

        // Topic performance
        if (!topicPerformance[attempt.topic]) {
          topicPerformance[attempt.topic] = { correct: 0, total: 0 };
        }
        topicPerformance[attempt.topic].total++;
        if (q.isCorrect) topicPerformance[attempt.topic].correct++;
      });
    });

    // Calculate accuracy percentages
    Object.keys(difficultyBreakdown).forEach(key => {
      const diff = key as keyof typeof difficultyBreakdown;
      if (difficultyBreakdown[diff].total > 0) {
        difficultyBreakdown[diff].accuracy = 
          (difficultyBreakdown[diff].correct / difficultyBreakdown[diff].total) * 100;
      }
    });

    Object.keys(questionTypeBreakdown).forEach(type => {
      if (questionTypeBreakdown[type].total > 0) {
        questionTypeBreakdown[type].accuracy = 
          (questionTypeBreakdown[type].correct / questionTypeBreakdown[type].total) * 100;
      }
    });

    // Determine recommended difficulty
    let recommendedDifficulty: 'Beginner' | 'Intermediate' | 'Advanced' = 'Beginner';
    
    if (difficultyBreakdown.Advanced.total >= 10 && difficultyBreakdown.Advanced.accuracy >= 70) {
      recommendedDifficulty = 'Advanced';
    } else if (difficultyBreakdown.Intermediate.total >= 10 && difficultyBreakdown.Intermediate.accuracy >= 75) {
      recommendedDifficulty = 'Advanced';
    } else if (difficultyBreakdown.Beginner.total >= 10 && difficultyBreakdown.Beginner.accuracy >= 80) {
      recommendedDifficulty = 'Intermediate';
    }

    // Identify weak and strong topics
    const topicAccuracies = Object.entries(topicPerformance).map(([topic, perf]) => ({
      topic,
      accuracy: (perf.correct / perf.total) * 100,
      total: perf.total
    })).filter(t => t.total >= 3); // Only consider topics with at least 3 questions

    const weakTopics = topicAccuracies
      .filter(t => t.accuracy < 60)
      .sort((a, b) => a.accuracy - b.accuracy)
      .map(t => t.topic)
      .slice(0, 3);

    const strongTopics = topicAccuracies
      .filter(t => t.accuracy >= 80)
      .sort((a, b) => b.accuracy - a.accuracy)
      .map(t => t.topic)
      .slice(0, 3);

    // Calculate recent trend (last 5 quizzes)
    let recentTrend: 'improving' | 'stable' | 'declining' = 'stable';
    if (history.length >= 5) {
      const recent = history.slice(-5);
      const older = history.slice(-10, -5);
      
      if (older.length >= 3) {
        const recentAvg = recent.reduce((sum, a) => sum + a.accuracy, 0) / recent.length;
        const olderAvg = older.reduce((sum, a) => sum + a.accuracy, 0) / older.length;
        
        if (recentAvg > olderAvg + 5) recentTrend = 'improving';
        else if (recentAvg < olderAvg - 5) recentTrend = 'declining';
      }
    }

    const analysis: PerformanceAnalysis = {
      overallAccuracy,
      totalQuizzesCompleted: history.length,
      totalQuestionsAnswered: totalQuestions,
      averageScore,
      difficultyBreakdown,
      questionTypeBreakdown,
      recommendedDifficulty,
      weakTopics,
      strongTopics,
      recentTrend
    };

    res.json(analysis);
  } catch (error) {
    console.error('Error analyzing performance:', error);
    res.status(500).json({ error: 'Failed to analyze performance' });
  }
});

export default router;
