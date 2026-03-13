"use client";

import { useEffect, useState, useCallback } from "react";

type OS = "mac" | "linux";

interface KeyDef {
  code: string; // event.code value(s), comma-separated for aliases
  label: string;
  macLabel?: string;
  linuxLabel?: string;
  width?: number; // relative width units (default 1)
  extraClass?: string;
}

function Key({
  keyDef,
  pressed,
  os,
}: {
  keyDef: KeyDef;
  pressed: Set<string>;
  os: OS;
}) {
  const codes = keyDef.code.split(",");
  const isPressed = codes.some((c) => pressed.has(c));
  const label =
    os === "mac" && keyDef.macLabel
      ? keyDef.macLabel
      : os === "linux" && keyDef.linuxLabel
        ? keyDef.linuxLabel
        : keyDef.label;

  const widthClass =
    keyDef.width === 2
      ? "min-w-[5rem]"
      : keyDef.width === 1.5
        ? "min-w-[3.75rem]"
        : keyDef.width === 2.5
          ? "min-w-[6.25rem]"
          : keyDef.width === 1.25
            ? "min-w-[3.125rem]"
            : keyDef.width === 7
              ? "flex-1"
              : "min-w-[2.5rem]";

  return (
    <div
      className={[
        "h-10 flex items-center justify-center rounded-md border text-xs font-mono font-medium select-none transition-all duration-75 px-1 text-center",
        widthClass,
        keyDef.extraClass ?? "",
        isPressed
          ? "bg-blue-500 border-blue-600 text-white shadow-inner scale-95"
          : "bg-white border-gray-300 text-gray-800 shadow-sm hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200",
      ].join(" ")}
    >
      {label}
    </div>
  );
}

function KeyRow({ keys, pressed, os }: { keys: KeyDef[]; pressed: Set<string>; os: OS }) {
  return (
    <div className="flex gap-1">
      {keys.map((k) => (
        <Key key={k.code} keyDef={k} pressed={pressed} os={os} />
      ))}
    </div>
  );
}

// ─── Keyboard layout definition ───────────────────────────────────────────────

const fnRow: KeyDef[] = [
  { code: "Escape", label: "Esc" },
  { code: "F1", label: "F1" },
  { code: "F2", label: "F2" },
  { code: "F3", label: "F3" },
  { code: "F4", label: "F4" },
  { code: "F5", label: "F5" },
  { code: "F6", label: "F6" },
  { code: "F7", label: "F7" },
  { code: "F8", label: "F8" },
  { code: "F9", label: "F9" },
  { code: "F10", label: "F10" },
  { code: "F11", label: "F11" },
  { code: "F12", label: "F12" },
  { code: "Delete", label: "Del" },
];

const numberRow: KeyDef[] = [
  { code: "Backquote", label: "` ~" },
  { code: "Digit1", label: "1 !" },
  { code: "Digit2", label: "2 @" },
  { code: "Digit3", label: "3 #" },
  { code: "Digit4", label: "4 $" },
  { code: "Digit5", label: "5 %" },
  { code: "Digit6", label: "6 ^" },
  { code: "Digit7", label: "7 &" },
  { code: "Digit8", label: "8 *" },
  { code: "Digit9", label: "9 (" },
  { code: "Digit0", label: "0 )" },
  { code: "Minus", label: "- _" },
  { code: "Equal", label: "= +" },
  { code: "Backspace", label: "⌫ Back", width: 2 },
];

const qwertyRow: KeyDef[] = [
  { code: "Tab", label: "⇥ Tab", width: 1.5 },
  { code: "KeyQ", label: "Q" },
  { code: "KeyW", label: "W" },
  { code: "KeyE", label: "E" },
  { code: "KeyR", label: "R" },
  { code: "KeyT", label: "T" },
  { code: "KeyY", label: "Y" },
  { code: "KeyU", label: "U" },
  { code: "KeyI", label: "I" },
  { code: "KeyO", label: "O" },
  { code: "KeyP", label: "P" },
  { code: "BracketLeft", label: "[ {" },
  { code: "BracketRight", label: "] }" },
  { code: "Backslash", label: "\\ |", width: 1.5 },
];

const homeRow: KeyDef[] = [
  { code: "CapsLock", label: "⇪ Caps", width: 1.75 },
  { code: "KeyA", label: "A" },
  { code: "KeyS", label: "S" },
  { code: "KeyD", label: "D" },
  { code: "KeyF", label: "F" },
  { code: "KeyG", label: "G" },
  { code: "KeyH", label: "H" },
  { code: "KeyJ", label: "J" },
  { code: "KeyK", label: "K" },
  { code: "KeyL", label: "L" },
  { code: "Semicolon", label: "; :" },
  { code: "Quote", label: "' \"" },
  { code: "Enter", label: "⏎ Enter", width: 2.25 },
];

const shiftRow: KeyDef[] = [
  { code: "ShiftLeft", label: "⇧ Shift", width: 2.25 },
  { code: "KeyZ", label: "Z" },
  { code: "KeyX", label: "X" },
  { code: "KeyC", label: "C" },
  { code: "KeyV", label: "V" },
  { code: "KeyB", label: "B" },
  { code: "KeyN", label: "N" },
  { code: "KeyM", label: "M" },
  { code: "Comma", label: ", <" },
  { code: "Period", label: ". >" },
  { code: "Slash", label: "/ ?" },
  { code: "ShiftRight", label: "⇧ Shift", width: 2.75 },
];

