// components/PromptInputForm.tsx
'use client'

import { useState } from 'react'
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

interface PromptInputFormProps {
  prompts: string[]
  onPromptsChange: (prompts: string[]) => void
}


export default function PromptInputForm({ prompts, onPromptsChange }: PromptInputFormProps) {
  const [currentPrompt, setCurrentPrompt] = useState('')

  const addPrompt = () => {
    if (currentPrompt.trim()) {
      onPromptsChange([...prompts, currentPrompt.trim()])
      setCurrentPrompt('')
    }
  }

  return (
    <div className="space-y-4 w-full">
      <h2 className="text-xl font-semibold">Enter Prompts</h2>
      <Textarea 
        placeholder="Enter your prompt here..." 
        className="min-h-[70px]" 
        value={currentPrompt}
        onChange={(e) => setCurrentPrompt(e.target.value)}
      />
      <Button onClick={addPrompt}>Add Prompt</Button>
      {prompts.length > 0 && (
        <div>
          <h3 className="text-lg font-meduim mb-2">Added Prompts:</h3>
          <ScrollArea className="h-[150px] w-full border rounded-md p-4">
            <ul className="space-y-2">
              {prompts.map((prompt, index) => (
                <li key={index} className="bg-secondary p-2 rounded">{prompt}</li>
              ))}
            </ul>
          </ScrollArea>
        </div>
      )}
    </div>
  )
}
