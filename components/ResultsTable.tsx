// components/ResultsTable.tsx
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Model } from '../hooks/useMultiProviderChat'

interface ResultsTableProps {
  results: Array<{
    prompt: string
    results: {
      [modelId: string]: string
    }
  }>
  selectedModels: Model[]
}

export default function ResultsTable({ results, selectedModels }: ResultsTableProps) {
  if (results.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Evaluation Results</h2>
      <Table>
        <TableCaption>A comparison of LLM outputs for given prompts.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Prompt</TableHead>
            {selectedModels.map((model) => (
              <TableHead key={model.id}>{model.name}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.map((result, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{result.prompt}</TableCell>
              {selectedModels.map((model) => (
                <TableCell key={model.id}>{result.results[model.id]}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
