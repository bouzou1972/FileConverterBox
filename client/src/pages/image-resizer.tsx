import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Download, RefreshCw, Maximize2, Minimize2 } from "lucide-react";
import CopyButton from "@/components/copy-button";

export default function ImageResizer() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalPreview, setOriginalPreview] = useState<string>("");
  const [processedImage, setProcessedImage] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  
  // Resize settings
  const [resizeMode, setResizeMode] = useState<"pixels" | "percentage">("pixels");
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [percentage, setPercentage] = useState(50);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  
  // Compression settings
  const [quality, setQuality] = useState([80]);
  const [format, setFormat] = useState<"jpeg" | "png" | "webp">("jpeg");
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError("Please select an image file");
      return;
    }

    setSelectedFile(file);
    setError("");
    setProcessedImage("");
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setOriginalPreview(dataUrl);
      
      // Get original dimensions
      const img = new Image();
      img.onload = () => {
        setOriginalDimensions({ width: img.width, height: img.height });
        setWidth(img.width);
        setHeight(img.height);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleWidthChange = (newWidth: number) => {
    setWidth(newWidth);
    if (maintainAspectRatio && originalDimensions.width > 0) {
      const aspectRatio = originalDimensions.height / originalDimensions.width;
      setHeight(Math.round(newWidth * aspectRatio));
    }
  };

  const handleHeightChange = (newHeight: number) => {
    setHeight(newHeight);
    if (maintainAspectRatio && originalDimensions.height > 0) {
      const aspectRatio = originalDimensions.width / originalDimensions.height;
      setWidth(Math.round(newHeight * aspectRatio));
    }
  };

  const processImage = async () => {
    if (!selectedFile || !canvasRef.current || !originalPreview) {
      setError("Please select an image file");
      return;
    }

    setIsProcessing(true);
    setError("");

    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error("Canvas context not available");

      // Load original image
      const img = new Image();
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = originalPreview;
      });

      // Calculate final dimensions
      let finalWidth, finalHeight;
      
      if (resizeMode === "percentage") {
        finalWidth = Math.round(img.width * (percentage / 100));
        finalHeight = Math.round(img.height * (percentage / 100));
      } else {
        finalWidth = width;
        finalHeight = height;
      }

      // Set canvas dimensions
      canvas.width = finalWidth;
      canvas.height = finalHeight;

      // Configure canvas for better quality
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Draw resized image
      ctx.drawImage(img, 0, 0, finalWidth, finalHeight);

      // Convert to desired format and quality
      const mimeType = `image/${format}`;
      const qualityValue = format === 'png' ? undefined : quality[0] / 100;
      
      const processedDataUrl = canvas.toDataURL(mimeType, qualityValue);
      setProcessedImage(processedDataUrl);

    } catch (err) {
      setError("Failed to process image. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadImage = () => {
    if (!processedImage) return;

    const link = document.createElement('a');
    const extension = format === 'jpeg' ? 'jpg' : format;
    link.download = `resized.${extension}`;
    link.href = processedImage;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const reset = () => {
    setSelectedFile(null);
    setOriginalPreview("");
    setProcessedImage("");
    setError("");
    setOriginalDimensions({ width: 0, height: 0 });
  };

  const getFileSize = (dataUrl: string) => {
    const base64Length = dataUrl.split(',')[1]?.length || 0;
    const sizeInBytes = (base64Length * 3) / 4;
    return (sizeInBytes / 1024).toFixed(1) + ' KB';
  };

  const getCompressionRatio = () => {
    if (!originalPreview || !processedImage) return 0;
    const originalSize = (originalPreview.split(',')[1]?.length || 0) * 3 / 4;
    const processedSize = (processedImage.split(',')[1]?.length || 0) * 3 / 4;
    return originalSize > 0 ? Math.round(((originalSize - processedSize) / originalSize) * 100) : 0;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-foreground">
            <span className="material-icons text-green-600 text-3xl">photo_size_select_large</span>
            Image Resizer & Compressor
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
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
          </div>

          {originalPreview && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Settings Panel */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Maximize2 className="w-5 h-5" />
                      Resize Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Tabs value={resizeMode} onValueChange={(value) => setResizeMode(value as "pixels" | "percentage")}>
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="pixels">By Pixels</TabsTrigger>
                        <TabsTrigger value="percentage">By Percentage</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="pixels" className="space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                          <input
                            type="checkbox"
                            id="aspectRatio"
                            checked={maintainAspectRatio}
                            onChange={(e) => setMaintainAspectRatio(e.target.checked)}
                            className="rounded"
                          />
                          <label htmlFor="aspectRatio" className="text-sm text-foreground">
                            Maintain aspect ratio
                          </label>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                              Width (px)
                            </label>
                            <Input
                              type="number"
                              value={width}
                              onChange={(e) => handleWidthChange(parseInt(e.target.value) || 0)}
                              min="1"
                              max="5000"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                              Height (px)
                            </label>
                            <Input
                              type="number"
                              value={height}
                              onChange={(e) => handleHeightChange(parseInt(e.target.value) || 0)}
                              min="1"
                              max="5000"
                            />
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="percentage" className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Scale: {percentage}%
                          </label>
                          <Input
                            type="range"
                            min="10"
                            max="200"
                            value={percentage}
                            onChange={(e) => setPercentage(parseInt(e.target.value))}
                            className="w-full"
                          />
                          <div className="text-xs text-muted-foreground mt-1">
                            New size: {Math.round(originalDimensions.width * percentage / 100)} × {Math.round(originalDimensions.height * percentage / 100)} px
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Minimize2 className="w-5 h-5" />
                      Compression Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Output Format
                      </label>
                      <select
                        value={format}
                        onChange={(e) => setFormat(e.target.value as "jpeg" | "png" | "webp")}
                        className="w-full p-2 border border-border rounded-md bg-background text-foreground"
                      >
                        <option value="jpeg">JPEG (Best compression)</option>
                        <option value="png">PNG (Lossless)</option>
                        <option value="webp">WebP (Modern)</option>
                      </select>
                    </div>

                    {format !== 'png' && (
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Quality: {quality[0]}%
                        </label>
                        <Slider
                          value={quality}
                          onValueChange={setQuality}
                          max={100}
                          min={10}
                          step={5}
                          className="w-full"
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>

                <div className="flex gap-2">
                  <Button
                    onClick={processImage}
                    disabled={isProcessing}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Process Image
                      </>
                    )}
                  </Button>
                  
                  <Button variant="outline" onClick={reset}>
                    Reset
                  </Button>
                </div>
              </div>

              {/* Preview Panel */}
              <div className="space-y-4">
                <div className="border border-border rounded-lg p-4 bg-muted">
                  <h4 className="font-medium text-foreground mb-2">Original Image</h4>
                  <img 
                    src={originalPreview} 
                    alt="Original" 
                    className="max-w-full h-auto max-h-48 rounded border mb-2"
                  />
                  <div className="text-sm text-muted-foreground">
                    {originalDimensions.width} × {originalDimensions.height} px | {getFileSize(originalPreview)}
                  </div>
                </div>

                {processedImage && (
                  <div className="border border-border rounded-lg p-4 bg-muted">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-foreground">Processed Image</h4>
                      <div className="flex gap-2">
                        <CopyButton 
                          text={processedImage} 
                          label="Copy"
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
                      src={processedImage} 
                      alt="Processed" 
                      className="max-w-full h-auto max-h-48 rounded border mb-2"
                    />
                    
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div>
                        {resizeMode === "pixels" ? `${width} × ${height}` : `${Math.round(originalDimensions.width * percentage / 100)} × ${Math.round(originalDimensions.height * percentage / 100)}`} px
                      </div>
                      <div>Size: {getFileSize(processedImage)}</div>
                      <div className="text-green-600">
                        {getCompressionRatio()}% size reduction
                      </div>
                    </div>
                  </div>
                )}
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
    </div>
  );
}