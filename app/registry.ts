import { createOpenAI } from "@ai-sdk/openai";
import { experimental_createProviderRegistry as createProviderRegistry } from "ai";

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const groq = createOpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
})

export const registry = createProviderRegistry({
  openai: openai,
  groq: groq
});
