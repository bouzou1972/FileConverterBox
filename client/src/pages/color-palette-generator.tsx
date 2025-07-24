import { useState, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, Palette, Copy, Download, RefreshCw, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import BuyMeCoffee from "@/components/buy-me-coffee";

interface ColorInfo {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
  frequency: number;
}

export default function ColorPaletteGeneratorPage() {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [palette, setPalette] = useState<ColorInfo[]>([]);
  const [colorCount, setColorCount] = useState([8]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const rgbToHex = (r: number, g: number, b: number): string => {
    return "#" + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    }).join("");
  };

  const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  };

  const colorDistance = (c1: { r: number; g: number; b: number }, c2: { r: number; g: number; b: number }): number => {
    return Math.sqrt(
      Math.pow(c1.r - c2.r, 2) +
      Math.pow(c1.g - c2.g, 2) +
      Math.pow(c1.b - c2.b, 2)
    );
  };

  const extractColors = useCallback((img: HTMLImageElement) => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const maxSize = 400; // Limit size for performance
    const scale = Math.min(maxSize / img.width, maxSize / img.height);
    canvas.width = img.width * scale;
    canvas.height = img.height * scale;

    // Draw image
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Get image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Sample pixels (every 4th pixel for performance)
    const pixelStep = 4;
    const colorMap = new Map<string, number>();

    for (let i = 0; i < data.length; i += 4 * pixelStep) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];

      // Skip transparent pixels
      if (a < 128) continue;

      // Group similar colors (reduce precision)
      const groupedR = Math.round(r / 8) * 8;
      const groupedG = Math.round(g / 8) * 8;
      const groupedB = Math.round(b / 8) * 8;

      const colorKey = `${groupedR},${groupedG},${groupedB}`;
      colorMap.set(colorKey, (colorMap.get(colorKey) || 0) + 1);
    }

    // Convert to array and sort by frequency
    const colorArray = Array.from(colorMap.entries()).map(([color, frequency]) => {
      const [r, g, b] = color.split(',').map(Number);
      return {
        rgb: { r, g, b },
        hex: rgbToHex(r, g, b),
        hsl: rgbToHsl(r, g, b),
        frequency
      };
    });

    // Sort by frequency
    colorArray.sort((a, b) => b.frequency - a.frequency);

    // Use k-means-like clustering to get diverse colors
    const selectedColors: ColorInfo[] = [];
    const minDistance = 50; // Minimum color distance

    for (const color of colorArray) {
      if (selectedColors.length >= colorCount[0]) break;

      // Check if this color is sufficiently different from already selected colors
      const isSimilar = selectedColors.some(selected => 
        colorDistance(color.rgb, selected.rgb) < minDistance
      );

      if (!isSimilar) {
        selectedColors.push(color);
      }
    }

    // If we don't have enough colors, relax the distance requirement
    if (selectedColors.length < colorCount[0]) {
      for (const color of colorArray) {
        if (selectedColors.length >= colorCount[0]) break;
        
        const isSimilar = selectedColors.some(selected => 
          colorDistance(color.rgb, selected.rgb) < minDistance / 2
        );

        if (!isSimilar) {
          selectedColors.push(color);
        }
      }
    }

    setPalette(selectedColors);
  }, [colorCount]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError("Please upload a valid image file");
      return;
    }

    setLoading(true);
    setError("");

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setImage(img);
        setImageUrl(e.target?.result as string);
        extractColors(img);
        setLoading(false);
        toast({
          title: "Success",
          description: "Color palette extracted successfully",
        });
      };
      img.onerror = () => {
        setError("Failed to load image");
        setLoading(false);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const regeneratePalette = () => {
    if (image) {
      setLoading(true);
      setTimeout(() => {
        extractColors(image);
        setLoading(false);
      }, 100);
    }
  };

  const copyColor = (color: ColorInfo, format: 'hex' | 'rgb' | 'hsl' = 'hex') => {
    let text = '';
    switch (format) {
      case 'hex':
        text = color.hex;
        break;
      case 'rgb':
        text = `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`;
        break;
      case 'hsl':
        text = `hsl(${color.hsl.h}, ${color.hsl.s}%, ${color.hsl.l}%)`;
        break;
    }
    
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: `Color ${text} copied to clipboard`,
    });
  };

  const copyAllColors = (format: 'hex' | 'rgb' | 'hsl' = 'hex') => {
    const colors = palette.map(color => {
      switch (format) {
        case 'hex':
          return color.hex;
        case 'rgb':
          return `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`;
        case 'hsl':
          return `hsl(${color.hsl.h}, ${color.hsl.s}%, ${color.hsl.l}%)`;
        default:
          return color.hex;
      }
    }).join('\n');

    navigator.clipboard.writeText(colors);
    toast({
      title: "Copied",
      description: `All colors copied as ${format.toUpperCase()}`,
    });
  };

  const exportPalette = () => {
    const data = {
      colors: palette.map(color => ({
        hex: color.hex,
        rgb: color.rgb,
        hsl: color.hsl
      })),
      generatedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'color-palette.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Color Palette Generator</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Extract beautiful color palettes from any image. Upload a photo and get dominant colors with hex, RGB, and HSL values.
        </p>
      </div>

      {error && (
        <Alert className="mb-6 border-red-200 bg-red-50">
          <AlertDescription className="text-red-700">{error}</AlertDescription>
        </Alert>
      )}

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload Image
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4 items-center">
            <Button 
              variant="outline" 
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
            >
              <Upload className="w-4 h-4 mr-2" />
              Choose Image
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
            
            <div className="flex items-center gap-2">
              <Label htmlFor="color-count">Colors to extract:</Label>
              <div className="w-32">
                <Slider
                  id="color-count"
                  min={3}
                  max={16}
                  step={1}
                  value={colorCount}
                  onValueChange={setColorCount}
                  className="w-full"
                />
              </div>
              <span className="text-sm font-medium w-8">{colorCount[0]}</span>
            </div>

            {image && (
              <Button
                variant="outline"
                onClick={regeneratePalette}
                disabled={loading}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Regenerate
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {imageUrl && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Source Image
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <img
                src={imageUrl}
                alt="Source"
                className="max-w-full max-h-64 mx-auto rounded-lg shadow-md"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {palette.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Color Palette ({palette.length} colors)
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => copyAllColors('hex')}>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy All
                </Button>
                <Button variant="outline" size="sm" onClick={exportPalette}>
                  <Download className="w-4 h-4 mr-2" />
                  Export JSON
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {palette.map((color, index) => (
                <Card key={index} className="overflow-hidden">
                  <div
                    className="h-20 w-full cursor-pointer transition-transform hover:scale-105"
                    style={{ backgroundColor: color.hex }}
                    onClick={() => copyColor(color, 'hex')}
                    title="Click to copy HEX"
                  />
                  <CardContent className="p-3 space-y-2">
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">HEX</span>
                        <button
                          onClick={() => copyColor(color, 'hex')}
                          className="font-mono text-gray-600 hover:text-gray-800 transition-colors"
                        >
                          {color.hex}
                        </button>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">RGB</span>
                        <button
                          onClick={() => copyColor(color, 'rgb')}
                          className="font-mono text-gray-600 hover:text-gray-800 transition-colors"
                        >
                          {color.rgb.r}, {color.rgb.g}, {color.rgb.b}
                        </button>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">HSL</span>
                        <button
                          onClick={() => copyColor(color, 'hsl')}
                          className="font-mono text-gray-600 hover:text-gray-800 transition-colors"
                        >
                          {color.hsl.h}°, {color.hsl.s}%, {color.hsl.l}%
                        </button>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {((color.frequency / Math.max(...palette.map(c => c.frequency))) * 100).toFixed(1)}%
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {!imageUrl && (
        <Card>
          <CardContent className="py-16">
            <div className="text-center text-gray-500">
              <Palette className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No image uploaded</h3>
              <p>Upload an image to extract its color palette</p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Extraction Process</h4>
              <ul className="text-gray-600 space-y-1">
                <li>• Analyzes image pixels using HTML5 Canvas</li>
                <li>• Groups similar colors to reduce noise</li>
                <li>• Uses clustering to find dominant colors</li>
                <li>• Ensures color diversity in the palette</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Features</h4>
              <ul className="text-gray-600 space-y-1">
                <li>• Multiple color format outputs (HEX, RGB, HSL)</li>
                <li>• Click any color to copy to clipboard</li>
                <li>• Adjustable palette size (3-16 colors)</li>
                <li>• Export palette as JSON for reuse</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <canvas ref={canvasRef} className="hidden" />
      
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