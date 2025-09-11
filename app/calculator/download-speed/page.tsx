"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  FileSizeUnit,
  TimeUnit,
  SpeedUnit,
  speedMultipliers,
  timeMultipliers,
  FileSizeMultipliers,
  formatFileSize,
  formatTime,
  formatNumber,
} from "./utils";

interface SpeedResults {
  "Bytes/s": number;
  "KB/s": number;
  "MB/s": number;
  "GB/s": number;
  bps: number;
  Kbps: number;
  Mbps: number;
  Gbps: number;
  "Kb/s": number;
  "Mb/s": number;
  "Gb/s": number;
}

type Inputs = {
  fileSize: string;
  fileSizeUnit: FileSizeUnit;
  downloadTime: string;
  timeUnit: TimeUnit;
  speed: string;
  speedUnit: SpeedUnit;
};

export default function DownloadSpeedCalculator() {
  const [fileSize, setFileSize] = useState<string>("");
  const [fileSizeUnit, setFileSizeUnit] = useState<FileSizeUnit>("MB");
  const [downloadTime, setDownloadTime] = useState<string>("0");
  const [timeUnit, setTimeUnit] = useState<TimeUnit>("s");
  const [speed, setSpeed] = useState<string>("100");
  const [speedUnit, setSpeedUnit] = useState<SpeedUnit>("Mbps");
  const [error, setError] = useState<string>("");

  const calculateFromInputs = (inputs: Inputs) => {
    // Parse numbers from potentially text inputs
    const fileSizeNum = parseFloat(inputs.fileSize.replace(/[^0-9.-]/g, ""));
    const downloadTimeNum = parseFloat(
      inputs.downloadTime.replace(/[^0-9.-]/g, ""),
    );
    const speedNum = parseFloat(inputs.speed.replace(/[^0-9.-]/g, ""));
    // Need file size + either time or speed
    if (fileSizeNum <= 0) {
      return;
    }

    const bytesPerSecond = speedNum * speedMultipliers[speedUnit];

    // Always show results when we have valid calculation
    if (bytesPerSecond > 0) {
      const speeds: SpeedResults = {
        "Bytes/s": bytesPerSecond,
        "KB/s": bytesPerSecond / 1024,
        "MB/s": bytesPerSecond / (1024 * 1024),
        "GB/s": bytesPerSecond / (1024 * 1024 * 1024),
        bps: bytesPerSecond * 8,
        Kbps: (bytesPerSecond * 8) / 1000,
        Mbps: (bytesPerSecond * 8) / (1000 * 1000),
        Gbps: (bytesPerSecond * 8) / (1000 * 1000 * 1000),
        "Kb/s": (bytesPerSecond * 8) / 1000,
        "Mb/s": (bytesPerSecond * 8) / (1000 * 1000),
        "Gb/s": (bytesPerSecond * 8) / (1000 * 1000 * 1000),
      };
      return speeds;
    }
  };

  const fileSizeNum = parseFloat(fileSize.replace(/[^0-9.-]/g, "") || "0");
  const downloadTimeNum = parseFloat(
    downloadTime.replace(/[^0-9.-]/g, "") || "0",
  );
  const speedNum = parseFloat(speed.replace(/[^0-9.-]/g, "") || "0");

  const totalBytes = fileSizeNum * FileSizeMultipliers[fileSizeUnit];
  const totalSeconds = downloadTimeNum * timeMultipliers[timeUnit];
  const totalSpeed = speedNum * speedMultipliers[speedUnit];

  function calculateTime(speed: string, speedUnit: SpeedUnit) {
    const speedNum = parseFloat(speed.replace(/[^0-9.-]/g, "") || "0");
    const speedBytesPerSec = speedNum * speedMultipliers[speedUnit];
    const timeInSeconds = totalBytes / speedBytesPerSec;
    const timeInUnit = timeInSeconds / timeMultipliers[timeUnit];
    setDownloadTime(timeInUnit.toString());
  }
  function calculateSpeed(time: string, timeUnit: TimeUnit) {
    const timeNum = parseFloat(time.replace(/[^0-9.-]/g, "") || "0");
    const timeInSeconds = timeNum * timeMultipliers[timeUnit];
    const speedInBytesPerSec = totalBytes / timeInSeconds;
    const speedInCurrentUnit = speedInBytesPerSec / speedMultipliers[speedUnit];
    setSpeed(speedInCurrentUnit.toString());
  }

  const results = calculateFromInputs({
    fileSize,
    downloadTime,
    speed,
    speedUnit,
    timeUnit,
    fileSizeUnit,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Download Speed Calculator
          </h1>
          <p className="text-gray-600 text-lg">
            Enter file size, then either time or speed to calculate the other
          </p>
        </div>

        {/* Main Calculator Card */}
        <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-white/20 mb-8">
          <CardContent className="p-8">
            {/* File Size Input */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <label
                  htmlFor="fileSize"
                  className="block text-lg font-semibold text-gray-700"
                >
                  File Size:
                </label>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="number"
                  id="fileSize"
                  value={fileSize}
                  onChange={(e) => {
                    const v = e.target.value;
                    setFileSize(v);
                    calculateTime(speed, speedUnit);
                  }}
                  placeholder="Enter file size (e.g., 100 MB, 1.5 GB)"
                  className="flex-1 text-lg h-12"
                />
                <Select
                  value={fileSizeUnit}
                  onValueChange={(value: FileSizeUnit) => {
                    setFileSizeUnit(value);
                    calculateTime(speed, speedUnit);
                  }}
                >
                  <SelectTrigger className="min-w-[140px] h-12 text-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="B">Bytes</SelectItem>
                    <SelectItem value="KB">KB (Kilobytes)</SelectItem>
                    <SelectItem value="MB">MB (Megabytes)</SelectItem>
                    <SelectItem value="GB">GB (Gigabytes)</SelectItem>
                    <SelectItem value="TB">TB (Terabytes)</SelectItem>
                    <SelectItem value="Kb">Kb (Kilobits)</SelectItem>
                    <SelectItem value="Mb">Mb (Megabits)</SelectItem>
                    <SelectItem value="Gb">Gb (Gigabits)</SelectItem>
                    <SelectItem value="Tb">Tb (Terabits)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Download Time Input */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <label
                  htmlFor="downloadTime"
                  className="block text-lg font-semibold text-gray-700"
                >
                  Download Time:
                </label>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="number"
                  id="downloadTime"
                  value={downloadTime}
                  onChange={(e) => {
                    const v = e.target.value;
                    setDownloadTime(v);
                    calculateSpeed(v, timeUnit);
                  }}
                  placeholder="Enter download time (e.g., 30 seconds, 5 min)"
                  className="flex-1 text-lg h-12"
                />
                <Select
                  value={timeUnit}
                  onValueChange={(value: TimeUnit) => {
                    setTimeUnit(value);
                    calculateSpeed(downloadTime, value);
                  }}
                >
                  <SelectTrigger className="min-w-[130px] h-12 text-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ms">Milliseconds</SelectItem>
                    <SelectItem value="s">Seconds</SelectItem>
                    <SelectItem value="min">Minutes</SelectItem>
                    <SelectItem value="hr">Hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Download Speed Input */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <label
                  htmlFor="speed"
                  className="block text-lg font-semibold text-gray-700"
                >
                  Download Speed:
                </label>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="number"
                  id="speed"
                  value={speed}
                  onChange={(e) => {
                    const v = e.target.value;
                    setSpeed(v);
                    calculateTime(v, speedUnit);
                  }}
                  placeholder="Enter download speed (e.g., 10 Mbps, 5 MB/s)"
                  className="flex-1 text-lg h-12"
                />
                <Select
                  value={speedUnit}
                  onValueChange={(value: SpeedUnit) => {
                    setSpeedUnit(value);
                    calculateTime(speed, value);
                  }}
                >
                  <SelectTrigger className="min-w-[120px] h-12 text-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mbps">Mbps</SelectItem>
                    <SelectItem value="Kbps">Kbps</SelectItem>
                    <SelectItem value="Gbps">Gbps</SelectItem>
                    <SelectItem value="MB/s">MB/s</SelectItem>
                    <SelectItem value="KB/s">KB/s</SelectItem>
                    <SelectItem value="GB/s">GB/s</SelectItem>
                    <SelectItem value="Mb/s">Mb/s</SelectItem>
                    <SelectItem value="Kb/s">Kb/s</SelectItem>
                    <SelectItem value="Gb/s">Gb/s</SelectItem>
                    <SelectItem value="Bytes/s">Bytes/s</SelectItem>
                    <SelectItem value="bps">bps</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 rounded-xl text-center font-medium mb-8">
            {error}
          </div>
        )}

        {/* Results Display */}
        {results && (
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-indigo-100">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center text-gray-800">
                📈 Download Speed Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
                {(
                  [
                    "MB/s",
                    "Mb/s",
                    "Mbps",
                    "KB/s",
                    "Kb/s",
                    "Kbps",
                    "GB/s",
                    "Gb/s",
                    "Gbps",
                    "Bytes/s",
                    "bps",
                  ] as const
                ).map((unit) => (
                  <div
                    key={unit}
                    className="bg-white rounded-xl p-4 text-center shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100"
                  >
                    <div className="text-2xl font-bold text-indigo-600 mb-1">
                      {formatNumber(results[unit])}
                    </div>
                    <div className="text-gray-600 text-sm tracking-wider font-medium">
                      {unit}
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center text-gray-600 bg-white/50 rounded-xl p-4">
                <p>
                  Downloaded {formatFileSize(totalBytes)} in{" "}
                  {formatTime(totalSeconds)} at {formatNumber(totalSpeed)}{" "}
                  Bytes/s
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex justify-center gap-4 mt-8">
          <Button asChild variant="outline">
            <a href="/calculator">← Back to Calculator</a>
          </Button>
          <Button asChild>
            <a href="/">🏠 Home</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
