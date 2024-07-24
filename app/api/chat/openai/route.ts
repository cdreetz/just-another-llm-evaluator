import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, model } = await req.json();

  const result = await streamText({
    model: openai(model || 'gpt-3.5-turbo'),
    messages,
  });
  return result.toAIStreamResponse();
}