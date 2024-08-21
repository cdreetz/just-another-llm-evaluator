// pages/index.tsx
'use client'

import { useState, useEffect } from 'react';
import ModelSelectionForm from '@/components/ModelSelectionForm'
import PromptInputForm from '@/components/PromptInputForm'
import EvaluationButton from '@/components/EvaluationButton'
import ResultsTable from '@/components/ResultsTable'
import { Alert, AlertDescription } from '@/components/ui/alert'
import InfoButton from '@/components/InfoButton';

export type Provider = 'openai' | 'groq' | 'anthropic';

export interface Model {
  id: string;
  name: string;
  provider: Provider;
}

const AVAILABLE_MODELS: Model[] = [
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'openai' },
  { id: 'gpt-4', name: 'GPT-4', provider: 'openai' },
  { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', provider: 'openai' },
  { id: 'gpt-4o', name: 'GPT-4o', provider: 'openai' },
  { id: 'gpt-4o-mini', name: 'GPT-4o Mini', provider: 'openai' },
  { id: 'llama-3.1-70b-versatile', name: 'Llama-3.1 70b', provider: 'groq' },
  { id: 'llama-3.1-8b-instant', name: 'Llama-3.1 8b', provider: 'groq' },
  { id: 'mixtral-8x7b-32768', name: 'Mixtral 8x7b', provider: 'groq' },
  { id: 'gemma-7b-it', name: 'Gemma 7b', provider: 'groq' },
  { id: 'gemma2-9b-it', name: 'Gemma2 9b', provider: 'groq' },
  { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus', provider: 'anthropic' },
  { id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku', provider: 'anthropic' },
  { id: 'claude-3-sonnet-20240229', name: 'Claude 3 Sonnet', provider: 'anthropic' },
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
  const [isInitial, setIsInitial] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleEvaluate = async () => {
    setIsInitial(false);
    setIsLoading(true);
    setError(null);

    const newResults: EvaluationResult[] = prompts.map(prompt => ({
      prompt,
      results: Object.fromEntries(selectedModels.map(model => [model.id, '']))
    }));
    setResults(newResults);

    try {
      for (let promptIndex = 0; promptIndex < prompts.length; promptIndex++) {
        const prompt = prompts[promptIndex];

        //for (const model of selectedModels) {
        await Promise.all(selectedModels.map(async (model) => {
          try {
            const response = await fetch('/api/stream-text', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                model: `${model.provider}:${model.id}`,
                prompt: prompt,
              }),
            });

            if (!response.ok) throw new Error('API response was not ok');

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();

            let accumulatedText = '';

            while (true) {
              const result = await reader?.read();
              if (!result) break;
              const { done, value } = result;
              if (done) break;
              const chunk = decoder.decode(value, { stream: true });
              accumulatedText += chunk;

              setResults(prevResults => {
                const newResults = [...prevResults];
                newResults[promptIndex].results[model.id] = accumulatedText;
                return newResults;
              });
            }
          } catch (error) {
            console.error(`Error with model ${model.id}:`, error);
            setResults(prevResults => {
              const newResults = [...prevResults];
              newResults[promptIndex].results[model.id] = 'Error occurred';
              return newResults;
            });
          }
        }));
      }
    } catch (error) {
      setError('An error occured during evaluation. Please try again.');
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
          <li>Select the models you want to compare</li>
          <li>Enter prompts you want to evaluate for</li>
          <li>Click Evaluate and wait for the generated responses</li>
        </ol>
      </InfoButton>
      <h1 className="text-3xl font-bold mb-6 mx-6">LLM Evaluations</h1>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="space-y-6 mx-6">
        <div className="flex flex-row w-full border p-4 space-x-2">
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
        <ResultsTable results={results} selectedModels={selectedModels} isLoading={isLoading} isInitial={isInitial} />
      </div>
    </main>
  )
}