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
          let lastChunk;
          try {
            for await (const chunk of stream) {
              const content = chunk.choices[0]?.delta?.content || "";
              if (content) {
                controller.enqueue(content);
              }
              lastChunk = chunk;
            }

            // After the stream is complete, send the metrics
            if (lastChunk?.x_groq?.usage) {
              console.log('Sending metrics:', lastChunk.x_groq.usage); // Debug log
              const metricsMessage = `\n__METRICS__${JSON.stringify({
                __metrics: {
                  completion_time: lastChunk.x_groq.usage.completion_time,
                  completion_tokens: lastChunk.x_groq.usage.completion_tokens,
                  total_tokens: lastChunk.x_groq.usage.total_tokens
                }
              })}`;
              controller.enqueue(metricsMessage);
            }
          } catch (error) {
            console.error('Error in stream processing:', error);
          } finally {
            controller.close();
          }
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
