import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Copy, Download, Upload, Minimize2, Maximize2, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import BuyMeCoffee from "@/components/buy-me-coffee";

export default function WhitespaceToolPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [options, setOptions] = useState({
    trimLines: true,
    removeEmptyLines: false,
    normalizeSpaces: true,
    tabsToSpaces: true,
    spacesToTabs: false,
    indentSize: 2,
    removeTrailingSpaces: true,
    normalizeLineEndings: true
  });
  const { toast } = useToast();

  const processText = () => {
    if (!input.trim()) {
      toast({
        title: "Error",
        description: "Please enter some text to process",
        variant: "destructive",
      });
      return;
    }

    let result = input;

    // Normalize line endings first
    if (options.normalizeLineEndings) {
      result = result.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    }

    // Split into lines for processing
    let lines = result.split('\n');

    // Process each line
    lines = lines.map(line => {
      let processedLine = line;

      // Trim line ends
      if (options.trimLines) {
        processedLine = processedLine.trim();
      }

      // Remove trailing spaces only
      if (options.removeTrailingSpaces && !options.trimLines) {
        processedLine = processedLine.replace(/\s+$/, '');
      }

      // Normalize multiple spaces to single space
      if (options.normalizeSpaces) {
        processedLine = processedLine.replace(/[ \t]+/g, ' ');
      }

      // Convert tabs to spaces
      if (options.tabsToSpaces && !options.spacesToTabs) {
        const spaces = ' '.repeat(options.indentSize);
        processedLine = processedLine.replace(/\t/g, spaces);
      }

      // Convert spaces to tabs (at line beginning only to preserve formatting)
      if (options.spacesToTabs && !options.tabsToSpaces) {
        const leadingSpaces = processedLine.match(/^( +)/);
        if (leadingSpaces) {
          const spaceCount = leadingSpaces[1].length;
          const tabCount = Math.floor(spaceCount / options.indentSize);
          const remainingSpaces = spaceCount % options.indentSize;
          processedLine = '\t'.repeat(tabCount) + ' '.repeat(remainingSpaces) + processedLine.slice(spaceCount);
        }
      }

      return processedLine;
    });

    // Remove empty lines if requested
    if (options.removeEmptyLines) {
      lines = lines.filter(line => line.trim() !== '');
    }

    const processed = lines.join('\n');
    setOutput(processed);

    toast({
      title: "Success",
      description: "Text whitespace normalized successfully",
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Text copied to clipboard",
    });
  };

  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
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
    const emptyLines = lines.filter(line => line.trim() === '').length;
    const trailingSpaces = lines.filter(line => line.endsWith(' ') || line.endsWith('\t')).length;
    const tabs = (text.match(/\t/g) || []).length;
    const multipleSpaces = (text.match(/  +/g) || []).length;

    return {
      totalLines: lines.length,
      emptyLines,
      trailingSpaces,
      tabs,
      multipleSpaces,
      characters: text.length
    };
  };

  const inputStats = getStats(input);
  const outputStats = getStats(output);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Whitespace & Indentation Tool</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Clean up messy text formatting by normalizing whitespace, fixing indentation, and removing unwanted spaces. Perfect for code cleanup and text processing.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="material-icons text-blue-600">text_snippet</span>
              Input Text
            </CardTitle>
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
                accept=".txt,.js,.css,.html,.json,.xml,.csv,.md"
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste your messy text here...
    This   text    has
        irregular   spacing
        and     mixed   tabs...
  "
              className="min-h-[300px] font-mono text-sm"
            />
            {input && (
              <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                <div className="grid grid-cols-2 gap-2">
                  <div>Lines: {inputStats.totalLines}</div>
                  <div>Empty: {inputStats.emptyLines}</div>
                  <div>Trailing spaces: {inputStats.trailingSpaces}</div>
                  <div>Tabs: {inputStats.tabs}</div>
                  <div>Multiple spaces: {inputStats.multipleSpaces}</div>
                  <div>Characters: {inputStats.characters}</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="material-icons text-green-600">auto_fix_high</span>
              Cleaned Output
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => copyToClipboard(output)} disabled={!output}>
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
              <Button variant="outline" size="sm" onClick={() => downloadFile(output, "cleaned.txt")} disabled={!output}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
            <Textarea
              value={output}
              readOnly
              placeholder="Cleaned text will appear here..."
              className="min-h-[300px] font-mono text-sm bg-gray-50"
            />
            {output && (
              <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                <div className="grid grid-cols-2 gap-2">
                  <div>Lines: {outputStats.totalLines}</div>
                  <div>Empty: {outputStats.emptyLines}</div>
                  <div>Trailing spaces: {outputStats.trailingSpaces}</div>
                  <div>Tabs: {outputStats.tabs}</div>
                  <div>Multiple spaces: {outputStats.multipleSpaces}</div>
                  <div>Characters: {outputStats.characters}</div>
                </div>
                {input && (
                  <div className="mt-2 pt-2 border-t">
                    <Badge variant="outline" className="text-green-600">
                      {outputStats.characters < inputStats.characters ? 
                        `Reduced by ${inputStats.characters - outputStats.characters} chars` :
                        'Text processed'
                      }
                    </Badge>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Processing Options</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="trimLines"
                  checked={options.trimLines}
                  onCheckedChange={(checked) => setOptions(prev => ({ ...prev, trimLines: checked }))}
                />
                <Label htmlFor="trimLines">Trim line beginnings and ends</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="removeTrailingSpaces"
                  checked={options.removeTrailingSpaces}
                  onCheckedChange={(checked) => setOptions(prev => ({ ...prev, removeTrailingSpaces: checked }))}
                />
                <Label htmlFor="removeTrailingSpaces">Remove trailing spaces only</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="normalizeSpaces"
                  checked={options.normalizeSpaces}
                  onCheckedChange={(checked) => setOptions(prev => ({ ...prev, normalizeSpaces: checked }))}
                />
                <Label htmlFor="normalizeSpaces">Normalize multiple spaces to single</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="removeEmptyLines"
                  checked={options.removeEmptyLines}
                  onCheckedChange={(checked) => setOptions(prev => ({ ...prev, removeEmptyLines: checked }))}
                />
                <Label htmlFor="removeEmptyLines">Remove empty lines</Label>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="tabsToSpaces"
                  checked={options.tabsToSpaces}
                  onCheckedChange={(checked) => setOptions(prev => ({ 
                    ...prev, 
                    tabsToSpaces: checked,
                    spacesToTabs: checked ? false : prev.spacesToTabs 
                  }))}
                />
                <Label htmlFor="tabsToSpaces">Convert tabs to spaces</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="spacesToTabs"
                  checked={options.spacesToTabs}
                  onCheckedChange={(checked) => setOptions(prev => ({ 
                    ...prev, 
                    spacesToTabs: checked,
                    tabsToSpaces: checked ? false : prev.tabsToSpaces 
                  }))}
                />
                <Label htmlFor="spacesToTabs">Convert leading spaces to tabs</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="normalizeLineEndings"
                  checked={options.normalizeLineEndings}
                  onCheckedChange={(checked) => setOptions(prev => ({ ...prev, normalizeLineEndings: checked }))}
                />
                <Label htmlFor="normalizeLineEndings">Normalize line endings (LF)</Label>
              </div>

              <div className="flex items-center space-x-2 gap-4">
                <Label htmlFor="indentSize">Indent size:</Label>
                <Input
                  id="indentSize"
                  type="number"
                  min="1"
                  max="8"
                  value={options.indentSize}
                  onChange={(e) => setOptions(prev => ({ ...prev, indentSize: parseInt(e.target.value) || 2 }))}
                  className="w-20"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button onClick={processText} size="lg" className="px-8">
          <Sparkles className="w-4 h-4 mr-2" />
          Clean Whitespace
        </Button>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Common Use Cases</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Code Cleanup</h4>
              <ul className="text-gray-600 space-y-1">
                <li>• Fix inconsistent indentation in source code</li>
                <li>• Convert between tabs and spaces</li>
                <li>• Remove trailing whitespace</li>
                <li>• Normalize mixed line endings</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Text Processing</h4>
              <ul className="text-gray-600 space-y-1">
                <li>• Clean copy-pasted content from websites</li>
                <li>• Remove extra spaces in documents</li>
                <li>• Format CSV or data files</li>
                <li>• Prepare text for further processing</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="text-center mt-8">
        <div className="mb-4">
          <p className="text-lg font-medium text-foreground mb-1">💛 Like these tools?</p>
          <p className="text-muted-foreground">Help support future development</p>
        </div>
        <BuyMeCoffee />
        <p className="text-sm text-gray-600 mt-2">
          Thanks for using this free tool! Your support keeps it ad-free and private.
        </p>
      </div>
    </div>
  );
}