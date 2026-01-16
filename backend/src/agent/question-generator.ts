import { GoogleGenerativeAI } from "@google/generative-ai";
import { QuestionType, DifficultyBand, WorkingMemory, MapData } from "../types/memory";
import { env } from "../config/env";
import { generateMockQuestion } from "./mock-questions";

const USE_MOCK_MODE = !env.geminiApiKey && !env.openaiApiKey; // Auto-detect mock mode

// Initialize Google AI
const genAI = new GoogleGenerativeAI(env.geminiApiKey || env.googleGenerativeAiApiKey || "");

// Track recent questions AND answers to prevent duplicates (per learner session)
const recentQuestions = new Map<string, Array<{question: string; answer: string}>>();
const MAX_RECENT_QUESTIONS = 20;

function addRecentQuestion(learnerId: string, questionText: string, correctAnswer: string) {
  if (!recentQuestions.has(learnerId)) {
    recentQuestions.set(learnerId, []);
  }
  const questions = recentQuestions.get(learnerId)!;
  questions.push({ question: questionText, answer: correctAnswer });
  if (questions.length > MAX_RECENT_QUESTIONS) {
    questions.shift(); // Remove oldest
  }
}

function isDuplicateQuestion(learnerId: string, questionText: string, correctAnswer: string): boolean {
  const questions = recentQuestions.get(learnerId) || [];
  
  // Check if question text is duplicate
  const duplicateText = questions.some(q => 
    q.question.trim().toLowerCase() === questionText.trim().toLowerCase()
  );
  
  // Check if answer is duplicate (same concept being tested)
  const duplicateAnswer = questions.some(q => 
    q.answer.trim().toLowerCase() === correctAnswer.trim().toLowerCase()
  );
  
  return duplicateText || duplicateAnswer;
}

export interface QuestionRequest {
  questionType: QuestionType;
  difficulty: DifficultyBand;
  workingMemory: WorkingMemory;
  historySummary: string;
  recallSummary: string;
  ragSignals: string[];
  learnerId: string; // Unique identifier per user session
}

export interface StructuredQuestion {
  questionType: QuestionType;
  difficulty: DifficultyBand;
  question: string;
  options?: string[];
  expectsConfidence: boolean;
  mapData?: MapData;
}

