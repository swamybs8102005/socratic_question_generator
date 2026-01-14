import { memory } from "../mastra/mastra";
import { WorkingMemory, QuestionType, DifficultyBand } from "../types/memory";
import { generateQuestion } from "../agent/question-generator";
import { updateWorkingMemory } from "../eval/updateWorkingMemory";
import { evaluateAnswer, updateWorkingMemoryWithEvaluation } from "../eval/evaluateAnswer";
import { retrieveRAGContext } from "../rag/retriever";

interface LearnerTurn {
  learnerId: string;
  message: string;
  topic?: string;
  confidence?: number;
}

function pickQuestionType(confidence: number, newTopic: boolean, questionCount: number): { type: QuestionType; difficulty: DifficultyBand } {
  // STRUCTURED PROGRESSION: 5 questions per type, then move to next type
  // Order: MCQ → Fill in Blanks → Multiple Answers → Puzzle → Confidence → Evidence → Critical Thinking → Clarification

  const questionTypeOrder: QuestionType[] = [
    "MCQ",                  // 1. Multiple Choice Questions
    "FillInBlank",          // 2. Fill in the Blanks
    "MultipleAnswers",      // 3. Multiple Answers (select all that apply)
    "Puzzle",               // 4. Puzzle Solving
    "ConfidenceBased",      // 5. Confidence-Based Questions
    "EvidenceBased",        // 6. Evidence-Based Questions
    "CriticalThinking",     // 7. Critical Thinking Questions
    "Clarification"         // 8. Clarification Questions
  ];

  const questionsPerType = 5; // 5 questions per type
  const typesPerLevel = questionTypeOrder.length; // 8 types
  const questionsPerLevel = questionsPerType * typesPerLevel; // 40 questions per level

  // Calculate which difficulty level we're at (0=Beginner, 1=Intermediate, 2=Advanced)
  const difficultyIndex = Math.floor(questionCount / questionsPerLevel);

  // Calculate position within current level
  const positionInLevel = questionCount % questionsPerLevel;

  // Calculate which question type within the current level
  const typeIndex = Math.floor(positionInLevel / questionsPerType);

  // Calculate which question within the current type
  const questionInType = (positionInLevel % questionsPerType) + 1;

  // Map difficulty index to difficulty band
  let difficulty: DifficultyBand;
  let levelName: string;

  switch (difficultyIndex) {
    case 0:
      difficulty = "Beginner";
      levelName = "Beginner (Level 1)";
      break;
    case 1:
      difficulty = "Intermediate";
      levelName = "Intermediate (Level 2)";
      break;
    default:
      difficulty = "Advanced";
      levelName = "Advanced (Level 3)";
      break;
  }

  const type = questionTypeOrder[typeIndex];

  // Calculate total progress
  const totalQuestions = questionsPerLevel * 3; // 120 total questions

  console.log(`\n${'='.repeat(80)}`);
  console.log(`📚 QUESTION PROGRESSION`);
  console.log(`${'='.repeat(80)}`);
  console.log(`Question Number: ${questionCount + 1} (Total)`);
  console.log(`Current Level: ${levelName}`);
  console.log(`Question Type: ${type} (${questionInType}/${questionsPerType})`);
  console.log(`Progress in ${difficulty} Level: ${positionInLevel + 1}/${questionsPerLevel} (${Math.round(((positionInLevel + 1) / questionsPerLevel) * 100)}%)`);
  console.log(`Overall Progress: ${questionCount + 1}/${totalQuestions} questions (${Math.round(((questionCount + 1) / totalQuestions) * 100)}%)`);

  // Show what's next
  if (questionInType < questionsPerType) {
    console.log(`Next Question: ${type} #${questionInType + 1} (${difficulty} Level)`);
  } else if (typeIndex < typesPerLevel - 1) {
    console.log(`Next Question Type: ${questionTypeOrder[typeIndex + 1]} (${difficulty} Level)`);
  } else {
    const nextDifficulty = difficultyIndex === 0 ? "Intermediate" : difficultyIndex === 1 ? "Advanced" : "Complete!";
    console.log(`Next: Moving to ${nextDifficulty} Level`);
  }
  console.log(`${'='.repeat(80)}\n`);

  return { type, difficulty };
}

