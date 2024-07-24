import { Button } from "@/components/ui/button"

interface EvaluationButtonProps {
  onEvaluate: () => void
}

export default function EvaluationButton({ onEvaluate }: EvaluationButtonProps) {
  return (
    <Button onClick={onEvaluate} className="m-2 w-1/2">Run Evaluation</Button>
  )
}
