// components/ResultsTable.tsx
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Model } from '../hooks/useMultiProviderChat'
import { Skeleton } from "@/components/ui/skeleton"

interface ResultsTableProps {
  results: Array<{
    prompt: string
    results: {
      [modelId: string]: string
    }
  }>
  selectedModels: Model[]
  isLoading: boolean
  isInitial: boolean
}

export default function ResultsTable({ results, selectedModels, isLoading, isInitial }: ResultsTableProps) {
  if (results.length === 0 && !isLoading && !isInitial) {
    return null
  }

  const modelColumnWidth = selectedModels.length > 0 ? `${85 / selectedModels.length}%` : 'auto'

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Evaluation Results</h2>
      <Table>
        <TableCaption>A comparison of LLM outputs for given prompts.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead style={{ width: '15%' }}>Prompt</TableHead>
            {selectedModels.map((model) => (
              <TableHead key={model.id} style={{ width: modelColumnWidth }}>{model.name}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isInitial ? (
              <TableRow>
                <TableCell colSpan={selectedModels.length + 1}>
                  <Skeleton className="h-4 w-full" />
                </TableCell>
              </TableRow>
          ) : (
            results.map((result, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{result.prompt}</TableCell>
                {selectedModels.map((model) => (
                  <TableCell key={model.id}>
                    {isLoading && result.results[model.id] === '' ? (
                      <Skeleton className="h-4 w-full" />
                    ) : (
                      result.results[model.id]
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}