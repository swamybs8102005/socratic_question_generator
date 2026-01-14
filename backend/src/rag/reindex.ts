import { PgVector } from "@mastra/pg";
import { env } from "../config/env";

// Simple alias swapper stub; in practice, re-embed to a temp index then swap.
async function reindex() {
  const pgVector = new PgVector({ connectionString: env.pgvectorUrl });
  await pgVector.swapAlias({ from: "rag_embeddings_vNext", to: "rag_embeddings" });
  // eslint-disable-next-line no-console
  console.log("Alias swap attempted; ensure vNext is populated before running.");
}

reindex().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
