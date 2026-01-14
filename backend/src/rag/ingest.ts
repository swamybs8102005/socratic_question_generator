import { MDocument } from "@mastra/rag";
import { embedMany } from "ai";
import { google } from "@ai-sdk/google";
import fs from "node:fs/promises";
import path from "node:path";
import { vectorStore } from "./vector-store";
import { env } from "../config/env";

// Simple ingest script: chunk files from ./data, embed, upsert to in-memory vector store.
async function ingest() {
  await vectorStore.load();
  
  const dataDir = path.join(process.cwd(), "data");
  const files = await fs.readdir(dataDir);

  for (const file of files) {
    const full = path.join(dataDir, file);
    const raw = await fs.readFile(full, "utf-8");
    const doc = MDocument.fromText(raw, { metadata: { source: file } });
    const chunks = await doc.chunk({ strategy: "recursive", maxSize: 512, overlap: 50 });
    
    console.log(`Processing ${file}: ${chunks.length} chunks`);
    
    const { embeddings } = await embedMany({
      values: chunks.map((c) => c.text),
      model: google.textEmbeddingModel("text-embedding-004", {
        apiKey: env.geminiApiKey || env.googleGenerativeAiApiKey
      }),
    });

    const vectors = embeddings.map((embedding, i) => ({
      id: `${file.replace(/\./g, '_')}_${i}`,
      values: embedding,
      metadata: {
        source: file,
        topic: "general",
        difficulty: "Beginner",
        text: chunks[i].text
      }
    }));

    await vectorStore.upsert("rag_embeddings", vectors);
    console.log(`  ✓ Inserted ${vectors.length} vectors`);
  }

  // eslint-disable-next-line no-console
  console.log("Ingestion complete");
}

ingest().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
