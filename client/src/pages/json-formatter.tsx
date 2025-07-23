import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, Copy, Clipboard, RotateCcw, FileText, Minimize2 } from "lucide-react";
import BuyMeCoffee from "@/components/buy-me-coffee";

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
          <CardTitle className="flex items-center gap-3">
            <span className="material-icons tool-pink text-3xl">data_object</span>
            JSON Formatter & Validator
          </CardTitle>
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
      
      <div className="text-center mt-8">
        <BuyMeCoffee />
      </div>
    </div>
  );
}
