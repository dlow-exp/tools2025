"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// ── helpers ─────────────────────────────────────────────────────────────────

function Toggle({
  enabled,
  onToggle,
}: {
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        enabled ? "bg-primary" : "bg-muted"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      type="button"
      onClick={copy}
      className="text-xs px-2 py-1 rounded bg-zinc-700 hover:bg-zinc-600 text-zinc-200 transition-colors"
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

function CodeBlock({ code }: { code: string }) {
  return (
    <div className="relative">
      <div className="absolute top-2 right-2">
        <CopyButton text={code} />
      </div>
      <pre className="bg-zinc-950 text-zinc-100 p-4 rounded-lg text-sm font-mono overflow-x-auto whitespace-pre-wrap pr-16">
        {code}
      </pre>
    </div>
  );
}

// ── types ────────────────────────────────────────────────────────────────────

type ScheduleType = "none" | "interval" | "calendar" | "watchpaths";

interface EnvVar {
  key: string;
  value: string;
}

// ── plist generator ──────────────────────────────────────────────────────────

function indent(n: number) {
  return "    ".repeat(n);
}

function generatePlist(state: {
  label: string;
  programPath: string;
  args: string[];
  workingDir: string;
  keepAlive: boolean;
  runAtLoad: boolean;
  scheduleType: ScheduleType;
  intervalSeconds: string;
  calWeekday: string;
  calHour: string;
  calMinute: string;
  watchPaths: string[];
  daemonType: "daemon" | "agent";
  userName: string;
  enableLogs: boolean;
  stdoutPath: string;
  stderrPath: string;
  enableEnv: boolean;
  envVars: EnvVar[];
  throttleEnabled: boolean;
  throttleInterval: string;
  niceEnabled: boolean;
  niceValue: number;
  cpuLimitEnabled: boolean;
  cpuLimitSeconds: string;
  includeComments: boolean;
}) {
  const c = state.includeComments;
  const lines: string[] = [];

  lines.push('<?xml version="1.0" encoding="UTF-8"?>');
  lines.push(
    '<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">'
  );
  lines.push('<plist version="1.0">');
  lines.push("<dict>");

  if (c) lines.push(`${indent(1)}<!-- Unique identifier for this service -->`);
  lines.push(`${indent(1)}<key>Label</key>`);
  lines.push(`${indent(1)}<string>${state.label || "com.example.myapp"}</string>`);

  if (c)
    lines.push(
      `${indent(1)}<!-- The executable and its arguments (first element must be the full path) -->`
    );
  lines.push(`${indent(1)}<key>ProgramArguments</key>`);
  lines.push(`${indent(1)}<array>`);
  lines.push(
    `${indent(2)}<string>${state.programPath || "/usr/local/bin/myapp"}</string>`
  );
  for (const arg of state.args.filter((a) => a.trim())) {
    lines.push(`${indent(2)}<string>${arg}</string>`);
  }
  lines.push(`${indent(1)}</array>`);

  if (state.workingDir.trim()) {
    if (c)
      lines.push(`${indent(1)}<!-- Directory to use as the working directory -->`);
    lines.push(`${indent(1)}<key>WorkingDirectory</key>`);
    lines.push(`${indent(1)}<string>${state.workingDir}</string>`);
  }

  if (c)
    lines.push(
      `${indent(1)}<!-- Whether to restart the job if it exits (true = keep running) -->`
    );
  lines.push(`${indent(1)}<key>KeepAlive</key>`);
  lines.push(`${indent(1)}<${state.keepAlive ? "true" : "false"}/>`);

  if (state.runAtLoad) {
    if (c)
      lines.push(`${indent(1)}<!-- Start the job immediately when loaded -->`);
    lines.push(`${indent(1)}<key>RunAtLoad</key>`);
    lines.push(`${indent(1)}<true/>`);
  }

  if (!state.keepAlive) {
    if (state.scheduleType === "interval" && state.intervalSeconds.trim()) {
      if (c)
        lines.push(
          `${indent(1)}<!-- Run every N seconds (StartInterval) -->`
        );
      lines.push(`${indent(1)}<key>StartInterval</key>`);
      lines.push(
        `${indent(1)}<integer>${parseInt(state.intervalSeconds, 10)}</integer>`
      );
    }

    if (state.scheduleType === "calendar") {
      if (c)
        lines.push(
          `${indent(1)}<!-- Run at a specific calendar time (like cron) -->`
        );
      lines.push(`${indent(1)}<key>StartCalendarInterval</key>`);
      lines.push(`${indent(1)}<dict>`);
      if (state.calWeekday.trim()) {
        lines.push(`${indent(2)}<key>Weekday</key>`);
        lines.push(
          `${indent(2)}<integer>${parseInt(state.calWeekday, 10)}</integer>`
        );
      }
      if (state.calHour.trim()) {
        lines.push(`${indent(2)}<key>Hour</key>`);
        lines.push(
          `${indent(2)}<integer>${parseInt(state.calHour, 10)}</integer>`
        );
      }
      if (state.calMinute.trim()) {
        lines.push(`${indent(2)}<key>Minute</key>`);
        lines.push(
          `${indent(2)}<integer>${parseInt(state.calMinute, 10)}</integer>`
        );
      }
      lines.push(`${indent(1)}</dict>`);
    }

    if (
      state.scheduleType === "watchpaths" &&
      state.watchPaths.some((p) => p.trim())
    ) {
      if (c)
        lines.push(
          `${indent(1)}<!-- Paths to watch; job is triggered when any path changes -->`
        );
      lines.push(`${indent(1)}<key>WatchPaths</key>`);
      lines.push(`${indent(1)}<array>`);
      for (const p of state.watchPaths.filter((p) => p.trim())) {
        lines.push(`${indent(2)}<string>${p}</string>`);
      }
      lines.push(`${indent(1)}</array>`);
    }
  }

  if (state.daemonType === "daemon" && state.userName.trim()) {
    if (c)
      lines.push(
        `${indent(1)}<!-- Run the job as this user instead of root -->`
      );
    lines.push(`${indent(1)}<key>UserName</key>`);
    lines.push(`${indent(1)}<string>${state.userName}</string>`);
  }

  if (state.enableLogs) {
    if (state.stdoutPath.trim()) {
      if (c)
        lines.push(`${indent(1)}<!-- Redirect standard output to this file -->`);
      lines.push(`${indent(1)}<key>StandardOutPath</key>`);
      lines.push(`${indent(1)}<string>${state.stdoutPath}</string>`);
    }
    if (state.stderrPath.trim()) {
      if (c)
        lines.push(
          `${indent(1)}<!-- Redirect standard error to this file -->`
        );
      lines.push(`${indent(1)}<key>StandardErrorPath</key>`);
      lines.push(`${indent(1)}<string>${state.stderrPath}</string>`);
    }
  }

  const validEnvVars = state.envVars.filter((e) => e.key.trim());
  if (state.enableEnv && validEnvVars.length > 0) {
    if (c)
      lines.push(
        `${indent(1)}<!-- Environment variables to set for the job -->`
      );
    lines.push(`${indent(1)}<key>EnvironmentVariables</key>`);
    lines.push(`${indent(1)}<dict>`);
    for (const { key, value } of validEnvVars) {
      lines.push(`${indent(2)}<key>${key}</key>`);
      lines.push(`${indent(2)}<string>${value}</string>`);
    }
    lines.push(`${indent(1)}</dict>`);
  }

  if (state.throttleEnabled && state.throttleInterval.trim()) {
    if (c)
      lines.push(
        `${indent(1)}<!-- Minimum seconds between job restarts to prevent rapid respawn -->`
      );
    lines.push(`${indent(1)}<key>ThrottleInterval</key>`);
    lines.push(
      `${indent(1)}<integer>${parseInt(state.throttleInterval, 10)}</integer>`
    );
  }

  if (state.niceEnabled) {
    if (c)
      lines.push(
        `${indent(1)}<!-- Process priority adjustment (-20 = highest, 20 = lowest) -->`
      );
    lines.push(`${indent(1)}<key>Nice</key>`);
    lines.push(`${indent(1)}<integer>${state.niceValue}</integer>`);
  }

  if (state.cpuLimitEnabled && state.cpuLimitSeconds.trim()) {
    if (c)
      lines.push(
        `${indent(1)}<!-- Soft CPU time limit in seconds (process gets SIGXCPU when exceeded) -->`
      );
    lines.push(`${indent(1)}<key>SoftResourceLimits</key>`);
    lines.push(`${indent(1)}<dict>`);
    lines.push(`${indent(2)}<key>CPUTime</key>`);
    lines.push(
      `${indent(2)}<integer>${parseInt(state.cpuLimitSeconds, 10)}</integer>`
    );
    lines.push(`${indent(1)}</dict>`);
  }

  lines.push("</dict>");
  lines.push("</plist>");

  return lines.join("\n");
}

// ── main component ───────────────────────────────────────────────────────────

export default function LaunchDaemonPage() {
  // Section 1: Identity
  const [label, setLabel] = useState("");
  const [description, setDescription] = useState("");

  // Section 2: Program
  const [programPath, setProgramPath] = useState("");
  const [args, setArgs] = useState<string[]>([""]);
  const [workingDir, setWorkingDir] = useState("");

  // Section 3: Trigger
  const [keepAlive, setKeepAlive] = useState(true);
  const [scheduleType, setScheduleType] = useState<ScheduleType>("none");
  const [intervalSeconds, setIntervalSeconds] = useState("");
  const [calWeekday, setCalWeekday] = useState("");
  const [calHour, setCalHour] = useState("");
  const [calMinute, setCalMinute] = useState("");
  const [watchPaths, setWatchPaths] = useState<string[]>([""]);

  // Section 4: User Context
  const [daemonType, setDaemonType] = useState<"daemon" | "agent">("daemon");
  const [userName, setUserName] = useState("");
  const [runAtLoad, setRunAtLoad] = useState(false);

  // Section 5: Logging
  const [enableLogs, setEnableLogs] = useState(false);
  const [stdoutPath, setStdoutPath] = useState("/var/log/myapp.log");
  const [stderrPath, setStderrPath] = useState("/var/log/myapp.err");

  // Section 6: Environment Variables
  const [enableEnv, setEnableEnv] = useState(false);
  const [envVars, setEnvVars] = useState<EnvVar[]>([{ key: "", value: "" }]);

  // Section 7: Extras
  const [throttleEnabled, setThrottleEnabled] = useState(false);
  const [throttleInterval, setThrottleInterval] = useState("10");
  const [niceEnabled, setNiceEnabled] = useState(false);
  const [niceValue, setNiceValue] = useState(0);
  const [cpuLimitEnabled, setCpuLimitEnabled] = useState(false);
  const [cpuLimitSeconds, setCpuLimitSeconds] = useState("");

  // Section 8: Output
  const [includeComments, setIncludeComments] = useState(false);
  const [plistOutput, setPlistOutput] = useState<string | null>(null);

  // ── helpers ────────────────────────────────────────────────────────────────

  const addArg = () => setArgs((a) => [...a, ""]);
  const removeArg = (i: number) => setArgs((a) => a.filter((_, idx) => idx !== i));
  const setArg = (i: number, v: string) =>
    setArgs((a) => a.map((x, idx) => (idx === i ? v : x)));

  const addWatchPath = () => setWatchPaths((p) => [...p, ""]);
  const removeWatchPath = (i: number) =>
    setWatchPaths((p) => p.filter((_, idx) => idx !== i));
  const setWatchPath = (i: number, v: string) =>
    setWatchPaths((p) => p.map((x, idx) => (idx === i ? v : x)));

  const addEnvVar = () => setEnvVars((e) => [...e, { key: "", value: "" }]);
  const removeEnvVar = (i: number) =>
    setEnvVars((e) => e.filter((_, idx) => idx !== i));
  const setEnvKey = (i: number, v: string) =>
    setEnvVars((e) =>
      e.map((x, idx) => (idx === i ? { ...x, key: v } : x))
    );
  const setEnvValue = (i: number, v: string) =>
    setEnvVars((e) =>
      e.map((x, idx) => (idx === i ? { ...x, value: v } : x))
    );

  const generate = () => {
    const xml = generatePlist({
      label,
      programPath,
      args,
      workingDir,
      keepAlive,
      runAtLoad,
      scheduleType,
      intervalSeconds,
      calWeekday,
      calHour,
      calMinute,
      watchPaths,
      daemonType,
      userName,
      enableLogs,
      stdoutPath,
      stderrPath,
      enableEnv,
      envVars,
      throttleEnabled,
      throttleInterval,
      niceEnabled,
      niceValue,
      cpuLimitEnabled,
      cpuLimitSeconds,
      includeComments,
    });
    setPlistOutput(xml);
    // scroll to output after a tick
    setTimeout(() => {
      document.getElementById("plist-output")?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  const effectiveLabel = label || "com.example.myapp";
  const filename = `${effectiveLabel}.plist`;
  const daemonPath =
    daemonType === "daemon"
      ? `/Library/LaunchDaemons/${filename}`
      : `~/Library/LaunchAgents/${filename}`;

  const deployInstructions = [
    {
      label: "1. Copy to the correct directory",
      code:
        daemonType === "daemon"
          ? `sudo cp ${filename} /Library/LaunchDaemons/`
          : `cp ${filename} ~/Library/LaunchAgents/`,
    },
    ...(daemonType === "daemon"
      ? [
          {
            label: "2. Set correct ownership & permissions",
            code: `sudo chown root:wheel /Library/LaunchDaemons/${filename} && sudo chmod 644 /Library/LaunchDaemons/${filename}`,
          },
        ]
      : []),
    {
      label: daemonType === "daemon" ? "3. Load the daemon" : "2. Load the agent",
      code:
        daemonType === "daemon"
          ? `sudo launchctl load /Library/LaunchDaemons/${filename}`
          : `launchctl load ~/Library/LaunchAgents/${filename}`,
    },
    {
      label: daemonType === "daemon" ? "4. Check status" : "3. Check status",
      code: `launchctl list | grep ${effectiveLabel}`,
    },
    {
      label: daemonType === "daemon" ? "5. Unload the daemon" : "4. Unload the agent",
      code:
        daemonType === "daemon"
          ? `sudo launchctl unload /Library/LaunchDaemons/${filename}`
          : `launchctl unload ~/Library/LaunchAgents/${filename}`,
    },
    {
      label: "View logs (unified log)",
      code: `log show --predicate 'subsystem == "${effectiveLabel}"' --last 1h`,
    },
    ...(enableLogs && stdoutPath.trim()
      ? [{ label: "View stdout log", code: `tail -f ${stdoutPath}` }]
      : []),
  ];

  // ── render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-background py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            LaunchDaemon / LaunchAgent Generator
          </h1>
          <p className="text-muted-foreground">
            Generate macOS <code className="text-sm bg-muted px-1 rounded">.plist</code>{" "}
            files for background services, with deployment instructions.
          </p>
        </div>

        {/* ── Section 1: Identity ── */}
        <Card>
          <CardHeader>
            <CardTitle>1. Identity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Label</label>
              <Input
                placeholder="com.yourname.myapp"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                This uniquely identifies your service. Use reverse-DNS style, e.g.{" "}
                <code>com.yourname.appname</code>
              </p>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">
                Description{" "}
                <span className="text-muted-foreground font-normal">(optional)</span>
              </label>
              <Input
                placeholder="My background service"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                For your reference only — not included in the plist.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* ── Section 2: Program ── */}
        <Card>
          <CardHeader>
            <CardTitle>2. Program</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Path to executable</label>
              <Input
                placeholder="/usr/local/bin/myapp"
                value={programPath}
                onChange={(e) => setProgramPath(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Arguments{" "}
                <span className="text-muted-foreground font-normal">(optional)</span>
              </label>
              {args.map((arg, i) => (
                <div key={i} className="flex gap-2">
                  <Input
                    placeholder={`--arg${i + 1}`}
                    value={arg}
                    onChange={(e) => setArg(i, e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => removeArg(i)}
                    disabled={args.length === 1}
                    className="px-3 rounded border text-muted-foreground hover:text-destructive hover:border-destructive transition-colors disabled:opacity-30"
                  >
                    ×
                  </button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={addArg}>
                + Add argument
              </Button>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">
                Working directory{" "}
                <span className="text-muted-foreground font-normal">(optional)</span>
              </label>
              <Input
                placeholder="/var/myapp"
                value={workingDir}
                onChange={(e) => setWorkingDir(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* ── Section 3: Trigger ── */}
        <Card>
          <CardHeader>
            <CardTitle>3. Trigger</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Toggle enabled={keepAlive} onToggle={() => setKeepAlive((v) => !v)} />
              <span className="text-sm font-medium">
                Keep alive (restart if it exits)
              </span>
            </div>

            {!keepAlive && (
              <div className="space-y-3 pl-4 border-l-2 border-muted">
                <p className="text-sm text-muted-foreground">Schedule type:</p>

                {/* Run at load */}
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="radio"
                    name="scheduleType"
                    checked={scheduleType === "none"}
                    onChange={() => setScheduleType("none")}
                    className="accent-primary"
                  />
                  Run at load / login only
                </label>

                {/* Interval */}
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="radio"
                    name="scheduleType"
                    checked={scheduleType === "interval"}
                    onChange={() => setScheduleType("interval")}
                    className="accent-primary"
                  />
                  On an interval
                </label>
                {scheduleType === "interval" && (
                  <div className="pl-6 flex items-center gap-2">
                    <Input
                      type="number"
                      placeholder="300"
                      value={intervalSeconds}
                      onChange={(e) => setIntervalSeconds(e.target.value)}
                      className="w-32"
                    />
                    <span className="text-sm text-muted-foreground">seconds</span>
                  </div>
                )}

                {/* Calendar */}
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="radio"
                    name="scheduleType"
                    checked={scheduleType === "calendar"}
                    onChange={() => setScheduleType("calendar")}
                    className="accent-primary"
                  />
                  At a specific time
                </label>
                {scheduleType === "calendar" && (
                  <div className="pl-6 flex flex-wrap gap-3">
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground">
                        Day of week (0–7, optional)
                      </label>
                      <Input
                        type="number"
                        min={0}
                        max={7}
                        placeholder="–"
                        value={calWeekday}
                        onChange={(e) => setCalWeekday(e.target.value)}
                        className="w-24"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground">
                        Hour (0–23)
                      </label>
                      <Input
                        type="number"
                        min={0}
                        max={23}
                        placeholder="–"
                        value={calHour}
                        onChange={(e) => setCalHour(e.target.value)}
                        className="w-24"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground">
                        Minute (0–59)
                      </label>
                      <Input
                        type="number"
                        min={0}
                        max={59}
                        placeholder="–"
                        value={calMinute}
                        onChange={(e) => setCalMinute(e.target.value)}
                        className="w-24"
                      />
                    </div>
                  </div>
                )}

                {/* Watch paths */}
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="radio"
                    name="scheduleType"
                    checked={scheduleType === "watchpaths"}
                    onChange={() => setScheduleType("watchpaths")}
                    className="accent-primary"
                  />
                  Watch paths
                </label>
                {scheduleType === "watchpaths" && (
                  <div className="pl-6 space-y-2">
                    {watchPaths.map((p, i) => (
                      <div key={i} className="flex gap-2">
                        <Input
                          placeholder="/path/to/watch"
                          value={p}
                          onChange={(e) => setWatchPath(i, e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => removeWatchPath(i)}
                          disabled={watchPaths.length === 1}
                          className="px-3 rounded border text-muted-foreground hover:text-destructive hover:border-destructive transition-colors disabled:opacity-30"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addWatchPath}
                    >
                      + Add path
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* ── Section 4: User Context ── */}
        <Card>
          <CardHeader>
            <CardTitle>4. User Context</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="daemonType"
                  checked={daemonType === "daemon"}
                  onChange={() => setDaemonType("daemon")}
                  className="accent-primary"
                />
                <span>
                  <span className="font-medium">LaunchDaemon</span>{" "}
                  <span className="text-muted-foreground">(system, runs as root)</span>
                </span>
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="daemonType"
                  checked={daemonType === "agent"}
                  onChange={() => setDaemonType("agent")}
                  className="accent-primary"
                />
                <span>
                  <span className="font-medium">LaunchAgent</span>{" "}
                  <span className="text-muted-foreground">(user session)</span>
                </span>
              </label>
            </div>

            {daemonType === "daemon" && (
              <div className="space-y-1">
                <label className="text-sm font-medium">
                  Run as user{" "}
                  <span className="text-muted-foreground font-normal">(optional)</span>
                </label>
                <Input
                  placeholder="nobody"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Sets the <code>UserName</code> key — runs as this user instead of root.
                </p>
              </div>
            )}

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="runAtLoad"
                checked={runAtLoad}
                onChange={(e) => setRunAtLoad(e.target.checked)}
                className="accent-primary h-4 w-4"
              />
              <label htmlFor="runAtLoad" className="text-sm cursor-pointer">
                <span className="font-medium">RunAtLoad</span> — start immediately when
                loaded
              </label>
            </div>
          </CardContent>
        </Card>

        {/* ── Section 5: Logging ── */}
        <Card>
          <CardHeader>
            <CardTitle>5. Logging</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Toggle
                enabled={enableLogs}
                onToggle={() => setEnableLogs((v) => !v)}
              />
              <span className="text-sm font-medium">Enable log files</span>
            </div>
            {enableLogs && (
              <div className="space-y-3 pl-4 border-l-2 border-muted">
                <div className="space-y-1">
                  <label className="text-sm font-medium">stdout log path</label>
                  <Input
                    placeholder="/var/log/myapp.log"
                    value={stdoutPath}
                    onChange={(e) => setStdoutPath(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">stderr log path</label>
                  <Input
                    placeholder="/var/log/myapp.err"
                    value={stderrPath}
                    onChange={(e) => setStderrPath(e.target.value)}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ── Section 6: Environment Variables ── */}
        <Card>
          <CardHeader>
            <CardTitle>6. Environment Variables</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Toggle
                enabled={enableEnv}
                onToggle={() => setEnableEnv((v) => !v)}
              />
              <span className="text-sm font-medium">Set environment variables</span>
            </div>
            {enableEnv && (
              <div className="space-y-2 pl-4 border-l-2 border-muted">
                {envVars.map((ev, i) => (
                  <div key={i} className="flex gap-2">
                    <Input
                      placeholder="KEY"
                      value={ev.key}
                      onChange={(e) => setEnvKey(i, e.target.value)}
                      className="w-40"
                    />
                    <Input
                      placeholder="value"
                      value={ev.value}
                      onChange={(e) => setEnvValue(i, e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => removeEnvVar(i)}
                      disabled={envVars.length === 1}
                      className="px-3 rounded border text-muted-foreground hover:text-destructive hover:border-destructive transition-colors disabled:opacity-30"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={addEnvVar}>
                  + Add variable
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ── Section 7: Extras ── */}
        <Card>
          <CardHeader>
            <CardTitle>7. Extras</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Throttle */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Toggle
                  enabled={throttleEnabled}
                  onToggle={() => setThrottleEnabled((v) => !v)}
                />
                <span className="text-sm font-medium">Throttle restarts</span>
              </div>
              {throttleEnabled && (
                <div className="pl-14 flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="10"
                    value={throttleInterval}
                    onChange={(e) => setThrottleInterval(e.target.value)}
                    className="w-32"
                  />
                  <span className="text-sm text-muted-foreground">
                    seconds between restarts
                  </span>
                </div>
              )}
            </div>

            {/* Nice */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Toggle
                  enabled={niceEnabled}
                  onToggle={() => setNiceEnabled((v) => !v)}
                />
                <span className="text-sm font-medium">Set process priority (Nice)</span>
              </div>
              {niceEnabled && (
                <div className="pl-14 space-y-1">
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={-20}
                      max={20}
                      value={niceValue}
                      onChange={(e) => setNiceValue(parseInt(e.target.value, 10))}
                      className="w-48 accent-primary"
                    />
                    <span className="text-sm font-mono w-8 text-center">
                      {niceValue}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    −20 = highest priority · 0 = default · 20 = lowest priority
                  </p>
                </div>
              )}
            </div>

            {/* CPU limit */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Toggle
                  enabled={cpuLimitEnabled}
                  onToggle={() => setCpuLimitEnabled((v) => !v)}
                />
                <span className="text-sm font-medium">Limit CPU time (soft limit)</span>
              </div>
              {cpuLimitEnabled && (
                <div className="pl-14 flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="3600"
                    value={cpuLimitSeconds}
                    onChange={(e) => setCpuLimitSeconds(e.target.value)}
                    className="w-32"
                  />
                  <span className="text-sm text-muted-foreground">seconds</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* ── Section 8: Output ── */}
        <Card>
          <CardHeader>
            <CardTitle>8. Generate</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={includeComments}
                onChange={(e) => setIncludeComments(e.target.checked)}
                className="accent-primary h-4 w-4"
              />
              Include comments explaining each key
            </label>

            <Button onClick={generate} className="w-full" size="lg">
              Generate Plist
            </Button>
          </CardContent>
        </Card>

        {/* ── Output ── */}
        {plistOutput && (
          <div id="plist-output" className="space-y-6">
            {/* Plist code */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>
                    Generated:{" "}
                    <code className="text-base font-mono">{filename}</code>
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CodeBlock code={plistOutput} />
              </CardContent>
            </Card>

            {/* Deployment instructions */}
            <Card>
              <CardHeader>
                <CardTitle>Deployment Instructions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Install location:{" "}
                  <code className="bg-muted px-1 rounded text-xs">
                    {daemonType === "daemon"
                      ? "/Library/LaunchDaemons/"
                      : "~/Library/LaunchAgents/"}
                  </code>
                </p>
                {deployInstructions.map((step, i) => (
                  <div key={i} className="space-y-1">
                    <p className="text-sm font-medium">{step.label}</p>
                    <CodeBlock code={step.code} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
