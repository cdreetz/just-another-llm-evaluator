'use client'

import { ProviderSelect } from './ProviderSelect';
import { Provider } from '@/hooks/useMultiProviderChat';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Message } from 'ai';

interface ChatWindowProps {
  messages: Message[]
  provider: Provider
  onProviderChange: (provider: Provider) => void
}

// export default function Chat({ messages, provider, onProviderChange }: ChatWindowProps) {
//   return (
//     <div className="flex flex-col h-full">
//       <div className='mb-4'>
//         <ProviderSelect 
//           provider={provider} 
//           onProviderChange={onProviderChange} 
//           model={model}
//         />
//       </div>
// 
//       <ScrollArea className='flex-grow'>
//         {messages.map((m) => (
//           <div key={m.id} className="whitespace-pre-wrap mb-4">
//             <strong>{m.role === 'user' ? 'User: ' : 'AI: '}</strong>
//             {m.content}
//           </div>
//         ))}
//       </ScrollArea>
//     </div>
//   );
// }

export default function Chat() {
  return <div>old component</div>
}