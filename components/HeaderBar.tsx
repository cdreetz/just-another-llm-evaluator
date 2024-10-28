import React from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { DiGithubBadge } from "react-icons/di";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const HeaderBar = () => {
  return (
    <header className="flex justify-end items-center p-4 bg-background">
      <Link
        href="https://github.com/cdreetz/just-another-llm-evaluator"
        target="_blank"
        rel="noopener noreferrer"
        className="mr-4"
      >
        <DiGithubBadge className="h-6 w-6" />
      </Link>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <Link href="/">Home</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/llm-eval">LLM Eval</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/chat-with-comparison">LLM Compare</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/transcribe">Audio</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/audio-analytics">Audio Analytics</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/vision">Vision</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/pii">PII</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="https://github.com/cdreetz/just-another-llm-evaluator/issues/new">
              Support
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};

export default HeaderBar;
