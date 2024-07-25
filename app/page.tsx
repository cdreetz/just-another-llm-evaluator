// pages/index.tsx
'use client'

import { useState, useEffect } from 'react';
import { generateText } from 'ai';
import ModelSelectionForm from '@/components/ModelSelectionForm'
import PromptInputForm from '@/components/PromptInputForm'
import EvaluationButton from '@/components/EvaluationButton'
import ResultsTable from '@/components/ResultsTable'
import { Alert, AlertDescription } from '@/components/ui/alert'

export type Provider = 'openai' | 'groq';

export interface Model {
  id: string;
  name: string;
  provider: Provider;
}

export const AVAILABLE_MODELS: Model[] = [
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'openai' },
  { id: 'gpt-4', name: 'GPT-4', provider: 'openai' },
  { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', provider: 'openai' },
  { id: 'llama-3.1-70b-versatile', name: 'Llama-3.1 70b', provider: 'groq' },
  { id: 'mixtral-8x7b-32768', name: 'Mixtral 8x7b', provider: 'groq' },
];

interface EvaluationResult {
  prompt: string;
  results: {
    [modelId: string]: string;
  };
}

export default function Home() {
  const [selectedModels, setSelectedModels] = useState<Model[]>([]);
  const [prompts, setPrompts] = useState<string[]>([]);
  const [results, setResults] = useState<EvaluationResult[]>([]);
  const [registry, setRegistry] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRegistry = async () => {
      try {
        const { registry } = await import('./registry.local');
        setRegistry(registry);
      } catch (error) {
        const { registry } = await import ('./registry');
        setRegistry(registry);
      }
    };
    loadRegistry();
  }, []);

  const handleEvaluate = async () => {
    if (!registry) return;
    setIsLoading(true);
    setError(null);

    try {
      const newResults: EvaluationResult[] = [];

      for (const prompt of prompts) {
        const promptResult: EvaluationResult = {
          prompt,
          results: {}
        };

        for (const model of selectedModels) {
          try {
            const { text } = await generateText({
              model: registry.languageModel(`${model.provider}:${model.id}`),
              prompt: prompt,
            });
            promptResult.results[model.id] = text;
          } catch (error) {
            console.error(`Error with model ${model.id}:`, error);
            promptResult.results[model.id] = 'Error occurred';
          }
        }

        newResults.push(promptResult);
      }

      setResults(newResults);
    } catch (error) {
      setError('An error occured during evaluation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!registry) return <div>Loading registry...</div>

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">LLM Evaluations</h1>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="space-y-6">
        <div className="flex flex-row w-full border p-4">
          <div className="flex flex-col w-1/2 pr-4">
            <ModelSelectionForm
              availableModels={AVAILABLE_MODELS}
              selectedModels={selectedModels}
              onModelSelectionChange={setSelectedModels}
            />
            <EvaluationButton onEvaluate={handleEvaluate} isLoading={isLoading} />
          </div>
          <PromptInputForm
            prompts={prompts}
            onPromptsChange={setPrompts}
          />
        </div>
        <ResultsTable results={results} selectedModels={selectedModels} isLoading={isLoading} />
      </div>
    </main>
  )
}