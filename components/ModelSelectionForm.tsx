// components/ModelSelectionForm.tsx
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Model } from '../hooks/useMultiProviderChat'

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

  return (
    <div className="space-y-2 w-full pb-2">
      <h2 className="text-xl font-semibold">Select Models</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
        {availableModels.map((model) => (
          <div key={model.id} className="flex items-center space-x-2">
            <Checkbox
              id={model.id}
              checked={selectedModels.some(m => m.id === model.id)}
              onCheckedChange={() => handleModelToggle(model)}
            />
            <Label htmlFor={model.id} className="text-sm md:text-md">{model.name} {model.provider}</Label>
          </div>
        ))}
      </div>
    </div>
  )
}
