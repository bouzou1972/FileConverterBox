import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, Download, RefreshCw } from "lucide-react";
import CopyButton from "@/components/copy-button";
import BuyMeCoffee from "@/components/buy-me-coffee";
import { ToolSEO } from "@/components/tool-seo";
import { ShareButtons } from "@/components/share-buttons";
import { UsageGuide } from "@/components/usage-guide";
import { BookmarkButton } from "@/components/bookmark-button";

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

  const usageExamples = [
    {
      title: "Social Media Image Conversion",
      description: "Convert images to web-optimized formats for social platforms",
      steps: [
        "Upload your high-quality image file",
        "Select WebP format for best compression and quality",
        "Adjust quality settings if needed (80-90% recommended)",
        "Click convert to process the image",
        "Download the optimized image for web use"
      ],
      tip: "WebP format provides 25-35% better compression than JPEG"
    },
    {
      title: "Legacy System Compatibility",
      description: "Convert modern formats to JPEG for older systems",
      steps: [
        "Upload your WebP, HEIC, or PNG image",
        "Choose JPEG format for maximum compatibility",
        "Set quality to 85-95% for good balance",
        "Convert and download the compatible format",
        "Use in legacy applications or older devices"
      ]
    },
    {
      title: "Transparent Image Processing",
      description: "Convert images with transparency to appropriate formats",
      steps: [
        "Upload your image with transparent background",
        "Choose PNG to preserve transparency",
        "Or select JPEG to add white background",
        "Process the image with desired settings",
        "Download for use in your project"
      ]
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <ToolSEO
        title="Image Format Converter"
        description="Convert images between PNG, JPEG, and WebP formats with quality control. Free online image converter supporting transparency and compression."
        keywords={["image converter", "image format converter", "png to jpeg", "jpeg to webp", "webp converter", "image compression"]}
        canonicalUrl={typeof window !== 'undefined' ? window.location.href : undefined}
      />
      
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
      
      <ShareButtons 
        url={typeof window !== 'undefined' ? window.location.href : ''}
        title="Image Format Converter - Free Online Tool"
        description="Convert images between PNG, JPEG, and WebP formats with quality control and transparency support."
      />
      
      <UsageGuide 
        title="Image Format Converter Usage Guide"
        description="Learn how to effectively convert images between different formats for web optimization and compatibility"
        examples={usageExamples}
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