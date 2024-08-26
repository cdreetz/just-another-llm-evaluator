// components/PromptInputForm.tsx
'use client'

import { useState, useRef } from 'react'
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

interface PromptInputFormProps {
  prompts: string[]
  onPromptsChange: (prompts: string[]) => void
}

export default function PromptInputForm({ prompts, onPromptsChange }: PromptInputFormProps) {
  const [currentPrompt, setCurrentPrompt] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const addPrompt = () => {
    if (currentPrompt.trim()) {
      onPromptsChange([...prompts, currentPrompt.trim()])
      setCurrentPrompt('')
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        const newPrompts = content.split('\n').filter(prompt => prompt.trim() !== '')
        onPromptsChange([...prompts, ...newPrompts])
      }
      reader.readAsText(file)
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
      <div className="flex space-x-2">
        <Button onClick={addPrompt}>Add Prompt</Button>
        <Button onClick={() => fileInputRef.current?.click()}>Upload Prompts</Button>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".txt"
          onChange={handleFileUpload}
        />
      </div>
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
