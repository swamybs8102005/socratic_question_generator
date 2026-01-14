import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { handleTurn } from '../orchestrator/route';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

app.post('/api/turn', async (req, res) => {
  try {
    const { learnerId, message, topic } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const { question, evaluation } = await handleTurn({
      learnerId: learnerId || 'default-learner',
      message,
      topic
    });

    res.json({ question, evaluation });
  } catch (error) {
    console.error('Error handling turn:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
