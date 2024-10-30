"use client";

import { useState } from "react";
import ModelSelectionForm from "@/components/ModelSelectionForm";
import PromptInputForm from "@/components/PromptInputForm";
import EvaluationButton from "@/components/EvaluationButton";
import ResultsTable2 from "@/components/ResultsTable2";
import { Alert, AlertDescription } from "@/components/ui/alert";
import InfoButton from "@/components/InfoButton";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export type Provider = "groq" | "openai" | "anthropic";

export interface Model {
  id: string;
  name: string;
  provider: Provider;
}

const AVAILABLE_MODELS: Model[] = [
  { id: "llama-3.2-1b-preview", name: "Llama-3.2 1B Preview", provider: "groq" },
  { id: "llama-3.2-3b-preview", name: "Llama-3.2 3B Preview", provider: "groq" },
  { id: "llama3-groq-8b-8192-tool-use-preview", name: "Llama-3 Groq 8B Tool Use", provider: "groq" },
  { id: "llama-3.2-11b-vision-preview", name: "Llama-3.2 11B Vision", provider: "groq" },
  { id: "llama-3.2-90b-vision-preview", name: "Llama-3.2 90B Vision", provider: "groq" },
  { id: "llama3-70b-8192", name: "Meta Llama 3 70B", provider: "groq" },
  { id: "llama3-8b-8192", name: "Meta Llama 3 8B", provider: "groq" },
  { id: "llama-3.1-70b-versatile", name: "Llama-3.1 70b", provider: "groq" },
  { id: "llama-3.1-8b-instant", name: "Llama-3.1 8b", provider: "groq" },
  { id: "mixtral-8x7b-32768", name: "Mixtral 8x7b", provider: "groq" },
  { id: "gemma-7b-it", name: "Gemma 7b", provider: "groq" },
  { id: "gemma2-9b-it", name: "Gemma2 9b", provider: "groq" },
];

interface ModelMetrics {
  completion_time: number;
  completion_tokens: number;
  total_tokens: number;
}

interface EvaluationResult {
  prompt: string;
  results: {
    [modelId: string]: string;
  };
  metrics: {
    [modelId: string]: ModelMetrics;
  };
}

export default function Home() {
  const [selectedModels, setSelectedModels] = useState<Model[]>([]);
  const [prompts, setPrompts] = useState<string[]>([]);
  const [results, setResults] = useState<EvaluationResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitial, setIsInitial] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleEvaluate = async () => {
    setIsInitial(false);
    setIsLoading(true);
    setError(null);

    const newResults: EvaluationResult[] = prompts.map((prompt) => ({
      prompt,
      results: Object.fromEntries(selectedModels.map((model) => [model.id, ""])),
      metrics: Object.fromEntries(selectedModels.map((model) => [model.id, {} as ModelMetrics])),
    }));
    setResults(newResults);

    try {
      for (let promptIndex = 0; promptIndex < prompts.length; promptIndex++) {
        const prompt = prompts[promptIndex];

        await Promise.all(
          selectedModels.map(async (model) => {
            try {
              const response = await fetch("/api/direct-groq", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  model: model.id,
                  prompt: prompt,
                }),
              });

              if (!response.ok) throw new Error("API response was not ok");

              const reader = response.body?.getReader();
              const decoder = new TextDecoder();

              let accumulatedText = "";

              while (true) {
                const result = await reader?.read();
                if (!result) break;
                const { done, value } = result;
                if (done) break;
                const chunk = decoder.decode(value, { stream: true });
                
                if (chunk.includes('__METRICS__')) {
                  const [text, metricsStr] = chunk.split('__METRICS__');
                  accumulatedText += text;
                  
                  try {
                    const { __metrics } = JSON.parse(metricsStr);
                    setResults((prevResults) => {
                      const newResults = [...prevResults];
                      newResults[promptIndex].metrics[model.id] = __metrics;
                      newResults[promptIndex].results[model.id] = accumulatedText;
                      return newResults;
                    });
                  } catch (e) {
                    console.error('Error parsing metrics:', e);
                  }
                } else {
                  accumulatedText += chunk;
                  setResults((prevResults) => {
                    const newResults = [...prevResults];
                    newResults[promptIndex].results[model.id] = accumulatedText;
                    return newResults;
                  });
                }
              }
            } catch (error) {
              console.error(`Error with model ${model.id}:`, error);
              setResults((prevResults) => {
                const newResults = [...prevResults];
                newResults[promptIndex].results[model.id] = "Error occurred";
                return newResults;
              });
            }
          }),
        );
      }
    } catch (error) {
      setError("An error occurred during evaluation. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="container mx-auto p-4">
      <InfoButton
        title="LLM Evaluations Groq"
        className="absolute top-4 left-4 z-10"
      >
        <ol className="list-decimal pl-4">
          <li>Select the models you want to compare</li>
          <li>Enter prompts you want to evaluate for</li>
          <li>Click Evaluate and wait for the generated responses</li>
          <br />
          <ul>* Upload a .txt file with prompts you want to evaluate for</ul>
        </ol>
      </InfoButton>
      <h1 className="text-3xl font-bold mb-6">LLM Evaluations Groq</h1>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="border rounded-lg p-4">
          <ModelSelectionForm
            availableModels={AVAILABLE_MODELS}
            selectedModels={selectedModels}
            onModelSelectionChange={setSelectedModels}
          />
          <EvaluationButton onEvaluate={handleEvaluate} isLoading={isLoading} />
        </div>
        <div className="border rounded-lg p-4">
          <PromptInputForm prompts={prompts} onPromptsChange={setPrompts} />
        </div>
      </div>
      <ScrollArea className="h-[400px] md:h-[600px] border rounded-lg p-4">
        <ResultsTable2
          results={results}
          selectedModels={selectedModels}
          isLoading={isLoading}
          isInitial={isInitial}
        />
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </main>
  );
}
