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
    <div className="space-y-4 w-full">
      <h2 className="text-xl font-semibold">Select Models</h2>
      {availableModels.map((model) => (
        <div key={model.id} className="flex items-center space-x-2">
          <Checkbox
            id={model.id}
            checked={selectedModels.some(m => m.id === model.id)}
            onCheckedChange={() => handleModelToggle(model)}
          />
          <Label htmlFor={model.id}>{model.name} {model.provider}</Label>
        </div>
      ))}
    </div>
  )
}
