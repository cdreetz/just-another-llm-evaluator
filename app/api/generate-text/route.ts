import { NextRequest, NextResponse } from "next/server";
import { createServerRegistry } from "@/app/registry";
import { generateText } from "ai";

export async function POST(req: Request) {
  const { model, prompt } = await req.json();
  const registry = createServerRegistry();

  try {
    const [provider, modelId] = model.split(":");
    const languageModel = registry.languageModel(`${provider}:${modelId}`);
    const result = await generateText({
      model: languageModel,
      prompt: prompt,
    });

    // Create a ReadableStream to stream the response
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(result.text);
        controller.close();
      }
    });

    // Return a streaming Response
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8'
      }
    });

  } catch (error) {
    console.error("Error generating text:", error);
    return NextResponse.json(
      { error: "Error generating text" },
      { status: 500 },
    );
  }
}
