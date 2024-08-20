import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Extract optional parameters from formData
    const prompt = formData.get('prompt') as string | null;
    const responseFormat = formData.get('responseFormat') as string | null;
    const temperature = formData.get('temperature') as string | null;
    const language = formData.get('language') as string | null;

    const transcriptionOptions: any = {
      file: new File([buffer], file.name, { type: file.type }),
      model: "distil-whisper-large-v3-en",
    };

    // Add optional parameters if provided
    if (prompt) transcriptionOptions.prompt = prompt;
    if (responseFormat) transcriptionOptions.response_format = responseFormat;
    if (temperature) transcriptionOptions.temperature = parseFloat(temperature);
    if (language) transcriptionOptions.language = language;

    const transcription = await groq.audio.transcriptions.create(transcriptionOptions);

    // Handle different response formats
    if (responseFormat === 'verbose_json') {
      return NextResponse.json(transcription);
    } else if (responseFormat === 'text') {
      return new NextResponse(transcription.text, { 
        headers: { 'Content-Type': 'text/plain' }
      });
    } else {
      // Default to JSON response with just the text
      return NextResponse.json({ text: transcription.text });
    }
  } catch (error) {
    console.error('Transcription error:', error);
    return NextResponse.json({ error: 'Transcription failed' }, { status: 500 });
  }
}
