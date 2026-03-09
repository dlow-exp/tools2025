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

type ServiceType = "simple" | "forking" | "oneshot" | "notify" | "exec";
type RestartPolicy = "no" | "always" | "on-failure" | "on-abnormal" | "on-abort";
type OutputTarget = "journal" | "file" | "inherit" | "null";

interface EnvVar {
  key: string;
  value: string;
}

interface TimerCalendar {
  expression: string;
}

// ── unit file generator ──────────────────────────────────────────────────────

function generateUnit(state: {
  unitName: string;
  description: string;
  after: string;
  wants: string;
  requires: string;
  serviceType: ServiceType;
  execStart: string;
  execStartPre: string;
  execStartPost: string;
  execStop: string;
  execReload: string;
  workingDir: string;
  restartPolicy: RestartPolicy;
  restartSec: string;
  startLimitBurst: string;
  startLimitInterval: string;
  user: string;
  group: string;
  outputTarget: OutputTarget;
  stdoutFile: string;
  stderrFile: string;
  syslogIdentifier: string;
  enableEnv: boolean;
  envVars: EnvVar[];
  envFile: string;
  niceEnabled: boolean;
  niceValue: number;
  cpuQuotaEnabled: boolean;
  cpuQuota: string;
  memoryMaxEnabled: boolean;
  memoryMax: string;
  limitNofileEnabled: boolean;
  limitNofile: string;
  protectSystem: string;
  protectHome: boolean;
  noNewPrivileges: boolean;
  privateTemp: boolean;
  wantedBy: string;
  enableTimer: boolean;
  timerOnCalendar: string;
  timerOnBootSec: string;
  timerOnUnitActiveSec: string;
  timerPersistent: boolean;
  includeComments: boolean;
}) {
  const c = state.includeComments;
  const lines: string[] = [];

  // ── [Unit] section ──
  if (c) lines.push("# Unit metadata and dependency ordering");
  lines.push("[Unit]");
  lines.push(`Description=${state.description || "My service"}`);
  if (state.after.trim()) {
    if (c) lines.push("# Start after these units have started");
    lines.push(`After=${state.after}`);
  }
  if (state.wants.trim()) {
    if (c) lines.push("# Weak dependencies — start these if available");
    lines.push(`Wants=${state.wants}`);
  }
  if (state.requires.trim()) {
    if (c) lines.push("# Hard dependencies — fail if these are not available");
    lines.push(`Requires=${state.requires}`);
  }
  if (state.startLimitBurst.trim() || state.startLimitInterval.trim()) {
    if (c) lines.push("# Rate-limit service start attempts");
    if (state.startLimitInterval.trim())
      lines.push(`StartLimitIntervalSec=${state.startLimitInterval}`);
    if (state.startLimitBurst.trim())
      lines.push(`StartLimitBurst=${state.startLimitBurst}`);
  }
  lines.push("");

  // ── [Service] section ──
  if (c) lines.push("# Service configuration");
  lines.push("[Service]");
  lines.push(`Type=${state.serviceType}`);
  if (state.execStartPre.trim()) {
    if (c) lines.push("# Run before the main process starts");
    lines.push(`ExecStartPre=${state.execStartPre}`);
  }
  lines.push(`ExecStart=${state.execStart || "/usr/local/bin/myapp"}`);
  if (state.execStartPost.trim()) {
    if (c) lines.push("# Run after the main process starts");
    lines.push(`ExecStartPost=${state.execStartPost}`);
  }
  if (state.execStop.trim()) {
    if (c) lines.push("# Custom stop command (default: sends SIGTERM)");
    lines.push(`ExecStop=${state.execStop}`);
  }
  if (state.execReload.trim()) {
    if (c) lines.push("# Command to reload the service (triggered by systemctl reload)");
    lines.push(`ExecReload=${state.execReload}`);
  }
  if (state.workingDir.trim()) {
    if (c) lines.push("# Working directory for the service");
    lines.push(`WorkingDirectory=${state.workingDir}`);
  }

  // Restart
  if (c) lines.push("# Restart behavior");
  lines.push(`Restart=${state.restartPolicy}`);
  if (state.restartPolicy !== "no" && state.restartSec.trim()) {
    if (c) lines.push("# Seconds to wait before restarting");
    lines.push(`RestartSec=${state.restartSec}`);
  }

  // User/Group
  if (state.user.trim()) {
    if (c) lines.push("# Run the service as this user");
    lines.push(`User=${state.user}`);
  }
  if (state.group.trim()) {
    if (c) lines.push("# Run the service as this group");
    lines.push(`Group=${state.group}`);
  }

  // Logging
  if (state.outputTarget === "file") {
    if (state.stdoutFile.trim()) {
      if (c) lines.push("# Redirect stdout to a file");
      lines.push(`StandardOutput=append:${state.stdoutFile}`);
    }
    if (state.stderrFile.trim()) {
      if (c) lines.push("# Redirect stderr to a file");
      lines.push(`StandardError=append:${state.stderrFile}`);
    }
  } else if (state.outputTarget === "null") {
    lines.push("StandardOutput=null");
    lines.push("StandardError=null");
  } else if (state.outputTarget === "inherit") {
    lines.push("StandardOutput=inherit");
    lines.push("StandardError=inherit");
  }
  // journal is the default — no need to specify
  if (state.syslogIdentifier.trim()) {
    if (c) lines.push("# Identifier for journal/syslog entries");
    lines.push(`SyslogIdentifier=${state.syslogIdentifier}`);
  }

  // Environment
  const validEnvVars = state.envVars.filter((e) => e.key.trim());
  if (state.enableEnv && validEnvVars.length > 0) {
    if (c) lines.push("# Environment variables");
    for (const { key, value } of validEnvVars) {
      lines.push(`Environment="${key}=${value}"`);
    }
  }
  if (state.envFile.trim()) {
    if (c) lines.push("# Load environment variables from a file");
    lines.push(`EnvironmentFile=${state.envFile}`);
  }

  // Resource limits / extras
  if (state.niceEnabled) {
    if (c) lines.push("# Process priority (-20 = highest, 19 = lowest)");
    lines.push(`Nice=${state.niceValue}`);
  }
  if (state.cpuQuotaEnabled && state.cpuQuota.trim()) {
    if (c) lines.push("# CPU time quota (100% = 1 full core)");
    lines.push(`CPUQuota=${state.cpuQuota}%`);
  }
  if (state.memoryMaxEnabled && state.memoryMax.trim()) {
    if (c) lines.push("# Maximum memory limit");
    lines.push(`MemoryMax=${state.memoryMax}`);
  }
  if (state.limitNofileEnabled && state.limitNofile.trim()) {
    if (c) lines.push("# Maximum number of open file descriptors");
    lines.push(`LimitNOFILE=${state.limitNofile}`);
  }

  // Security hardening
  const securityLines: string[] = [];
  if (state.protectSystem && state.protectSystem !== "false") {
    securityLines.push(`ProtectSystem=${state.protectSystem}`);
  }
  if (state.protectHome) securityLines.push("ProtectHome=true");
  if (state.noNewPrivileges) securityLines.push("NoNewPrivileges=true");
  if (state.privateTemp) securityLines.push("PrivateTmp=true");
  if (securityLines.length > 0) {
    if (c) lines.push("# Security hardening");
    lines.push(...securityLines);
  }

  lines.push("");

  // ── [Install] section ──
  if (c) lines.push("# Install configuration — determines when this service starts");
  lines.push("[Install]");
  lines.push(`WantedBy=${state.wantedBy || "multi-user.target"}`);

  const serviceUnit = lines.join("\n");

  // ── Timer unit (optional) ──
  let timerUnit: string | null = null;
  if (state.enableTimer) {
    const tLines: string[] = [];
    if (c) tLines.push("# Timer unit — triggers the associated service on a schedule");
    tLines.push("[Unit]");
    tLines.push(`Description=Timer for ${state.description || "My service"}`);
    tLines.push("");

    if (c) tLines.push("# Timer schedule configuration");
    tLines.push("[Timer]");
    if (state.timerOnCalendar.trim()) {
      if (c) tLines.push("# Calendar expression (like cron but more readable)");
      tLines.push(`OnCalendar=${state.timerOnCalendar}`);
    }
    if (state.timerOnBootSec.trim()) {
      if (c) tLines.push("# Run this long after boot");
      tLines.push(`OnBootSec=${state.timerOnBootSec}`);
    }
    if (state.timerOnUnitActiveSec.trim()) {
      if (c) tLines.push("# Run this long after the service last activated");
      tLines.push(`OnUnitActiveSec=${state.timerOnUnitActiveSec}`);
    }
    if (state.timerPersistent) {
      if (c) tLines.push("# Catch up on missed runs if the machine was off");
      tLines.push("Persistent=true");
    }
    tLines.push("");

    if (c) tLines.push("# Install — enable with systemctl enable");
    tLines.push("[Install]");
    tLines.push(`WantedBy=timers.target`);

    timerUnit = tLines.join("\n");
  }

  return { serviceUnit, timerUnit };
}

