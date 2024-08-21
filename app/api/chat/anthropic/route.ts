import { anthropic } from '@ai-sdk/anthropic';
import { streamText } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, model } = await req.json();

  const result = await streamText({
    model: anthropic(model || 'claude-3-opus-20240229'),
    messages,
  });

  return result.toAIStreamResponse();
}

