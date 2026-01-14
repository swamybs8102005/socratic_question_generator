import { WorkingMemory } from "../types/memory";

interface EvalInput {
  learnerMessage: string;
  systemQuestion: string;
  topic?: string;
}

export function updateWorkingMemory(current: WorkingMemory, input: EvalInput): WorkingMemory {
  const next = { ...current };

  const lower = input.learnerMessage.toLowerCase();
  
  // Detect hesitation patterns
  const hesitant = lower.includes("not sure") || lower.includes("maybe") || 
                   lower.includes("i think") || lower.includes("unsure");
  
  // Detect confidence patterns
  const confident = lower.includes("confident") || lower.includes("definitely") ||
                    lower.includes("certain") || lower.includes("sure");

  // Adjust confidence based on sentiment
  if (hesitant) {
    next.confidence = Math.max(0, next.confidence - 0.1);
  } else if (confident) {
    next.confidence = Math.min(1, next.confidence + 0.1);
  }

  // Detect potential correctness heuristics (simple pattern matching)
  const likelyCorrect = lower.length > 20 && !hesitant && (confident || lower.includes("because"));
  const likelyIncorrect = lower.length < 10 || lower.includes("don't know") || lower.includes("idk");

  if (likelyCorrect) {
    next.streak.correct += 1;
    next.streak.incorrect = 0;
    next.confidence = Math.min(1, next.confidence + 0.05);
  } else if (likelyIncorrect) {
    next.streak.incorrect += 1;
    next.streak.correct = 0;
    next.confidence = Math.max(0, next.confidence - 0.15);
  }

  // If asked clarification, reset streak (indicating new baseline)
  const questionText = typeof input.systemQuestion === 'string' 
    ? input.systemQuestion 
    : input.systemQuestion?.question || '';
  
  if (questionText.toLowerCase().includes("clarification") || 
      questionText.toLowerCase().includes("what do you understand")) {
    next.streak = { correct: 0, incorrect: 0 };
  }

  // Level progression based on sustained performance
  if (next.streak.correct >= 5 && next.confidence > 0.7) {
    if (next.level === "Beginner") next.level = "Intermediate";
    else if (next.level === "Intermediate") next.level = "Advanced";
  } else if (next.streak.incorrect >= 3 || next.confidence < 0.3) {
    if (next.level === "Advanced") next.level = "Intermediate";
    else if (next.level === "Intermediate") next.level = "Beginner";
  }

  // Update last topic
  next.lastTopic = input.topic || next.lastTopic || "general";

  return next;
}
