// components/ModelSelectionForm.tsx
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Model } from '../hooks/useMultiProviderChat'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { ChevronDown, X } from "lucide-react"

interface ModelSelectionFormProps {
  availableModels: Model[]
  selectedModels: Model[]
  onModelSelectionChange: (models: Model[]) => void
}

export default function ModelSelectionForm({
  availableModels,
  selectedModels,
  onModelSelectionChange
}: ModelSelectionFormProps) {
  const handleModelToggle = (model: Model) => {
    const updatedModels = selectedModels.some(m => m.id === model.id)
      ? selectedModels.filter(m => m.id !== model.id)
      : [...selectedModels, model]
    onModelSelectionChange(updatedModels)
  }

  const handleModelRemove = (modelId: string) => {
    const updatedModels = selectedModels.filter(m => m.id !== modelId)
    onModelSelectionChange(updatedModels)
  }

  return (
    <div className="space-y-4 w-full pb-2">
      <h2 className="text-xl font-semibold">Select Models</h2>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            Select Models
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <div className="max-h-60 overflow-auto p-2">
            {availableModels.map((model) => (
              <div key={model.id} className="flex items-center space-x-2 py-2">
                <Checkbox
                  id={model.id}
                  checked={selectedModels.some(m => m.id === model.id)}
                  onCheckedChange={() => handleModelToggle(model)}
                />
                <Label htmlFor={model.id} className="text-sm">{model.name} {model.provider}</Label>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>
      <div className="flex flex-wrap gap-2">
        {selectedModels.map((model) => (
          <div key={model.id} className="flex items-center space-x-1 bg-gray-100 rounded-full px-3 py-1">
            <span className="text-sm">{model.name} {model.provider}</span>
            <button onClick={() => handleModelRemove(model.id)} className="text-gray-500 hover:text-gray-700">
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
