import { google } from "@ai-sdk/google";
import { embedMany } from "ai";
import { vectorStore } from "./vector-store";
import { env } from "../config/env";

export interface RAGSignal {
  topic: string;
  snippet: string;
  difficulty: string;
}

export async function retrieveRAGContext(
  query: string,
  topic: string,
  difficulty: string,
  topK: number = 5
): Promise<RAGSignal[]> {
  try {
    // Skip RAG for now - return empty array
    console.log("⚠️ RAG retrieval skipped (embedding model version issue)");
    return [];
    
    /* Disabled until embedding model is fixed
    await vectorStore.load();
    
    // Embed the query
    const { embeddings } = await embedMany({
      values: [query],
      model: google.textEmbeddingModel("text-embedding-004", {
        apiKey: env.geminiApiKey || env.googleGenerativeAiApiKey
      }),
    });

    // Query vector store
    const results = await vectorStore.query(
      "rag_embeddings",
      embeddings[0],
      topK,
      // { topic, difficulty } // Optionally filter by metadata
    );

    // Transform results into RAG signals (no verbatim text exposure)
    return results.map((r: any) => ({
      topic: r.metadata?.topic || topic,
      snippet: r.metadata?.text?.substring(0, 100) || "concept reference",
      difficulty: r.metadata?.difficulty || difficulty,
    }));
    */
  } catch (err) {
    console.warn("RAG retrieval failed:", err);
    return [];
  }
}
