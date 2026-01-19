import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { env } from "./src/config/env";

// Test different Gemini model names
const modelsToTest = [
  "gemini-1.0-pro",
  "gemini-1.5-pro-latest",
  "gemini-2.0-flash-exp",
];

async function testModels() {
  for (const modelName of modelsToTest) {
    console.log(`\nTesting: ${modelName}`);
    try {
      const { text } = await generateText({
        model: google(modelName, {
          apiKey: env.geminiApiKey || env.googleGenerativeAiApiKey
        }),
        messages: [
          { role: "user", content: "Say 'Hello'" }
        ],
        maxTokens: 10,
      });
      console.log(`✓ SUCCESS: ${modelName}`);
      console.log(`Response: ${text}`);
      break; // Found working model
    } catch (err: any) {
      console.log(`✗ FAILED: ${err.message}`);
    }
  }
}

testModels();
