import { Button } from "@/components/ui/button"

interface EvaluationButtonProps {
  onEvaluate: () => void
  isLoading: boolean
}

export default function EvaluationButton({ onEvaluate, isLoading }: EvaluationButtonProps) {
  return (
    <Button 
      onClick={onEvaluate} 
      disabled={isLoading} 
      className="m-2 w-full md:w-1/2 px-2 md:px-4 text-xs md:text-sm"
    >
      {isLoading ? 'Evaluating...' : 'Run Evaluation'}
    </Button>
  )
}
