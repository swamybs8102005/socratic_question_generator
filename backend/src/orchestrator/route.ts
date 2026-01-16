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

// Track question type history per learner to ensure variety
const questionTypeHistory = new Map<string, QuestionType[]>();
const MAX_TYPE_HISTORY = 8;

function pickQuestionType(confidence: number, newTopic: boolean, questionCount: number, learnerId: string): { type: QuestionType; difficulty: DifficultyBand } {
  // DYNAMIC PROGRESSION: Randomly select from all question types based on history
  // Ensures variety while avoiding recent duplicates
  
  const allQuestionTypes: QuestionType[] = [
    "MCQ",                  // 1. Multiple Choice Questions
    "FillInBlank",          // 2. Fill in the Blanks (text input)
    "MultipleAnswers",      // 3. Multiple Answers (select all that apply)
    "MultipleBlanksFill",   // 4. Fill Multiple Blanks with Options
    "Puzzle",               // 5. Puzzle Solving
    "ConfidenceBased",      // 6. Confidence-Based Questions
    "EvidenceBased",        // 7. Evidence-Based Questions
    "CriticalThinking",     // 8. Critical Thinking Questions
    "Clarification"         // 9. Clarification Questions
  ];

  // Get recent question types for this learner
  const recentTypes = questionTypeHistory.get(learnerId) || [];
  
  // Filter out recently used types to ensure variety
  const availableTypes = recentTypes.length >= 3 
    ? allQuestionTypes.filter(type => !recentTypes.slice(-3).includes(type))
    : allQuestionTypes;
  
  // If all types have been used recently, allow any type
  const typesToChooseFrom = availableTypes.length > 0 ? availableTypes : allQuestionTypes;
  
  // Randomly select a question type
  const type = typesToChooseFrom[Math.floor(Math.random() * typesToChooseFrom.length)];
  
  // Track this type in history
  recentTypes.push(type);
  if (recentTypes.length > MAX_TYPE_HISTORY) {
    recentTypes.shift();
  }
  questionTypeHistory.set(learnerId, recentTypes);

  // Determine difficulty based on confidence and question count
  // First 10 questions: Beginner
  // Next 15 questions: Intermediate  
  // After 25 questions: Advanced
  let difficulty: DifficultyBand;
  let levelName: string;

  if (questionCount < 10) {
    difficulty = "Beginner";
    levelName = "Beginner (Level 1)";
  } else if (questionCount < 25) {
    difficulty = "Intermediate";
    levelName = "Intermediate (Level 2)";
  } else {
    difficulty = "Advanced";
    levelName = "Advanced (Level 3)";
  }

  // Adjust difficulty based on confidence
  if (confidence > 0.8 && difficulty === "Beginner" && questionCount >= 5) {
    difficulty = "Intermediate";
    levelName = "Intermediate (Level 2) [Promoted]";
  } else if (confidence > 0.9 && difficulty === "Intermediate" && questionCount >= 15) {
    difficulty = "Advanced";
    levelName = "Advanced (Level 3) [Promoted]";
  } else if (confidence < 0.4 && difficulty === "Advanced") {
    difficulty = "Intermediate";
    levelName = "Intermediate (Level 2) [Adjusted]";
  } else if (confidence < 0.3 && difficulty === "Intermediate" && questionCount >= 10) {
    difficulty = "Beginner";
    levelName = "Beginner (Level 1) [Adjusted]";
  }

  console.log(`\n${'='.repeat(80)}`);
  console.log(`📚 QUESTION SELECTION (Dynamic)`);
  console.log(`${'='.repeat(80)}`);
  console.log(`Question Number: ${questionCount + 1} (Total)`);
  console.log(`Current Level: ${levelName}`);
  console.log(`Confidence Score: ${(confidence * 100).toFixed(1)}%`);
  console.log(`Question Type: ${type} (randomly selected)`);
  console.log(`Recent Types: ${recentTypes.slice(-5).join(' → ')}`);
  console.log(`Available Types: ${typesToChooseFrom.length}/${allQuestionTypes.length}`);
  console.log(`${'='.repeat(80)}\n`);

  return { type, difficulty };
}

export async function handleTurn(turn: LearnerTurn): Promise<{ question: any; evaluation: any | null; correctAnswer?: string }> {
  try {
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
  
  // Only count actual answers, not initial "I want to learn about..." messages
  // "next question" should INCREMENT the counter, so it's NOT an initial message
  const isInitialMessage = turn.message.toLowerCase().includes('i want to learn') || 
                          turn.message.toLowerCase().includes('teach me') ||
                          turn.message.length < 10;
  
  const questionCount = wm.streak.correct + wm.streak.incorrect;
  const { type, difficulty } = pickQuestionType(wm.confidence, newTopic, questionCount, turn.learnerId);

  // Retrieve RAG context grounded in current topic and difficulty
  const ragResults = await retrieveRAGContext(
    turn.message,
    turn.topic || wm.lastTopic || "general",
    difficulty,
    5
  );
  const ragSignals = ragResults.map((r) => `${r.topic}: ${r.snippet}`);

  // Generate new question
  const question = await generateQuestion({
    questionType: type,
    difficulty,
    workingMemory: wm,
    historySummary: history.map((h: any) => h.content).join(" | "),
    recallSummary: recall.map((r: any) => r.content).join(" | "),
    ragSignals,
    learnerId: turn.learnerId, // Pass actual learner ID for duplicate tracking
  });

  // Extract correct answer from the NEW question
  let correctAnswer: string | undefined;
  if (typeof question === 'object') {
    // Try to get correctAnswer field first
    correctAnswer = question.correctAnswer;
    // Fallback to first option if not specified
    if (!correctAnswer && question.options && question.options.length > 0) {
      correctAnswer = question.options[0];
    }
    
    console.log("🎯 Correct Answer Extraction (for NEW question):");
    console.log("  correctAnswer field:", JSON.stringify(question.correctAnswer));
    console.log("  First option:", JSON.stringify(question.options?.[0]));
    console.log("  Final correctAnswer:", JSON.stringify(correctAnswer));
    console.log("📝 All Options:", question.options?.map((opt: string) => JSON.stringify(opt)));
  }

  // DON'T evaluate the learner's answer here - evaluation happens on the frontend
  // Just return the new question and its correct answer
  let evaluation = null;
  
  if (!isInitialMessage) {
    // For non-initial messages (when user requests next question), increment question count
    // We don't know if they got it right or wrong (frontend handles that), so just increment "correct" to track progression
    wm.streak.correct += 1;
    console.log(`✅ Incremented question count: ${wm.streak.correct} questions answered`);
  } else {
    // For initial message, just set the topic without updating streak
    if (turn.topic) {
      wm.lastTopic = turn.topic;
    }
    // Update working memory based on question/answer patterns (without evaluation)
    // wm = updateWorkingMemory(wm, { learnerMessage: turn.message, systemQuestion: question, topic: turn.topic });
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

  return { question, evaluation, correctAnswer };
  } catch (error) {
    console.error("❌ Error in handleTurn:", error);
    throw error; // Re-throw to be caught by API handler
  }
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
