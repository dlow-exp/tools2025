"use client";

import { useCallback, useRef, useState } from "react";
import { Check, ClipboardPaste, Copy, FileText, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

function htmlToMarkdown(html: string): string {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const TurndownService = require("turndown");
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { gfm } = require("turndown-plugin-gfm");
  const td = new TurndownService({
    headingStyle: "atx",
    hr: "---",
    bulletListMarker: "-",
    codeBlockStyle: "fenced",
    emDelimiter: "_",
    strongDelimiter: "**",
  });
  td.use(gfm);
  return td.turndown(html);
}

export default function RichTextToMarkdownPage() {
  const [markdown, setMarkdown] = useState("");
  const [copied, setCopied] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const editorRef = useRef<HTMLDivElement>(null);

  const convert = useCallback((html: string) => {
    if (!html.trim()) {
      setMarkdown("");
      setCharCount(0);
      return;
    }
    const md = htmlToMarkdown(html);
    setMarkdown(md);
    setCharCount(md.length);
  }, []);

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLDivElement>) => {
      // Let the browser insert the rich content, then read innerHTML
      // We use setTimeout 0 to read after the paste is applied
      setTimeout(() => {
        if (editorRef.current) {
          convert(editorRef.current.innerHTML);
        }
      }, 0);
      // Don't prevent default — let browser paste the rich content naturally
    },
    [convert],
  );

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      convert(editorRef.current.innerHTML);
    }
  }, [convert]);

  const clearAll = useCallback(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = "";
    }
    setMarkdown("");
    setCharCount(0);
  }, []);

  const copyMarkdown = useCallback(async () => {
    if (!markdown) return;
    await navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [markdown]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="border-b px-6 py-4 flex items-center gap-3">
        <FileText className="w-6 h-6 text-primary" />
        <div>
          <h1 className="text-xl font-bold">Rich Text to Markdown</h1>
          <p className="text-xs text-muted-foreground">
            Paste formatted text on the left — get Markdown on the right
          </p>
        </div>
        {markdown && (
          <Badge variant="secondary" className="ml-auto">
            {charCount.toLocaleString()} chars
          </Badge>
        )}
      </div>

      {/* Two-panel layout */}
      <div
        className="flex flex-1 divide-x overflow-hidden"
        style={{ minHeight: "calc(100vh - 73px)" }}
      >
        {/* Left: Rich text input */}
        <div className="flex flex-1 flex-col">
          <div className="flex items-center justify-between px-4 py-2 bg-muted/40 border-b">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Rich Text Input
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <ClipboardPaste className="w-3 h-3" />
                Paste or type here
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAll}
                className="h-7 px-2 text-xs"
              >
                <Trash2 className="w-3 h-3 mr-1" />
                Clear
              </Button>
            </div>
          </div>
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onPaste={handlePaste}
            onInput={handleInput}
            className="flex-1 p-5 outline-none overflow-auto prose prose-sm max-w-none dark:prose-invert"
            style={{ minHeight: "200px" }}
            data-placeholder="Paste rich text here (e.g. from a webpage, Google Docs, Word)…"
          />
        </div>

        {/* Right: Markdown output */}
        <div className="flex flex-1 flex-col">
          <div className="flex items-center justify-between px-4 py-2 bg-muted/40 border-b">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Markdown Output
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={copyMarkdown}
              disabled={!markdown}
              className="h-7 px-2 text-xs"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 mr-1 text-green-500" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 mr-1" />
                  Copy
                </>
              )}
            </Button>
          </div>
          <pre
            className="flex-1 p-5 overflow-auto text-sm font-mono whitespace-pre-wrap text-foreground bg-muted/20"
            style={{ minHeight: "200px" }}
          >
            {markdown || (
              <span className="text-muted-foreground/50 italic">
                Markdown will appear here…
              </span>
            )}
          </pre>
        </div>
      </div>

      <style>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: hsl(var(--muted-foreground) / 0.5);
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
