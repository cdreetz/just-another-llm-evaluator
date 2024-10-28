"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import InfoButton from "@/components/InfoButton";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function PIIPage() {
  const [inputText, setInputText] = useState("");
  const [anonymizedText, setAnonymizedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAnonymize = async () => {
    if (!inputText.trim()) {
      setError("Please enter some text to anonymize.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/generate-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "groq:llama3-70b-8192",
          prompt: `
You are an AI assistant specialized in identifying and anonymizing Personally Identifiable Information (PII). Your task is to analyze the following text and replace any PII with appropriate tags.

Here's the text to anonymize:

${inputText}

These are the PII instances and their corresponding tags to replace with:

- Names: <NAME>
- Addresses: <ADDRESS>
- Phone numbers: <PHONE>
- Email addresses: <EMAIL>
- Dates of birth: <DOB>
- Other PII: <PII>

Please provide the anonymized version of the text. Replace all instances of PII with their respective tags. Your output should not include any additional text or comments. If there are multiple types of PII, replace them all.
`,
        }),
      });

      if (!response.ok) throw new Error("API response was not ok");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      let accumulatedText = "";

      while (true) {
        const result = await reader?.read();
        if (!result) break;
        const { done, value } = result;
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        accumulatedText += chunk;
        setAnonymizedText(accumulatedText);
      }
    } catch (err) {
      setError("An error occurred during anonymization. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="container mx-auto p-4">
      <InfoButton
        title="PII Anonymization"
        className="absolute top-4 left-4 z-10"
      >
        <ol className="list-decimal pl-4">
          <li>Enter text containing PII in the input box</li>
          <li>Click Anonymize PII</li>
          <li>View the anonymized text in the result box</li>
        </ol>
      </InfoButton>
      <h1 className="text-3xl font-bold mb-6">PII Anonymization</h1>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">Input Text:</h2>
          <Textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full h-64 mb-4"
            placeholder="Enter text containing PII here..."
          />
          <Button
            onClick={handleAnonymize}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "Anonymizing..." : "Anonymize PII"}
          </Button>
        </div>
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">Anonymized Result:</h2>
          <ScrollArea className="h-[300px] w-full border rounded-lg p-2">
            <pre className="whitespace-pre-wrap">{anonymizedText}</pre>
          </ScrollArea>
        </div>
      </div>
    </main>
  );
}
