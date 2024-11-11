'use client'

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import InfoButton from '@/components/InfoButton';

export default function RealTimeAudioPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [error, setError] = useState('');
  const [audioData, setAudioData] = useState<Float32Array | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const transcriptionIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (transcriptionIntervalRef.current) {
        clearInterval(transcriptionIntervalRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new AudioContext();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      const processor = audioContextRef.current.createScriptProcessor(4096, 1, 1);

      source.connect(processor);
      processor.connect(audioContextRef.current.destination);

      processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        setAudioData(new Float32Array(inputData));
      };

      setIsRecording(true);
      setError('');

      // Start the transcription process
      transcriptionIntervalRef.current = setInterval(sendAudioForTranscription, 1000);
    } catch (err) {
      console.error('Error starting recording:', err);
      setError('Failed to start recording. Please check your microphone permissions.');
    }
  };

  const stopRecording = () => {
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    setIsRecording(false);
    if (transcriptionIntervalRef.current) {
      clearInterval(transcriptionIntervalRef.current);
    }
  };

  const sendAudioForTranscription = async () => {
    if (!audioData) return;

    const formData = new FormData();
    formData.append('audio', new File([audioData.buffer], 'audio.raw', { type: 'audio/raw' }));
    formData.append('model', 'whisper-large-v3');

    try {
      const response = await fetch('/api/real-time-audio', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Transcription failed');
      }

      const data = await response.json();
      setTranscription(prev => prev + ' ' + data.text);
    } catch (err) {
      console.error('Transcription error:', err);
      setError('An error occurred during transcription. Please try again.');
    }
  };

  return (
    <main className="container mx-auto p-4">
      <InfoButton
        title="Real-Time Audio Transcription"
        className="absolute top-4 left-4 z-10"
      >
        <ol className="list-decimal pl-4">
          <li>Click Start Recording to begin</li>
          <li>Speak into your microphone</li>
          <li>Watch the transcription appear in real-time</li>
          <li>Click Stop Recording when finished</li>
        </ol>
      </InfoButton>
      <h1 className="text-3xl font-bold mb-6">Real-Time Audio Transcription</h1>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="space-y-4">
        <Button onClick={isRecording ? stopRecording : startRecording}>
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </Button>
        <Textarea
          value={transcription}
          readOnly
          className="w-full h-64"
          placeholder="Transcription will appear here in real-time..."
        />
      </div>
    </main>
  );
}

