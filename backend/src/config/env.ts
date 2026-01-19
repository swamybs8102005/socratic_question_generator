import "dotenv/config";

export const env = {
  geminiApiKey: process.env.GEMINI_API_KEY,
  googleGenerativeAiApiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
  openaiApiKey: process.env.OPENAI_API_KEY,
  pgvectorUrl: process.env.PGVECTOR_URL,
  pgvectorUser: process.env.PGVECTOR_USER,
  pgvectorPassword: process.env.PGVECTOR_PASSWORD,
  pgvectorDatabase: process.env.PGVECTOR_DATABASE,
  qdrantUrl: process.env.QDRANT_URL,
  qdrantApiKey: process.env.QDRANT_API_KEY,
};