export async function handleTurn(turn: LearnerTurn): Promise<{ question: string; evaluation: any | null }> {
  // Initialize working memory with defaults if not exists
  let wm: WorkingMemory;
  try {
    const retrieved = await memory.getWorkingMemory({ resourceId: turn.learnerId });
    wm = retrieved && typeof retrieved === 'object' ? retrieved as WorkingMemory : null;
  } catch {
    wm = null;
  }

  if (!wm) {
    wm = {
      level: "Beginner",
      confidence: 0.5,
      weakTopics: [],
      lastTopic: undefined,
      streak: { correct: 0, incorrect: 0 },
      misconceptions: []
    };
  }

  // Set the topic from turn BEFORE generating question
  if (turn.topic) {
    wm.lastTopic = turn.topic;
  }

  // Retrieve conversation history from Mastra Memory
  let history: any[] = [];
  // TODO: Fix memory.history API - currently not available
  // try {
  //   const historyData = await memory.history.list({ resourceId: turn.learnerId });
  //   history = Array.isArray(historyData) ? historyData : [];
  // } catch (err) {
  //   console.warn("Failed to retrieve conversation history:", err);
  // }

  // Retrieve semantic recall from Mastra Memory
  let recall: any[] = [];
  // TODO: Fix memory.recall API - currently not available
  // try {
  //   const recallData = await memory.recall.search({ 
  //     resourceId: turn.learnerId,
  //     query: turn.message,
  //     topK: 5 
  //   });
  //   recall = Array.isArray(recallData) ? recallData : [];
  // } catch (err) {
  //   console.warn("Failed to retrieve semantic recall:", err);
  // }

  const newTopic = wm.lastTopic !== turn.topic && !!turn.topic;
  const questionCount = wm.streak.correct + wm.streak.incorrect;
  const { type, difficulty } = pickQuestionType(wm.confidence, newTopic, questionCount);

  // Retrieve RAG context grounded in current topic and difficulty
  const ragResults = await retrieveRAGContext(
    turn.message,
    turn.topic || wm.lastTopic || "general",
    difficulty,
    5
  );
  const ragSignals = ragResults.map((r) => `${r.topic}: ${r.snippet}`);

  const question = await generateQuestion({
    questionType: type,
    difficulty,
    workingMemory: wm,
    historySummary: history.map((h: any) => h.content).join(" | "),
    recallSummary: recall.map((r: any) => r.content).join(" | "),
    ragSignals,
  });

  // Evaluate the learner's answer if provided
  let evaluation = null;
  if (turn.message && turn.message.length > 3) {
    evaluation = evaluateAnswer(question, turn.message, turn.confidence || 50);

    // Update working memory with evaluation
    wm = updateWorkingMemoryWithEvaluation(wm, evaluation, turn.confidence || 50);

    // Set the topic from the turn
    if (turn.topic) {
      wm.lastTopic = turn.topic;
    }
  } else {
    // Update working memory based on question/answer patterns
    wm = updateWorkingMemory(wm, { learnerMessage: turn.message, systemQuestion: question, topic: turn.topic });
  }

  // Store updated working memory
  console.log("Updated working memory:", wm);
  // TODO: Fix memory.wm.save API - currently not available
  // await memory.wm.save({ resourceId: turn.learnerId, data: wm });

  // Save conversation turn to history
  // TODO: Fix memory.history.save API - currently not available
  // try {
  //   await memory.history.save({
  //     resourceId: turn.learnerId,
  //     messages: [
  //       { role: 'user', content: turn.message },
  //       { role: 'assistant', content: typeof question === 'string' ? question : JSON.stringify(question) }
  //     ]
  //   });
  // } catch (err) {
  //   console.warn("Failed to save conversation history:", err);
  // }

  return { question, evaluation };
}

// Demo entrypoint for manual test
(async () => {
  try {
    const question = await handleTurn({ learnerId: "demo", message: "Explain RAG", topic: "RAG" });
    console.log("\n=== Generated Question ===");
    console.log(question);
    console.log("=========================\n");
  } catch (err) {
    console.error("Error:", err);
  }
})();
