import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "../config/env";
import { retrieveRAGContext } from "../rag/retriever";

// Initialize Google AI
const genAI = new GoogleGenerativeAI(env.geminiApiKey || env.googleGenerativeAiApiKey || "");

export interface AssessmentQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  topic: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface AssessmentResult {
  learnerId: string;
  topic: string;
  questionsAsked: number;
  correctAnswers: number;
  suggestedLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  knowledgeGaps: string[];
  strengths: string[];
  recommendedTopics: string[];
}

// Mock assessment questions fallback
function generateMockAssessmentQuestions(topic: string, count: number): AssessmentQuestion[] {
  const baseQuestions = [
    {
      question: `What is a fundamental concept in ${topic}?`,
      options: ["Basic principles", "Advanced algorithms", "Historical context", "Future predictions"],
      correctAnswer: 0,
      difficulty: 'Beginner' as const
    },
    {
      question: `Which approach is commonly used in ${topic}?`,
      options: ["Trial and error", "Systematic methodology", "Random selection", "Intuitive guessing"],
      correctAnswer: 1,
      difficulty: 'Intermediate' as const
    },
    {
      question: `What challenge is common in ${topic}?`,
      options: ["Lack of interest", "Complexity and scale", "Too much simplicity", "No applications"],
      correctAnswer: 1,
      difficulty: 'Intermediate' as const
    },
    {
      question: `How would you evaluate progress in ${topic}?`,
      options: ["Random checks", "Metrics and benchmarks", "Personal opinion", "Time spent only"],
      correctAnswer: 1,
      difficulty: 'Advanced' as const
    },
    {
      question: `What skill is essential for mastering ${topic}?`,
      options: ["Memorization only", "Critical thinking", "Speed reading", "Multitasking"],
      correctAnswer: 1,
      difficulty: 'Beginner' as const
    },
    {
      question: `Which tool is most relevant to ${topic}?`,
      options: ["Specialized software", "General calculator", "Notepad only", "None needed"],
      correctAnswer: 0,
      difficulty: 'Intermediate' as const
    },
    {
      question: `What is a common misconception about ${topic}?`,
      options: ["It's too complex", "Anyone can master it instantly", "It has no practical use", "It requires no practice"],
      correctAnswer: 1,
      difficulty: 'Advanced' as const
    }
  ];

  // Ensure we have enough unique questions
  const uniqueTimestamp = Date.now();
  const shuffled = [...baseQuestions].sort(() => Math.random() - 0.5);
  
  return shuffled.slice(0, count).map((q, i) => ({
    id: `assess-${uniqueTimestamp}-${i}`,
    question: q.question,
    options: q.options,
    correctAnswer: q.correctAnswer,
    topic: topic,
    difficulty: q.difficulty
  }));
}

// Generate assessment MCQ questions using RAG and LLM
export async function generateAssessmentQuestions(
  topic: string,
  count: number = 5
): Promise<AssessmentQuestion[]> {
  try {
    // Use RAG to get relevant context about the topic
    const ragContext = await retrieveRAGContext(
      `Assessment questions about ${topic} for evaluating learner knowledge`,
      topic,
      'Intermediate',
      3
    );

    const contextText = ragContext.map(r => `${r.topic}: ${r.snippet}`).join('\n');

    const prompt = `Generate ${count} multiple-choice assessment questions about ${topic}.

RAG Context for Reference:
${contextText || 'General knowledge assessment'}

Requirements:
- Progress through difficulty levels IN ORDER: Start with Beginner, then Intermediate, then Advanced
- For 5 questions: 2 Beginner, 2 Intermediate, 1 Advanced (in that exact order)
- Each question should test understanding, not just memorization
- Include 4 options (A, B, C, D)
- Questions should reveal knowledge gaps and strengths
- IMPORTANT: For programming language topics (Python, Java, C++, JavaScript), include actual code snippets
- IMPORTANT: For mathematical/geometry topics (square, rectangle, circle, triangle):
  * Provide specific values for calculations
  * Include SVG diagram in the question showing the shape with labeled measurements
  * Use large SVG size (width="600" height="600") and large text (font-size="28" font-weight="bold")
  * Make shapes large (at least 250-300 units) with stroke-width="5" and fill colors
  * Use high contrast: black text on light shapes or white text with stroke
  * Example: "What is the area?\\n\\n<svg width=\\"600\\" height=\\"600\\" viewBox=\\"0 0 600 600\\"><rect x=\\"150\\" y=\\"150\\" width=\\"300\\" height=\\"300\\" fill=\\"lightblue\\" stroke=\\"black\\" stroke-width=\\"5\\"/><text x=\\"300\\" y=\\"120\\" text-anchor=\\"middle\\" font-size=\\"28\\" font-weight=\\"bold\\" fill=\\"black\\">Side = 5 cm</text></svg>"
- IMPORTANT: For non-programming topics, ask about the topic itself - NO code
- Do NOT ask "write a Python function" for mathematical topics
- Do NOT reference "the following code" without including the actual code
- Order matters: Questions 1-2 must be Beginner, 3-4 must be Intermediate, 5 must be Advanced

Format your response as JSON array (MUST be in difficulty order):
[
  {
    "question": "Question 1 text\\n\\n\`\`\`cpp\\ncode here\\n\`\`\`",
    "options": ["A", "B", "C", "D"],
    "correctAnswer": 0,
    "topic": "specific subtopic",
    "difficulty": "Beginner"
  },
  {
    "question": "Question 2 text",
    "options": ["A", "B", "C", "D"],
    "correctAnswer": 1,
    "topic": "specific subtopic",
    "difficulty": "Beginner"
  },
  {
    "question": "Question 3 text",
    "options": ["A", "B", "C", "D"],
    "correctAnswer": 2,
    "topic": "specific subtopic",
    "difficulty": "Intermediate"
  }
]

Generate exactly ${count} questions with actual code snippets included, ordered by difficulty (Beginner → Intermediate → Advanced).`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    console.log("✅ Assessment API response length:", text.length, "chars");

    // Check if response is empty
    if (!text || text.trim().length < 10) {
      console.log("⚠️ Empty response, generating mock assessment questions");
      return generateMockAssessmentQuestions(topic, count);
    }

    // Parse JSON response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.log("⚠️ Failed to parse JSON, using mock assessment questions");
      return generateMockAssessmentQuestions(topic, count);
    }

    const questions = JSON.parse(jsonMatch[0]);
    
    return questions.map((q: any, i: number) => ({
      id: `assess-${Date.now()}-${i}`,
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      topic: q.topic || topic,
      difficulty: q.difficulty || 'Intermediate'
    }));

  } catch (error) {
    console.error("Failed to generate assessment questions:", error);
    // Fallback to hardcoded assessment questions
    return generateFallbackAssessment(topic, count);
  }
}

