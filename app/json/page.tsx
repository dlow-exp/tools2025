"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Copy, Braces } from "lucide-react";

type IndentSize = 2 | 4;

export default function JsonPage() {
  const [input, setInput] = useState("");
  const [indentSize, setIndentSize] = useState<IndentSize>(2);
  const [copied, setCopied] = useState(false);

  let formatted = "";
  let error = "";

  if (input.trim()) {
    try {
      formatted = JSON.stringify(JSON.parse(input), null, indentSize);
    } catch (e) {
      error = (e as SyntaxError).message;
    }
  }

  const handleCopy = async () => {
    if (!formatted) return;
    await navigator.clipboard.writeText(formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Braces className="w-6 h-6" />
            JSON Formatter
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Paste JSON to validate and format it.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">Indent:</span>
          {([2, 4] as IndentSize[]).map((n) => (
            <button
              key={n}
              onClick={() => setIndentSize(n)}
              className={`px-3 py-1 text-sm rounded-md border transition-colors ${
                indentSize === n
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-input hover:bg-accent"
              }`}
            >
              {n} spaces
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Input</label>
            <textarea
              className="w-full h-96 rounded-md border border-input bg-background px-3 py-2 text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder='{"key": "value"}'
              value={input}
              onChange={(e) => setInput(e.target.value)}
              autoFocus
              spellCheck={false}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Formatted output</label>
              {formatted && (
                <Button variant="outline" size="sm" onClick={handleCopy}>
                  {copied ? (
                    <Check className="w-3 h-3 mr-1" />
                  ) : (
                    <Copy className="w-3 h-3 mr-1" />
                  )}
                  {copied ? "Copied!" : "Copy"}
                </Button>
              )}
            </div>
            {error ? (
              <div className="h-96 rounded-md border border-destructive bg-destructive/5 px-3 py-2 text-sm font-mono text-destructive overflow-auto">
                {error}
              </div>
            ) : (
              <textarea
                className="w-full h-96 rounded-md border border-input bg-muted px-3 py-2 text-sm font-mono resize-none focus:outline-none"
                value={formatted}
                readOnly
                spellCheck={false}
                placeholder="Formatted JSON will appear here..."
              />
            )}
          </div>
        </div>

        {input.trim() && !error && (
          <p className="text-xs text-muted-foreground">
            Valid JSON &mdash; {formatted.split("\n").length} lines
          </p>
        )}
      </div>
    </div>
  );
}
