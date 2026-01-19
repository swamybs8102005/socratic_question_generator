import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { handleTurn } from '../orchestrator/route';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '../config/env';
import quizHistoryRouter from './quiz-history';
import authRouter from './auth-simple'; // Using simple in-memory auth (no PostgreSQL required)

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

// Auth routes
app.use('/api/auth', authRouter);

// Quiz history routes
app.use('/api/quiz', quizHistoryRouter);

app.post('/api/turn', async (req, res) => {
  try {
    const { learnerId, message, topic } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const { question, evaluation, correctAnswer } = await handleTurn({
      learnerId: learnerId || 'default-learner',
      message,
      topic
    });

    console.log("📤 API Response:");
    console.log("  Has Question:", !!question);
    console.log("  Has Evaluation:", !!evaluation);
    console.log("  Correct Answer:", correctAnswer);

    res.json({ question, evaluation, correctAnswer });
  } catch (error) {
    console.error('Error handling turn:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/hint', async (req, res) => {
  try {
    const { question, topic, difficulty } = req.body;

    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    // Generate hint using Gemini AI
    const genAI = new GoogleGenerativeAI(env.geminiApiKey || '');
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are a helpful tutor. Provide a SHORT hint (1-2 sentences) to help the student answer this question without giving away the answer directly.

Question: ${question}
Topic: ${topic}
Difficulty: ${difficulty}

Hint guidelines:
- Don't give the answer directly
- Point them in the right direction
- Use simple language
- Be encouraging
- Keep it brief (1-2 sentences max)

Provide ONLY the hint text, no other formatting:`;

    const result = await model.generateContent(prompt);
    const hint = result.response.text().trim();

    res.json({ hint });
  } catch (error) {
    console.error('Error generating hint:', error);
    res.status(500).json({ error: 'Failed to generate hint' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