// Fallback assessment questions when LLM fails
function generateFallbackAssessment(topic: string, count: number): AssessmentQuestion[] {
  const templates: AssessmentQuestion[] = [
    {
      id: `assess-${Date.now()}-0`,
      question: `What is your current level of experience with ${topic}?`,
      options: [
        "I've never heard of it before",
        "I know what it is but haven't used it",
        "I have some hands-on experience",
        "I use it regularly in my work"
      ],
      correctAnswer: 2,
      topic,
      difficulty: 'Beginner'
    },
    {
      id: `assess-${Date.now()}-1`,
      question: `Which best describes your learning goal for ${topic}?`,
      options: [
        "Understand the basic concepts",
        "Learn practical applications",
        "Master advanced techniques",
        "Prepare for professional certification"
      ],
      correctAnswer: 1,
      topic,
      difficulty: 'Beginner'
    },
    {
      id: `assess-${Date.now()}-2`,
      question: `How would you approach learning a new concept in ${topic}?`,
      options: [
        "Read documentation from start to finish",
        "Watch video tutorials",
        "Build a small project to experiment",
        "Study examples and adapt them"
      ],
      correctAnswer: 2,
      topic,
      difficulty: 'Intermediate'
    },
    {
      id: `assess-${Date.now()}-3`,
      question: `What is your biggest challenge when learning technical topics like ${topic}?`,
      options: [
        "Understanding the underlying theory",
        "Finding time to practice",
        "Knowing what to learn first",
        "Applying concepts to real problems"
      ],
      correctAnswer: 3,
      topic,
      difficulty: 'Intermediate'
    },
    {
      id: `assess-${Date.now()}-4`,
      question: `Which resource would help you most in learning ${topic}?`,
      options: [
        "Interactive coding exercises",
        "Real-world case studies",
        "Visual diagrams and infographics",
        "Discussion with experienced practitioners"
      ],
      correctAnswer: 0,
      topic,
      difficulty: 'Advanced'
    }
  ];

  return templates.slice(0, Math.min(count, templates.length));
}

// Analyze assessment results and generate profile
export function analyzeAssessment(
  learnerId: string,
  topic: string,
  questions: AssessmentQuestion[],
  answers: number[]
): AssessmentResult {
  let correctAnswers = 0;
  const knowledgeGaps: string[] = [];
  const strengths: string[] = [];

  // Calculate score and identify gaps/strengths
  questions.forEach((q, i) => {
    const isCorrect = answers[i] === q.correctAnswer;
    if (isCorrect) {
      correctAnswers++;
      if (q.difficulty === 'Advanced' || q.difficulty === 'Intermediate') {
        strengths.push(q.topic);
      }
    } else {
      if (q.difficulty === 'Beginner' || q.difficulty === 'Intermediate') {
        knowledgeGaps.push(q.topic);
      }
    }
  });

  const score = correctAnswers / questions.length;
  
  // Determine suggested level
  let suggestedLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  if (score >= 0.8) {
    suggestedLevel = 'Advanced';
  } else if (score >= 0.5) {
    suggestedLevel = 'Intermediate';
  } else {
    suggestedLevel = 'Beginner';
  }

  // Generate recommended topics based on gaps
  const recommendedTopics = [...new Set([
    ...knowledgeGaps,
    ...questions.map(q => q.topic)
  ])].slice(0, 5);

  return {
    learnerId,
    topic,
    questionsAsked: questions.length,
    correctAnswers,
    suggestedLevel,
    knowledgeGaps: [...new Set(knowledgeGaps)],
    strengths: [...new Set(strengths)],
    recommendedTopics
  };
}

// Store assessment in Mastra Memory
export async function storeAssessmentInMemory(
  learnerId: string,
  result: AssessmentResult
): Promise<void> {
  // This will be called from the orchestrator to store in Mastra Memory
  console.log(`📊 Assessment stored for learner ${learnerId}:`, {
    level: result.suggestedLevel,
    score: `${result.correctAnswers}/${result.questionsAsked}`,
    gaps: result.knowledgeGaps,
    strengths: result.strengths
  });
}
