import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, Download, RefreshCw } from "lucide-react";
import CopyButton from "@/components/copy-button";
import BuyMeCoffee from "@/components/buy-me-coffee";

type ImageFormat = "png" | "jpeg" | "webp";

export default function ImageConverter() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [outputFormat, setOutputFormat] = useState<ImageFormat>("png");
  const [quality, setQuality] = useState(90);
  const [convertedImage, setConvertedImage] = useState<string>("");
  const [originalPreview, setOriginalPreview] = useState<string>("");
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError("Please select an image file");
      return;
    }

    setSelectedFile(file);
    setError("");
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setOriginalPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const convertImage = async () => {
    if (!selectedFile || !canvasRef.current) {
      setError("Please select an image file");
      return;
    }

    setIsConverting(true);
    setError("");

    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error("Canvas context not available");

      // Load image
      const img = new Image();
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = originalPreview;
      });

      // Set canvas dimensions
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw image
      ctx.drawImage(img, 0, 0);

      // Convert to desired format
      const mimeType = `image/${outputFormat === 'jpeg' ? 'jpeg' : outputFormat}`;
      const qualityValue = outputFormat === 'png' ? undefined : quality / 100;
      
      const convertedDataUrl = canvas.toDataURL(mimeType, qualityValue);
      setConvertedImage(convertedDataUrl);

    } catch (err) {
      setError("Failed to convert image. Please try again.");
    } finally {
      setIsConverting(false);
    }
  };

  const downloadImage = () => {
    if (!convertedImage) return;

    const link = document.createElement('a');
    link.download = `converted.${outputFormat}`;
    link.href = convertedImage;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const reset = () => {
    setSelectedFile(null);
    setOriginalPreview("");
    setConvertedImage("");
    setError("");
  };

  const getFileInfo = (dataUrl: string) => {
    // Estimate file size from base64 string
    const base64Length = dataUrl.split(',')[1]?.length || 0;
    const sizeInBytes = (base64Length * 3) / 4;
    return {
      size: (sizeInBytes / 1024).toFixed(1) + ' KB'
    };
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-foreground">
            <span className="material-icons text-indigo-600 text-3xl">image</span>
            Image Format Converter
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Upload Image
              </label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="mb-4"
              />
              
              {originalPreview && (
                <div className="border border-border rounded-lg p-4 bg-muted">
                  <h4 className="font-medium text-foreground mb-2">Original Image</h4>
                  <img 
                    src={originalPreview} 
                    alt="Original" 
                    className="max-w-full h-auto max-h-48 rounded border"
                  />
                  <div className="text-sm text-muted-foreground mt-2">
                    {selectedFile?.name} ({getFileInfo(originalPreview).size})
                  </div>
                </div>
              )}
            </div>

            <div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Output Format
                  </label>
                  <Select value={outputFormat} onValueChange={(value: ImageFormat) => setOutputFormat(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="png">PNG (Lossless)</SelectItem>
                      <SelectItem value="jpeg">JPEG (Compressed)</SelectItem>
                      <SelectItem value="webp">WebP (Modern)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {(outputFormat === 'jpeg' || outputFormat === 'webp') && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Quality: {quality}%
                    </label>
                    <Input
                      type="range"
                      min="10"
                      max="100"
                      value={quality}
                      onChange={(e) => setQuality(parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    onClick={convertImage}
                    disabled={!selectedFile || isConverting}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                  >
                    {isConverting ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Converting...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Convert
                      </>
                    )}
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={reset}
                    disabled={!selectedFile}
                  >
                    Reset
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {convertedImage && (
            <div className="border border-border rounded-lg p-4 bg-muted">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-foreground">Converted Image</h4>
                <div className="flex gap-2">
                  <CopyButton 
                    text={convertedImage} 
                    label="Copy Data URL"
                    size="sm"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={downloadImage}
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                </div>
              </div>
              
              <img 
                src={convertedImage} 
                alt="Converted" 
                className="max-w-full h-auto max-h-48 rounded border"
              />
              
              <div className="text-sm text-muted-foreground mt-2">
                Format: {outputFormat.toUpperCase()} | Size: {getFileInfo(convertedImage).size}
                {(outputFormat === 'jpeg' || outputFormat === 'webp') && ` | Quality: ${quality}%`}
              </div>
            </div>
          )}

          {error && (
            <Alert>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <canvas ref={canvasRef} className="hidden" />
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