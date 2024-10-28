import { NextRequest, NextResponse } from 'next/server';
import Groq from "groq-sdk";

const groq = new Groq();

export async function POST(req: NextRequest) {
  try {
    const { prompt, model } = await req.json();

    if (!prompt || !model) {
      return NextResponse.json({ error: 'Prompt and model are required' }, { status: 400 });
    }
    // Set the API key from environment variable
    if (!process.env.GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY is not set in the environment variables');
    }
    groq.apiKey = process.env.GROQ_API_KEY;

    const stream = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: model,
      temperature: 0.7,
      max_tokens: 1024,
      top_p: 1,
      stream: true,
    });

    return new Response(
      new ReadableStream({
        async start(controller) {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || "";
            controller.enqueue(content);
          }
          controller.close();
        },
      }),
      {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
        },
      }
    );
  } catch (error) {
    console.error('Error in Groq API request:', error);
    return NextResponse.json({ error: 'An error occurred while processing your request' }, { status: 500 });
  }
}
