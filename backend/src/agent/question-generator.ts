import { GoogleGenerativeAI } from "@google/generative-ai";
import { QuestionType, DifficultyBand, WorkingMemory, MapData } from "../types/memory";
import { env } from "../config/env";
import { generateMockQuestion } from "./mock-questions";

const USE_MOCK_MODE = !env.geminiApiKey && !env.openaiApiKey; // Auto-detect mock mode

// Initialize Google AI
const genAI = new GoogleGenerativeAI(env.geminiApiKey || env.googleGenerativeAiApiKey || "");

// Track recent questions to prevent duplicates (per learner session)
const recentQuestions = new Map<string, string[]>();
const MAX_RECENT_QUESTIONS = 20;

function addRecentQuestion(learnerId: string, questionText: string) {
  if (!recentQuestions.has(learnerId)) {
    recentQuestions.set(learnerId, []);
  }
  const questions = recentQuestions.get(learnerId)!;
  questions.push(questionText);
  if (questions.length > MAX_RECENT_QUESTIONS) {
    questions.shift(); // Remove oldest
  }
}

function isDuplicateQuestion(learnerId: string, questionText: string): boolean {
  const questions = recentQuestions.get(learnerId) || [];
  return questions.some(q => q.trim().toLowerCase() === questionText.trim().toLowerCase());
}

export interface QuestionRequest {
  questionType: QuestionType;
  difficulty: DifficultyBand;
  workingMemory: WorkingMemory;
  historySummary: string;
  recallSummary: string;
  ragSignals: string[];
}

export interface StructuredQuestion {
  questionType: QuestionType;
  difficulty: DifficultyBand;
  question: string;
  options?: string[];
  expectsConfidence: boolean;
  mapData?: MapData;
}

export async function generateQuestion(req: QuestionRequest): Promise<string | StructuredQuestion> {
  const learnerId = req.workingMemory.lastTopic || "default"; // Use as session identifier
  
  // Use mock mode if no API keys or if quota issues detected
  if (USE_MOCK_MODE) {
    console.log("📝 Using mock question generator (no API keys configured)");
    return generateMockQuestion(
      req.questionType,
      req.difficulty,
      req.workingMemory.lastTopic || "this topic"
    );
  }

  const recentQs = recentQuestions.get(learnerId) || [];
  const avoidList = recentQs.length > 0 
    ? `\n\nDo NOT repeat these recent questions:\n${recentQs.slice(-5).map((q, i) => `${i+1}. ${q}`).join('\n')}`
    : '';

  const systemPrompt = `You are generating educational questions. Output ONLY valid JSON in this exact format:

{
  "questionType": "${req.questionType}",
  "difficulty": "${req.difficulty}",
  "question": "Your question text here",
  "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
  "expectsConfidence": true,
  "mapData": {
    "title": "Map Title",
    "imageUrl": "URL or description",
    "markers": [
      {"id": "1", "name": "Location Name", "lat": 0, "lng": 0, "isCorrect": true}
    ]
  }
}

Rules:
- For MCQ questions, provide exactly 4 options
- For FillInBlank questions, do NOT include options field - learners type their answer
- For MultipleAnswers questions, provide 4-6 options with 2-4 correct answers
- Question must be clear, educational, and UNIQUE
- Focus DIRECTLY on the topic: ${req.workingMemory.lastTopic || "general knowledge"}
- For programming language topics (Python, Java, C++, JavaScript), include code snippets using markdown: \`\`\`language\\ncode\\n\`\`\`
- For mathematical/geometry topics (square, rectangle, circle, triangle), include:
  * Practical calculations with specific values
  * SVG diagram showing the shape with measurements labeled (use width="600" height="600")
  * Use large stroke-width (5) and large font-size (28) with font-weight="bold" for clear visibility
  * Make shapes large (at least 250-300 units)
  * Use high contrast colors: white text on dark background or black text on light shapes
  * Example SVG: <svg width="600" height="600" viewBox="0 0 600 600"><circle cx="300" cy="300" r="150" fill="lightblue" stroke="black" stroke-width="5"/><text x="300" y="315" text-anchor="middle" font-size="28" font-weight="bold" fill="black">Radius = 5 cm</text><line x1="300" y1="300" x2="450" y2="300" stroke="red" stroke-width="3"/></svg>
  * Place SVG on its own line in the question text
- For HISTORY topics (dynasties, empires, historical events, geography), include mapData:
  * Set questionType to "MapLocation" or "MCQ"
  * Provide a detailed map description in imageUrl (e.g., "Map of Vijayanagara Empire showing Hampi, Penukonda, and surrounding kingdoms")
  * Include 3-5 markers with names and approximate relative positions
  * Mark one location as correct (isCorrect: true) for guessing
  * Example: Ask "Identify the capital of the Vijayanagara Empire" with options like Hampi, Penukonda, Bijapur, Golconda
  * Use relative coordinates (0-100 range) for positioning markers on the map
- For non-programming topics (mathematics, science, concepts), ask about the topic itself, NOT about programming it
- Do NOT ask programming questions for mathematical/conceptual topics like "square", "triangle", "RAG", etc.
- Generate a DIFFERENT question each time - vary the angle, concept, or focus
- Output ONLY the JSON, no other text${avoidList}`;

  const topic = req.workingMemory.lastTopic || "general knowledge";
  
  const userPrompt = `Generate a unique ${req.difficulty} level ${req.questionType} question about ${topic} that has not been asked before.`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const result = await model.generateContent([
      systemPrompt,
      userPrompt
    ]);
    
    const text = result.response.text();

    console.log("✅ Gemini API response length:", text.length, "chars");
    console.log("✅ Response preview:", text.substring(0, 300));

    // Check if response is empty or too short
    if (!text || text.trim().length < 10) {
      console.log("⚠️ Empty or too short response from Gemini, using mock");
      return generateMockQuestion(
        req.questionType,
        req.difficulty,
        req.workingMemory.lastTopic || topic
      );
    }

    // Try to parse as JSON first
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        const questionText = typeof parsed === 'object' && 'question' in parsed 
          ? parsed.question 
          : String(parsed);
        
        // Check for duplicates
        if (isDuplicateQuestion(learnerId, questionText)) {
          console.log("⚠️ Duplicate question detected, regenerating...");
          // Retry once with stronger anti-duplicate instruction
          return generateQuestion(req);
        }
        
        // Track this question
        addRecentQuestion(learnerId, questionText);
        
        console.log("\n=== Generated Question ===");
        console.log("Question:", questionText);
        if (parsed.options && Array.isArray(parsed.options)) {
          console.log("Options:");
          parsed.options.forEach((opt: string, i: number) => {
            console.log(`  ${String.fromCharCode(65 + i)}. ${opt}`);
          });
        }
        console.log("Difficulty:", parsed.difficulty);
        console.log("Type:", parsed.questionType);
        console.log("=========================\n");
        
        return parsed as StructuredQuestion;
      }
    } catch (parseErr) {
      console.log("❌ Failed to parse JSON:", parseErr);
      console.log("Using mock question instead");
    }

    // If we got text but couldn't parse it, use mock
    return generateMockQuestion(
      req.questionType,
      req.difficulty,
      req.workingMemory.lastTopic || topic
    );
  } catch (err) {
    console.error("LLM generation failed:", err);
    // Fallback to mock on API errors (like quota exceeded)
    console.log("📝 Falling back to mock question generator due to API error");
    return generateMockQuestion(
      req.questionType,
      req.difficulty,
      req.workingMemory.lastTopic || "this topic"
    );
  }
}