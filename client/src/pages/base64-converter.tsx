import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RotateCcw, Upload, Download } from "lucide-react";
import BuyMeCoffee from "@/components/buy-me-coffee";
import CopyButton from "@/components/copy-button";

export default function Base64Converter() {
  const [textInput, setTextInput] = useState("");
  const [base64Input, setBase64Input] = useState("");
  const [encodedResult, setEncodedResult] = useState("");
  const [decodedResult, setDecodedResult] = useState("");
  const [error, setError] = useState("");
  const { toast } = useToast();

  const encodeToBase64 = () => {
    try {
      if (!textInput.trim()) {
        setError("Please enter text to encode");
        return;
      }
      const encoded = btoa(unescape(encodeURIComponent(textInput)));
      setEncodedResult(encoded);
      setError("");
    } catch (err) {
      setError("Failed to encode text to Base64");
    }
  };

  const decodeFromBase64 = () => {
    try {
      if (!base64Input.trim()) {
        setError("Please enter Base64 text to decode");
        return;
      }
      const decoded = decodeURIComponent(escape(atob(base64Input)));
      setDecodedResult(decoded);
      setError("");
    } catch (err) {
      setError("Invalid Base64 string");
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        const base64 = result.split(',')[1]; // Remove data:mime;base64, prefix
        setEncodedResult(base64);
        setTextInput(`File: ${file.name} (${file.type || 'unknown type'})`);
      };
      reader.readAsDataURL(file);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied",
        description: "Text copied to clipboard successfully!"
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive"
      });
    }
  };

  const downloadAsFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    setTextInput("");
    setBase64Input("");
    setEncodedResult("");
    setDecodedResult("");
    setError("");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <span className="material-icons text-blue-600 text-3xl">code</span>
            Base64 Encoder/Decoder
          </CardTitle>
          <p className="text-gray-600">
            Encode text to Base64 or decode Base64 strings back to readable text. Supports file encoding too.
          </p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="encode" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="encode">Encode to Base64</TabsTrigger>
              <TabsTrigger value="decode">Decode from Base64</TabsTrigger>
            </TabsList>

            <TabsContent value="encode" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Text to Encode
                  </label>
                  <Textarea
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="Enter text to encode to Base64..."
                    className="min-h-32"
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={encodeToBase64} className="bg-blue-600 hover:bg-blue-700">
                    Encode to Base64
                  </Button>
                  <div className="relative">
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Button variant="outline">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload File
                    </Button>
                  </div>
                  <Button variant="outline" onClick={clearAll}>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Clear
                  </Button>
                </div>

                {encodedResult && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">
                      Base64 Result
                    </label>
                    <div className="relative">
                      <Textarea
                        value={encodedResult}
                        readOnly
                        className="min-h-32 pr-24"
                      />
                      <div className="absolute top-2 right-2 flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(encodedResult)}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => downloadAsFile(encodedResult, 'base64.txt')}
                        >
                          <Download className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="decode" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Base64 to Decode
                  </label>
                  <Textarea
                    value={base64Input}
                    onChange={(e) => setBase64Input(e.target.value)}
                    placeholder="Enter Base64 string to decode..."
                    className="min-h-32"
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={decodeFromBase64} className="bg-blue-600 hover:bg-blue-700">
                    Decode from Base64
                  </Button>
                  <Button variant="outline" onClick={clearAll}>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Clear
                  </Button>
                </div>

                {decodedResult && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">
                      Decoded Result
                    </label>
                    <div className="relative">
                      <Textarea
                        value={decodedResult}
                        readOnly
                        className="min-h-32 pr-24"
                      />
                      <div className="absolute top-2 right-2 flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(decodedResult)}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => downloadAsFile(decodedResult, 'decoded.txt')}
                        >
                          <Download className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Base64 Encoder/Decoder Features:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Encode any text to Base64 format</li>
              <li>• Decode Base64 strings back to readable text</li>
              <li>• Support for file encoding (images, documents, etc.)</li>
              <li>• UTF-8 character support for international text</li>
              <li>• Copy results to clipboard with one click</li>
              <li>• Download encoded/decoded content as files</li>
            </ul>
          </div>
        </CardContent>
      </Card>
      
      <div className="text-center mt-8">
        <BuyMeCoffee />
      </div>
    </div>
  );
}