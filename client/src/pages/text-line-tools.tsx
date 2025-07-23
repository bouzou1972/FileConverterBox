import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Copy, Download, Upload, SortAsc, SortDesc, Filter, Merge } from "lucide-react";
import BuyMeCoffee from "@/components/buy-me-coffee";
import { useToast } from "@/hooks/use-toast";

export default function TextLineTools() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [delimiter, setDelimiter] = useState(",");
  const [error, setError] = useState("");
  const { toast } = useToast();

  const processLines = (operation: string) => {
    try {
      setError("");
      
      if (!input.trim()) {
        setError("Please enter text to process");
        return;
      }

      const lines = input.split('\n');
      let result: string[] = [];

      switch (operation) {
        case 'sort-asc':
          result = [...lines].sort((a, b) => a.localeCompare(b));
          break;
        case 'sort-desc':
          result = [...lines].sort((a, b) => b.localeCompare(a));
          break;
        case 'remove-duplicates':
          result = [...new Set(lines)];
          break;
        case 'remove-empty':
          result = lines.filter(line => line.trim() !== '');
          break;
        case 'trim-lines':
          result = lines.map(line => line.trim());
          break;
        case 'merge-lines':
          result = [lines.join(delimiter)];
          break;
        case 'split-lines':
          result = input.split(delimiter).map(item => item.trim());
          break;
        case 'number-lines':
          result = lines.map((line, index) => `${index + 1}. ${line}`);
          break;
        case 'reverse-lines':
          result = [...lines].reverse();
          break;
        case 'shuffle-lines':
          result = [...lines].sort(() => Math.random() - 0.5);
          break;
        default:
          throw new Error("Unknown operation");
      }

      setOutput(result.join('\n'));
      
      const operationNames = {
        'sort-asc': 'sorted ascending',
        'sort-desc': 'sorted descending',
        'remove-duplicates': 'duplicates removed',
        'remove-empty': 'empty lines removed',
        'trim-lines': 'lines trimmed',
        'merge-lines': 'lines merged',
        'split-lines': 'text split into lines',
        'number-lines': 'lines numbered',
        'reverse-lines': 'lines reversed',
        'shuffle-lines': 'lines shuffled'
      };

      toast({
        title: "Success",
        description: `Text ${operationNames[operation as keyof typeof operationNames]} successfully`,
      });
    } catch (err) {
      setError("Error processing text. Please check your input.");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Content copied to clipboard",
    });
  };

  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setInput(content);
      };
      reader.readAsText(file);
    }
  };

  const getStats = (text: string) => {
    const lines = text.split('\n');
    const nonEmptyLines = lines.filter(line => line.trim() !== '');
    const uniqueLines = new Set(lines);
    
    return {
      totalLines: lines.length,
      nonEmptyLines: nonEmptyLines.length,
      uniqueLines: uniqueLines.size,
      characters: text.length,
      words: text.trim() ? text.trim().split(/\s+/).length : 0
    };
  };

  const inputStats = getStats(input);
  const outputStats = getStats(output);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Text Line Tools</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Powerful line-by-line text processing tools. Sort, deduplicate, merge, and manipulate text lines with ease.
        </p>
      </div>

      {error && (
        <Alert className="mb-6 border-red-200 bg-red-50">
          <AlertDescription className="text-red-700">{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="material-icons text-blue-600">text_snippet</span>
              Input Text
            </CardTitle>
            <CardDescription>Paste your text or upload a file to process</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => document.getElementById('text-file')?.click()}>
                <Upload className="w-4 h-4 mr-2" />
                Upload File
              </Button>
              <input
                id="text-file"
                type="file"
                accept=".txt,.csv,.log"
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter text with multiple lines...
Line 1
Line 2
Duplicate line
Line 3
Duplicate line"
              className="min-h-[300px] font-mono text-sm"
            />
            {input && (
              <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                <div className="grid grid-cols-2 gap-4">
                  <div>Lines: {inputStats.totalLines}</div>
                  <div>Non-empty: {inputStats.nonEmptyLines}</div>
                  <div>Unique: {inputStats.uniqueLines}</div>
                  <div>Words: {inputStats.words}</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="material-icons text-green-600">text_snippet</span>
              Processed Output
            </CardTitle>
            <CardDescription>Result of the text processing operation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => copyToClipboard(output)} disabled={!output}>
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
              <Button variant="outline" size="sm" onClick={() => downloadFile(output, "processed.txt")} disabled={!output}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
            <Textarea
              value={output}
              readOnly
              placeholder="Processed text will appear here..."
              className="min-h-[300px] font-mono text-sm bg-gray-50"
            />
            {output && (
              <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                <div className="grid grid-cols-2 gap-4">
                  <div>Lines: {outputStats.totalLines}</div>
                  <div>Non-empty: {outputStats.nonEmptyLines}</div>
                  <div>Unique: {outputStats.uniqueLines}</div>
                  <div>Words: {outputStats.words}</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Basic Operations</TabsTrigger>
          <TabsTrigger value="advanced">Advanced Tools</TabsTrigger>
          <TabsTrigger value="merge-split">Merge & Split</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button onClick={() => processLines('sort-asc')} variant="outline" className="h-20 flex-col">
              <SortAsc className="w-6 h-6 mb-2" />
              Sort A→Z
            </Button>
            <Button onClick={() => processLines('sort-desc')} variant="outline" className="h-20 flex-col">
              <SortDesc className="w-6 h-6 mb-2" />
              Sort Z→A
            </Button>
            <Button onClick={() => processLines('remove-duplicates')} variant="outline" className="h-20 flex-col">
              <Filter className="w-6 h-6 mb-2" />
              Remove Duplicates
            </Button>
            <Button onClick={() => processLines('remove-empty')} variant="outline" className="h-20 flex-col">
              <span className="material-icons text-xl mb-2">clear_all</span>
              Remove Empty
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button onClick={() => processLines('trim-lines')} variant="outline" className="h-20 flex-col">
              <span className="material-icons text-xl mb-2">content_cut</span>
              Trim Lines
            </Button>
            <Button onClick={() => processLines('number-lines')} variant="outline" className="h-20 flex-col">
              <span className="material-icons text-xl mb-2">format_list_numbered</span>
              Number Lines
            </Button>
            <Button onClick={() => processLines('reverse-lines')} variant="outline" className="h-20 flex-col">
              <span className="material-icons text-xl mb-2">flip</span>
              Reverse Order
            </Button>
            <Button onClick={() => processLines('shuffle-lines')} variant="outline" className="h-20 flex-col">
              <span className="material-icons text-xl mb-2">shuffle</span>
              Shuffle Lines
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="merge-split" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Merge & Split Options</CardTitle>
              <CardDescription>Configure how lines should be merged or split</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Label htmlFor="delimiter">Delimiter:</Label>
                <Input
                  id="delimiter"
                  value={delimiter}
                  onChange={(e) => setDelimiter(e.target.value)}
                  placeholder=","
                  className="w-32"
                />
                <span className="text-sm text-gray-500">Character(s) to join/split lines</span>
              </div>
              <div className="flex gap-4">
                <Button onClick={() => processLines('merge-lines')} variant="outline" className="flex-1">
                  <Merge className="w-4 h-4 mr-2" />
                  Merge Lines with Delimiter
                </Button>
                <Button onClick={() => processLines('split-lines')} variant="outline" className="flex-1">
                  <span className="material-icons text-sm mr-2">call_split</span>
                  Split by Delimiter
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Common Use Cases</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Data Cleaning</h4>
              <ul className="text-gray-600 space-y-1">
                <li>• Remove duplicate entries from lists</li>
                <li>• Clean up CSV data by removing empty lines</li>
                <li>• Trim whitespace from imported data</li>
                <li>• Sort alphabetically for better organization</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Development Tasks</h4>
              <ul className="text-gray-600 space-y-1">
                <li>• Process log files and extract unique entries</li>
                <li>• Merge configuration items with custom delimiters</li>
                <li>• Number lines for documentation or debugging</li>
                <li>• Randomize test data or sample lists</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="text-center mt-8">
        <BuyMeCoffee />
        <p className="text-sm text-gray-600 mt-2">
          Thanks for using this free tool! Your support keeps it ad-free and private.
        </p>
      </div>
    </div>
  );
}