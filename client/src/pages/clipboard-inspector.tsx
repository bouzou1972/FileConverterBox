import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Clipboard, Trash2, Eye, Info, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import CopyButton from "@/components/copy-button";
import BuyMeCoffee from "@/components/buy-me-coffee";

export default function ClipboardInspector() {
  const [clipboardContent, setClipboardContent] = useState("");
  const [lastRead, setLastRead] = useState<Date | null>(null);
  const [isSupported, setIsSupported] = useState(true);
  const [error, setError] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    // Check if clipboard API is supported
    setIsSupported(!!navigator.clipboard?.readText);
  }, []);

  const readClipboard = async () => {
    if (!isSupported) {
      setError("Clipboard API not supported in this browser");
      return;
    }

    try {
      setError("");
      const text = await navigator.clipboard.readText();
      setClipboardContent(text);
      setLastRead(new Date());
      
      toast({
        title: "Clipboard Read",
        description: `Found ${text.length} characters`,
      });
    } catch (err: any) {
      setError(`Failed to read clipboard: ${err.message}. You may need to grant clipboard permissions.`);
      
      // Fallback: Ask user to paste manually
      const fallbackText = prompt("Paste your clipboard content here:");
      if (fallbackText !== null) {
        setClipboardContent(fallbackText);
        setLastRead(new Date());
      }
    }
  };

  const clearClipboard = async () => {
    try {
      await navigator.clipboard.writeText("");
      setClipboardContent("");
      setLastRead(new Date());
      
      toast({
        title: "Clipboard Cleared",
        description: "Clipboard has been emptied",
      });
    } catch (err: any) {
      setError(`Failed to clear clipboard: ${err.message}`);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Text copied to clipboard",
      });
    } catch (err: any) {
      setError(`Failed to copy: ${err.message}`);
    }
  };

  const analyzeContent = () => {
    if (!clipboardContent) return null;

    const lines = clipboardContent.split('\n');
    const words = clipboardContent.trim().split(/\s+/).length;
    const chars = clipboardContent.length;
    
    // Detect content type
    let contentType = "Plain Text";
    if (clipboardContent.trim().startsWith('<') && clipboardContent.trim().endsWith('>')) {
      contentType = "HTML";
    } else if (clipboardContent.trim().startsWith('{') || clipboardContent.trim().startsWith('[')) {
      contentType = "JSON";
    } else if (clipboardContent.includes('\t') && lines.length > 1) {
      contentType = "Tabular Data";
    } else if (clipboardContent.match(/^https?:\/\//)) {
      contentType = "URL";
    } else if (clipboardContent.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
      contentType = "Email";
    }

    // Detect special characters
    const specialChars = clipboardContent.match(/[^\x20-\x7E]/g) || [];
    const uniqueSpecialChars = [...new Set(specialChars)];

    // Detect whitespace types
    const hasSpaces = clipboardContent.includes(' ');
    const hasTabs = clipboardContent.includes('\t');
    const hasLineBreaks = clipboardContent.includes('\n');
    const hasCarriageReturns = clipboardContent.includes('\r');

    return {
      contentType,
      lines: lines.length,
      words,
      chars,
      specialChars: uniqueSpecialChars,
      whitespace: {
        spaces: hasSpaces,
        tabs: hasTabs,
        lineBreaks: hasLineBreaks,
        carriageReturns: hasCarriageReturns
      }
    };
  };

  const analysis = analyzeContent();

  const showHiddenCharacters = () => {
    return clipboardContent
      .replace(/ /g, '·')
      .replace(/\t/g, '→')
      .replace(/\n/g, '↵\n')
      .replace(/\r/g, '⏎');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Clipboard Inspector</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          View, analyze, and manage your clipboard content. See hidden formatting, special characters, 
          and detailed content analysis. Clear clipboard or copy specific content.
        </p>
      </div>

      {!isSupported && (
        <Alert className="mb-6">
          <Info className="w-4 h-4" />
          <AlertDescription>
            Clipboard API not supported. You can still paste content manually for analysis.
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clipboard className="w-5 h-5" />
                  Clipboard Content
                </div>
                {lastRead && (
                  <Badge variant="outline" className="text-xs">
                    Read at {lastRead.toLocaleTimeString()}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2 mb-4">
                <Button onClick={readClipboard} className="bg-blue-600 hover:bg-blue-700">
                  <Clipboard className="w-4 h-4 mr-2" />
                  Read Clipboard
                </Button>
                <Button 
                  variant="outline" 
                  onClick={clearClipboard}
                  disabled={!clipboardContent}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear Clipboard
                </Button>
                <CopyButton text={clipboardContent} label="Copy Content" />
              </div>

              <Textarea
                value={clipboardContent}
                onChange={(e) => setClipboardContent(e.target.value)}
                placeholder="Clipboard content will appear here, or paste manually..."
                className="min-h-[300px] font-mono text-sm"
              />

              {clipboardContent && (
                <div className="border rounded p-4 bg-gray-50">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Hidden Characters View
                  </h4>
                  <div className="font-mono text-sm bg-white p-3 rounded border max-h-32 overflow-auto">
                    {showHiddenCharacters()}
                  </div>
                  <div className="text-xs text-gray-600 mt-2">
                    · = space, → = tab, ↵ = line break, ⏎ = carriage return
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          {analysis && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Content Analysis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 gap-3 text-sm">
                    <div className="bg-blue-50 p-3 rounded">
                      <div className="font-semibold text-blue-900">Content Type</div>
                      <div className="text-blue-600">{analysis.contentType}</div>
                    </div>
                    <div className="bg-green-50 p-3 rounded">
                      <div className="font-semibold text-green-900">Characters</div>
                      <div className="text-green-600">{analysis.chars.toLocaleString()}</div>
                    </div>
                    <div className="bg-purple-50 p-3 rounded">
                      <div className="font-semibold text-purple-900">Words</div>
                      <div className="text-purple-600">{analysis.words.toLocaleString()}</div>
                    </div>
                    <div className="bg-orange-50 p-3 rounded">
                      <div className="font-semibold text-orange-900">Lines</div>
                      <div className="text-orange-600">{analysis.lines.toLocaleString()}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Whitespace Analysis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-sm space-y-1">
                    {Object.entries(analysis.whitespace).map(([type, present]) => (
                      <div key={type} className="flex justify-between">
                        <span className="capitalize">{type.replace(/([A-Z])/g, ' $1')}:</span>
                        <Badge variant={present ? "default" : "outline"}>
                          {present ? "Present" : "None"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {analysis.specialChars.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Special Characters</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-sm">
                        Found {analysis.specialChars.length} unique special character(s):
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {analysis.specialChars.map((char, index) => (
                          <Badge 
                            key={index} 
                            variant="outline" 
                            className="font-mono cursor-pointer"
                            onClick={() => copyToClipboard(char)}
                            title={`Click to copy: ${char} (U+${char.charCodeAt(0).toString(16).toUpperCase()})`}
                          >
                            {char}
                          </Badge>
                        ))}
                      </div>
                      <div className="text-xs text-gray-500">
                        Click any character to copy it
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start"
                onClick={() => copyToClipboard(clipboardContent.replace(/\s+/g, ' '))}
                disabled={!clipboardContent}
              >
                Copy Normalized (single spaces)
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start"
                onClick={() => copyToClipboard(clipboardContent.replace(/[^\x20-\x7E]/g, ''))}
                disabled={!clipboardContent}
              >
                Copy ASCII Only
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start"
                onClick={() => copyToClipboard(clipboardContent.trim())}
                disabled={!clipboardContent}
              >
                Copy Trimmed
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Features & Security</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Analysis Features</h4>
              <ul className="text-gray-600 space-y-1">
                <li>• Detect content type (HTML, JSON, URLs, etc.)</li>
                <li>• Count characters, words, and lines</li>
                <li>• Show hidden whitespace characters</li>
                <li>• Identify special Unicode characters</li>
                <li>• Analyze whitespace composition</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Privacy & Security</h4>
              <ul className="text-gray-600 space-y-1">
                <li>• All processing happens locally in browser</li>
                <li>• No data sent to servers or stored</li>
                <li>• Requires clipboard permission in browser</li>
                <li>• Can clear clipboard for security</li>
                <li>• Manual paste fallback available</li>
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