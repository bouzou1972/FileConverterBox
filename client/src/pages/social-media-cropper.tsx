import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, Download, Crop, RefreshCw, Info, Move, ZoomIn, ZoomOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import BuyMeCoffee from "@/components/buy-me-coffee";

interface CropPreset {
  name: string;
  width: number;
  height: number;
  description: string;
  category: string;
}

export default function SocialMediaCropper() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [selectedPreset, setSelectedPreset] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [cropData, setCropData] = useState({ x: 0, y: 0, width: 0, height: 0, scale: 1 });
  const [croppedImages, setCroppedImages] = useState<{[key: string]: string}>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const { toast } = useToast();

  const cropPresets: CropPreset[] = [
    // Instagram
    { name: "Instagram Post (Square)", width: 1080, height: 1080, description: "Perfect square for feed posts", category: "Instagram" },
    { name: "Instagram Story", width: 1080, height: 1920, description: "Vertical story format", category: "Instagram" },
    { name: "Instagram Reel", width: 1080, height: 1920, description: "Vertical video thumbnail", category: "Instagram" },
    { name: "Instagram IGTV Cover", width: 420, height: 654, description: "IGTV thumbnail", category: "Instagram" },
    
    // Facebook
    { name: "Facebook Post", width: 1200, height: 630, description: "Shared link preview", category: "Facebook" },
    { name: "Facebook Cover Photo", width: 820, height: 312, description: "Profile/page cover", category: "Facebook" },
    { name: "Facebook Event Cover", width: 1920, height: 1080, description: "Event banner image", category: "Facebook" },
    { name: "Facebook Ad", width: 1200, height: 628, description: "News feed advertisement", category: "Facebook" },
    
    // Twitter/X
    { name: "Twitter Post", width: 1200, height: 675, description: "Tweet image attachment", category: "Twitter" },
    { name: "Twitter Header", width: 1500, height: 500, description: "Profile banner", category: "Twitter" },
    { name: "Twitter Card", width: 1200, height: 628, description: "Link preview card", category: "Twitter" },
    
    // LinkedIn
    { name: "LinkedIn Post", width: 1200, height: 627, description: "Shared content image", category: "LinkedIn" },
    { name: "LinkedIn Cover", width: 1584, height: 396, description: "Profile background", category: "LinkedIn" },
    { name: "LinkedIn Company Cover", width: 1128, height: 191, description: "Company page banner", category: "LinkedIn" },
    
    // YouTube
    { name: "YouTube Thumbnail", width: 1280, height: 720, description: "Video thumbnail (16:9)", category: "YouTube" },
    { name: "YouTube Banner", width: 2560, height: 1440, description: "Channel art", category: "YouTube" },
    { name: "YouTube Short", width: 1080, height: 1920, description: "Vertical short video", category: "YouTube" },
    
    // TikTok
    { name: "TikTok Video", width: 1080, height: 1920, description: "Vertical video format", category: "TikTok" },
    { name: "TikTok Profile", width: 200, height: 200, description: "Profile picture", category: "TikTok" },
    
    // Pinterest
    { name: "Pinterest Pin", width: 1000, height: 1500, description: "Standard pin (2:3 ratio)", category: "Pinterest" },
    { name: "Pinterest Square", width: 1000, height: 1000, description: "Square pin format", category: "Pinterest" },
    
    // General
    { name: "Square (1:1)", width: 1080, height: 1080, description: "Perfect square", category: "General" },
    { name: "Landscape (16:9)", width: 1920, height: 1080, description: "Widescreen format", category: "General" },
    { name: "Portrait (4:5)", width: 1080, height: 1350, description: "Tall format", category: "General" },
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file (PNG, JPG, JPEG, GIF)",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 20MB",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setCroppedImages({});
    setCropData({ x: 0, y: 0, width: 0, height: 0, scale: 1 });
  };

  const cropImage = (preset: CropPreset): string => {
    if (!imageRef.current || !canvasRef.current) return "";

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;
    const img = imageRef.current;

    canvas.width = preset.width;
    canvas.height = preset.height;

    // Calculate crop area to maintain aspect ratio
    const targetRatio = preset.width / preset.height;
    const imgRatio = img.naturalWidth / img.naturalHeight;

    let sourceWidth, sourceHeight, sourceX, sourceY;

    if (imgRatio > targetRatio) {
      // Image is wider than target ratio
      sourceHeight = img.naturalHeight;
      sourceWidth = sourceHeight * targetRatio;
      sourceX = (img.naturalWidth - sourceWidth) / 2;
      sourceY = 0;
    } else {
      // Image is taller than target ratio
      sourceWidth = img.naturalWidth;
      sourceHeight = sourceWidth / targetRatio;
      sourceX = 0;
      sourceY = (img.naturalHeight - sourceHeight) / 2;
    }

    // Draw the cropped image
    ctx.drawImage(
      img,
      sourceX, sourceY, sourceWidth, sourceHeight,
      0, 0, preset.width, preset.height
    );

    return canvas.toDataURL('image/png', 0.9);
  };

  const generateAllCrops = async () => {
    if (!selectedFile || !imageRef.current) {
      toast({
        title: "No image loaded",
        description: "Please select an image first",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      const newCrops: {[key: string]: string} = {};
      
      for (const preset of cropPresets) {
        const croppedImage = cropImage(preset);
        if (croppedImage) {
          newCrops[preset.name] = croppedImage;
        }
      }

      setCroppedImages(newCrops);
      setIsProcessing(false);
      
      toast({
        title: "Cropping complete",
        description: `Generated ${Object.keys(newCrops).length} cropped images`,
      });
    } catch (error) {
      setIsProcessing(false);
      toast({
        title: "Cropping failed",
        description: "An error occurred while processing the image",
        variant: "destructive"
      });
    }
  };

  const generateSingleCrop = () => {
    if (!selectedPreset) {
      toast({
        title: "No preset selected",
        description: "Please select a social media format first",
        variant: "destructive",
      });
      return;
    }

    const preset = cropPresets.find(p => p.name === selectedPreset);
    if (!preset) return;

    setIsProcessing(true);
    const croppedImage = cropImage(preset);
    
    if (croppedImage) {
      setCroppedImages({ [preset.name]: croppedImage });
      toast({
        title: "Cropping complete",
        description: `Generated ${preset.name} format`,
      });
    }
    
    setIsProcessing(false);
  };

  const downloadImage = (filename: string, dataUrl: string) => {
    const link = document.createElement('a');
    link.download = `${filename.toLowerCase().replace(/[^a-z0-9]/g, '-')}.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadAll = () => {
    Object.entries(croppedImages).forEach(([name, dataUrl], index) => {
      setTimeout(() => downloadImage(name, dataUrl), index * 100);
    });
    
    toast({
      title: "Downloading all images",
      description: "Check your downloads folder for all cropped images",
    });
  };

  const resetTool = () => {
    setSelectedFile(null);
    setPreviewUrl("");
    setCroppedImages({});
    setSelectedPreset("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const groupedPresets = cropPresets.reduce((acc, preset) => {
    if (!acc[preset.category]) {
      acc[preset.category] = [];
    }
    acc[preset.category].push(preset);
    return acc;
  }, {} as {[key: string]: CropPreset[]});

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Social Media Image Cropper</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Automatically crop your images to perfect sizes for Instagram, Facebook, Twitter, LinkedIn, 
          YouTube, TikTok, and Pinterest. No manual cropping needed!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Upload & Select Format
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-700 mb-2">
                  Drop image here or click to browse
                </p>
                <p className="text-sm text-gray-500">
                  Supports PNG, JPG, JPEG, GIF (Max 20MB)
                </p>
              </label>
            </div>

            {selectedFile && (
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Selected File:</h4>
                  <p className="text-sm text-gray-600">{selectedFile.name}</p>
                  <p className="text-sm text-gray-600">
                    Size: {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Select Format (Optional - leave blank to generate all)
                  </label>
                  <Select value={selectedPreset} onValueChange={setSelectedPreset}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a social media format" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(groupedPresets).map(([category, presets]) => (
                        <div key={category}>
                          <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            {category}
                          </div>
                          {presets.map((preset) => (
                            <SelectItem key={preset.name} value={preset.name}>
                              <div className="flex flex-col">
                                <span>{preset.name}</span>
                                <span className="text-xs text-gray-500">
                                  {preset.width}×{preset.height} - {preset.description}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </div>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2">
                  {selectedPreset ? (
                    <Button 
                      onClick={generateSingleCrop} 
                      disabled={isProcessing}
                      className="bg-blue-600 hover:bg-blue-700 flex-1"
                    >
                      {isProcessing ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Cropping...
                        </>
                      ) : (
                        <>
                          <Crop className="w-4 h-4 mr-2" />
                          Crop to {selectedPreset}
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button 
                      onClick={generateAllCrops} 
                      disabled={isProcessing}
                      className="bg-green-600 hover:bg-green-700 flex-1"
                    >
                      {isProcessing ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Crop className="w-4 h-4 mr-2" />
                          Generate All Formats
                        </>
                      )}
                    </Button>
                  )}
                  <Button variant="outline" onClick={resetTool}>
                    Reset
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Original Image</CardTitle>
          </CardHeader>
          <CardContent>
            {previewUrl ? (
              <div className="space-y-4">
                <div className="border rounded-lg p-4 bg-gray-50">
                  <img 
                    ref={imageRef}
                    src={previewUrl} 
                    alt="Original"
                    className="max-w-full max-h-64 mx-auto object-contain rounded"
                    onLoad={() => {
                      if (imageRef.current) {
                        // Image loaded, ready for cropping
                      }
                    }}
                  />
                </div>
                
                {imageRef.current && (
                  <div className="text-sm text-gray-600 text-center">
                    Original: {imageRef.current.naturalWidth}×{imageRef.current.naturalHeight}px
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Upload className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No image selected</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {Object.keys(croppedImages).length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Download className="w-5 h-5" />
                Cropped Images ({Object.keys(croppedImages).length})
              </span>
              {Object.keys(croppedImages).length > 1 && (
                <Button onClick={downloadAll} className="bg-green-600 hover:bg-green-700">
                  <Download className="w-4 h-4 mr-2" />
                  Download All
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(croppedImages).map(([name, dataUrl]) => {
                const preset = cropPresets.find(p => p.name === name);
                return (
                  <div key={name} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="aspect-square bg-gray-100 rounded mb-3 overflow-hidden">
                      <img 
                        src={dataUrl}
                        alt={name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm truncate">{name}</h4>
                      <p className="text-xs text-gray-600">
                        {preset?.width}×{preset?.height}px
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {preset?.description}
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => downloadImage(name, dataUrl)}
                        className="w-full"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <Alert className="mb-6">
        <Info className="w-4 h-4" />
        <AlertDescription>
          <strong>Smart Cropping:</strong> Images are automatically center-cropped to maintain the most important content. 
          For best results, use high-resolution images with the subject centered.
        </AlertDescription>
      </Alert>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Supported Social Media Formats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
            {Object.entries(groupedPresets).map(([category, presets]) => (
              <div key={category}>
                <h4 className="font-semibold mb-2 text-blue-600">{category}</h4>
                <ul className="space-y-1 text-gray-600">
                  {presets.map((preset) => (
                    <li key={preset.name} className="flex justify-between">
                      <span className="truncate mr-2">{preset.name}</span>
                      <span className="text-xs text-gray-500 shrink-0">
                        {preset.width}×{preset.height}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
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
          All processing happens in your browser - your images never leave your device!
        </p>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}