// app/page.tsx

import { Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { ArrowRight, Code, Zap, Shield } from 'lucide-react'

function HeroSection() {
  return (
    <section className="py-20 px-4 text-center">
      <h1 className="text-4xl font-bold mb-4">Just Another LLM Evaluator</h1>
      <p className="text-xl mb-8">Unfortunately this is nothing special, just another LLM evaluator..</p>
      <Link href="/llm-eval2">
        <Button size="lg">
          Get Started
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </Link>
    </section>
  )
}

function Footer() {
  return (
    <footer className="py-8 px-4 text-center absolute bottom-0 left-0 right-0">
      <h2 className="text-2xl font-semibold mb-4">Featured</h2>
      <div className="flex justify-center items-center">
        <Image src="/groq.svg" alt="Groq Logo" width={100} height={34} />
      </div>
    </footer>
  )
}

export default function LandingPage() {
  return (
    <main className="flex flex-col">
      <Suspense fallback={<div>Loading...</div>}>
        <HeroSection />
      </Suspense>
      <div className="flex-grow"></div>
      <Footer />
    </main>
  )
}