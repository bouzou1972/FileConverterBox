import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, Download, Image as ImageIcon, RefreshCw, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import BuyMeCoffee from "@/components/buy-me-coffee";

export default function FaviconGenerator() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedFavicons, setGeneratedFavicons] = useState<{[key: string]: string}>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const faviconSizes = [
    { size: 16, name: "favicon-16x16.ico", desc: "Browser tab" },
    { size: 32, name: "favicon-32x32.ico", desc: "Browser bookmark" },
    { size: 48, name: "favicon-48x48.ico", desc: "Desktop shortcut" },
    { size: 64, name: "favicon-64x64.ico", desc: "High-DPI displays" },
    { size: 128, name: "favicon-128x128.ico", desc: "Chrome Web Store" },
    { size: 180, name: "apple-touch-icon.png", desc: "iOS home screen" },
    { size: 192, name: "android-chrome-192x192.png", desc: "Android home screen" },
    { size: 512, name: "android-chrome-512x512.png", desc: "Android splash screen" }
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file (PNG, JPG, JPEG, GIF, SVG)",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 10MB",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setGeneratedFavicons({});
  };

  const generateDrawIcon = (size: number): HTMLCanvasElement => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    canvas.width = size;
    canvas.height = size;

    // Create a simple icon as fallback
    ctx.fillStyle = '#4F46E5';
    ctx.fillRect(0, 0, size, size);
    
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `${size * 0.6}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('F', size / 2, size / 2);

    return canvas;
  };

  const resizeImage = (img: HTMLImageElement, size: number): HTMLCanvasElement => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    canvas.width = size;
    canvas.height = size;

    // Fill with transparent background
    ctx.clearRect(0, 0, size, size);

    // Calculate dimensions to fit image in square while maintaining aspect ratio
    const imgAspect = img.width / img.height;
    let drawWidth, drawHeight, offsetX = 0, offsetY = 0;

    if (imgAspect > 1) {
      // Landscape - fit to height
      drawHeight = size;
      drawWidth = size * imgAspect;
      offsetX = -(drawWidth - size) / 2;
    } else {
      // Portrait or square - fit to width
      drawWidth = size;
      drawHeight = size / imgAspect;
      offsetY = -(drawHeight - size) / 2;
    }

    // Add slight padding for better appearance
    const padding = size * 0.05;
    drawWidth -= padding * 2;
    drawHeight -= padding * 2;
    offsetX += padding;
    offsetY += padding;

    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    return canvas;
  };

  const generateFavicons = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select an image file first",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      const img = new Image();
      img.onload = async () => {
        const newFavicons: {[key: string]: string} = {};

        for (const favicon of faviconSizes) {
          const canvas = resizeImage(img, favicon.size);
          
          // Convert to appropriate format
          const format = favicon.name.endsWith('.png') ? 'image/png' : 'image/x-icon';
          
          newFavicons[favicon.name] = canvas.toDataURL(format);
        }

        setGeneratedFavicons(newFavicons);
        setIsGenerating(false);
        
        toast({
          title: "Favicons generated successfully",
          description: `Generated ${faviconSizes.length} favicon sizes`,
        });
      };

      img.onerror = () => {
        setIsGenerating(false);
        toast({
          title: "Error loading image",
          description: "Could not load the selected image file",
          variant: "destructive",
        });
      };

      img.src = previewUrl;
    } catch (error) {
      setIsGenerating(false);
      toast({
        title: "Generation failed",
        description: "An error occurred while generating favicons",
        variant: "destructive",
      });
    }
  };

  const downloadFavicon = (filename: string, dataUrl: string) => {
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadAll = () => {
    Object.entries(generatedFavicons).forEach(([filename, dataUrl]) => {
      setTimeout(() => downloadFavicon(filename, dataUrl), 100);
    });
    
    toast({
      title: "Downloading all favicons",
      description: "Check your downloads folder for all favicon files",
    });
  };

  const resetTool = () => {
    setSelectedFile(null);
    setPreviewUrl("");
    setGeneratedFavicons({});
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Favicon Generator</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Upload any image and generate favicons in all the standard sizes for your website. 
          Creates ICO files for browsers and PNG files for mobile devices.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Upload Image
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
                id="favicon-upload"
              />
              <label htmlFor="favicon-upload" className="cursor-pointer">
                <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-700 mb-2">
                  Drop image here or click to browse
                </p>
                <p className="text-sm text-gray-500">
                  Supports PNG, JPG, JPEG, GIF, SVG (Max 10MB)
                </p>
              </label>
            </div>

            {selectedFile && (
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Selected File:</h4>
                  <p className="text-sm text-gray-600">{selectedFile.name}</p>
                  <p className="text-sm text-gray-600">
                    Size: {(selectedFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={generateFavicons} 
                    disabled={isGenerating}
                    className="bg-blue-600 hover:bg-blue-700 flex-1"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <ImageIcon className="w-4 h-4 mr-2" />
                        Generate Favicons
                      </>
                    )}
                  </Button>
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
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent>
            {previewUrl ? (
              <div className="space-y-4">
                <div className="border rounded-lg p-4 bg-gray-50">
                  <img 
                    src={previewUrl} 
                    alt="Original"
                    className="max-w-full max-h-48 mx-auto object-contain rounded"
                  />
                </div>
                
                {Object.keys(generatedFavicons).length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3">Generated Previews:</h4>
                    <div className="grid grid-cols-4 gap-2">
                      {faviconSizes.slice(0, 8).map((favicon) => (
                        <div key={favicon.size} className="text-center">
                          <div className="border rounded p-2 bg-white mb-1">
                            {generatedFavicons[favicon.name] && (
                              <img 
                                src={generatedFavicons[favicon.name]}
                                alt={`${favicon.size}x${favicon.size}`}
                                className="w-8 h-8 mx-auto"
                                style={{ imageRendering: 'pixelated' }}
                              />
                            )}
                          </div>
                          <p className="text-xs text-gray-600">{favicon.size}px</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No image selected</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {Object.keys(generatedFavicons).length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Download className="w-5 h-5" />
                Generated Favicons ({Object.keys(generatedFavicons).length})
              </span>
              <Button onClick={downloadAll} className="bg-green-600 hover:bg-green-700">
                <Download className="w-4 h-4 mr-2" />
                Download All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {faviconSizes.map((favicon) => (
                <div key={favicon.name} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 border rounded bg-white p-1">
                      {generatedFavicons[favicon.name] && (
                        <img 
                          src={generatedFavicons[favicon.name]}
                          alt={favicon.name}
                          className="w-full h-full"
                          style={{ imageRendering: 'pixelated' }}
                        />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{favicon.name}</p>
                      <p className="text-xs text-gray-600">{favicon.size}×{favicon.size} - {favicon.desc}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => downloadFavicon(favicon.name, generatedFavicons[favicon.name])}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Alert className="mb-6">
        <Info className="w-4 h-4" />
        <AlertDescription>
          <strong>Best Practices:</strong> Use square images (1:1 ratio) for best results. 
          Images with transparent backgrounds work great for modern icons. 
          Minimum recommended size is 512×512 pixels for crisp results at all sizes.
        </AlertDescription>
      </Alert>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>How to Use Your Favicons</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">1. Add to your website's HTML head:</h4>
              <div className="bg-gray-100 p-3 rounded font-mono text-xs overflow-x-auto">
                {`<link rel="icon" type="image/x-icon" href="/favicon-32x32.ico">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.ico">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.ico">
<link rel="manifest" href="/site.webmanifest">`}
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">2. Upload files to your website's root directory</h4>
              <p className="text-gray-600">Place all favicon files in your website's root folder (same level as index.html)</p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">3. Create a web manifest (optional)</h4>
              <p className="text-gray-600">For PWA support, create a site.webmanifest file referencing your Android icons</p>
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
          All processing happens in your browser - your images never leave your device!
        </p>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}