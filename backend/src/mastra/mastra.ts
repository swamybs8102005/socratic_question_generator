import { Mastra } from "@mastra/core/mastra";
import { Memory } from "@mastra/memory";
import { LibSQLStore } from "@mastra/libsql";
import { workingMemorySchema } from "../types/memory";

// Silence deprecated telemetry warning when running outside mastra server.
// Set to true explicitly so Mastra skips looking for instrumentation.
(globalThis as Record<string, unknown>).___MASTRA_TELEMETRY___ = true;

const storage = new LibSQLStore({ url: "file:memory.db" });

export const mastra = new Mastra({
  storage,
});

export const memory = new Memory({
  workingMemory: {
    schema: workingMemorySchema,
    storage,
  },
  conversationHistory: {
    lastMessages: 12,
    storage,
  },
  semanticRecall: {
    enabled: true,
    storage,
  },
});
