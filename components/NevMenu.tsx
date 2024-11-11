import React from 'react';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import { DiGithubBadge } from "react-icons/di";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

const NavMenu = () => {
  return (
    <div className="absolute top-4 right-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <Menu className="h-[1.2rem] w-[1.2rem]" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <Link href="/">LLM Eval All</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/llm-eval2">LLM Eval Groq</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/chat-with-comparison">LLM Compare</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="https://github.com/cdreetz/just-another-llm-evaluator" target="_blank" rel="noopener noreferrer">
              <DiGithubBadge className="h-[1.2rem] w-[1.2rem] mr-2" />
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default NavMenu;