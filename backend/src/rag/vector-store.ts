import fs from "node:fs/promises";
import path from "node:path";

interface VectorRecord {
  id: string;
  values: number[];
  metadata: Record<string, any>;
}

interface VectorStore {
  [indexName: string]: VectorRecord[];
}

class InMemoryVectorStore {
  private storePath: string;
  private store: VectorStore;

  constructor(storePath: string = "vector-store.json") {
    this.storePath = storePath;
    this.store = {};
  }

  async load() {
    try {
      const data = await fs.readFile(this.storePath, "utf-8");
      this.store = JSON.parse(data);
    } catch {
      this.store = {};
    }
  }

  async save() {
    await fs.writeFile(this.storePath, JSON.stringify(this.store, null, 2));
  }

  async upsert(indexName: string, vectors: VectorRecord[]) {
    if (!this.store[indexName]) {
      this.store[indexName] = [];
    }

    for (const vector of vectors) {
      const existingIndex = this.store[indexName].findIndex(v => v.id === vector.id);
      if (existingIndex >= 0) {
        this.store[indexName][existingIndex] = vector;
      } else {
        this.store[indexName].push(vector);
      }
    }

    await this.save();
  }

  async query(indexName: string, queryVector: number[], topK: number = 5, filter?: Record<string, any>) {
    const vectors = this.store[indexName] || [];
    
    // Apply metadata filter if provided
    let filtered = vectors;
    if (filter) {
      filtered = vectors.filter(v => {
        return Object.entries(filter).every(([key, value]) => v.metadata[key] === value);
      });
    }

    // Calculate cosine similarity
    const similarities = filtered.map(vector => ({
      ...vector,
      similarity: this.cosineSimilarity(queryVector, vector.values)
    }));

    // Sort by similarity and return top K
    return similarities
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, topK);
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) return 0;
    
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  async clear(indexName: string) {
    delete this.store[indexName];
    await this.save();
  }
}

export const vectorStore = new InMemoryVectorStore();
