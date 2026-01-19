import http from "http";
import { generateAssessmentQuestions, analyzeAssessment, storeAssessmentInMemory } from "../assessment/analyzer";

// In-memory storage for assessment sessions
const assessmentSessions = new Map<string, any>();

export function createAssessmentServer() {
  const server = http.createServer(async (req, res) => {
    // CORS headers
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
      res.writeHead(200);
      res.end();
      return;
    }

    // POST /api/assessment/start - Start new assessment
    if (req.method === "POST" && req.url === "/api/assessment/start") {
      let body = "";
      req.on("data", (chunk) => (body += chunk.toString()));
      req.on("end", async () => {
        try {
          const { learnerId, topic } = JSON.parse(body);
          
          console.log(`🔍 Starting assessment for learner ${learnerId} on topic: ${topic}`);
          
          // Generate assessment questions (5 questions for complete assessment)
          const questions = await generateAssessmentQuestions(topic, 5);
          
          // Store session
          const sessionId = `${learnerId}-${Date.now()}`;
          assessmentSessions.set(sessionId, {
            learnerId,
            topic,
            questions,
            answers: [],
            startTime: Date.now()
          });

          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({
            sessionId,
            questions: questions.map(q => ({
              id: q.id,
              question: q.question,
              options: q.options,
              difficulty: q.difficulty
              // Don't send correctAnswer to client
            }))
          }));
        } catch (error) {
          console.error("Assessment start error:", error);
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Failed to start assessment" }));
        }
      });
      return;
    }

    // POST /api/assessment/submit - Submit assessment answers
    if (req.method === "POST" && req.url === "/api/assessment/submit") {
      let body = "";
      req.on("data", (chunk) => (body += chunk.toString()));
      req.on("end", async () => {
        try {
          const { sessionId, answers } = JSON.parse(body);
          
          const session = assessmentSessions.get(sessionId);
          if (!session) {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Assessment session not found" }));
            return;
          }

          console.log(`📊 Analyzing assessment for ${session.learnerId}`);
          
          // Analyze results
          const result = analyzeAssessment(
            session.learnerId,
            session.topic,
            session.questions,
            answers
          );

          // Extract correct answers for review
          const correctAnswers = session.questions.map((q: any) => q.correctAnswer);

          // Store in Mastra Memory (will be integrated with orchestrator)
          await storeAssessmentInMemory(session.learnerId, result);

          // Clean up session
          assessmentSessions.delete(sessionId);

          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({
            result: {
              suggestedLevel: result.suggestedLevel,
              score: result.correctAnswers,
              total: result.questionsAsked,
              knowledgeGaps: result.knowledgeGaps,
              strengths: result.strengths,
              recommendedTopics: result.recommendedTopics
            },
            correctAnswers // Send correct answers for review
          }));
        } catch (error) {
          console.error("Assessment submit error:", error);
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Failed to submit assessment" }));
        }
      });
      return;
    }

    // 404 for other routes
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not found" }));
  });

  return server;
}
