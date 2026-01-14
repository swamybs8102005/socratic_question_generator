import { WorkingMemory } from "../types/memory";

interface EvaluationResult {
  understanding: number; // 0-1 score
  depth: number; // 0-1 score
  hasEvidence: boolean;
  hasMisconceptions: boolean;
  keyInsights: string[];
  weakAreas: string[];
}

export function evaluateAnswer(
  question: string,
  answer: string,
  confidence: number
): EvaluationResult {
  const answerLower = answer.toLowerCase();
  const answerLength = answer.trim().split(/\s+/).length;
  
  // Shallow answer indicators
  const shallowIndicators = [
    'i think', 'maybe', 'not sure', 'i guess', 'probably',
    'i dont know', "i don't know", 'no idea', 'idk'
  ];
  const hasShallowIndicators = shallowIndicators.some(ind => answerLower.includes(ind));
  
  // Depth indicators
  const depthIndicators = [
    'because', 'therefore', 'however', 'although', 'specifically',
    'for example', 'such as', 'this means', 'in other words',
    'relationship', 'connection', 'impact', 'consequence', 'trade-off'
  ];
  const depthScore = depthIndicators.filter(ind => answerLower.includes(ind)).length;
  
  // Evidence indicators
  const evidenceIndicators = [
    'data shows', 'research', 'study', 'experiment', 'example',
    'case', 'demonstrated', 'proven', 'observed', 'measured'
  ];
  const hasEvidence = evidenceIndicators.some(ind => answerLower.includes(ind));
  
  // Misconception indicators
  const misconceptionIndicators = [
    'always', 'never', 'impossible', 'definitely', 'absolutely',
    'must be', 'has to', 'only way'
  ];
  const hasMisconceptions = misconceptionIndicators.some(ind => answerLower.includes(ind));
  
  // Calculate understanding score based on length and depth
  let understanding = 0;
  if (answerLength < 10) {
    understanding = 0.2;
  } else if (answerLength < 30) {
    understanding = 0.4 + (depthScore * 0.1);
  } else if (answerLength < 60) {
    understanding = 0.6 + (depthScore * 0.1);
  } else {
    understanding = 0.8 + (depthScore * 0.05);
  }
  
  // Adjust for shallow indicators
  if (hasShallowIndicators) {
    understanding *= 0.6;
  }
  
  // Adjust for evidence
  if (hasEvidence) {
    understanding = Math.min(1.0, understanding + 0.15);
  }
  
  // Calculate depth score
  const depth = Math.min(1.0, (depthScore / 3) + (answerLength / 200));
  
  // Extract insights (simplified)
  const keyInsights: string[] = [];
  if (depthScore > 2) keyInsights.push("Shows analytical thinking");
  if (hasEvidence) keyInsights.push("Provides evidence");
  if (answerLength > 50) keyInsights.push("Detailed response");
  
  // Identify weak areas
  const weakAreas: string[] = [];
  if (answerLength < 15) weakAreas.push("Brief responses");
  if (hasShallowIndicators) weakAreas.push("Lacks confidence");
  if (depthScore === 0) weakAreas.push("Surface-level thinking");
  
  return {
    understanding: Math.max(0, Math.min(1, understanding)),
    depth,
    hasEvidence,
    hasMisconceptions,
    keyInsights,
    weakAreas
  };
}

export function updateWorkingMemoryWithEvaluation(
  wm: WorkingMemory,
  evaluation: EvaluationResult,
  reportedConfidence: number
): WorkingMemory {
  const updated = { ...wm };
  
  // Compare reported confidence with actual understanding
  const confidenceGap = Math.abs((reportedConfidence / 100) - evaluation.understanding);
  
  // Update confidence based on evaluation
  if (confidenceGap > 0.3) {
    // User is miscalibrated
    updated.confidence = (wm.confidence * 0.7) + (evaluation.understanding * 0.3);
  } else {
    // User is well-calibrated, trust their judgment more
    updated.confidence = (wm.confidence * 0.5) + (evaluation.understanding * 0.3) + ((reportedConfidence / 100) * 0.2);
  }
  
  // Update streak based on understanding
  if (evaluation.understanding > 0.6) {
    updated.streak.correct += 1;
    updated.streak.incorrect = 0;
  } else {
    updated.streak.incorrect += 1;
    updated.streak.correct = 0;
  }
  
  // Update misconceptions
  if (evaluation.hasMisconceptions) {
    updated.misconceptions.push({
      topic: wm.lastTopic || "general",
      pattern: "Overgeneralization detected",
      timestamp: new Date().toISOString()
    });
  }
  
  // Update weak topics
  if (evaluation.understanding < 0.5 && wm.lastTopic) {
    if (!updated.weakTopics.includes(wm.lastTopic)) {
      updated.weakTopics.push(wm.lastTopic);
    }
  } else if (evaluation.understanding > 0.7 && wm.lastTopic) {
    // Remove from weak topics if improved
    updated.weakTopics = updated.weakTopics.filter(t => t !== wm.lastTopic);
  }
  
  // Level progression
  if (updated.streak.correct >= 5 && updated.confidence > 0.7) {
    if (updated.level === "Beginner") {
      updated.level = "Intermediate";
      updated.streak.correct = 0;
    } else if (updated.level === "Intermediate" && updated.confidence > 0.8) {
      updated.level = "Advanced";
      updated.streak.correct = 0;
    }
  }
  
  // Level regression if struggling
  if (updated.streak.incorrect >= 4 && updated.confidence < 0.4) {
    if (updated.level === "Advanced") {
      updated.level = "Intermediate";
      updated.streak.incorrect = 0;
    } else if (updated.level === "Intermediate") {
      updated.level = "Beginner";
      updated.streak.incorrect = 0;
    }
  }
  
  return updated;
}
