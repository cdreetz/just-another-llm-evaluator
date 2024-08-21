'use client'

import * as React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Provider, Model, AVAILABLE_MODELS } from '../hooks/useMultiProviderChat';

interface ProviderSelectProps {
  provider: Provider
  model: string
  onProviderChange: (provider: Provider) => void
  onModelChange: (model: string) => void
}

export function ProviderSelect({ provider, model, onProviderChange, onModelChange }: ProviderSelectProps) {
  const availableModels = AVAILABLE_MODELS.filter(m => m.provider === provider)

  return (
    <div className='space-y-2'>
      <Select onValueChange={onProviderChange} value={provider}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select AI Provider" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="openai">OpenAI</SelectItem>
          <SelectItem value="groq">Groq</SelectItem>
          <SelectItem value="anthropic">Anthropic</SelectItem>
        </SelectContent>
      </Select>
      <Select onValueChange={onModelChange} value={model}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select Model" />
        </SelectTrigger>
        <SelectContent>
          {availableModels.map((m) => (
            <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
