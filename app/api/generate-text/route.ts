import { NextRequest, NextResponse } from 'next/server'
import { createServerRegistry } from '@/app/registry'
import { generateText } from 'ai'

export async function POST(req: Request) {
  const { model, prompt } = await req.json();
  const registry = createServerRegistry();

  try {
    const [provider, modelId] = model.split(':');
    const languageModel = registry.languageModel(`${provider}:${modelId}`);
    const { text } = await generateText({
      model: languageModel,
      prompt: prompt,
    });
    return NextResponse.json({ text });
  } catch (error) { 
    console.error('Error generating text:', error);
    return NextResponse.json({ error: 'Error generating text' }, { status: 500 });
  }
}