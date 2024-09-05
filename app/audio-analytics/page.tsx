'use client'

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import InfoButton from '@/components/InfoButton';
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function AudioAnalyticsPage() {
  const [file, setFile] = useState<File | null>(null);
  const [transcription, setTranscription] = useState('');
  const [summary, setSummary] = useState('');
  const [sentiment, setSentiment] = useState('');
  const [entities, setEntities] = useState('');
  const [customClassification, setCustomClassification] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [fileDetails, setFileDetails] = useState<{ name: string; duration: string } | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const [enableSummary, setEnableSummary] = useState(true);
  const [enableSentiment, setEnableSentiment] = useState(true);
  const [enableEntities, setEnableEntities] = useState(true);
  const [enableCustom, setEnableCustom] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);
      setFileDetails(null);

      const audioUrl = URL.createObjectURL(selectedFile);
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.onloadedmetadata = () => {
          const duration = audioRef.current?.duration || 0;
          const minutes = Math.floor(duration / 60);
          const seconds = Math.floor(duration % 60);
          setFileDetails({
            name: selectedFile.name,
            duration: `${minutes}:${seconds.toString().padStart(2, '0')}`,
          });
        };
      }
    }
  };

  const handleTranscribe = async () => {
    if (!file) {
      setError('Please select an audio file.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('model', 'whisper-large-v3');

      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Transcription failed');
      }

      const data = await response.json();
      setTranscription(data.text);

      // Process the transcription
      await processTranscription(data.text);
    } catch (err) {
      setError('An error occurred during processing. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const processTranscription = async (text: string) => {
    const tasks = [
      { prompt: `Summarize the following text:\n\n${text}`, setter: setSummary, enabled: enableSummary },
      { prompt: `Analyze the sentiment of the following text:\n\n${text}`, setter: setSentiment, enabled: enableSentiment },
      { prompt: `Extract named entities from the following text:\n\n${text}`, setter: setEntities, enabled: enableEntities },
      { prompt: customPrompt + `\n\n${text}`, setter: setCustomClassification, enabled: enableCustom },
    ];

    for (const task of tasks) {
      if (!task.enabled) continue;
      
      try {
        const response = await fetch('/api/generate-text', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'groq:llama-3.1-70b-versatile',
            prompt: task.prompt,
          }),
        });

        if (!response.ok) throw new Error('API response was not ok');

        const data = await response.json();
        task.setter(data.text);
      } catch (error) {
        console.error(`Error processing task:`, error);
        task.setter('Error occurred');
      }
    }
  };

  return (
    <main className="container mx-auto p-4">
      <InfoButton
        title="Audio Analytics"
        className="absolute top-4 left-4 z-10"
      >
        <ol className="list-decimal pl-4">
          <li>Upload an audio file</li>
          <li>Select analysis options</li>
          <li>Click Process Audio</li>
          <li>View the transcription and analysis results</li>
        </ol>
      </InfoButton>
      <h1 className="text-3xl font-bold mb-6">Audio Analytics</h1>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="flex space-x-6">
        <div className="w-1/3 space-y-4 border rounded-lg p-4">
          <Input
            type="file"
            accept="audio/*"
            onChange={handleFileChange}
            className="mb-4"
          />
          {fileDetails && (
            <div className="mb-4 p-2 bg-gray-100 rounded">
              <h3 className="font-semibold">File Details:</h3>
              <p>Name: {fileDetails.name}</p>
              <p>Duration: {fileDetails.duration}</p>
            </div>
          )}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Switch id="summary" checked={enableSummary} onCheckedChange={setEnableSummary} />
              <Label htmlFor="summary">Enable Summary</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="sentiment" checked={enableSentiment} onCheckedChange={setEnableSentiment} />
              <Label htmlFor="sentiment">Enable Sentiment Analysis</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="entities" checked={enableEntities} onCheckedChange={setEnableEntities} />
              <Label htmlFor="entities">Enable Entity Extraction</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="custom" checked={enableCustom} onCheckedChange={setEnableCustom} />
              <Label htmlFor="custom">Enable Custom Classification</Label>
            </div>
          </div>
          {enableCustom && (
            <Textarea
              placeholder="Enter custom prompt for classification..."
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              className="mt-2"
            />
          )}
          <Button onClick={handleTranscribe} disabled={isLoading} className="w-full">
            {isLoading ? 'Processing...' : 'Process Audio'}
          </Button>
        </div>
        <div className="w-2/3 border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">Results:</h2>
          <ScrollArea className="h-[400px]">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Transcription:</h3>
                <Textarea value={transcription} readOnly className="w-full h-24" />
              </div>
              {enableSummary && (
                <div>
                  <h3 className="font-semibold">Summary:</h3>
                  <Textarea value={summary} readOnly className="w-full h-24" />
                </div>
              )}
              {enableSentiment && (
                <div>
                  <h3 className="font-semibold">Sentiment:</h3>
                  <Textarea value={sentiment} readOnly className="w-full h-24" />
                </div>
              )}
              {enableEntities && (
                <div>
                  <h3 className="font-semibold">Entities:</h3>
                  <Textarea value={entities} readOnly className="w-full h-24" />
                </div>
              )}
              {enableCustom && (
                <div>
                  <h3 className="font-semibold">Custom Classification:</h3>
                  <Textarea value={customClassification} readOnly className="w-full h-24" />
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
      <audio ref={audioRef} style={{ display: 'none' }} />
    </main>
  );
}
