import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt, imageUrl } = await req.json();

    // Log the request payload for debugging
    console.log('Request payload:', { prompt, imageUrl: imageUrl.substring(0, 50) + '...' });

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: prompt
              },
              {
                type: "image_url",
                image_url: {
                  url: imageUrl
                }
              }
            ]
          }
        ],
        model: "llava-v1.5-7b-4096-preview",
        temperature: 0,
        max_tokens: 1024,
        top_p: 1,
        stream: false,
        stop: null
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Groq API error:', errorData);
      throw new Error(`HTTP error! status: ${response.status}, message: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error processing image:', error);
    return NextResponse.json({ error: 'Error processing image', details: error.message }, { status: 500 });
  }
}
