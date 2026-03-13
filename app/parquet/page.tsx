"use client";

import { useState, useCallback, useRef } from "react";
import { Upload, X, ChevronLeft, ChevronRight, Search, FileText, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

type TableData = {
  columns: string[];
  rows: Record<string, unknown>[];
  fileName: string;
  fileSize: number;
  totalRows: number;
};

const PAGE_SIZE = 100;

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

function formatCell(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "bigint") return value.toString();
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

export default function ParquetViewer() {
  const [tableData, setTableData] = useState<TableData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});
  const [currentPage, setCurrentPage] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parseCSV = useCallback(async (file: File): Promise<TableData> => {
    const { default: Papa } = await import("papaparse");
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        complete: (results) => {
          const columns = results.meta.fields ?? [];
          const rows = results.data as Record<string, unknown>[];
          resolve({
            columns,
            rows,
            fileName: file.name,
            fileSize: file.size,
            totalRows: rows.length,
          });
        },
        error: (err: Error) => reject(err),
      });
    });
  }, []);

  const parseParquet = useCallback(async (file: File): Promise<TableData> => {
    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);

    const parquet = await import("parquet-wasm");
    // parquet-wasm bundler build — init is the default export
    if (typeof parquet.default === "function") {
      await parquet.default();
    }

    const wasmTable = parquet.readParquet(bytes);
    const arrowIpc = wasmTable.intoIPCStream();
    const { tableFromIPC } = await import("apache-arrow");
    const table = tableFromIPC(arrowIpc);

    const columns = table.schema.fields.map((f) => f.name);
    const rows: Record<string, unknown>[] = [];

    for (let i = 0; i < table.numRows; i++) {
      const row: Record<string, unknown> = {};
      for (const col of columns) {
        row[col] = table.getChild(col)?.get(i) ?? null;
      }
      rows.push(row);
    }

    return {
      columns,
      rows,
      fileName: file.name,
      fileSize: file.size,
      totalRows: table.numRows,
    };
  }, []);

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);
      setLoading(true);
      setTableData(null);
      setGlobalSearch("");
      setColumnFilters({});
      setCurrentPage(0);

      try {
        const ext = file.name.split(".").pop()?.toLowerCase();
        let data: TableData;

        if (ext === "csv" || ext === "tsv" || ext === "txt") {
          data = await parseCSV(file);
        } else if (ext === "parquet") {
          data = await parseParquet(file);
        } else {
          throw new Error(`Unsupported file type: .${ext}. Supported: .parquet, .csv, .tsv`);
        }

        setTableData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    },
    [parseCSV, parseParquet],
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const onFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  // Filtering logic
  const filteredRows = tableData
    ? tableData.rows.filter((row) => {
        // Global search
        if (globalSearch) {
          const q = globalSearch.toLowerCase();
          const matches = tableData.columns.some((col) =>
            formatCell(row[col]).toLowerCase().includes(q),
          );
          if (!matches) return false;
        }
        // Column filters
        for (const [col, filter] of Object.entries(columnFilters)) {
          if (!filter) continue;
          if (!formatCell(row[col]).toLowerCase().includes(filter.toLowerCase())) return false;
        }
        return true;
      })
    : [];

  const totalPages = Math.ceil(filteredRows.length / PAGE_SIZE);
  const pageRows = filteredRows.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE);

  const setColumnFilter = (col: string, value: string) => {
    setColumnFilters((prev) => ({ ...prev, [col]: value }));
    setCurrentPage(0);
  };

  const handleGlobalSearch = (value: string) => {
    setGlobalSearch(value);
    setCurrentPage(0);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-full">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Database className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Data Viewer</h1>
            <p className="text-sm text-muted-foreground">View Parquet and CSV files in-browser — no upload, fully client-side</p>
          </div>
          {tableData && (
            <Button variant="outline" size="sm" className="ml-auto" onClick={() => { setTableData(null); setError(null); }}>
              <X className="w-4 h-4 mr-1" /> Clear
            </Button>
          )}
        </div>

        {/* Drop zone */}
        {!tableData && !loading && (
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-16 text-center cursor-pointer transition-all duration-200 ${
              isDragging
                ? "border-primary bg-primary/5 scale-[1.01]"
                : "border-muted-foreground/30 hover:border-primary/50 hover:bg-muted/30"
            }`}
          >
            <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium mb-1">Drop a file here</p>
            <p className="text-sm text-muted-foreground mb-4">or click to browse</p>
            <div className="flex justify-center gap-2">
              <Badge variant="secondary"><FileText className="w-3 h-3 mr-1" />.csv</Badge>
              <Badge variant="secondary"><FileText className="w-3 h-3 mr-1" />.tsv</Badge>
              <Badge variant="secondary"><Database className="w-3 h-3 mr-1" />.parquet</Badge>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".parquet,.csv,.tsv,.txt"
              className="hidden"
              onChange={onFileChange}
            />
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-muted-foreground">Parsing file…</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 mt-4 flex items-start gap-3">
            <X className="w-5 h-5 text-destructive mt-0.5 shrink-0" />
            <div>
              <p className="font-medium text-destructive">Error</p>
              <p className="text-sm text-muted-foreground mt-1">{error}</p>
            </div>
            <Button variant="ghost" size="sm" className="ml-auto" onClick={() => setError(null)}>Dismiss</Button>
          </div>
        )}

        {/* Table view */}
        {tableData && (
          <div className="space-y-4">
            {/* File info + search */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium text-sm">{tableData.fileName}</span>
                <Badge variant="outline">{formatBytes(tableData.fileSize)}</Badge>
                <Badge variant="secondary">{tableData.totalRows.toLocaleString()} rows</Badge>
                <Badge variant="secondary">{tableData.columns.length} cols</Badge>
                {filteredRows.length !== tableData.totalRows && (
                  <Badge variant="default">{filteredRows.length.toLocaleString()} matching</Badge>
                )}
              </div>
              <div className="relative ml-auto w-64">
                <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search all columns…"
                  value={globalSearch}
                  onChange={(e) => handleGlobalSearch(e.target.value)}
                  className="pl-8 h-9"
                />
                {globalSearch && (
                  <button onClick={() => handleGlobalSearch("")} className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Table */}
            <div className="rounded-lg border overflow-auto max-h-[calc(100vh-280px)]">
              <table className="w-full text-sm border-collapse">
                <thead className="sticky top-0 z-20 bg-muted/95 backdrop-blur">
                  <tr>
                    {tableData.columns.map((col) => (
                      <th key={col} className="border-b px-3 py-2 text-left font-medium whitespace-nowrap min-w-[120px]">
                        <div className="font-semibold text-xs text-muted-foreground uppercase tracking-wide mb-1.5">{col}</div>
                        <div className="relative">
                          <Search className="absolute left-1.5 top-1.5 w-3 h-3 text-muted-foreground/60" />
                          <input
                            type="text"
                            placeholder="filter…"
                            value={columnFilters[col] ?? ""}
                            onChange={(e) => setColumnFilter(col, e.target.value)}
                            className="w-full pl-5 pr-2 py-0.5 text-xs bg-background border border-input rounded text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pageRows.length === 0 ? (
                    <tr>
                      <td colSpan={tableData.columns.length} className="text-center py-12 text-muted-foreground">
                        No rows match the current filters
                      </td>
                    </tr>
                  ) : (
                    pageRows.map((row, i) => (
                      <tr key={i} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                        {tableData.columns.map((col) => (
                          <td key={col} className="px-3 py-1.5 whitespace-nowrap max-w-[300px] truncate text-xs font-mono" title={formatCell(row[col])}>
                            {formatCell(row[col]) || <span className="text-muted-foreground/40 italic">null</span>}
                          </td>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>
                  Rows {currentPage * PAGE_SIZE + 1}–{Math.min((currentPage + 1) * PAGE_SIZE, filteredRows.length)} of {filteredRows.length.toLocaleString()}
                </span>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setCurrentPage(0)} disabled={currentPage === 0}>«</Button>
                  <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => p - 1)} disabled={currentPage === 0}>
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="px-2">Page {currentPage + 1} / {totalPages}</span>
                  <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => p + 1)} disabled={currentPage >= totalPages - 1}>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setCurrentPage(totalPages - 1)} disabled={currentPage >= totalPages - 1}>»</Button>
                </div>
              </div>
            )}

            {/* Drop another file */}
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border border-dashed rounded-lg p-3 text-center cursor-pointer text-xs text-muted-foreground transition-colors ${
                isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/20 hover:border-primary/40"
              }`}
            >
              Drop another file to replace current
              <input ref={fileInputRef} type="file" accept=".parquet,.csv,.tsv,.txt" className="hidden" onChange={onFileChange} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
