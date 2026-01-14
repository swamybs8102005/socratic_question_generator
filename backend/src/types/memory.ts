import { z } from "zod";

export const workingMemorySchema = z.object({
  learnerId: z.string().optional(),
  level: z.enum(["Beginner", "Intermediate", "Advanced"]).default("Beginner"),
  confidence: z.number().min(0).max(1).default(0.5),
  weakTopics: z.array(z.string()).default([]),
  lastTopic: z.string().optional(),
  streak: z.object({
    correct: z.number().int().min(0).default(0),
    incorrect: z.number().int().min(0).default(0)
  }).default({ correct: 0, incorrect: 0 }),
  misconceptions: z.array(z.string()).default([])
});

export type WorkingMemory = z.infer<typeof workingMemorySchema>;

export type QuestionType =
  | "Clarification"
  | "MCQ"
  | "FillInBlank"
  | "MultipleAnswers"
  | "Puzzle"
  | "ConfidenceBased"
  | "EvidenceBased"
  | "CriticalThinking"
  | "MapLocation";

export type DifficultyBand = "Beginner" | "Intermediate" | "Advanced";

export interface MapData {
  title: string;           // e.g., "Vijayanagara Empire"
  imageUrl: string;        // URL to the map image
  markers: MapMarker[];    // Locations to be marked/guessed
  correctAnswer?: string;  // For MCQ-style map questions
}

export interface MapMarker {
  id: string;
  name: string;            // e.g., "Hampi", "Capital city"
  lat: number;             // Latitude (or relative position)
  lng: number;             // Longitude (or relative position)
  isCorrect?: boolean;     // For marking the correct location
}
