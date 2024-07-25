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
}

export default function ResultsTable({ results, selectedModels, isLoading }: ResultsTableProps) {
  if (results.length === 0 && !isLoading) {
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
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={selectedModels.length + 1}>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </TableCell>
            </TableRow>
          ) : (
            results.map((result, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{result.prompt}</TableCell>
                {selectedModels.map((model) => (
                  <TableCell key={model.id}>{result.results[model.id]}</TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
