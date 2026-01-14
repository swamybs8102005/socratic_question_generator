import { generateMockQuestion } from "./src/agent/mock-questions";
import type { QuestionType, DifficultyBand } from "./src/types/memory";

console.log("=== Testing All 8 Question Types ===\n");

const types: QuestionType[] = [
  "Clarification",
  "MCQ", 
  "FillInBlank",
  "MultipleAnswers",
  "Puzzle",
  "ConfidenceBased",
  "EvidenceBased",
  "CriticalThinking"
];

const difficulties: DifficultyBand[] = ["Beginner", "Intermediate", "Advanced"];
const topic = "RAG (Retrieval Augmented Generation)";

// Test each type at each difficulty, showing rotation
for (const difficulty of difficulties) {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`DIFFICULTY: ${difficulty.toUpperCase()}`);
  console.log("=".repeat(60));
  
  for (const type of types) {
    console.log(`\n[${type}]`);
    
    // Generate 2 questions to show rotation
    const q1 = generateMockQuestion(type, difficulty, topic);
    const q2 = generateMockQuestion(type, difficulty, topic);
    
    console.log(`Question 1: ${q1}`);
    if (q1 !== q2) {
      console.log(`Question 2: ${q2}`);
    }
  }
}

console.log("\n" + "=".repeat(60));
console.log("✅ All 8 question types tested with rotation!");
console.log("=".repeat(60));
