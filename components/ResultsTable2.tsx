// components/ResultsTable.tsx
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Model } from '../hooks/useMultiProviderChat'
import { Skeleton } from "@/components/ui/skeleton"

interface ModelMetrics {
  completion_time: number;
  completion_tokens: number;
  total_tokens: number;
}

interface ResultsTableProps {
  results: {
    prompt: string;
    results: { [modelId: string]: string };
    metrics: { [modelId: string]: ModelMetrics };
  }[];
  selectedModels: Model[]
  isLoading: boolean
  isInitial: boolean
}

export default function ResultsTable2({ results, selectedModels, isLoading, isInitial }: ResultsTableProps) {
  console.log('Results with metrics:', results);

  if (results.length === 0 && !isLoading && !isInitial) {
    return null
  }

  const modelColumnWidth = selectedModels.length > 0 ? `${85 / selectedModels.length}%` : 'auto'

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Evaluation Results</h2>
      <div className="w-full">
        <Table>
          <TableCaption>A comparison of LLM outputs for given prompts.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px] min-w-[200px]">Prompt</TableHead>
              {selectedModels.map((model) => (
                <TableHead key={model.id} className="min-w-[300px]">{model.name}</TableHead>
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
                        <>
                          <div>{result.results[model.id]}</div>
                          {result.metrics[model.id]?.completion_time && 
                           result.metrics[model.id]?.completion_tokens && (
                            <div className="text-xs text-gray-500 mt-2">
                              Speed: {(result.metrics[model.id].completion_tokens / result.metrics[model.id].completion_time).toFixed(1)} tokens/sec
                              <br />
                              Total tokens: {result.metrics[model.id].total_tokens}
                            </div>
                          )}
                        </>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
