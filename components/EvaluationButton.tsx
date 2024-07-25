import { Button } from "@/components/ui/button"

interface EvaluationButtonProps {
  onEvaluate: () => void
  isLoading: boolean
}

export default function EvaluationButton({ onEvaluate, isLoading }: EvaluationButtonProps) {
  return (
    <Button onClick={onEvaluate} disabled={isLoading} className="m-2 w-1/2">
      {isLoading ? 'Evaluating...' : 'Run Evaluation'}
    </Button>
  )
}
