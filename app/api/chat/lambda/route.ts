import { createOpenAI as createLambdaLabs } from '@ai-sdk/openai';
import { convertToCoreMessages, streamText } from 'ai';

const lambdalabs = createLambdaLabs({
  baseURL: 'https://cloud.lambdalabs.com/api/v1/chat/completions',
  apiKey: process.env.LAMBDALABS_API_KEY,
})

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, model } = await req.json();

  const result = await streamText({
    model: lambdalabs(model || 'hermes-3-llama-3.1-405b-fp8'),
    messages: convertToCoreMessages(messages),
  });

  return result.toAIStreamResponse();
}

