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
import { ReactNode } from 'react';

interface InfoButtonProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export default function InfoButton({ title, children, className = 'absolute top-4 left-4 z-10' }: InfoButtonProps) {
  return (
    <div className={className}>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant='outline' size='icon'>
            <QuestionMarkCircledIcon className='h-4 w-4' />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>
              {children}
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