export async function generateQuestion(req: QuestionRequest, retryCount: number = 0): Promise<string | StructuredQuestion> {
  const learnerId = req.learnerId; // Use actual learner ID for tracking
  const MAX_RETRIES = 2; // Prevent infinite recursion
  
  console.log("🔑 API Keys configured:", {
    gemini: !!env.geminiApiKey,
    googleAI: !!env.googleGenerativeAiApiKey,
    openai: !!env.openaiApiKey
  });
  
  if (retryCount > 0) {
    console.log(`🔄 Retry attempt ${retryCount}/${MAX_RETRIES} for duplicate question`);
  }
  
  // Use mock mode if no API keys or if quota issues detected
  if (USE_MOCK_MODE) {
    console.log("❌ Using mock question generator (no API keys configured)");
    throw new Error("API key not configured. Please add GEMINI_API_KEY to .env file");
  }

  const recentQs = recentQuestions.get(learnerId) || [];
  
  // Get context from the most recent question for continuity
  const lastQuestion = recentQs.length > 0 ? recentQs[recentQs.length - 1] : null;
  const continuityContext = lastQuestion 
    ? `\n\nPREVIOUS QUESTION CONTEXT: The last question was about: "${lastQuestion.question.substring(0, 100)}..."
The previous answer was: "${lastQuestion.answer}"
    
Build on this naturally - your next question should either:
1. Go deeper into the same concept (if it's foundational)
2. Progress to a closely related or next logical topic
3. Apply the previous concept in a different context

DO NOT jump to completely unrelated topics. Maintain learning continuity and natural progression.`
    : '\n\nThis is the first question - start with foundational concepts.';
  
  const avoidList = recentQs.length > 0 
    ? `\n\nDo NOT repeat these recent questions OR test the same concepts with different wording:\n${recentQs.slice(-5).map((q, i) => `${i+1}. Q: "${q.question.substring(0, 60)}..." Answer: "${q.answer}"`).join('\n')}\n\nThese answers are ALREADY TESTED - do not ask questions with the same answer again!`
    : '';

  const topic = req.workingMemory.lastTopic || "general knowledge";
  
  // Detect topic category to provide better context
  const isGeometry = /circle|square|rectangle|triangle|polygon|sphere|cube|cone|cylinder|pyramid/i.test(topic);
  const isMath = /algebra|calculus|geometry|trigonometry|statistics|probability|equation|function|derivative|integral/i.test(topic);
  const isProgramming = /python|java|javascript|c\+\+|typescript|react|node|programming|code|algorithm|data structure/i.test(topic);
  
  let topicContext = "";
  if (isGeometry) {
    topicContext = `\nTOPIC CONTEXT: "${topic}" is a GEOMETRIC SHAPE. Ask about its properties, calculations, formulas, and applications in geometry. DO NOT treat it as a technology or solution.`;
  } else if (isMath && !isGeometry) {
    topicContext = `\nTOPIC CONTEXT: "${topic}" is a MATHEMATICAL CONCEPT. Ask about mathematical principles, calculations, and problem-solving related to this topic.`;
  } else if (isProgramming) {
    topicContext = `\nTOPIC CONTEXT: "${topic}" is a PROGRAMMING TOPIC. Ask about code, syntax, best practices, and implementation concepts.`;
  } else {
    topicContext = `\nTOPIC CONTEXT: "${topic}" is the learning subject. Ask educational questions that help learners understand and master this specific topic.`;
  }

  const systemPrompt = `You are generating educational questions. Output ONLY valid JSON.

${req.questionType === 'MultipleBlanksFill' ? `For MultipleBlanksFill questions, use this format:
{
  "questionType": "MultipleBlanksFill",
  "difficulty": "${req.difficulty}",
  "question": "Complete the following code:\\n#include _____1_____\\nusing _____2____;\\nint main() {\\n    _____3_____\\n}",
  "blanks": [
    {"id": 1, "options": ["<iostream>", "<stdio.h>", "<string>", "<vector>"], "correctAnswer": "<iostream>"},
    {"id": 2, "options": ["namespace std;", "namespace std::cout;", "std;", "namespace;"], "correctAnswer": "namespace std;"},
    {"id": 3, "options": ["return 0;", "return 1;", "exit(0);", "break;"], "correctAnswer": "return 0;"}
  ],
  "expectsConfidence": false
}

RULES for MultipleBlanksFill:
- Use _____1_____, _____2_____, etc. for blanks in the question
- Each blank MUST have 4 options
- First option in each blank's options array is the CORRECT answer
- Include "correctAnswer" field for each blank
- Perfect for code completion, formula filling, syntax completion
` : `For standard questions, use this format:
{
  "questionType": "${req.questionType}",
  "difficulty": "${req.difficulty}",
  "question": "Your question text here",
  "options": ["CORRECT ANSWER (MUST BE FIRST)", "Wrong option 2", "Wrong option 3", "Wrong option 4"],
  "correctAnswer": "CORRECT ANSWER (MUST BE FIRST)",
  "expectsConfidence": true
}

CRITICAL: The "correctAnswer" field MUST contain the EXACT text of the correct option, and that correct option MUST be listed FIRST in the options array.`}

CRITICAL Rules:
- **THE CORRECT ANSWER MUST ALWAYS BE THE FIRST OPTION IN THE OPTIONS ARRAY**
- The "correctAnswer" field must match the first option exactly
- ALWAYS provide exactly 4 options for MCQ, MultipleAnswers, Puzzle, ConfidenceBased, EvidenceBased, and CriticalThinking questions
- For FillInBlank and Clarification questions, do NOT include options field - learners type their answer
- For MultipleAnswers questions, provide exactly 4 options (first 2-3 should be correct answers)
- Question must be clear, educational, and UNIQUE
- DO NOT embed options in the question text like "A) option B) option"
- Keep question text separate from options
- Focus DIRECTLY on the topic: ${topic}${topicContext}

PROGRAMMING QUESTIONS:
- For programming topics (Python, Java, C++, JavaScript, etc.), include code using markdown code blocks
- Format: \`\`\`language\\ncode\\n\`\`\`
- Example: \`\`\`python\\ndef hello():\\n    print("Hello")\\n\`\`\`
- Place code blocks in the question text, not in options
- Ask about code behavior, debugging, or concepts
- NEVER use phrases like "code snippet" or "following code" - just show the code directly
- Example good question: "What will be the output?\n\`\`\`python\nx = 10\nprint(x)\n\`\`\`"

MATHEMATICAL/GEOMETRY QUESTIONS:
- For math topics (geometry, algebra, calculus), include SVG diagrams with measurements
- For GEOMETRY SHAPES (circle, square, triangle, etc.), ask about:
  * Properties (radius, diameter, area, perimeter, volume, angles)
  * Formulas (area = πr², circumference = 2πr, etc.)
  * Calculations with specific numerical values
  * Real-world applications
- Use SVG format: <svg width="600" height="600" viewBox="0 0 600 600">...</svg>
- Label measurements clearly with large, bold text (font-size="28" font-weight="bold")
- Use high contrast colors (black/white, or colored shapes with dark borders)
- Example circle: <svg width="600" height="600"><circle cx="300" cy="300" r="150" fill="lightblue" stroke="black" stroke-width="5"/><text x="300" y="315" text-anchor="middle" font-size="28" font-weight="bold">r = 5cm</text></svg>
- Include practical calculations with specific numerical values
- NEVER ask about geometric shapes as if they were technologies or solutions

QUESTION TYPE SPECIFIC:
- ${req.questionType === 'Puzzle' ? 'Create thought-provoking scenarios requiring logical reasoning' : ''}
- ${req.questionType === 'ConfidenceBased' ? 'Ask learners to rate their confidence and explain their reasoning' : ''}
- ${req.questionType === 'EvidenceBased' ? 'Require learners to cite evidence or examples to support their answer' : ''}
- ${req.questionType === 'CriticalThinking' ? 'Challenge assumptions and require deep analysis' : ''}
- ${req.questionType === 'Clarification' ? 'Ask open-ended questions requiring detailed explanations' : ''}

- Generate a DIFFERENT question each time - vary the angle, concept, or focus
- Output ONLY the JSON, no other text, no markdown code blocks
- Make sure the JSON is properly formatted and parseable${continuityContext}${avoidList}`;

  const userPrompt = `Generate a ${req.difficulty} level ${req.questionType} question about "${topic}".

${isGeometry ? `Remember: This is a GEOMETRIC SHAPE. Ask about its mathematical properties, formulas, and calculations. Include an SVG diagram if appropriate.` : ''}
${isProgramming ? `Remember: This is a PROGRAMMING topic. Include code examples if appropriate.` : ''}

LEARNING PROGRESSION GUIDELINES:
${lastQuestion ? `- Build naturally on the previous question concept
- Progress to the next logical step or related subtopic
- Maintain coherent learning flow - don't jump randomly
- Either deepen understanding OR move to closely related concepts` : `- Start with fundamental concepts
- Lay groundwork for progressive learning`}

VARIETY REQUIREMENTS:
- Use different examples, scenarios, or code snippets than previous questions
- Vary the specific angle or aspect being tested
- Keep content fresh while maintaining topic continuity

The question should be educational, clear, appropriate for ${req.difficulty} level learners.

Current question number: ${recentQs.length + 1}.`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const result = await model.generateContent([
      systemPrompt,
      userPrompt
    ]);
    
    const text = result.response.text();

    console.log("✅ Gemini API response length:", text.length, "chars");
    console.log("✅ Full response:", text);

    // Check if response is empty or too short
    if (!text || text.trim().length < 10) {
      console.log("⚠️ Empty or too short response from Gemini");
      throw new Error("Empty response from API. Please try again.");
    }

    // Try to parse as JSON first
    try {
      // Remove markdown code blocks if present
      let cleanText = text.trim();
      if (cleanText.startsWith('```json')) {
        cleanText = cleanText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      } else if (cleanText.startsWith('```')) {
        cleanText = cleanText.replace(/```\n?/g, '');
      }
      
      // Try to find JSON object - handle incomplete responses
      const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        let jsonStr = jsonMatch[0];
        
        // If JSON is incomplete, try to fix it
        if (!jsonStr.includes('"correctAnswer"') && jsonStr.includes('"options"')) {
          console.log("⚠️ Incomplete JSON detected, attempting to fix...");
          // Find the last complete field
          const lastCommaIndex = jsonStr.lastIndexOf(',');
          if (lastCommaIndex > 0) {
            // Try to close the JSON properly
            jsonStr = jsonStr.substring(0, lastCommaIndex) + '\n}';
          }
        }
        
        const parsed = JSON.parse(jsonStr);
        
        // Add correctAnswer field if missing (use first option)
        if (!parsed.correctAnswer && parsed.options && Array.isArray(parsed.options) && parsed.options.length > 0) {
          parsed.correctAnswer = parsed.options[0];
          console.log("✅ Added correctAnswer field:", parsed.correctAnswer);
        }
        
        const questionText = typeof parsed === 'object' && 'question' in parsed 
          ? parsed.question 
          : String(parsed);
        
        const correctAnswer = parsed.correctAnswer || '';
        
        // Check for duplicates (both question text AND answer)
        if (isDuplicateQuestion(learnerId, questionText, correctAnswer)) {
          if (retryCount < MAX_RETRIES) {
            console.log("⚠️ Duplicate question or concept detected, regenerating...");
            console.log("   Question:", questionText.substring(0, 60));
            console.log("   Answer:", correctAnswer);
            // Retry with stronger anti-duplicate instruction
            return generateQuestion(req, retryCount + 1);
          } else {
            console.log("⚠️ Max retries reached, accepting potentially duplicate question");
            // Accept the question after max retries to prevent infinite loop
          }
        }
        
        // Track this question AND answer
        addRecentQuestion(learnerId, questionText, correctAnswer);
        
        console.log("\n=== Generated Question ===");
        console.log("Question:", questionText);
        if (parsed.options && Array.isArray(parsed.options)) {
          console.log("Options:");
          parsed.options.forEach((opt: string, i: number) => {
            const isCorrect = opt === parsed.correctAnswer;
            console.log(`  ${String.fromCharCode(65 + i)}. ${opt}${isCorrect ? ' ✓ CORRECT' : ''}`);
          });
        }
        console.log("Correct Answer:", parsed.correctAnswer);
        console.log("Difficulty:", parsed.difficulty);
        console.log("Type:", parsed.questionType);
        console.log("=========================\n");
        
        return parsed as StructuredQuestion;
      }
    } catch (parseErr) {
      console.log("❌ Failed to parse JSON:", parseErr);
      console.log("Raw response:", text);
      throw new Error("Failed to parse API response. Please try again.");
    }

    throw new Error("No valid response from API");
  } catch (err) {
    console.error("❌ LLM generation failed:", err);
    throw err; // Propagate error instead of using mock
  }
}