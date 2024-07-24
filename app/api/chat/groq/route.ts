import { createOpenAI as createGroq } from '@ai-sdk/openai';
import { convertToCoreMessages, streamText } from 'ai';

const groq = createGroq({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
})

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, model } = await req.json();

  const result = await streamText({
    model: groq(model || 'llama-3.1-70b-versatile'),
    messages: convertToCoreMessages(messages),
  });

  return result.toAIStreamResponse();
}

