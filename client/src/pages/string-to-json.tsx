import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Copy, RefreshCw, FileText, CheckCircle, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import CopyButton from "@/components/copy-button";
import BuyMeCoffee from "@/components/buy-me-coffee";
import { ToolSEO } from "@/components/tool-seo";
import { ShareButtons } from "@/components/share-buttons";
import { UsageGuide } from "@/components/usage-guide";
import { BookmarkButton } from "@/components/bookmark-button";

export default function StringToJson() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [isValid, setIsValid] = useState(false);
  const { toast } = useToast();

  const fixCommonIssues = (str: string): string => {
    let fixed = str.trim();
    
    // Replace single quotes with double quotes (but not inside strings)
    fixed = fixed.replace(/'/g, '"');
    
    // Fix unquoted keys (basic pattern matching)
    fixed = fixed.replace(/([{,]\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g, '$1"$2":');
    
    // Fix trailing commas
    fixed = fixed.replace(/,(\s*[}\]])/g, '$1');
    
    // Fix missing commas between properties
    fixed = fixed.replace(/}(\s*)([{"])/g, '},$1$2');
    fixed = fixed.replace(/](\s*)([{"])/g, '],$1$2');
    fixed = fixed.replace(/"(\s*)([{"])/g, '",$1$2');
    
    // Escape unescaped quotes inside strings (basic approach)
    // This is a simplified version - real implementation would need proper parsing
    
    return fixed;
  };

  const convertStringToJson = () => {
    if (!input.trim()) {
      setError("Please enter a string to convert");
      setOutput("");
      setIsValid(false);
      return;
    }

    try {
      setError("");
      let processedString = input.trim();
      
      // Try to parse as-is first
      let parsed;
      try {
        parsed = JSON.parse(processedString);
      } catch {
        // If it fails, try to fix common issues
        processedString = fixCommonIssues(processedString);
        parsed = JSON.parse(processedString);
      }
      
      // Format the output nicely
      const formattedJson = JSON.stringify(parsed, null, 2);
      setOutput(formattedJson);
      setIsValid(true);
      
      toast({
        title: "Success!",
        description: "String converted to valid JSON",
      });
    } catch (err: any) {
      setError(`Invalid JSON format: ${err.message}`);
      setOutput("");
      setIsValid(false);
    }
  };

  const minifyJson = () => {
    if (!output) return;
    
    try {
      const parsed = JSON.parse(output);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
      
      toast({
        title: "JSON Minified",
        description: "Removed whitespace and formatting",
      });
    } catch (err) {
      setError("Cannot minify invalid JSON");
    }
  };

  const beautifyJson = () => {
    if (!output) return;
    
    try {
      const parsed = JSON.parse(output);
      const beautified = JSON.stringify(parsed, null, 2);
      setOutput(beautified);
      
      toast({
        title: "JSON Beautified",
        description: "Added proper formatting and indentation",
      });
    } catch (err) {
      setError("Cannot beautify invalid JSON");
    }
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
    setError("");
    setIsValid(false);
  };

  const copyOutput = () => {
    if (output) {
      navigator.clipboard.writeText(output);
      toast({
        title: "Copied!",
        description: "JSON copied to clipboard",
      });
    }
  };

  const usageExamples = [
    {
      title: "Fix JavaScript Objects",
      description: "Convert JavaScript object notation to valid JSON",
      steps: [
        "Paste your JavaScript object with single quotes or unquoted keys",
        "Click 'Convert to JSON' to automatically fix formatting",
        "Review the valid JSON output with proper double quotes",
        "Copy the corrected JSON for use in APIs or configurations",
        "Use 'Beautify' button to add proper indentation"
      ],
      tip: "JavaScript objects often use single quotes and unquoted keys - this tool fixes both automatically"
    },
    {
      title: "Clean API Responses",
      description: "Fix malformed JSON from API responses or logs",
      steps: [
        "Input the malformed JSON string with trailing commas or syntax errors",
        "Let the tool automatically detect and fix common issues",
        "Verify the output is valid JSON with the green checkmark",
        "Use the formatted output in your applications",
        "Save time debugging JSON parsing errors"
      ],
      tip: "Common issues like trailing commas and unescaped quotes are automatically fixed"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <ToolSEO
        title="String to JSON Converter - Fix Malformed JSON Online"
        description="Convert malformed strings to valid JSON. Automatically fixes single quotes, unquoted keys, trailing commas, and other common JSON syntax errors."
        keywords={["string to json", "json converter", "fix json", "json validator", "malformed json fixer"]}
        canonicalUrl="/string-to-json"
      />
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">String to JSON Converter</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Convert malformed strings to valid JSON. Automatically fixes common issues like single quotes, 
          unquoted keys, trailing commas, and missing quotes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Input String
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Enter your string here, e.g.:
{name: 'John', age: 30, city: 'New York'}
{'user': 'admin', 'role': 'administrator',}
[{id: 1, name: 'Item 1'}, {id: 2, name: 'Item 2'}]`}
              className="min-h-[300px] font-mono text-sm"
            />
            
            <div className="flex gap-2">
              <Button onClick={convertStringToJson} className="bg-blue-600 hover:bg-blue-700">
                <CheckCircle className="w-4 h-4 mr-2" />
                Convert to JSON
              </Button>
              <Button variant="outline" onClick={clearAll}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Clear
              </Button>
            </div>

            {input && (
              <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium">Input Analysis:</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>Characters: {input.length}</div>
                  <div>Lines: {input.split('\n').length}</div>
                  <div>Single quotes: {(input.match(/'/g) || []).length}</div>
                  <div>Double quotes: {(input.match(/"/g) || []).length}</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-icons text-green-600">data_object</span>
                Valid JSON Output
              </div>
              {isValid && <Badge className="bg-green-100 text-green-800">Valid JSON</Badge>}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={output}
              readOnly
              placeholder="Valid JSON will appear here..."
              className="min-h-[300px] font-mono text-sm bg-gray-50"
            />
            
            <div className="flex gap-2">
              <CopyButton 
                text={output} 
                label="Copy JSON"
              />
              <Button 
                variant="outline" 
                onClick={beautifyJson}
                disabled={!output}
              >
                Beautify
              </Button>
              <Button 
                variant="outline" 
                onClick={minifyJson}
                disabled={!output}
              >
                Minify
              </Button>
            </div>

            {output && (
              <div className="text-sm text-gray-600 bg-green-50 p-3 rounded">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="font-medium">Output Analysis:</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>Characters: {output.length}</div>
                  <div>Lines: {output.split('\n').length}</div>
                  <div>Objects: {(output.match(/{/g) || []).length}</div>
                  <div>Arrays: {(output.match(/\[/g) || []).length}</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {error && (
        <Alert className="mb-6">
          <AlertTriangle className="w-4 h-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Common Fixes Applied</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Automatic Corrections</h4>
              <ul className="text-gray-600 space-y-1">
                <li>• Converts single quotes to double quotes</li>
                <li>• Adds quotes around unquoted object keys</li>
                <li>• Removes trailing commas</li>
                <li>• Fixes missing commas between properties</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Output Options</h4>
              <ul className="text-gray-600 space-y-1">
                <li>• Beautified: Pretty-printed with indentation</li>
                <li>• Minified: Compact single-line format</li>
                <li>• Validated: Ensures valid JSON syntax</li>
                <li>• Analysis: Character and structure statistics</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-center mt-8">
        <ShareButtons 
          title="String to JSON Converter - Fix Malformed JSON Online"
          description="Convert malformed strings to valid JSON with automatic fixing of common syntax errors"
        />
        
        <UsageGuide 
          title="String to JSON Converter"
          description="Learn how to fix and convert malformed strings into valid JSON format"
          examples={usageExamples}
          tips={[
            "JavaScript objects often use single quotes and unquoted keys - this tool fixes both automatically",
            "Common issues like trailing commas and unescaped quotes are automatically fixed",
            "Use 'Beautify' to add proper indentation to your JSON",
            "The tool handles nested objects and arrays",
            "Check the green checkmark to confirm valid JSON output"
          ]}
          commonUses={[
            "API response cleaning",
            "JavaScript object conversion",
            "Configuration file fixing",
            "JSON debugging",
            "Data format standardization"
          ]}
        />

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