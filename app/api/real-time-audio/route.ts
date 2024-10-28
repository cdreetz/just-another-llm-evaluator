import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    console.log('Received transcription request');

    const formData = await request.formData();
    console.log('FormData received');

    const audioFile = formData.get('audio') as File;
    const model = formData.get('model') as string;

    console.log('Audio file:', audioFile?.name, 'Model:', model);

    if (!audioFile) {
      console.error('No audio file provided');
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
    }

    const arrayBuffer = await audioFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    console.log('Audio processed, preparing transcription options');

    const transcriptionOptions: any = {
      file: buffer,
      model: model === 'distil-whisper-large-v3-en' ? 'distil-whisper-large-v3-en' : 'whisper-large-v3',
    };

    console.log('Sending request to Groq API');
    const transcription = await groq.audio.transcriptions.create(transcriptionOptions);

    console.log('Transcription received');
    return NextResponse.json({ text: transcription.text });
  } catch (error) {
    console.error('Transcription error:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    if (error && typeof error === 'object' && 'response' in error) {
      console.error('API error response:', (error as { response?: unknown }).response);
    }
    return NextResponse.json({ error: 'An error occurred during transcription', details: (error as Error).message }, { status: 500 });
  }
}
