'use client'

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import InfoButton from '@/components/InfoButton';

export default function VisionPage() {
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [base64Image, setBase64Image] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);
      setImagePreview(URL.createObjectURL(selectedFile));
      encodeImageToBase64(selectedFile).then(setBase64Image);
    }
  };

  const encodeImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleProcess = async () => {
    if (!base64Image || !prompt) {
      setError('Please select an image and provide a prompt.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          imageUrl: base64Image,
        }),
      });

      if (!response.ok) {
        throw new Error('Image processing failed');
      }

      const data = await response.json();
      setResult(data.choices[0].message.content);
    } catch (err) {
      setError('An error occurred during image processing. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="container mx-auto p-4">
      <InfoButton
        title="Image Processing"
        className="absolute top-4 left-4 z-10"
      >
        <ol className="list-decimal pl-4">
          <li>Upload an image</li>
          <li>Enter a prompt describing what you want to know about the image</li>
          <li>Click Process Image</li>
          <li>Wait for the result</li>
        </ol>
      </InfoButton>
      <h1 className="text-3xl font-bold mb-6">Image Processing</h1>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0">
        <div className="w-full md:w-1/3 space-y-4 border rounded-lg p-4">
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mb-4"
          />
          {imagePreview && (
            <img src={imagePreview} alt="Preview" className="w-full mb-4 rounded" />
          )}
          <Input
            placeholder="Enter your prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <Button onClick={handleProcess} disabled={isLoading} className="w-full">
            {isLoading ? 'Processing...' : 'Process Image'}
          </Button>
        </div>
        <div className="w-full md:w-2/3 border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">Result:</h2>
          <Textarea
            value={result}
            readOnly
            className="w-full h-64"
            placeholder="Result will appear here..."
          />
        </div>
      </div>
    </main>
  );
}
