import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Copy, Download, Upload, Image as ImageIcon, Trash2 } from "lucide-react";
import BuyMeCoffee from "@/components/buy-me-coffee";
import { useToast } from "@/hooks/use-toast";

export default function ImageToBase64() {
  const [base64Output, setBase64Output] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const [mimeType, setMimeType] = useState("");
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError("Please select a valid image file (PNG, JPG, GIF, SVG, WebP, etc.)");
      return;
    }

    // Check file size (limit to 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB");
      return;
    }

    setError("");
    setFileName(file.name);
    setFileSize(file.size);
    setMimeType(file.type);

    const reader = new FileReader();
    
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setBase64Output(result);
      setImagePreview(result);
      
      toast({
        title: "Success",
        description: "Image converted to Base64 successfully",
      });
    };

    reader.onerror = () => {
      setError("Error reading the file. Please try again.");
    };

    reader.readAsDataURL(file);
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: `${type} copied to clipboard`,
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

  const clearAll = () => {
    setBase64Output("");
    setImagePreview(null);
    setFileName("");
    setFileSize(0);
    setMimeType("");
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getDataUrlOnly = () => {
    return base64Output;
  };

  const getBase64Only = () => {
    return base64Output.split(',')[1] || '';
  };

  const getHtmlImgTag = () => {
    return `<img src="${base64Output}" alt="${fileName}" />`;
  };

  const getCssBackgroundImage = () => {
    return `background-image: url(${base64Output});`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Image to Base64 Converter</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Convert images to Base64 encoded strings for embedding in HTML, CSS, or applications. All processing happens locally in your browser.
        </p>
      </div>

      {error && (
        <Alert className="mb-6 border-red-200 bg-red-50">
          <AlertDescription className="text-red-700">{error}</AlertDescription>
        </Alert>
      )}

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-blue-600" />
            Upload Image
          </CardTitle>
          <CardDescription>Select an image file to convert to Base64 format</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button 
              onClick={() => fileInputRef.current?.click()} 
              className="flex-1"
              variant={base64Output ? "outline" : "default"}
            >
              <Upload className="w-4 h-4 mr-2" />
              Choose Image File
            </Button>
            {base64Output && (
              <Button onClick={clearAll} variant="outline">
                <Trash2 className="w-4 h-4 mr-2" />
                Clear
              </Button>
            )}
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />

          {!imagePreview && (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
              <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">Drop an image file here or click to browse</p>
              <p className="text-sm text-gray-400">Supports PNG, JPG, GIF, SVG, WebP (max 10MB)</p>
            </div>
          )}

          {imagePreview && (
            <div className="space-y-4">
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-medium">File:</span> {fileName}
                  </div>
                  <div>
                    <span className="font-medium">Size:</span> {formatFileSize(fileSize)}
                  </div>
                  <div>
                    <span className="font-medium">Type:</span> {mimeType}
                  </div>
                  <div>
                    <span className="font-medium">Base64 Size:</span> {formatFileSize(base64Output.length)}
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="max-w-full max-h-64 mx-auto rounded border"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="text-center mt-8">
        <BuyMeCoffee />
      </div>

      {base64Output && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Complete Data URL</span>
                <Button variant="outline" size="sm" onClick={() => copyToClipboard(getDataUrlOnly(), "Data URL")}>
                  <Copy className="w-4 h-4" />
                </Button>
              </CardTitle>
              <CardDescription>Full data URL with MIME type (ready to use in src attributes)</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={getDataUrlOnly()}
                readOnly
                className="min-h-[120px] font-mono text-xs bg-gray-50"
              />
            </CardContent>
          </Card>
      
      <div className="text-center mt-8">
        <BuyMeCoffee />
      </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Base64 String Only</span>
                <Button variant="outline" size="sm" onClick={() => copyToClipboard(getBase64Only(), "Base64 string")}>
                  <Copy className="w-4 h-4" />
                </Button>
              </CardTitle>
              <CardDescription>Just the Base64 encoded data without the data URL prefix</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={getBase64Only()}
                readOnly
                className="min-h-[120px] font-mono text-xs bg-gray-50"
              />
            </CardContent>
          </Card>
      
      <div className="text-center mt-8">
        <BuyMeCoffee />
      </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>HTML Image Tag</span>
                  <Button variant="outline" size="sm" onClick={() => copyToClipboard(getHtmlImgTag(), "HTML tag")}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </CardTitle>
                <CardDescription>Ready-to-use HTML img element</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={getHtmlImgTag()}
                  readOnly
                  className="min-h-[80px] font-mono text-xs bg-gray-50"
                />
              </CardContent>
            </Card>
      
      <div className="text-center mt-8">
        <BuyMeCoffee />
      </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>CSS Background Image</span>
                  <Button variant="outline" size="sm" onClick={() => copyToClipboard(getCssBackgroundImage(), "CSS property")}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </CardTitle>
                <CardDescription>CSS property for background images</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={getCssBackgroundImage()}
                  readOnly
                  className="min-h-[80px] font-mono text-xs bg-gray-50"
                />
              </CardContent>
            </Card>
      
      <div className="text-center mt-8">
        <BuyMeCoffee />
      </div>
          </div>

          <div className="flex gap-4">
            <Button onClick={() => downloadFile(getDataUrlOnly(), `${fileName}_dataurl.txt`)} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download Data URL
            </Button>
            <Button onClick={() => downloadFile(getBase64Only(), `${fileName}_base64.txt`)} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download Base64
            </Button>
          </div>
        </div>
      )}

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Common Use Cases</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Web Development</h4>
              <ul className="text-gray-600 space-y-1">
                <li>• Embed small images directly in HTML/CSS</li>
                <li>• Reduce HTTP requests for icons and logos</li>
                <li>• Include images in email templates</li>
                <li>• Store images in JSON or database as text</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Applications</h4>
              <ul className="text-gray-600 space-y-1">
                <li>• Mobile app development (React Native, Flutter)</li>
                <li>• Offline applications and PWAs</li>
                <li>• API responses with embedded images</li>
                <li>• Documentation with inline screenshots</li>
              </ul>
            </div>
          </div>
          <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> Base64 encoded images are ~33% larger than the original file. 
              Use this for small images or when you need to embed images directly in code/markup.
            </p>
          </div>
        </CardContent>
      </Card>
      
      <div className="text-center mt-8">
        <BuyMeCoffee />
      </div>
    </div>
  );
}