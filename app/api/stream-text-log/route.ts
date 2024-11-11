import { NextRequest, NextResponse } from "next/server";
import { createServerRegistry } from "@/app/registry";
import { AIStream, generateText, streamText } from "ai";

export async function POST(req: Request) {
  const { model, prompt } = await req.json();
  const registry = createServerRegistry();

  try {
    const [provider, modelId] = model.split(":");
    const languageModel = registry.languageModel(`${provider}:${modelId}`);
    console.log(prompt);

    let startTime = Date.now();

    let usedTokens = 0;
    const result = await streamText({
      model: languageModel,
      prompt: prompt,
      onFinish: (result) => {
        const endTime = Date.now();
        const durationInSeconds = (endTime - startTime) / 1000;
        console.log(`Duration: ${durationInSeconds} seconds`);
        console.log(`Usage: ${JSON.stringify(result.usage)}`);
        //console.log(`Full Result: ${JSON.stringify(result)}`);
        console.log(`Headers: ${JSON.stringify(result.rawResponse?.headers)}`);
        console.log(`X-Ratelimit-Limit-Tokens: ${result.rawResponse?.headers?.["x-ratelimit-limit-tokens"]}`);
        const limitTokens = result.rawResponse?.headers?.["x-ratelimit-limit-tokens"];
        console.log(`X-Ratelimit-Remaining-Tokens: ${result.rawResponse?.headers?.["x-ratelimit-remaining-tokens"]}`);
        const remainingTokens = Number(result.rawResponse?.headers?.["x-ratelimit-remaining-tokens"]);
        usedTokens = Number(limitTokens) - remainingTokens;
        console.log(`Used Tokens: ${usedTokens}`);
        console.log(`Tokens per second: ${usedTokens / durationInSeconds}`);
      },
    });
    let firstTextPartTime: number | null = null;
    let lastTextPartTime: number | null = null;

    for await (const textPart of result.textStream) {
      if (firstTextPartTime === null) {
        firstTextPartTime = Date.now();
      }
      lastTextPartTime = Date.now();
      console.log(textPart);
    }

    if (firstTextPartTime !== null && lastTextPartTime !== null) {
      const streamDuration = (lastTextPartTime - firstTextPartTime) / 1000;
      console.log(`Stream duration: ${streamDuration} seconds`);
      console.log(`Tokens per second: ${usedTokens / streamDuration}`);
    }

    //const stuff = result.pipeDataStreamToResponse();
    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Error generating text:", error);
    return NextResponse.json(
      { error: "Error generating text" },
      { status: 500 },
    );
  }
}
