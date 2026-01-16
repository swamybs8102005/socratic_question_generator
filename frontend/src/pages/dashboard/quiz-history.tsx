import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, TrendingUp, TrendingDown, Minus, Award, Target, Brain, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface QuizAttempt {
  id: string;
  topic: string;
  startTime: string;
  endTime: string;
  score: number;
  totalQuestions: number;
  accuracy: number;
  questions: Array<{
    question: string;
    questionType: string;
    difficulty: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
  }>;
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

export default function QuizHistory() {
  const navigate = useNavigate();
  const [history, setHistory] = useState<QuizAttempt[]>([]);
  const [analysis, setAnalysis] = useState<PerformanceAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAttempt, setSelectedAttempt] = useState<QuizAttempt | null>(null);

  useEffect(() => {
    fetchHistory();
    fetchAnalysis();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/quiz/history/default-learner');
      const data = await response.json();
      setHistory(data.history || []);
    } catch (error) {
      console.error('Failed to fetch history:', error);
    }
  };

  const fetchAnalysis = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/quiz/analyze/default-learner');
      const data = await response.json();
      setAnalysis(data);
    } catch (error) {
      console.error('Failed to fetch analysis:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'declining':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-500/20 text-green-700 border-green-500/50';
      case 'Intermediate':
        return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/50';
      case 'Advanced':
        return 'bg-red-500/20 text-red-700 border-red-500/50';
      default:
        return 'bg-gray-500/20 text-gray-700 border-gray-500/50';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading quiz history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Quiz History & Analytics
            </h1>
            <p className="text-muted-foreground mt-2">
              Track your learning progress and get personalized recommendations
            </p>
          </div>
        </div>

        {analysis && (
          <>
            {/* Performance Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Overall Accuracy</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{analysis.overallAccuracy.toFixed(1)}%</div>
                  <Progress value={analysis.overallAccuracy} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Quizzes Completed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    <div className="text-3xl font-bold">{analysis.totalQuizzesCompleted}</div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {analysis.totalQuestionsAnswered} questions answered
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Recommended Level</CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge className={`${getDifficultyColor(analysis.recommendedDifficulty)} text-lg px-3 py-1`}>
                    {analysis.recommendedDifficulty}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-2">
                    Based on your performance
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Recent Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    {getTrendIcon(analysis.recentTrend)}
                    <div className="text-3xl font-bold capitalize">{analysis.recentTrend}</div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Last 5 quizzes
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Difficulty Breakdown */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Performance by Difficulty
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(analysis.difficultyBreakdown).map(([difficulty, stats]) => (
                    <div key={difficulty} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge className={getDifficultyColor(difficulty)}>
                            {difficulty}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {stats.correct} / {stats.total} correct
                          </span>
                        </div>
                        <span className="font-bold">{stats.accuracy.toFixed(1)}%</span>
                      </div>
                      <Progress value={stats.accuracy} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Topics Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-red-500" />
                    Topics to Practice
                  </CardTitle>
                  <CardDescription>Areas where you need more practice</CardDescription>
                </CardHeader>
                <CardContent>
                  {analysis.weakTopics.length > 0 ? (
                    <div className="space-y-2">
                      {analysis.weakTopics.map((topic, idx) => (
                        <div key={idx} className="flex items-center gap-2 p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                          <div className="w-2 h-2 rounded-full bg-red-500"></div>
                          <span className="font-medium">{topic}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No weak topics identified yet. Keep practicing!</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-green-500" />
                    Strong Topics
                  </CardTitle>
                  <CardDescription>Areas where you excel</CardDescription>
                </CardHeader>
                <CardContent>
                  {analysis.strongTopics.length > 0 ? (
                    <div className="space-y-2">
                      {analysis.strongTopics.map((topic, idx) => (
                        <div key={idx} className="flex items-center gap-2 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          <span className="font-medium">{topic}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Complete more quizzes to identify your strengths!</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {/* Quiz History */}
        <Card>
          <CardHeader>
            <CardTitle>Quiz Attempts</CardTitle>
            <CardDescription>Your complete quiz history</CardDescription>
          </CardHeader>
          <CardContent>
            {history.length > 0 ? (
              <div className="space-y-4">
                {history.map((attempt) => (
                  <div
                    key={attempt.id}
                    className="p-4 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
                    onClick={() => setSelectedAttempt(attempt)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="text-lg font-bold">{attempt.topic}</div>
                        <Badge variant="outline" className="text-xs">
                          {new Date(attempt.startTime).toLocaleDateString()}
                        </Badge>
                      </div>
                      <div className="text-2xl font-bold">
                        {attempt.score}/{attempt.totalQuestions}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Progress value={attempt.accuracy} className="h-2 flex-1 mr-4" />
                      <span className="text-sm font-medium">{attempt.accuracy.toFixed(1)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No quiz attempts yet</p>
                <Button onClick={() => navigate('/dashboard')}>Start Learning</Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Start Adaptive Quiz Button */}
        {analysis && analysis.recommendedDifficulty && (
          <div className="mt-8 text-center">
            <Card className="bg-gradient-to-r from-primary/10 to-purple-600/10 border-primary/20">
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold mb-2">Ready for the Next Challenge?</h3>
                <p className="text-muted-foreground mb-4">
                  Based on your performance, we recommend starting at <strong>{analysis.recommendedDifficulty}</strong> level
                </p>
                <Button size="lg" onClick={() => navigate('/dashboard')}>
                  Start Adaptive Quiz
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
  );
}