function getBottomRow(os: OS): KeyDef[] {
  if (os === "mac") {
    return [
      { code: "ControlLeft", label: "⌃ Ctrl", macLabel: "⌃ Ctrl", width: 1.25 },
      { code: "AltLeft", label: "Alt", macLabel: "⌥ Opt", width: 1.25 },
      { code: "MetaLeft", label: "Super", macLabel: "⌘ Cmd", width: 1.5 },
      { code: "Space", label: "Space", width: 7 },
      { code: "MetaRight", label: "Super", macLabel: "⌘ Cmd", width: 1.5 },
      { code: "AltRight", label: "Alt", macLabel: "⌥ Opt", width: 1.25 },
      { code: "ControlRight", label: "⌃ Ctrl", macLabel: "⌃ Ctrl", width: 1.25 },
    ];
  }
  return [
    { code: "ControlLeft", label: "Ctrl", linuxLabel: "Ctrl", width: 1.25 },
    { code: "MetaLeft", label: "Super", linuxLabel: "⊞ Super", width: 1.25 },
    { code: "AltLeft", label: "Alt", linuxLabel: "Alt", width: 1.5 },
    { code: "Space", label: "Space", width: 7 },
    { code: "AltRight", label: "AltGr", linuxLabel: "AltGr", width: 1.5 },
    { code: "MetaRight", label: "Super", linuxLabel: "⊞ Super", width: 1.25 },
    { code: "ControlRight", label: "Ctrl", linuxLabel: "Ctrl", width: 1.25 },
  ];
}

const arrowCluster: KeyDef[][] = [
  [{ code: "ArrowUp", label: "↑" }],
  [
    { code: "ArrowLeft", label: "←" },
    { code: "ArrowDown", label: "↓" },
    { code: "ArrowRight", label: "→" },
  ],
];

// ─── Main component ────────────────────────────────────────────────────────────

export default function KeyboardPage() {
  const [pressed, setPressed] = useState<Set<string>>(new Set());
  const [lastKey, setLastKey] = useState<{ code: string; key: string } | null>(null);
  const [os, setOs] = useState<OS>("mac");

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    e.preventDefault();
    setPressed((prev) => {
      const next = new Set(prev);
      next.add(e.code);
      return next;
    });
    setLastKey({ code: e.code, key: e.key });
  }, []);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    setPressed((prev) => {
      const next = new Set(prev);
      next.delete(e.code);
      return next;
    });
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    // Clear on blur (e.g. tab away)
    const handleBlur = () => setPressed(new Set());
    window.addEventListener("blur", handleBlur);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", handleBlur);
    };
  }, [handleKeyDown, handleKeyUp]);

  // Detect OS on mount for default
  useEffect(() => {
    if (typeof navigator !== "undefined") {
      const platform = navigator.platform?.toLowerCase() ?? "";
      const ua = navigator.userAgent?.toLowerCase() ?? "";
      if (platform.includes("mac") || ua.includes("mac")) {
        setOs("mac");
      } else {
        setOs("linux");
      }
    }
  }, []);

  const bottomRow = getBottomRow(os);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Keyboard Tester</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Press any key to see it light up. Distinguishes left/right modifiers.
          </p>
        </div>

        {/* OS toggle */}
        <div className="flex justify-center gap-2">
          {(["mac", "linux"] as OS[]).map((o) => (
            <button
              key={o}
              onClick={() => setOs(o)}
              className={[
                "px-4 py-1.5 rounded-full text-sm font-medium border transition-colors",
                os === o
                  ? "bg-blue-500 border-blue-600 text-white"
                  : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700",
              ].join(" ")}
            >
              {o === "mac" ? "🍎 Mac" : "🐧 Linux"}
            </button>
          ))}
        </div>

        {/* Last key indicator */}
        <div className="flex justify-center">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-6 py-3 font-mono text-sm min-w-[16rem] text-center shadow-sm">
            {lastKey ? (
              <span>
                <span className="text-gray-400">key:</span>{" "}
                <span className="text-blue-600 dark:text-blue-400 font-bold">{lastKey.key}</span>
                {"  "}
                <span className="text-gray-400">code:</span>{" "}
                <span className="text-green-600 dark:text-green-400 font-bold">{lastKey.code}</span>
              </span>
            ) : (
              <span className="text-gray-400">Press a key…</span>
            )}
          </div>
        </div>

        {/* Keyboard */}
        <div className="bg-gray-200 dark:bg-gray-700 rounded-2xl p-4 shadow-lg overflow-x-auto">
          <div className="space-y-1 min-w-max mx-auto w-fit">
            <KeyRow keys={fnRow} pressed={pressed} os={os} />
            <div className="h-1" />
            <KeyRow keys={numberRow} pressed={pressed} os={os} />
            <KeyRow keys={qwertyRow} pressed={pressed} os={os} />
            <KeyRow keys={homeRow} pressed={pressed} os={os} />
            <KeyRow keys={shiftRow} pressed={pressed} os={os} />

            {/* Bottom row + arrow cluster */}
            <div className="flex gap-4 items-end">
              <KeyRow keys={bottomRow} pressed={pressed} os={os} />
              <div className="space-y-1">
                <div className="flex justify-center">
                  <Key keyDef={arrowCluster[0][0]} pressed={pressed} os={os} />
                </div>
                <div className="flex gap-1">
                  {arrowCluster[1].map((k) => (
                    <Key key={k.code} keyDef={k} pressed={pressed} os={os} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-6 text-xs text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-blue-500 inline-block" />
            Key pressed
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-white border border-gray-300 inline-block" />
            Key released
          </span>
          <span>Left/right modifiers tracked independently</span>
        </div>
      </div>
    </div>
  );
}
