'use client';

import { useState, useEffect } from 'react';

type FileSizeUnit = 'B' | 'KB' | 'MB' | 'GB' | 'TB' | 'Kb' | 'Mb' | 'Gb' | 'Tb';
type TimeUnit = 'ms' | 's' | 'min' | 'hr';
type SpeedUnit = 'Bytes/s' | 'KB/s' | 'MB/s' | 'GB/s' | 'bps' | 'Kbps' | 'Mbps' | 'Gbps' | 'Kb/s' | 'Mb/s' | 'Gb/s';

interface SpeedResults {
  'Bytes/s': number;
  'KB/s': number;
  'MB/s': number;
  'GB/s': number;
  'bps': number;
  'Kbps': number;
  'Mbps': number;
  'Gbps': number;
  'Kb/s': number;
  'Mb/s': number;
  'Gb/s': number;
}

export default function DownloadSpeedCalculator() {
  const [fileSize, setFileSize] = useState<string>('');
  const [fileSizeUnit, setFileSizeUnit] = useState<FileSizeUnit>('MB');
  const [downloadTime, setDownloadTime] = useState<string>('');
  const [timeUnit, setTimeUnit] = useState<TimeUnit>('s');
  const [speed, setSpeed] = useState<string>('');
  const [speedUnit, setSpeedUnit] = useState<SpeedUnit>('Mbps');
  const [results, setResults] = useState<SpeedResults | null>(null);
  const [error, setError] = useState<string>('');
  const [lastModified, setLastModified] = useState<'size' | 'time' | 'speed' | null>(null);

  const convertToBytes = (size: number, unit: FileSizeUnit): number => {
    const multipliers: Record<FileSizeUnit, number> = {
      'B': 1,
      'KB': 1024,
      'MB': 1024 * 1024,
      'GB': 1024 * 1024 * 1024,
      'TB': 1024 * 1024 * 1024 * 1024,
      'Kb': 1000 / 8,
      'Mb': (1000 * 1000) / 8,
      'Gb': (1000 * 1000 * 1000) / 8,
      'Tb': (1000 * 1000 * 1000 * 1000) / 8
    };
    return size * multipliers[unit];
  };

  const convertToSeconds = (time: number, unit: TimeUnit): number => {
    const multipliers: Record<TimeUnit, number> = {
      'ms': 0.001,
      's': 1,
      'min': 60,
      'hr': 3600
    };
    return time * multipliers[unit];
  };

  const convertToBytesPerSecond = (speed: number, unit: SpeedUnit): number => {
    const multipliers: Record<SpeedUnit, number> = {
      'Bytes/s': 1,
      'KB/s': 1024,
      'MB/s': 1024 * 1024,
      'GB/s': 1024 * 1024 * 1024,
      'bps': 1/8,
      'Kbps': 1000/8,
      'Mbps': (1000 * 1000)/8,
      'Gbps': (1000 * 1000 * 1000)/8,
      'Kb/s': 1000/8,
      'Mb/s': (1000 * 1000)/8,
      'Gb/s': (1000 * 1000 * 1000)/8
    };
    return speed * multipliers[unit];
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(2) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(2) + 'K';
    } else if (num >= 1) {
      return num.toFixed(2);
    } else if (num >= 0.01) {
      return num.toFixed(3);
    } else {
      return num.toExponential(2);
    }
  };

  const formatFileSize = (bytes: number): string => {
    const byteUnits = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < byteUnits.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    const bits = bytes * 8;
    const bitUnits = ['bits', 'Kb', 'Mb', 'Gb', 'Tb'];
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

  const formatTime = (seconds: number): string => {
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

  const calculateFromInputs = () => {
    // Parse numbers from potentially text inputs
    const fileSizeNum = parseFloat(fileSize.replace(/[^0-9.-]/g, ''));
    const downloadTimeNum = parseFloat(downloadTime.replace(/[^0-9.-]/g, ''));
    const speedNum = parseFloat(speed.replace(/[^0-9.-]/g, ''));

    setError('');
    setResults(null);

    // Need file size + either time or speed
    if (fileSizeNum <= 0) {
      return;
    }

    try {
      let bytesPerSecond = 0;

      if (downloadTimeNum > 0 && speedNum <= 0) {
        // Calculate speed from size and time
        const fileSizeInBytes = convertToBytes(fileSizeNum, fileSizeUnit);
        const timeInSeconds = convertToSeconds(downloadTimeNum, timeUnit);
        bytesPerSecond = fileSizeInBytes / timeInSeconds;
        
        const speedInCurrentUnit = bytesPerSecond / (convertToBytesPerSecond(1, speedUnit));
        setSpeed(speedInCurrentUnit.toFixed(3));
      } else if (speedNum > 0 && downloadTimeNum <= 0) {
        // Calculate time from size and speed
        const fileSizeInBytes = convertToBytes(fileSizeNum, fileSizeUnit);
        bytesPerSecond = convertToBytesPerSecond(speedNum, speedUnit);
        const timeInSeconds = fileSizeInBytes / bytesPerSecond;
        
        const timeInCurrentUnit = timeInSeconds / (convertToSeconds(1, timeUnit));
        setDownloadTime(timeInCurrentUnit.toFixed(3));
      } else if (downloadTimeNum > 0 && speedNum > 0) {
        // Both time and speed are filled - use the last modified to determine which to update
        if (lastModified === 'time') {
          // Time was changed, update speed
          const fileSizeInBytes = convertToBytes(fileSizeNum, fileSizeUnit);
          const timeInSeconds = convertToSeconds(downloadTimeNum, timeUnit);
          bytesPerSecond = fileSizeInBytes / timeInSeconds;
          
          const speedInCurrentUnit = bytesPerSecond / (convertToBytesPerSecond(1, speedUnit));
          setSpeed(speedInCurrentUnit.toFixed(3));
        } else if (lastModified === 'speed') {
          // Speed was changed, update time
          const fileSizeInBytes = convertToBytes(fileSizeNum, fileSizeUnit);
          bytesPerSecond = convertToBytesPerSecond(speedNum, speedUnit);
          const timeInSeconds = fileSizeInBytes / bytesPerSecond;
          
          const timeInCurrentUnit = timeInSeconds / (convertToSeconds(1, timeUnit));
          setDownloadTime(timeInCurrentUnit.toFixed(3));
        }
      }

      // Always show results when we have valid calculation
      if (bytesPerSecond > 0) {
        const speeds: SpeedResults = {
          'Bytes/s': bytesPerSecond,
          'KB/s': bytesPerSecond / 1024,
          'MB/s': bytesPerSecond / (1024 * 1024),
          'GB/s': bytesPerSecond / (1024 * 1024 * 1024),
          'bps': bytesPerSecond * 8,
          'Kbps': (bytesPerSecond * 8) / 1000,
          'Mbps': (bytesPerSecond * 8) / (1000 * 1000),
          'Gbps': (bytesPerSecond * 8) / (1000 * 1000 * 1000),
          'Kb/s': (bytesPerSecond * 8) / 1000,
          'Mb/s': (bytesPerSecond * 8) / (1000 * 1000),
          'Gb/s': (bytesPerSecond * 8) / (1000 * 1000 * 1000)
        };
        setResults(speeds);
      }
    } catch (err) {
      setError('Error calculating: ' + (err as Error).message);
    }
  };

  // Auto-calculate when inputs change (with debounce)
  useEffect(() => {
    const timeout = setTimeout(() => {
      calculateFromInputs();
    }, 300);

    return () => clearTimeout(timeout);
  }, [fileSize, downloadTime, speed, fileSizeUnit, timeUnit, speedUnit]);

  // Clear field helper
  const clearField = (field: 'size' | 'time' | 'speed') => {
    if (field === 'size') {
      setFileSize('');
      setLastModified(null);
    }
    if (field === 'time') {
      setDownloadTime('');
      setLastModified(null);
    }
    if (field === 'speed') {
      setSpeed('');
      setLastModified(null);
    }
  };

  // Field change handlers
  const handleFileSizeChange = (value: string) => {
    setFileSize(value);
    setLastModified('size');
  };

  const handleTimeChange = (value: string) => {
    setDownloadTime(value);
    setLastModified('time');
  };

  const handleSpeedChange = (value: string) => {
    setSpeed(value);
    setLastModified('speed');
  };

  // Unit parsing functions
  const parseFileSizeInput = (input: string): { value: string; unit: FileSizeUnit } => {
    const trimmed = input.trim().toLowerCase();
    
    // Extract number part
    const numberMatch = trimmed.match(/^([0-9]*\.?[0-9]+)/);
    if (!numberMatch) return { value: input, unit: fileSizeUnit };
    
    const value = numberMatch[1];
    const unitPart = trimmed.replace(value, '').trim();
    
    // Unit mappings (case insensitive, flexible)
    const unitMappings: Record<string, FileSizeUnit> = {
      'b': 'B', 'byte': 'B', 'bytes': 'B',
      'kb': 'KB', 'kilobyte': 'KB', 'kilobytes': 'KB',
      'mb': 'MB', 'megabyte': 'MB', 'megabytes': 'MB',
      'gb': 'GB', 'gigabyte': 'GB', 'gigabytes': 'GB',
      'tb': 'TB', 'terabyte': 'TB', 'terabytes': 'TB',
      'kbit': 'Kb', 'kilobit': 'Kb', 'kilobits': 'Kb',
      'mbit': 'Mb', 'megabit': 'Mb', 'megabits': 'Mb',
      'gbit': 'Gb', 'gigabit': 'Gb', 'gigabits': 'Gb',
      'tbit': 'Tb', 'terabit': 'Tb', 'terabits': 'Tb'
    };
    
    const mappedUnit = unitMappings[unitPart];
    return {
      value,
      unit: mappedUnit || fileSizeUnit
    };
  };

  const parseTimeInput = (input: string): { value: string; unit: TimeUnit } => {
    const trimmed = input.trim().toLowerCase();
    
    const numberMatch = trimmed.match(/^([0-9]*\.?[0-9]+)/);
    if (!numberMatch) return { value: input, unit: timeUnit };
    
    const value = numberMatch[1];
    const unitPart = trimmed.replace(value, '').trim();
    
    const unitMappings: Record<string, TimeUnit> = {
      'ms': 'ms', 'millisecond': 'ms', 'milliseconds': 'ms',
      's': 's', 'sec': 's', 'second': 's', 'seconds': 's',
      'min': 'min', 'minute': 'min', 'minutes': 'min',
      'h': 'hr', 'hr': 'hr', 'hour': 'hr', 'hours': 'hr'
    };
    
    const mappedUnit = unitMappings[unitPart];
    return {
      value,
      unit: mappedUnit || timeUnit
    };
  };

  const parseSpeedInput = (input: string): { value: string; unit: SpeedUnit } => {
    const trimmed = input.trim().toLowerCase();
    
    const numberMatch = trimmed.match(/^([0-9]*\.?[0-9]+)/);
    if (!numberMatch) return { value: input, unit: speedUnit };
    
    const value = numberMatch[1];
    const unitPart = trimmed.replace(value, '').trim();
    
    const unitMappings: Record<string, SpeedUnit> = {
      'bytes/s': 'Bytes/s', 'b/s': 'Bytes/s',
      'kb/s': 'KB/s', 'kilobytes/s': 'KB/s',
      'mb/s': 'MB/s', 'megabytes/s': 'MB/s',
      'gb/s': 'GB/s', 'gigabytes/s': 'GB/s',
      'bps': 'bps', 'bits/s': 'bps',
      'kbps': 'Kbps', 'kilobits/s': 'Kbps',
      'mbps': 'Mbps', 'megabits/s': 'Mbps',
      'gbps': 'Gbps', 'gigabits/s': 'Gbps',
      'kb/s': 'Kb/s', 'mb/s': 'Mb/s', 'gb/s': 'Gb/s'
    };
    
    const mappedUnit = unitMappings[unitPart];
    return {
      value,
      unit: mappedUnit || speedUnit
    };
  };

  // Blur handlers with unit parsing
  const handleFileSizeBlur = (input: string) => {
    const { value, unit } = parseFileSizeInput(input);
    setFileSize(value);
    if (unit !== fileSizeUnit) {
      setFileSizeUnit(unit);
    }
  };

  const handleTimeBlur = (input: string) => {
    const { value, unit } = parseTimeInput(input);
    setDownloadTime(value);
    if (unit !== timeUnit) {
      setTimeUnit(unit);
    }
  };

  const handleSpeedBlur = (input: string) => {
    const { value, unit } = parseSpeedInput(input);
    setSpeed(value);
    if (unit !== speedUnit) {
      setSpeedUnit(unit);
    }
  };

  const fileSizeNum = parseFloat(fileSize.replace(/[^0-9.-]/g, '') || '0');
  const downloadTimeNum = parseFloat(downloadTime.replace(/[^0-9.-]/g, '') || '0');
  const speedNum = parseFloat(speed.replace(/[^0-9.-]/g, '') || '0');
  
  const totalBytes = fileSizeNum > 0 ? convertToBytes(fileSizeNum, fileSizeUnit) : 0;
  const totalSeconds = downloadTimeNum > 0 ? convertToSeconds(downloadTimeNum, timeUnit) : 0;
  const totalSpeed = speedNum > 0 ? convertToBytesPerSecond(speedNum, speedUnit) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            📊 Download Speed Calculator
          </h1>
          <p className="text-gray-600 text-lg">
            Enter file size, then either time or speed to calculate the other
          </p>
        </div>

        {/* Main Calculator Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-8">
          {/* File Size Input */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <label htmlFor="fileSize" className="block text-lg font-semibold text-gray-700">
                File Size:
              </label>
              {fileSizeNum > 0 && (
                <button 
                  onClick={() => clearField('size')}
                  className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                id="fileSize"
                value={fileSize}
                onChange={(e) => handleFileSizeChange(e.target.value)}
                onBlur={(e) => handleFileSizeBlur(e.target.value)}
                placeholder="Enter file size (e.g., 100 MB, 1.5 GB)"
                step="0.01"
                min="0"
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl text-lg focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200"
              />
              <select
                id="fileSizeUnit"
                value={fileSizeUnit}
                onChange={(e) => setFileSizeUnit(e.target.value as FileSizeUnit)}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl text-lg bg-white cursor-pointer focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200 min-w-[140px]"
              >
                <option value="B">Bytes</option>
                <option value="KB">KB (Kilobytes)</option>
                <option value="MB">MB (Megabytes)</option>
                <option value="GB">GB (Gigabytes)</option>
                <option value="TB">TB (Terabytes)</option>
                <option value="Kb">Kb (Kilobits)</option>
                <option value="Mb">Mb (Megabits)</option>
                <option value="Gb">Gb (Gigabits)</option>
                <option value="Tb">Tb (Terabits)</option>
              </select>
            </div>
          </div>

          {/* Download Time Input */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <label htmlFor="downloadTime" className="block text-lg font-semibold text-gray-700">
                Download Time:
              </label>
              {downloadTimeNum > 0 && (
                <button 
                  onClick={() => clearField('time')}
                  className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                id="downloadTime"
                value={downloadTime}
                onChange={(e) => handleTimeChange(e.target.value)}
                onBlur={(e) => handleTimeBlur(e.target.value)}
                placeholder="Enter download time (e.g., 30 seconds, 5 min)"
                step="0.01"
                min="0"
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl text-lg focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200"
              />
              <select
                id="timeUnit"
                value={timeUnit}
                onChange={(e) => setTimeUnit(e.target.value as TimeUnit)}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl text-lg bg-white cursor-pointer focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200 min-w-[130px]"
              >
                <option value="ms">Milliseconds</option>
                <option value="s">Seconds</option>
                <option value="min">Minutes</option>
                <option value="hr">Hours</option>
              </select>
            </div>
          </div>

          {/* Download Speed Input */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <label htmlFor="speed" className="block text-lg font-semibold text-gray-700">
                Download Speed:
              </label>
              {speedNum > 0 && (
                <button 
                  onClick={() => clearField('speed')}
                  className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                id="speed"
                value={speed}
                onChange={(e) => handleSpeedChange(e.target.value)}
                onBlur={(e) => handleSpeedBlur(e.target.value)}
                placeholder="Enter download speed (e.g., 10 Mbps, 5 MB/s)"
                step="0.01"
                min="0"
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl text-lg focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200"
              />
              <select
                id="speedUnit"
                value={speedUnit}
                onChange={(e) => setSpeedUnit(e.target.value as SpeedUnit)}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl text-lg bg-white cursor-pointer focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200 min-w-[120px]"
              >
                <option value="Mbps">Mbps</option>
                <option value="Kbps">Kbps</option>
                <option value="Gbps">Gbps</option>
                <option value="MB/s">MB/s</option>
                <option value="KB/s">KB/s</option>
                <option value="GB/s">GB/s</option>
                <option value="Mb/s">Mb/s</option>
                <option value="Kb/s">Kb/s</option>
                <option value="Gb/s">Gb/s</option>
                <option value="Bytes/s">Bytes/s</option>
                <option value="bps">bps</option>
              </select>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 rounded-xl text-center font-medium mb-8">
            {error}
          </div>
        )}

        {/* Results Display */}
        {results && (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border-2 border-indigo-100">
            <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">
              📈 Download Speed Results
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
              {(['MB/s', 'Mb/s', 'Mbps', 'KB/s', 'Kb/s', 'Kbps', 'GB/s', 'Gb/s', 'Gbps', 'Bytes/s', 'bps'] as const).map((unit) => (
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
              {totalBytes > 0 && totalSeconds > 0 && (
                <>Downloaded {formatFileSize(totalBytes)} in {formatTime(totalSeconds)}</>
              )}
              {totalBytes > 0 && totalSpeed > 0 && totalSeconds <= 0 && (
                <>File size: {formatFileSize(totalBytes)} at {formatNumber(totalSpeed)} Bytes/s</>
              )}
              {totalSeconds > 0 && totalSpeed > 0 && totalBytes <= 0 && (
                <>Download time: {formatTime(totalSeconds)} at {formatNumber(totalSpeed)} Bytes/s</>
              )}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-center gap-4 mt-8">
          <a
            href="/calculator"
            className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            ← Back to Calculator
          </a>
          <a
            href="/"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            🏠 Home
          </a>
        </div>
      </div>
    </div>
  );
}