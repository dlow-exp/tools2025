"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy, Download, QrCode, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import QRCode from "qrcode";

export default function TextToQrPage() {
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!text.trim()) {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        ctx?.clearRect(0, 0, canvas.width, canvas.height);
      }
      setError("");
      return;
    }
    QRCode.toCanvas(
      canvasRef.current,
      text,
      { width: 320, margin: 2 },
      (err) => {
        if (err) {
          setError("Text is too long to encode as a QR code.");
        } else {
          setError("");
        }
      },
    );
  }, [text]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas || !text.trim()) return;
    const link = document.createElement("a");
    link.download = "qrcode.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const handleCopy = async () => {
    const canvas = canvasRef.current;
    if (!canvas || !text.trim()) return;
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob }),
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const hasQr = text.trim() && !error;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="border-b px-6 py-4 flex items-center gap-3">
        <QrCode className="w-6 h-6 text-primary" />
        <div>
          <h1 className="text-xl font-bold">Text to QR Code</h1>
          <p className="text-xs text-muted-foreground">
            Type or paste text to generate a QR code instantly
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col items-center justify-start gap-8 px-4 py-10 md:py-16">
        {/* Input */}
        <div className="w-full max-w-lg flex flex-col gap-2">
          <div className="flex items-center justify-between mb-1">
            <label
              htmlFor="qr-input"
              className="text-sm font-medium text-muted-foreground uppercase tracking-wide"
            >
              Input Text
            </label>
            {text && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setText("")}
                className="h-7 px-2 text-xs"
              >
                <Trash2 className="w-3 h-3 mr-1" />
                Clear
              </Button>
            )}
          </div>
          <textarea
            id="qr-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter URL, text, contact info…"
            rows={4}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-ring"
          />
          {error && <p className="text-xs text-destructive">{error}</p>}
          <p className="text-xs text-muted-foreground text-right">
            {text.length} characters
          </p>
        </div>

        {/* QR canvas */}
        <div
          className={`rounded-xl border bg-white p-4 shadow-sm transition-opacity duration-200 ${hasQr ? "opacity-100" : "opacity-30"}`}
        >
          <canvas ref={canvasRef} width={320} height={320} />
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleCopy}
            disabled={!hasQr}
            className="gap-2"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-green-500" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy Image
              </>
            )}
          </Button>
          <Button onClick={handleDownload} disabled={!hasQr} className="gap-2">
            <Download className="w-4 h-4" />
            Download PNG
          </Button>
        </div>
      </div>
    </div>
  );
}