// ── main component ───────────────────────────────────────────────────────────

export default function SystemdPage() {
  // Section 1: Identity
  const [unitName, setUnitName] = useState("");
  const [description, setDescription] = useState("");
  const [after, setAfter] = useState("network.target");
  const [wants, setWants] = useState("");
  const [requires, setRequires] = useState("");

  // Section 2: Service
  const [serviceType, setServiceType] = useState<ServiceType>("simple");
  const [execStart, setExecStart] = useState("");
  const [execStartPre, setExecStartPre] = useState("");
  const [execStartPost, setExecStartPost] = useState("");
  const [execStop, setExecStop] = useState("");
  const [execReload, setExecReload] = useState("");
  const [workingDir, setWorkingDir] = useState("");

  // Section 3: Restart
  const [restartPolicy, setRestartPolicy] = useState<RestartPolicy>("on-failure");
  const [restartSec, setRestartSec] = useState("5");
  const [startLimitBurst, setStartLimitBurst] = useState("");
  const [startLimitInterval, setStartLimitInterval] = useState("");

  // Section 4: User Context
  const [user, setUser] = useState("");
  const [group, setGroup] = useState("");

  // Section 5: Logging
  const [outputTarget, setOutputTarget] = useState<OutputTarget>("journal");
  const [stdoutFile, setStdoutFile] = useState("/var/log/myapp.log");
  const [stderrFile, setStderrFile] = useState("/var/log/myapp.err");
  const [syslogIdentifier, setSyslogIdentifier] = useState("");

  // Section 6: Environment Variables
  const [enableEnv, setEnableEnv] = useState(false);
  const [envVars, setEnvVars] = useState<EnvVar[]>([{ key: "", value: "" }]);
  const [envFile, setEnvFile] = useState("");

  // Section 7: Resource Limits & Extras
  const [niceEnabled, setNiceEnabled] = useState(false);
  const [niceValue, setNiceValue] = useState(0);
  const [cpuQuotaEnabled, setCpuQuotaEnabled] = useState(false);
  const [cpuQuota, setCpuQuota] = useState("");
  const [memoryMaxEnabled, setMemoryMaxEnabled] = useState(false);
  const [memoryMax, setMemoryMax] = useState("");
  const [limitNofileEnabled, setLimitNofileEnabled] = useState(false);
  const [limitNofile, setLimitNofile] = useState("");

  // Section 8: Security
  const [protectSystem, setProtectSystem] = useState("false");
  const [protectHome, setProtectHome] = useState(false);
  const [noNewPrivileges, setNoNewPrivileges] = useState(false);
  const [privateTemp, setPrivateTemp] = useState(false);

  // Section 9: Install
  const [wantedBy, setWantedBy] = useState("multi-user.target");

  // Section 10: Timer
  const [enableTimer, setEnableTimer] = useState(false);
  const [timerOnCalendar, setTimerOnCalendar] = useState("");
  const [timerOnBootSec, setTimerOnBootSec] = useState("");
  const [timerOnUnitActiveSec, setTimerOnUnitActiveSec] = useState("");
  const [timerPersistent, setTimerPersistent] = useState(false);

  // Output
  const [includeComments, setIncludeComments] = useState(false);
  const [output, setOutput] = useState<{
    serviceUnit: string;
    timerUnit: string | null;
  } | null>(null);

  // ── env var helpers ────────────────────────────────────────────────────────

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
    const result = generateUnit({
      unitName,
      description,
      after,
      wants,
      requires,
      serviceType,
      execStart,
      execStartPre,
      execStartPost,
      execStop,
      execReload,
      workingDir,
      restartPolicy,
      restartSec,
      startLimitBurst,
      startLimitInterval,
      user,
      group,
      outputTarget,
      stdoutFile,
      stderrFile,
      syslogIdentifier,
      enableEnv,
      envVars,
      envFile,
      niceEnabled,
      niceValue,
      cpuQuotaEnabled,
      cpuQuota,
      memoryMaxEnabled,
      memoryMax,
      limitNofileEnabled,
      limitNofile,
      protectSystem,
      protectHome,
      noNewPrivileges,
      privateTemp,
      wantedBy,
      enableTimer,
      timerOnCalendar,
      timerOnBootSec,
      timerOnUnitActiveSec,
      timerPersistent,
      includeComments,
    });
    setOutput(result);
    setTimeout(() => {
      document.getElementById("systemd-output")?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  const effectiveName = unitName || "myapp";
  const serviceFilename = `${effectiveName}.service`;
  const timerFilename = `${effectiveName}.timer`;
  const isUserService = !user.trim() || user.trim() === "$USER";

  const deployInstructions = [
    {
      label: "1. Copy the service file",
      code: `sudo cp ${serviceFilename} /etc/systemd/system/`,
    },
    ...(enableTimer
      ? [
          {
            label: "2. Copy the timer file",
            code: `sudo cp ${timerFilename} /etc/systemd/system/`,
          },
        ]
      : []),
    {
      label: enableTimer ? "3. Reload systemd" : "2. Reload systemd",
      code: "sudo systemctl daemon-reload",
    },
    {
      label: enableTimer ? "4. Enable and start" : "3. Enable and start the service",
      code: enableTimer
        ? `sudo systemctl enable --now ${timerFilename}`
        : `sudo systemctl enable --now ${serviceFilename}`,
    },
    {
      label: enableTimer ? "5. Check status" : "4. Check status",
      code: enableTimer
        ? `sudo systemctl status ${serviceFilename}\nsudo systemctl list-timers ${timerFilename}`
        : `sudo systemctl status ${serviceFilename}`,
    },
    {
      label: "View logs (journalctl)",
      code: `journalctl -u ${serviceFilename} -f`,
    },
    {
      label: "Stop the service",
      code: enableTimer
        ? `sudo systemctl stop ${timerFilename} && sudo systemctl stop ${serviceFilename}`
        : `sudo systemctl stop ${serviceFilename}`,
    },
    {
      label: "Disable (prevent starting on boot)",
      code: enableTimer
        ? `sudo systemctl disable ${timerFilename}`
        : `sudo systemctl disable ${serviceFilename}`,
    },
  ];

  // ── render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-background py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Systemd Service Generator
          </h1>
          <p className="text-muted-foreground">
            Generate Linux{" "}
            <code className="text-sm bg-muted px-1 rounded">.service</code> and{" "}
            <code className="text-sm bg-muted px-1 rounded">.timer</code>{" "}
            unit files for background services, with deployment instructions.
          </p>
        </div>

        {/* ── Section 1: Identity ── */}
        <Card>
          <CardHeader>
            <CardTitle>1. Identity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Unit name</label>
              <Input
                placeholder="myapp"
                value={unitName}
                onChange={(e) => setUnitName(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Used as the filename:{" "}
                <code>{effectiveName}.service</code>
              </p>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Description</label>
              <Input
                placeholder="My background service"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">
                After{" "}
                <span className="text-muted-foreground font-normal">(ordering)</span>
              </label>
              <Input
                placeholder="network.target"
                value={after}
                onChange={(e) => setAfter(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Start this service after these targets/units. Space-separated.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-sm font-medium">
                  Wants{" "}
                  <span className="text-muted-foreground font-normal">(weak deps)</span>
                </label>
                <Input
                  placeholder="network-online.target"
                  value={wants}
                  onChange={(e) => setWants(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">
                  Requires{" "}
                  <span className="text-muted-foreground font-normal">(hard deps)</span>
                </label>
                <Input
                  placeholder=""
                  value={requires}
                  onChange={(e) => setRequires(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── Section 2: Service ── */}
        <Card>
          <CardHeader>
            <CardTitle>2. Service</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Type</label>
              <div className="flex flex-wrap gap-3">
                {(["simple", "exec", "forking", "oneshot", "notify"] as ServiceType[]).map(
                  (t) => (
                    <label key={t} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="radio"
                        name="serviceType"
                        checked={serviceType === t}
                        onChange={() => setServiceType(t)}
                        className="accent-primary"
                      />
                      <span className="font-medium">{t}</span>
                    </label>
                  )
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                <strong>simple</strong> = main process stays in foreground ·{" "}
                <strong>forking</strong> = daemonizes itself ·{" "}
                <strong>oneshot</strong> = runs once and exits ·{" "}
                <strong>notify</strong> = sends sd_notify when ready
              </p>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">ExecStart</label>
              <Input
                placeholder="/usr/local/bin/myapp --flag"
                value={execStart}
                onChange={(e) => setExecStart(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                The command to start the service. Use absolute paths.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-sm font-medium">
                  ExecStartPre{" "}
                  <span className="text-muted-foreground font-normal">(optional)</span>
                </label>
                <Input
                  placeholder="/usr/bin/mkdir -p /var/myapp"
                  value={execStartPre}
                  onChange={(e) => setExecStartPre(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">
                  ExecStartPost{" "}
                  <span className="text-muted-foreground font-normal">(optional)</span>
                </label>
                <Input
                  placeholder=""
                  value={execStartPost}
                  onChange={(e) => setExecStartPost(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-sm font-medium">
                  ExecStop{" "}
                  <span className="text-muted-foreground font-normal">(optional)</span>
                </label>
                <Input
                  placeholder=""
                  value={execStop}
                  onChange={(e) => setExecStop(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">
                  ExecReload{" "}
                  <span className="text-muted-foreground font-normal">(optional)</span>
                </label>
                <Input
                  placeholder="/bin/kill -HUP $MAINPID"
                  value={execReload}
                  onChange={(e) => setExecReload(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">
                Working directory{" "}
                <span className="text-muted-foreground font-normal">(optional)</span>
              </label>
              <Input
                placeholder="/opt/myapp"
                value={workingDir}
                onChange={(e) => setWorkingDir(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* ── Section 3: Restart ── */}
        <Card>
          <CardHeader>
            <CardTitle>3. Restart Policy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Restart</label>
              <div className="flex flex-wrap gap-3">
                {(["no", "always", "on-failure", "on-abnormal", "on-abort"] as RestartPolicy[]).map(
                  (r) => (
                    <label key={r} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="radio"
                        name="restartPolicy"
                        checked={restartPolicy === r}
                        onChange={() => setRestartPolicy(r)}
                        className="accent-primary"
                      />
                      <span className="font-medium">{r}</span>
                    </label>
                  )
                )}
              </div>
            </div>

            {restartPolicy !== "no" && (
              <div className="space-y-1">
                <label className="text-sm font-medium">RestartSec</label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="5"
                    value={restartSec}
                    onChange={(e) => setRestartSec(e.target.value)}
                    className="w-32"
                  />
                  <span className="text-sm text-muted-foreground">
                    seconds before restarting
                  </span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-sm font-medium">
                  StartLimitBurst{" "}
                  <span className="text-muted-foreground font-normal">(optional)</span>
                </label>
                <Input
                  type="number"
                  placeholder="5"
                  value={startLimitBurst}
                  onChange={(e) => setStartLimitBurst(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Max start attempts within the interval
                </p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">
                  StartLimitIntervalSec{" "}
                  <span className="text-muted-foreground font-normal">(optional)</span>
                </label>
                <Input
                  type="number"
                  placeholder="60"
                  value={startLimitInterval}
                  onChange={(e) => setStartLimitInterval(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Time window in seconds
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── Section 4: User Context ── */}
        <Card>
          <CardHeader>
            <CardTitle>4. User Context</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-sm font-medium">
                  User{" "}
                  <span className="text-muted-foreground font-normal">(optional)</span>
                </label>
                <Input
                  placeholder="www-data"
                  value={user}
                  onChange={(e) => setUser(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Runs as root if not specified
                </p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">
                  Group{" "}
                  <span className="text-muted-foreground font-normal">(optional)</span>
                </label>
                <Input
                  placeholder="www-data"
                  value={group}
                  onChange={(e) => setGroup(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── Section 5: Logging ── */}
        <Card>
          <CardHeader>
            <CardTitle>5. Logging</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Output target</label>
              <div className="flex flex-wrap gap-3">
                {(
                  [
                    { value: "journal" as OutputTarget, label: "Journal (default)" },
                    { value: "file" as OutputTarget, label: "File" },
                    { value: "inherit" as OutputTarget, label: "Inherit" },
                    { value: "null" as OutputTarget, label: "Discard" },
                  ] as const
                ).map((opt) => (
                  <label
                    key={opt.value}
                    className="flex items-center gap-2 text-sm cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="outputTarget"
                      checked={outputTarget === opt.value}
                      onChange={() => setOutputTarget(opt.value)}
                      className="accent-primary"
                    />
                    <span className="font-medium">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {outputTarget === "file" && (
              <div className="space-y-3 pl-4 border-l-2 border-muted">
                <div className="space-y-1">
                  <label className="text-sm font-medium">stdout log path</label>
                  <Input
                    placeholder="/var/log/myapp.log"
                    value={stdoutFile}
                    onChange={(e) => setStdoutFile(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">stderr log path</label>
                  <Input
                    placeholder="/var/log/myapp.err"
                    value={stderrFile}
                    onChange={(e) => setStderrFile(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-sm font-medium">
                SyslogIdentifier{" "}
                <span className="text-muted-foreground font-normal">(optional)</span>
              </label>
              <Input
                placeholder="myapp"
                value={syslogIdentifier}
                onChange={(e) => setSyslogIdentifier(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Custom tag for journal entries (defaults to unit name)
              </p>
            </div>
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
            <div className="space-y-1">
              <label className="text-sm font-medium">
                EnvironmentFile{" "}
                <span className="text-muted-foreground font-normal">(optional)</span>
              </label>
              <Input
                placeholder="/etc/myapp/env"
                value={envFile}
                onChange={(e) => setEnvFile(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Load environment from a file (KEY=value per line). Prefix with{" "}
                <code>-</code> to ignore if missing.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* ── Section 7: Resource Limits ── */}
        <Card>
          <CardHeader>
            <CardTitle>7. Resource Limits</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
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
                      max={19}
                      value={niceValue}
                      onChange={(e) => setNiceValue(parseInt(e.target.value, 10))}
                      className="w-48 accent-primary"
                    />
                    <span className="text-sm font-mono w-8 text-center">
                      {niceValue}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    −20 = highest priority · 0 = default · 19 = lowest priority
                  </p>
                </div>
              )}
            </div>

            {/* CPU Quota */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Toggle
                  enabled={cpuQuotaEnabled}
                  onToggle={() => setCpuQuotaEnabled((v) => !v)}
                />
                <span className="text-sm font-medium">Limit CPU quota</span>
              </div>
              {cpuQuotaEnabled && (
                <div className="pl-14 flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="200"
                    value={cpuQuota}
                    onChange={(e) => setCpuQuota(e.target.value)}
                    className="w-32"
                  />
                  <span className="text-sm text-muted-foreground">
                    % (100% = 1 core)
                  </span>
                </div>
              )}
            </div>

            {/* Memory Max */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Toggle
                  enabled={memoryMaxEnabled}
                  onToggle={() => setMemoryMaxEnabled((v) => !v)}
                />
                <span className="text-sm font-medium">Limit memory</span>
              </div>
              {memoryMaxEnabled && (
                <div className="pl-14 flex items-center gap-2">
                  <Input
                    placeholder="512M"
                    value={memoryMax}
                    onChange={(e) => setMemoryMax(e.target.value)}
                    className="w-32"
                  />
                  <span className="text-sm text-muted-foreground">
                    e.g. 512M, 2G
                  </span>
                </div>
              )}
            </div>

            {/* LimitNOFILE */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Toggle
                  enabled={limitNofileEnabled}
                  onToggle={() => setLimitNofileEnabled((v) => !v)}
                />
                <span className="text-sm font-medium">Limit open files (NOFILE)</span>
              </div>
              {limitNofileEnabled && (
                <div className="pl-14 flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="65535"
                    value={limitNofile}
                    onChange={(e) => setLimitNofile(e.target.value)}
                    className="w-32"
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* ── Section 8: Security Hardening ── */}
        <Card>
          <CardHeader>
            <CardTitle>8. Security Hardening</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">ProtectSystem</label>
              <div className="flex flex-wrap gap-3">
                {["false", "true", "full", "strict"].map((v) => (
                  <label key={v} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="radio"
                      name="protectSystem"
                      checked={protectSystem === v}
                      onChange={() => setProtectSystem(v)}
                      className="accent-primary"
                    />
                    <span className="font-medium">{v}</span>
                  </label>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                <strong>true</strong> = /usr, /boot read-only ·{" "}
                <strong>full</strong> = + /etc read-only ·{" "}
                <strong>strict</strong> = entire filesystem read-only (use ReadWritePaths= for exceptions)
              </p>
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={protectHome}
                  onChange={(e) => setProtectHome(e.target.checked)}
                  className="accent-primary h-4 w-4"
                />
                <span className="font-medium">ProtectHome</span>
                <span className="text-muted-foreground">— make /home, /root, /run/user inaccessible</span>
              </label>

              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={noNewPrivileges}
                  onChange={(e) => setNoNewPrivileges(e.target.checked)}
                  className="accent-primary h-4 w-4"
                />
                <span className="font-medium">NoNewPrivileges</span>
                <span className="text-muted-foreground">— prevent privilege escalation via setuid/setgid</span>
              </label>

              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={privateTemp}
                  onChange={(e) => setPrivateTemp(e.target.checked)}
                  className="accent-primary h-4 w-4"
                />
                <span className="font-medium">PrivateTmp</span>
                <span className="text-muted-foreground">— private /tmp and /var/tmp</span>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* ── Section 9: Install ── */}
        <Card>
          <CardHeader>
            <CardTitle>9. Install</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">WantedBy</label>
              <Input
                placeholder="multi-user.target"
                value={wantedBy}
                onChange={(e) => setWantedBy(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                <code>multi-user.target</code> = non-graphical boot ·{" "}
                <code>graphical.target</code> = desktop login ·{" "}
                <code>default.target</code> = whatever is default
              </p>
            </div>
          </CardContent>
        </Card>

        {/* ── Section 10: Timer (optional) ── */}
        <Card>
          <CardHeader>
            <CardTitle>10. Timer (optional)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Toggle
                enabled={enableTimer}
                onToggle={() => setEnableTimer((v) => !v)}
              />
              <span className="text-sm font-medium">
                Generate a timer unit (systemd alternative to cron)
              </span>
            </div>

            {enableTimer && (
              <div className="space-y-3 pl-4 border-l-2 border-muted">
                <div className="space-y-1">
                  <label className="text-sm font-medium">OnCalendar</label>
                  <Input
                    placeholder="*-*-* 02:00:00"
                    value={timerOnCalendar}
                    onChange={(e) => setTimerOnCalendar(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Examples: <code>daily</code>, <code>weekly</code>,{" "}
                    <code>*-*-* 02:00:00</code>, <code>Mon *-*-* 09:00:00</code>
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-sm font-medium">
                      OnBootSec{" "}
                      <span className="text-muted-foreground font-normal">(optional)</span>
                    </label>
                    <Input
                      placeholder="5min"
                      value={timerOnBootSec}
                      onChange={(e) => setTimerOnBootSec(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">
                      OnUnitActiveSec{" "}
                      <span className="text-muted-foreground font-normal">(optional)</span>
                    </label>
                    <Input
                      placeholder="1h"
                      value={timerOnUnitActiveSec}
                      onChange={(e) => setTimerOnUnitActiveSec(e.target.value)}
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={timerPersistent}
                    onChange={(e) => setTimerPersistent(e.target.checked)}
                    className="accent-primary h-4 w-4"
                  />
                  <span className="font-medium">Persistent</span>
                  <span className="text-muted-foreground">
                    — catch up on missed runs if the machine was off
                  </span>
                </label>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ── Generate ── */}
        <Card>
          <CardHeader>
            <CardTitle>11. Generate</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={includeComments}
                onChange={(e) => setIncludeComments(e.target.checked)}
                className="accent-primary h-4 w-4"
              />
              Include comments explaining each directive
            </label>

            <Button onClick={generate} className="w-full" size="lg">
              Generate Unit File{enableTimer ? "s" : ""}
            </Button>
          </CardContent>
        </Card>

        {/* ── Output ── */}
        {output && (
          <div id="systemd-output" className="space-y-6">
            {/* Service unit */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>
                    Generated:{" "}
                    <code className="text-base font-mono">{serviceFilename}</code>
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CodeBlock code={output.serviceUnit} />
              </CardContent>
            </Card>

            {/* Timer unit */}
            {output.timerUnit && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>
                      Generated:{" "}
                      <code className="text-base font-mono">{timerFilename}</code>
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CodeBlock code={output.timerUnit} />
                </CardContent>
              </Card>
            )}

            {/* Deployment instructions */}
            <Card>
              <CardHeader>
                <CardTitle>Deployment Instructions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Install location:{" "}
                  <code className="bg-muted px-1 rounded text-xs">
                    /etc/systemd/system/
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
