import { useChat, UseChatOptions } from 'ai/react';

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
  { id: 'gpt-4o', name: 'GPT-4o', provider: 'openai' },
  { id: 'gpt-4o-mini', name: 'GPT-4o Mini', provider: 'openai' },
//  { id: 'llama-3.1-405b-reasoning', name: 'Llama-3.1 405b', provider: 'groq' },
  { id: 'llama-3.1-70b-versatile', name: 'Llama-3.1 70b', provider: 'groq' },
  { id: 'llama-3.1-8b-instant', name: 'Llama-3.1 8b', provider: 'groq' },
  { id: 'llama-3-70b-8192', name: 'Llama-3 70b', provider: 'groq' },
  { id: 'mixtral-8x7b-32768', name: 'Mixtral 8x7b', provider: 'groq' },
  { id: 'gemma-7b-it', name: 'Gemma 7b', provider: 'groq' },
  { id: 'gemma2-9b-it', name: 'Gemma2 9b', provider: 'groq' },
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
