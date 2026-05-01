"use client";

import { useState, useEffect, useRef } from "react";
import QRCode from "qrcode";
import { Button } from "@/components/ui/button";
import { Download, Copy, Check } from "lucide-react";

export default function QRPage() {
  const [text, setText] = useState("");
  const [hasQr, setHasQr] = useState(false);
  const [error, setError] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (!text.trim()) {
      setHasQr(false);
      setError("");
      const ctx = canvas.getContext("2d");
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    QRCode.toCanvas(canvas, text, { width: 300, margin: 2 }, (err) => {
      if (err) {
        setError("Failed to generate QR code");
        setHasQr(false);
        return;
      }
      setError("");
      setHasQr(true);
    });
  }, [text]);

  const getDataUrl = () => canvasRef.current?.toDataURL("image/png") ?? "";

  const handleDownload = () => {
    const url = getDataUrl();
    if (!url) return;
    const a = document.createElement("a");
    a.href = url;
    a.download = "qrcode.png";
    a.click();
  };

  const handleCopy = async () => {
    const url = getDataUrl();
    if (!url) return;
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob }),
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Copy not supported in this browser");
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Text to QR Code</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Type or paste any text or URL to generate a QR code instantly.
          </p>
        </div>

        <textarea
          className="w-full h-32 rounded-md border border-input bg-background px-3 py-2 text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Enter text or URL..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          autoFocus
        />

        {error && <p className="text-destructive text-sm">{error}</p>}

        <div className="flex flex-col items-center space-y-4">
          <canvas
            ref={canvasRef}
            className={`rounded-md border ${hasQr ? "" : "hidden"}`}
          />
          {hasQr && (
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCopy}>
                {copied ? (
                  <Check className="w-4 h-4 mr-2" />
                ) : (
                  <Copy className="w-4 h-4 mr-2" />
                )}
                {copied ? "Copied!" : "Copy image"}
              </Button>
              <Button onClick={handleDownload}>
                <Download className="w-4 h-4 mr-2" />
                Download PNG
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
