import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { QuestionMarkCircledIcon } from '@radix-ui/react-icons';

export default function InfoButton() {
  return (
    <div className='absolute top-2 left-4 z-10'>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant='outline' size='icon'>
            <QuestionMarkCircledIcon className='h-4 w-4' />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>How to Use This Page</AlertDialogTitle>
            <AlertDialogDescription>
              <ol className='list-decimal list-inside space-y-2'>
                <li>Select the models you want to compare</li>
                <li>Add the prompts you want to evaluate for</li>
                <li>Run the evaluation and wait for all the responses to generate</li>
              </ol>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Close</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}