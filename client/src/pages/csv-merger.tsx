import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Download, Merge, Split, X } from "lucide-react";
import CopyButton from "@/components/copy-button";

export default function CsvMerger() {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [mergedCsv, setMergedCsv] = useState("");
  const [splitInput, setSplitInput] = useState("");
  const [splitBy, setSplitBy] = useState<"rows" | "size">("rows");
  const [splitValue, setSplitValue] = useState(1000);
  const [splitFiles, setSplitFiles] = useState<{ name: string; content: string }[]>([]);
  const [error, setError] = useState("");

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const csvFiles = files.filter(file => file.name.toLowerCase().endsWith('.csv'));
    
    if (csvFiles.length === 0) {
      setError("Please select CSV files only");
      return;
    }

    setUploadedFiles(prev => [...prev, ...csvFiles]);
    setError("");
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const mergeCsvFiles = async () => {
    if (uploadedFiles.length === 0) {
      setError("Please upload CSV files to merge");
      return;
    }

    try {
      const csvContents: string[] = [];
      let headers = "";

      for (let i = 0; i < uploadedFiles.length; i++) {
        const file = uploadedFiles[i];
        const content = await readFileAsText(file);
        const lines = content.trim().split('\n');
        
        if (i === 0) {
          headers = lines[0];
          csvContents.push(...lines);
        } else {
          // Skip header for subsequent files
          csvContents.push(...lines.slice(1));
        }
      }

      const merged = csvContents.join('\n');
      setMergedCsv(merged);
      setError("");
    } catch (err) {
      setError("Failed to merge CSV files");
    }
  };

  const splitCsv = () => {
    if (!splitInput.trim()) {
      setError("Please enter CSV content to split");
      return;
    }

    try {
      const lines = splitInput.trim().split('\n');
      const headers = lines[0];
      const dataLines = lines.slice(1);
      
      const chunks: string[][] = [];
      
      if (splitBy === "rows") {
        for (let i = 0; i < dataLines.length; i += splitValue) {
          chunks.push(dataLines.slice(i, i + splitValue));
        }
      } else {
        // Split by approximate size (KB)
        const targetSize = splitValue * 1024; // Convert KB to bytes
        let currentChunk: string[] = [];
        let currentSize = headers.length;

        for (const line of dataLines) {
          if (currentSize + line.length > targetSize && currentChunk.length > 0) {
            chunks.push([...currentChunk]);
            currentChunk = [];
            currentSize = headers.length;
          }
          currentChunk.push(line);
          currentSize += line.length + 1; // +1 for newline
        }
        
        if (currentChunk.length > 0) {
          chunks.push(currentChunk);
        }
      }

      const splitFiles = chunks.map((chunk, index) => ({
        name: `split_part_${index + 1}.csv`,
        content: [headers, ...chunk].join('\n')
      }));

      setSplitFiles(splitFiles);
      setError("");
    } catch (err) {
      setError("Failed to split CSV");
    }
  };

  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-foreground">
            <span className="material-icons text-blue-600 text-3xl">merge</span>
            CSV Merger & Splitter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="merge" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="merge">Merge CSV Files</TabsTrigger>
              <TabsTrigger value="split">Split CSV File</TabsTrigger>
            </TabsList>

            <TabsContent value="merge" className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Upload CSV Files
                </label>
                <Input
                  type="file"
                  multiple
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="mb-4"
                />
                
                {uploadedFiles.length > 0 && (
                  <div className="space-y-2 mb-4">
                    <h4 className="font-medium text-foreground">Selected Files:</h4>
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-muted p-2 rounded">
                        <span className="text-sm text-foreground">{file.name}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                <Button
                  onClick={mergeCsvFiles}
                  disabled={uploadedFiles.length === 0}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <Merge className="w-4 h-4 mr-2" />
                  Merge CSV Files
                </Button>
              </div>

              {mergedCsv && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-foreground">
                      Merged CSV Result
                    </label>
                    <div className="flex gap-2">
                      <CopyButton text={mergedCsv} label="Copy" />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadFile(mergedCsv, 'merged.csv')}
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                  <Textarea
                    value={mergedCsv}
                    readOnly
                    className="h-48 font-mono bg-muted"
                  />
                </div>
              )}
            </TabsContent>

            <TabsContent value="split" className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  CSV Content to Split
                </label>
                <Textarea
                  value={splitInput}
                  onChange={(e) => setSplitInput(e.target.value)}
                  placeholder="Paste your CSV content here..."
                  className="h-32 font-mono"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Split By
                  </label>
                  <select
                    value={splitBy}
                    onChange={(e) => setSplitBy(e.target.value as "rows" | "size")}
                    className="w-full p-2 border border-border rounded-md bg-background text-foreground"
                  >
                    <option value="rows">Number of Rows</option>
                    <option value="size">File Size (KB)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {splitBy === "rows" ? "Rows per file" : "Max size (KB)"}
                  </label>
                  <Input
                    type="number"
                    value={splitValue}
                    onChange={(e) => setSplitValue(parseInt(e.target.value) || 1000)}
                    min="1"
                    placeholder={splitBy === "rows" ? "1000" : "100"}
                  />
                </div>
              </div>

              <Button
                onClick={splitCsv}
                disabled={!splitInput.trim()}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <Split className="w-4 h-4 mr-2" />
                Split CSV
              </Button>

              {splitFiles.length > 0 && (
                <div>
                  <h4 className="font-medium text-foreground mb-4">
                    Split Results ({splitFiles.length} files)
                  </h4>
                  <div className="space-y-2">
                    {splitFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-muted p-3 rounded">
                        <div>
                          <span className="font-medium text-foreground">{file.name}</span>
                          <span className="text-sm text-muted-foreground ml-2">
                            ({file.content.split('\n').length - 1} rows)
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <CopyButton text={file.content} label="Copy" size="sm" />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => downloadFile(file.content, file.name)}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>

          {error && (
            <Alert className="mt-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}