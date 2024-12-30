import { useChat, UseChatOptions } from 'ai/react';

export type Provider = 'openai' | 'groq' | 'anthropic';

export interface Model {
  id: string;
  name: string;
  provider: Provider;
}

export const AVAILABLE_MODELS: Model[] = [
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'openai' },
  { id: 'gpt-4', name: 'GPT-4', provider: 'openai' },
  { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', provider: 'openai' },
  { id: 'gpt-4o', name: 'GPT-4o', provider: 'openai' },
  { id: 'gpt-4o-mini', name: 'GPT-4o Mini', provider: 'openai' },
  { id: "llama-3.3-70b-specdec", name: "Llama-3.3 70b Speculative Decoding", provider: "groq" },
  { id: "llama-3.1-70b-specdec", name: "Llama-3.1 70b Speculative Decoding", provider: "groq" },
  { id: "llama-3.3-70b-versatile", name: "Llama-3.3 70b", provider: "groq" },
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
  { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus', provider: 'anthropic' },
  { id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku', provider: 'anthropic' },
  { id: 'claude-3-sonnet-20240229', name: 'Claude 3 Sonnet', provider: 'anthropic' },
];

interface UseMultiProviderChatOptions extends Omit<UseChatOptions, 'api'> {
  provider: Provider;
  model: string;
}

export function useMultiProviderChat({
  provider,
  model,
  ...options
}: UseMultiProviderChatOptions) {
  return useChat({
    ...options,
    api: `/api/chat/${provider}`,
    body: { model },
  });
}
