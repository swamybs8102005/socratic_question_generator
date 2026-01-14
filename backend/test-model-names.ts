import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { env } from "./src/config/env";

async function testModels() {
  const models = [
    "gemini-1.5-flash-latest",
    "gemini-1.5-pro-latest",
    "gemini-2.0-flash-exp",
    "models/gemini-1.5-flash-latest",
    "models/gemini-1.5-pro-latest"
  ];

  for (const modelName of models) {
    try {
      console.log(`\nTesting: ${modelName}`);
      const { text } = await generateText({
        model: google(modelName, {
          apiKey: env.geminiApiKey || env.googleGenerativeAiApiKey
        }),
        prompt: "Say hello",
        maxTokens: 10,
      });
      console.log(`✅ SUCCESS: ${modelName}`);
      console.log(`Response: ${text}`);
    } catch (err: any) {
      console.log(`❌ FAILED: ${modelName}`);
      console.log(`Error: ${err.message}`);
    }
  }
}

testModels();
