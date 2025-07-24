import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Upload, Download, Image as ImageIcon, Zap, FileImage } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ToolSEO } from "@/components/tool-seo";
import { ShareButtons } from "@/components/share-buttons";
import { UsageGuide } from "@/components/usage-guide";
import { BookmarkButton } from "@/components/bookmark-button";

export default function ImageOptimizer() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalPreview, setOriginalPreview] = useState<string>("");
  const [optimizedPreview, setOptimizedPreview] = useState<string>("");
  const [quality, setQuality] = useState([80]);
  const [maxWidth, setMaxWidth] = useState([1920]);
  const [maxHeight, setMaxHeight] = useState([1080]);
  const [originalSize, setOriginalSize] = useState(0);
  const [optimizedSize, setOptimizedSize] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const calculateSavings = (): { percentage: number; bytes: number } => {
    if (originalSize === 0 || optimizedSize === 0) return { percentage: 0, bytes: 0 };
    const savings = originalSize - optimizedSize;
    const percentage = (savings / originalSize) * 100;
    return { percentage: Math.max(0, percentage), bytes: Math.max(0, savings) };
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Please select a valid image file",
        variant: "destructive",
      });
      return;
    }

    setOriginalFile(file);
    setOriginalSize(file.size);
    setOptimizedPreview("");
    setOptimizedSize(0);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setOriginalPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    toast({
      title: "Image Loaded",
      description: `File: ${file.name} (${formatFileSize(file.size)})`,
    });
  };

  const optimizeImage = async () => {
    if (!originalFile || !canvasRef.current) return;

    setIsProcessing(true);
    
    try {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext('2d')!;

        // Calculate new dimensions
        let { width, height } = img;
        const maxW = maxWidth[0];
        const maxH = maxHeight[0];

        if (width > maxW || height > maxH) {
          const ratio = Math.min(maxW / width, maxH / height);
          width *= ratio;
          height *= ratio;
        }

        // Set canvas dimensions
        canvas.width = width;
        canvas.height = height;

        // Draw image
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to blob
        canvas.toBlob((blob) => {
          if (blob) {
            setOptimizedSize(blob.size);
            const url = URL.createObjectURL(blob);
            setOptimizedPreview(url);
            
            const savings = calculateSavings();
            toast({
              title: "Optimization Complete",
              description: `Saved ${formatFileSize(originalSize - blob.size)} (${savings.percentage.toFixed(1)}%)`,
            });
          }
          setIsProcessing(false);
        }, originalFile.type, quality[0] / 100);
      };

      img.onerror = () => {
        toast({
          title: "Error",
          description: "Failed to load image",
          variant: "destructive",
        });
        setIsProcessing(false);
      };

      img.src = originalPreview;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to optimize image",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  const downloadOptimized = () => {
    if (!canvasRef.current || !originalFile) return;

    canvasRef.current.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `optimized-${originalFile.name}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        toast({
          title: "Downloaded",
          description: "Optimized image saved successfully!",
        });
      }
    }, originalFile.type, quality[0] / 100);
  };

  const resetOptimizer = () => {
    setOriginalFile(null);
    setOriginalPreview("");
    setOptimizedPreview("");
    setOriginalSize(0);
    setOptimizedSize(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const savings = calculateSavings();

  const usageExamples = [
    {
      title: "Website Image Optimization",
      description: "Optimize images for faster website loading",
      steps: [
        "Upload your high-resolution website images",
        "Set quality to 80-85% for good balance of size and quality",
        "Resize to maximum 1920px width for desktop displays",
        "Download optimized images for web use",
        "Test loading speeds and adjust quality if needed"
      ],
      tip: "80% quality usually provides the best balance for web images"
    },
    {
      title: "Social Media Preparation",
      description: "Reduce file sizes for social media uploads",
      steps: [
        "Upload your original high-quality images",
        "Set max width to 1080px for Instagram/Facebook",
        "Use 75-80% quality for good compression",
        "Download and upload to social platforms",
        "Check how images appear after platform compression"
      ],
      tip: "Social platforms often compress further, so start with good quality"
    },
    {
      title: "Email Attachments",
      description: "Compress images to fit email size limits",
      steps: [
        "Select images that are too large for email",
        "Reduce quality to 60-70% and resize significantly",
        "Aim for files under 1MB each for email compatibility",
        "Download compressed versions for email attachment"
      ]
    }
  ];

  const proTips = [
    "JPEG format works best for photos, PNG for graphics with transparency",
    "Always keep original files as backups before optimizing",
    "Test different quality settings to find the sweet spot for your use case",
    "Resize images to their display size rather than just compressing",
    "Preview optimized images at actual size to check quality loss",
    "Batch process similar images with the same settings for consistency"
  ];

  const bestPractices = [
    "Always work with copies - never compress your original files",
    "Choose quality based on final use: 90%+ for print, 70-85% for web",
    "Resize images to their actual display dimensions first",
    "Use appropriate formats: JPEG for photos, PNG for graphics",
    "Test optimized images in their intended context",
    "Monitor file size vs quality trade-offs carefully",
    "Keep originals in a separate folder as backups"
  ];

  const commonUses = [
    "Website optimization",
    "Social media posts",
    "Email attachments",
    "Mobile app assets",
    "Blog images",
    "Product photos",
    "Portfolio galleries",
    "Document illustrations"
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <ToolSEO
        title="Image Optimizer"
        description="Compress and resize images while preserving quality. Free online image optimizer with customizable quality settings and size reduction."
        keywords={["image optimizer", "image compressor", "resize images", "reduce image size", "compress photos online"]}
        canonicalUrl={window.location.href}
      />
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
            <Zap className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Image Optimizer</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">Compress images while preserving quality</p>
          </div>
          <BookmarkButton 
            href="/image-optimizer"
            title="Image Optimizer"
            icon="image"
            iconColor="text-purple-600"
            description="Compress and resize images while maintaining visual quality with customizable settings and format support"
          />
        </div>
        <div className="flex flex-wrap gap-2 justify-center">
          <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
            Lossless & Lossy
          </Badge>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
            Resize & Compress
          </Badge>
          <Badge variant="secondary" className="bg-purple-100 text-purple-800 border-purple-200">
            100% Local
          </Badge>
        </div>
      </div>

      {/* File Upload */}
      {!originalFile && (
        <Card>
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full">
                  <Upload className="w-12 h-12 text-gray-400" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Upload Image</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Select a JPEG, PNG, or WebP image to optimize
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Button 
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Choose Image
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Optimization Interface */}
      {originalFile && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Settings */}
          <Card className="xl:col-span-1">
            <CardHeader>
              <CardTitle>Optimization Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Quality */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label>Quality</Label>
                  <span className="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                    {quality[0]}%
                  </span>
                </div>
                <Slider
                  value={quality}
                  onValueChange={setQuality}
                  min={10}
                  max={100}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>10%</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Max Width */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label>Max Width</Label>
                  <span className="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                    {maxWidth[0]}px
                  </span>
                </div>
                <Slider
                  value={maxWidth}
                  onValueChange={setMaxWidth}
                  min={320}
                  max={4000}
                  step={80}
                  className="w-full"
                />
              </div>

              {/* Max Height */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label>Max Height</Label>
                  <span className="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                    {maxHeight[0]}px
                  </span>
                </div>
                <Slider
                  value={maxHeight}
                  onValueChange={setMaxHeight}
                  min={240}
                  max={3000}
                  step={60}
                  className="w-full"
                />
              </div>

              <Button 
                onClick={optimizeImage}
                disabled={isProcessing}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {isProcessing ? "Optimizing..." : "Optimize Image"}
              </Button>

              {/* File Info */}
              <div className="pt-4 border-t space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Original Size:</span>
                  <span className="font-mono">{formatFileSize(originalSize)}</span>
                </div>
                {optimizedSize > 0 && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span>Optimized Size:</span>
                      <span className="font-mono">{formatFileSize(optimizedSize)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-semibold text-green-600">
                      <span>Savings:</span>
                      <span>{savings.percentage.toFixed(1)}%</span>
                    </div>
                    <Progress value={savings.percentage} className="h-2" />
                  </>
                )}
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={downloadOptimized}
                  disabled={!optimizedPreview}
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button 
                  onClick={resetOptimizer}
                  variant="outline"
                  className="flex-1"
                >
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Image Comparison */}
          <div className="xl:col-span-2 space-y-6">
            {/* Original Image */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" />
                  Original Image
                  <Badge variant="secondary">{formatFileSize(originalSize)}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  {originalPreview && (
                    <img 
                      src={originalPreview} 
                      alt="Original" 
                      className="max-w-full max-h-64 object-contain rounded"
                    />
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Optimized Image */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileImage className="w-5 h-5" />
                  Optimized Image
                  {optimizedSize > 0 && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {formatFileSize(optimizedSize)}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg min-h-[200px]">
                  {optimizedPreview ? (
                    <img 
                      src={optimizedPreview} 
                      alt="Optimized" 
                      className="max-w-full max-h-64 object-contain rounded"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-gray-400 h-32">
                      <Zap className="w-12 h-12 mb-2 opacity-30" />
                      <p>Optimized image will appear here</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Hidden Canvas */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Usage Guide */}
      <UsageGuide
        title="Image Optimizer"
        description="Compress and resize images efficiently while maintaining visual quality for web, social media, and other applications."
        examples={usageExamples}
        tips={proTips}
        bestPractices={bestPractices}
        commonUses={commonUses}
      />

      {/* Share Buttons */}
      <ShareButtons
        title="Free Image Optimizer"
        description="Compress and resize images while preserving quality. Free online image optimizer with customizable settings."
      />
    </div>
  );
}