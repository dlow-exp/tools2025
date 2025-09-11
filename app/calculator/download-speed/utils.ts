export type FileSizeUnit =
  | "B"
  | "KB"
  | "MB"
  | "GB"
  | "TB"
  | "Kb"
  | "Mb"
  | "Gb"
  | "Tb";
export type TimeUnit = "ms" | "s" | "min" | "hr";
export type SpeedUnit =
  | "Bytes/s"
  | "KB/s"
  | "MB/s"
  | "GB/s"
  | "bps"
  | "Kbps"
  | "Mbps"
  | "Gbps"
  | "Kb/s"
  | "Mb/s"
  | "Gb/s";

export const FileSizeMultipliers: Record<FileSizeUnit, number> = {
  B: 1,
  KB: 1024,
  MB: 1024 * 1024,
  GB: 1024 * 1024 * 1024,
  TB: 1024 * 1024 * 1024 * 1024,
  Kb: 1000 / 8,
  Mb: (1000 * 1000) / 8,
  Gb: (1000 * 1000 * 1000) / 8,
  Tb: (1000 * 1000 * 1000 * 1000) / 8,
};

export const timeMultipliers: Record<TimeUnit, number> = {
  ms: 0.001,
  s: 1,
  min: 60,
  hr: 3600,
};

export const convertToSeconds = (time: number, unit: TimeUnit): number => {
  return time * timeMultipliers[unit];
};

export const convertSecondsToTimeUnit = (
  time: number,
  unit: TimeUnit,
): number => {
  return time / timeMultipliers[unit];
};

export const speedMultipliers: Record<SpeedUnit, number> = {
  "Bytes/s": 1,
  "KB/s": 1024,
  "MB/s": 1024 * 1024,
  "GB/s": 1024 * 1024 * 1024,
  bps: 1 / 8,
  Kbps: 1000 / 8,
  Mbps: (1000 * 1000) / 8,
  Gbps: (1000 * 1000 * 1000) / 8,
  "Kb/s": 1000 / 8,
  "Mb/s": (1000 * 1000) / 8,
  "Gb/s": (1000 * 1000 * 1000) / 8,
};
export const convertToBytesPerSecond = (
  speed: number,
  unit: SpeedUnit,
): number => {
  return speed * speedMultipliers[unit];
};

export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(2) + "M";
  } else if (num >= 1000) {
    return (num / 1000).toFixed(2) + "K";
  } else if (num >= 1) {
    return num.toFixed(2);
  } else if (num >= 0.01) {
    return num.toFixed(3);
  } else {
    return num.toExponential(2);
  }
};

export const formatFileSize = (bytes: number): string => {
  const byteUnits = ["B", "KB", "MB", "GB", "TB"];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < byteUnits.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  const bits = bytes * 8;
  const bitUnits = ["bits", "Kb", "Mb", "Gb", "Tb"];
  let bitSize = bits;
  let bitUnitIndex = 0;

  while (bitSize >= 1000 && bitUnitIndex < bitUnits.length - 1) {
    bitSize /= 1000;
    bitUnitIndex++;
  }

  if (bitUnitIndex > 0) {
    return `${size.toFixed(2)} ${byteUnits[unitIndex]} (${bitSize.toFixed(2)} ${bitUnits[bitUnitIndex]})`;
  } else {
    return `${size.toFixed(2)} ${byteUnits[unitIndex]}`;
  }
};

export const formatTime = (seconds: number): string => {
  if (seconds < 60) {
    return `${seconds.toFixed(2)} seconds`;
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds.toFixed(0)}s`;
  } else {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  }
};
