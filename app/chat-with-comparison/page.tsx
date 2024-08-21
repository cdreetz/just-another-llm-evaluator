// page.tsx
'use client'

import { useState } from 'react';
import { useMultiProviderChat, Provider, AVAILABLE_MODELS } from '../../hooks/useMultiProviderChat';
import { ProviderSelect } from '../../components/ProviderSelect';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import InfoButton from '@/components/InfoButton';

export default function DualChat() {
  const [provider1, setProvider1] = useState<Provider>('openai');
  const [model1, setModel1] = useState(AVAILABLE_MODELS.find(m => m.provider === 'openai')?.id || '');
  const [provider2, setProvider2] = useState<Provider>('groq');
  const [model2, setModel2] = useState(AVAILABLE_MODELS.find(m => m.provider === 'groq')?.id || '');

  const chat1 = useMultiProviderChat({ provider: provider1, model: model1 });
  const chat2 = useMultiProviderChat({ provider: provider2, model: model2 });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (chat1.input.trim()) {
      chat1.handleSubmit(e);
      chat2.handleSubmit(e);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    chat1.handleInputChange(e);
    chat2.setInput(value);
  };

  return (
    <main className="container mx-auto p-4">
      <InfoButton
        title="LLM Evaluations"
        className="absolute top-4 left-4 z-10"
      >
        <ol className="list-decimal pl-4">
          <li>Select two models you want to compare</li>
          <li>Start chatting with the models like you normally would</li>
        </ol>
      </InfoButton>
      <h1 className="text-3xl font-bold mb-6">Dual Model Chat Comparison</h1>
      <div className="grid grid-cols-2 gap-4 mb-4">
        {[
          { provider: provider1, setProvider: setProvider1, model: model1, setModel: setModel1, chat: chat1 },
          { provider: provider2, setProvider: setProvider2, model: model2, setModel: setModel2, chat: chat2 },
        ].map((chatConfig, index) => (
          <div key={index} className="border rounded-lg p-4">
            <ProviderSelect 
              provider={chatConfig.provider} 
              model={chatConfig.model}
              onProviderChange={(newProvider) => {
                chatConfig.setProvider(newProvider);
                const newModel = AVAILABLE_MODELS.find(m => m.provider === newProvider)?.id || '';
                chatConfig.setModel(newModel);
              }} 
              onModelChange={chatConfig.setModel}
            />
            <ScrollArea className="h-[400px] mt-4">
              {chatConfig.chat.messages.map((m) => (
                <div key={m.id} className="whitespace-pre-wrap mb-4">
                  <strong>{m.role === 'user' ? 'User: ' : 'AI: '}</strong>
                  {m.content}
                </div>
              ))}
            </ScrollArea>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="flex space-x-2">
          <Input
            className="flex-grow"
            value={chat1.input}
            placeholder="Type your message here..."
            onChange={handleInputChange}
          />
          <Button type="submit">Send</Button>
        </div>
      </form>
    </main>
  );
}