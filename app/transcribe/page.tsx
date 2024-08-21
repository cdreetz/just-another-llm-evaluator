'use client'

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import InfoButton from '@/components/InfoButton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export default function TranscribePage() {
  const [file, setFile] = useState<File | null>(null);
  const [transcription, setTranscription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [verboseJson, setVerboseJson] = useState(false);
  const [language, setLanguage] = useState('');
  const [prompt, setPrompt] = useState('');
  const [temperature, setTemperature] = useState('');
  const [fileDetails, setFileDetails] = useState<{ name: string; duration: string; transcriptionTime: string } | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [model, setModel] = useState('whisper-large-v3');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);
      setFileDetails(null); // Reset file details when a new file is selected

      // Create a URL for the audio file
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
            transcriptionTime: '',
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
    const startTime = Date.now();

    try {
      const formData = new FormData();
      formData.append('file', file);
      if (verboseJson) formData.append('responseFormat', 'verbose_json');
      if (language) formData.append('language', language);
      if (prompt) formData.append('prompt', prompt);
      if (temperature) formData.append('temperature', temperature);
      formData.append('model', model);

      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Transcription failed');
      }

      const data = await response.json();
      setTranscription(verboseJson ? JSON.stringify(data, null, 2) : data.text);

      const endTime = Date.now();
      const transcriptionTime = ((endTime - startTime) / 1000).toFixed(2);
      setFileDetails(prevDetails => ({
        ...prevDetails!,
        transcriptionTime: `${transcriptionTime} seconds`,
      }));
    } catch (err) {
      setError('An error occurred during transcription. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="container mx-auto p-4">
       <InfoButton
        title="LLM Evaluations"
        className="absolute top-4 left-4 z-10"
      >
        <ol className="list-decimal pl-4">
          <li>Select an audio file</li>
          <li>Select any optional settings if you want</li>
          <li>Click Transcribe Audio</li>
          <li>Wait for the transcription to finish</li>
        </ol>
      </InfoButton>
      <h1 className="text-3xl font-bold mb-6 mx-6">Audio Transcription</h1>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="flex space-x-6 mx-6">
        <div className="w-1/3 space-y-4 border p-4">
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
              {fileDetails.transcriptionTime && (
                <p>Time to transcribe: {fileDetails.transcriptionTime}</p>
              )}
            </div>
          )}
          <Select onValueChange={setModel} value={model}>
            <SelectTrigger>
              <SelectValue placeholder="Select Model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="whisper-large-v3">Whisper Large v3</SelectItem>
              <SelectItem value="distil-whisper-large-v3-en">Distil Whisper Large v3 (English)</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center space-x-2">
            <Switch
              id="verbose-json"
              checked={verboseJson}
              onCheckedChange={setVerboseJson}
            />
            <Label htmlFor="verbose-json">Verbose JSON</Label>
          </div>
          <Select onValueChange={setLanguage}>
            <SelectTrigger>
              <SelectValue placeholder="Select Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="es">Spanish</SelectItem>
              <SelectItem value="fr">French</SelectItem>
              {/* Add more languages as needed */}
            </SelectContent>
          </Select>
          <Input
            placeholder="Optional prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Temperature (0-1)"
            value={temperature}
            onChange={(e) => setTemperature(e.target.value)}
            min="0"
            max="1"
            step="0.1"
          />
          <Button onClick={handleTranscribe} disabled={isLoading} className="w-full">
            {isLoading ? 'Transcribing...' : 'Transcribe Audio'}
          </Button>
        </div>
        <div className="w-2/3 border p-4">
          <h2 className="text-xl font-semibold mb-2">Transcription Result:</h2>
          <Textarea
            value={transcription}
            readOnly
            className="w-full h-64"
            placeholder="Transcription will appear here..."
          />
        </div>
      </div>
      <audio ref={audioRef} style={{ display: 'none' }} />
    </main>
  );
}
