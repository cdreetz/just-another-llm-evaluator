import { createOpenAI } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";
import { experimental_createProviderRegistry as createProviderRegistry } from "ai";

export function createServerRegistry(){
  const openai = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })
  const groq = createOpenAI({
    baseURL: 'https://api.groq.com/openai/v1',
    apiKey: process.env.GROQ_API_KEY,
    compatibility: 'strict',
  })
  return createProviderRegistry({
    openai: openai,
    groq: groq,
    anthropic: anthropic
  });
}


