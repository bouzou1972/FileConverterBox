import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, Copy, Clipboard, RotateCcw, FileText, Minimize2 } from "lucide-react";
import BuyMeCoffee from "@/components/buy-me-coffee";
import { ToolSEO } from "@/components/tool-seo";
import { ShareButtons } from "@/components/share-buttons";
import { UsageGuide } from "@/components/usage-guide";
import { BookmarkButton } from "@/components/bookmark-button";

export default function JsonFormatter() {
  const [inputJson, setInputJson] = useState("");
  const [outputJson, setOutputJson] = useState("");
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: "" });
  const { toast } = useToast();

  const formatJSON = () => {
    if (!inputJson.trim()) {
      setStatus({ type: 'error', message: 'Please enter some JSON to format' });
      return;
    }

    try {
      const parsed = JSON.parse(inputJson);
      const formatted = JSON.stringify(parsed, null, 2);
      setOutputJson(formatted);
      setStatus({ type: 'success', message: 'Valid JSON formatted successfully' });
    } catch (error) {
      setStatus({ type: 'error', message: `Invalid JSON: ${(error as Error).message}` });
      setOutputJson("");
    }
  };

  const minifyJSON = () => {
    if (!inputJson.trim()) {
      setStatus({ type: 'error', message: 'Please enter some JSON to minify' });
      return;
    }

    try {
      const parsed = JSON.parse(inputJson);
      const minified = JSON.stringify(parsed);
      setOutputJson(minified);
      setStatus({ type: 'success', message: 'JSON minified successfully' });
    } catch (error) {
      setStatus({ type: 'error', message: `Invalid JSON: ${(error as Error).message}` });
      setOutputJson("");
    }
  };

  const validateJSON = () => {
    if (!inputJson.trim()) {
      setStatus({ type: 'error', message: 'Please enter some JSON to validate' });
      return;
    }

    try {
      JSON.parse(inputJson);
      setStatus({ type: 'success', message: '✓ Valid JSON' });
    } catch (error) {
      setStatus({ type: 'error', message: `✗ Invalid JSON: ${(error as Error).message}` });
    }
  };

  const copyToClipboard = () => {
    if (outputJson) {
      navigator.clipboard.writeText(outputJson);
      toast({
        title: "Copied",
        description: "JSON copied to clipboard!"
      });
    }
  };

  const pasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInputJson(text);
      toast({
        title: "Pasted",
        description: "Content pasted from clipboard!"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to read from clipboard",
        variant: "destructive"
      });
    }
  };

  const clearAll = () => {
    setInputJson("");
    setOutputJson("");
    setStatus({ type: null, message: "" });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle className="flex items-center gap-3">
              <span className="material-icons tool-pink text-3xl">data_object</span>
              JSON Formatter & Validator
            </CardTitle>
            <BookmarkButton 
              href="/json-formatter"
              title="JSON Formatter"
              icon="data_object"
              iconColor="text-indigo-600"
              description="Format, validate, and minify JSON data with syntax highlighting and error detection"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-700">Raw JSON Input</label>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={pasteFromClipboard}
                  >
                    <Clipboard className="w-4 h-4 mr-1" />
                    Paste
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearAll}
                  >
                    <RotateCcw className="w-4 h-4 mr-1" />
                    Clear
                  </Button>
                </div>
              </div>
              
              <Textarea
                value={inputJson}
                onChange={(e) => setInputJson(e.target.value)}
                placeholder='{"name": "John", "age": 30, "city": "New York"}'
                className="h-80 font-mono text-sm resize-none"
              />
              
              <div className="flex gap-2">
                <Button
                  onClick={formatJSON}
                  className="bg-pink-500 hover:bg-pink-600"
                >
                  <FileText className="w-4 h-4 mr-1" />
                  Format
                </Button>
                <Button
                  onClick={minifyJSON}
                  variant="secondary"
                >
                  <Minimize2 className="w-4 h-4 mr-1" />
                  Minify
                </Button>
                <Button
                  onClick={validateJSON}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Validate
                </Button>
              </div>
            </div>

            {/* Output Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-700">Formatted Output</label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyToClipboard}
                  disabled={!outputJson}
                >
                  <Copy className="w-4 h-4 mr-1" />
                  Copy
                </Button>
              </div>
              
              <div className="relative">
                <Textarea
                  value={outputJson}
                  readOnly
                  className="h-80 font-mono text-sm bg-gray-50 resize-none"
                  placeholder="Formatted JSON will appear here..."
                />
              </div>
              
              {status.type && (
                <Alert variant={status.type === 'error' ? 'destructive' : 'default'}>
                  <div className="flex items-center gap-2">
                    {status.type === 'success' ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <XCircle className="w-4 h-4" />
                    )}
                    <AlertDescription>{status.message}</AlertDescription>
                  </div>
                </Alert>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <ShareButtons 
        url={typeof window !== 'undefined' ? window.location.href : ''}
        title="JSON Formatter - Free JSON Validator & Beautifier"
        description="Format, validate, and minify JSON data with instant error detection and syntax highlighting."
      />
      
      <UsageGuide 
        title="JSON Formatter Usage Guide"
        description="Learn how to effectively format, validate, and minify JSON data for development and debugging"
        examples={[
          {
            title: "API Response Formatting",
            description: "Clean up and format JSON responses from APIs",
            steps: [
              "Copy JSON response from your API testing tool",
              "Paste into the input field",
              "Click 'Format JSON' to beautify the output",
              "Use formatted JSON for documentation or debugging",
              "Copy the clean result to clipboard"
            ],
            tip: "Properly formatted JSON is easier to read and debug"
          },
          {
            title: "JSON Data Validation",
            description: "Validate JSON syntax and structure before using in applications",
            steps: [
              "Paste your JSON data into the formatter",
              "Click 'Validate JSON' to check for syntax errors",
              "Review error messages if validation fails",
              "Fix syntax issues based on error details",
              "Revalidate until JSON is properly formatted"
            ]
          },
          {
            title: "Code Minification",
            description: "Reduce JSON file size for production use",
            steps: [
              "Input your formatted JSON data",
              "Click 'Minify JSON' to remove unnecessary whitespace",
              "Copy the compressed output",
              "Use minified JSON in production applications",
              "Save bandwidth and improve loading times"
            ]
          }
        ]}
      />

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
