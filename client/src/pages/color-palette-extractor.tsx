import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, Palette, Copy, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ToolSEO } from "@/components/tool-seo";
import { ShareButtons } from "@/components/share-buttons";
import { UsageGuide } from "@/components/usage-guide";
import { BookmarkButton } from "@/components/bookmark-button";

interface Color {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
  count: number;
}

export default function ColorPaletteExtractor() {
  const [image, setImage] = useState<string>("");
  const [colors, setColors] = useState<Color[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);
  const [paletteSize, setPaletteSize] = useState(8);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
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

    const reader = new FileReader();
    reader.onload = (e) => {
      setImage(e.target?.result as string);
      setColors([]);
    };
    reader.readAsDataURL(file);
  };

  const extractColors = () => {
    if (!image || !canvasRef.current) return;

    setIsExtracting(true);
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;
    const img = new Image();

    img.onload = () => {
      // Scale down image for faster processing
      const maxSize = 200;
      const scale = Math.min(maxSize / img.width, maxSize / img.height);
      const width = img.width * scale;
      const height = img.height * scale;

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;
      const colorMap = new Map<string, number>();

      // Count colors
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const alpha = data[i + 3];

        // Skip transparent pixels
        if (alpha < 128) continue;

        // Quantize colors to reduce palette size
        const qr = Math.round(r / 16) * 16;
        const qg = Math.round(g / 16) * 16;
        const qb = Math.round(b / 16) * 16;
        
        const key = `${qr},${qg},${qb}`;
        colorMap.set(key, (colorMap.get(key) || 0) + 1);
      }

      // Sort by frequency and take top colors
      const sortedColors = Array.from(colorMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, paletteSize)
        .map(([key, count]) => {
          const [r, g, b] = key.split(',').map(Number);
          return {
            hex: rgbToHex(r, g, b),
            rgb: { r, g, b },
            hsl: rgbToHsl(r, g, b),
            count
          };
        });

      setColors(sortedColors);
      setIsExtracting(false);

      toast({
        title: "Extraction Complete",
        description: `Found ${sortedColors.length} dominant colors`,
      });
    };

    img.onerror = () => {
      toast({
        title: "Error",
        description: "Failed to load image",
        variant: "destructive",
      });
      setIsExtracting(false);
    };

    img.src = image;
  };

  const copyColor = (color: Color, format: 'hex' | 'rgb' | 'hsl') => {
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

    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied",
        description: `${format.toUpperCase()} value copied to clipboard`,
      });
    });
  };

  const copyAllColors = (format: 'hex' | 'rgb' | 'hsl') => {
    const colorStrings = colors.map(color => {
      switch (format) {
        case 'hex':
          return color.hex;
        case 'rgb':
          return `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`;
        case 'hsl':
          return `hsl(${color.hsl.h}, ${color.hsl.s}%, ${color.hsl.l}%)`;
      }
    });

    navigator.clipboard.writeText(colorStrings.join('\n')).then(() => {
      toast({
        title: "Copied",
        description: `All ${format.toUpperCase()} values copied to clipboard`,
      });
    });
  };

  const exportPalette = () => {
    const data = colors.map(color => ({
      hex: color.hex,
      rgb: `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`,
      hsl: `hsl(${color.hsl.h}, ${color.hsl.s}%, ${color.hsl.l}%)`,
      frequency: color.count
    }));

    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `color-palette-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Exported",
      description: "Color palette saved as JSON file",
    });
  };

  const resetExtractor = () => {
    setImage("");
    setColors([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const usageExamples = [
    {
      title: "Brand Color Palette",
      description: "Extract colors from logo or brand images for consistent design",
      steps: [
        "Upload your logo or brand image",
        "Set palette size to 5-8 colors for main brand colors",
        "Click 'Extract Colors' to analyze the image",
        "Copy the dominant colors in HEX format",
        "Use these colors in your design system and brand guidelines"
      ],
      tip: "Use high-resolution, uncompressed logos for the most accurate color extraction"
    },
    {
      title: "Design Inspiration",
      description: "Get color schemes from inspiring photos or artwork",
      steps: [
        "Upload an inspiring image or artwork",
        "Increase palette size to 12-16 for more color options",
        "Extract colors and review the dominant tones",
        "Copy colors in your preferred format (HEX, RGB, HSL)",
        "Apply the palette to your design project"
      ],
      tip: "Nature photos and artwork often provide the most harmonious color palettes"
    },
    {
      title: "Website Color Matching",
      description: "Match colors from existing websites or designs",
      steps: [
        "Take a screenshot of the website or design",
        "Upload the screenshot to the extractor",
        "Extract colors to get the exact color values",
        "Export the palette as JSON for development use",
        "Implement the colors in your CSS or design files"
      ]
    }
  ];

  const proTips = [
    "High-contrast images with varied colors work best for extraction",
    "Use larger palette sizes (12-16) for more color variety and options",
    "Export palettes as JSON files to easily import into design tools",
    "Click individual colors to copy them instantly to your clipboard",
    "The frequency analysis shows which colors are most prominent in the image",
    "Try different image crops to focus on specific color areas"
  ];

  const bestPractices = [
    "Use high-quality, uncompressed images for accurate color extraction",
    "Test extracted colors in your actual design context",
    "Consider color accessibility when using extracted palettes",
    "Save successful color palettes for future reference",
    "Verify colors work well together in various lighting conditions",
    "Document color usage guidelines when creating brand palettes",
    "Test color combinations for sufficient contrast ratios"
  ];

  const commonUses = [
    "Brand identity design",
    "Website color schemes",
    "Marketing materials",
    "App UI design",
    "Interior design",
    "Fashion design",
    "Art projects",
    "Product design"
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <ToolSEO
        title="Color Palette Extractor"
        description="Extract dominant colors from any image with frequency analysis. Free online color palette generator with HEX, RGB, and HSL support."
        keywords={["color palette extractor", "color picker from image", "extract colors", "image color analysis", "color scheme generator"]}
        canonicalUrl={window.location.href}
      />
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
            <Palette className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Color Palette Extractor</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">Extract dominant colors from any image</p>
          </div>
          <BookmarkButton 
            href="/color-palette-extractor"
            title="Color Palette Extractor"
            icon="palette"
            iconColor="text-pink-600"
            description="Extract dominant colors from any image with frequency analysis and multiple format support"
          />
        </div>
        <div className="flex flex-wrap gap-2 justify-center">
          <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
            Multiple Formats
          </Badge>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
            Frequency Analysis
          </Badge>
          <Badge variant="secondary" className="bg-purple-100 text-purple-800 border-purple-200">
            100% Local
          </Badge>
        </div>
      </div>

      {/* File Upload */}
      {!image && (
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
                  Select any image to extract its color palette
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

      {/* Image and Extraction */}
      {image && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Image Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Source Image</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <img 
                    src={image} 
                    alt="Source" 
                    className="max-w-full max-h-64 object-contain rounded"
                  />
                </div>
                
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <Button
                      onClick={extractColors}
                      disabled={isExtracting}
                      className="flex-1 bg-purple-600 hover:bg-purple-700"
                    >
                      {isExtracting ? "Extracting..." : "Extract Colors"}
                    </Button>
                    <Button
                      onClick={resetExtractor}
                      variant="outline"
                    >
                      Reset
                    </Button>
                  </div>
                  
                  {/* Palette Size */}
                  <div className="flex items-center gap-2">
                    <label className="text-sm">Colors:</label>
                    <select 
                      value={paletteSize} 
                      onChange={(e) => setPaletteSize(Number(e.target.value))}
                      className="text-sm border rounded px-2 py-1"
                    >
                      <option value={5}>5</option>
                      <option value={8}>8</option>
                      <option value={12}>12</option>
                      <option value={16}>16</option>
                    </select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Extracted Colors */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Color Palette
                {colors.length > 0 && (
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={exportPalette}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {colors.length > 0 ? (
                <div className="space-y-4">
                  {/* Color Grid */}
                  <div className="grid grid-cols-4 gap-2">
                    {colors.map((color, index) => (
                      <div
                        key={index}
                        className="aspect-square rounded-lg border border-gray-200 dark:border-gray-700 relative group cursor-pointer"
                        style={{ backgroundColor: color.hex }}
                        onClick={() => copyColor(color, 'hex')}
                      >
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all flex items-center justify-center">
                          <Copy className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Color Details */}
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {colors.map((color, index) => (
                      <div key={index} className="p-2 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded border"
                            style={{ backgroundColor: color.hex }}
                          />
                          <div className="flex-1 grid grid-cols-3 gap-2 text-xs font-mono">
                            <button
                              onClick={() => copyColor(color, 'hex')}
                              className="text-left hover:bg-gray-100 dark:hover:bg-gray-800 p-1 rounded"
                            >
                              {color.hex}
                            </button>
                            <button
                              onClick={() => copyColor(color, 'rgb')}
                              className="text-left hover:bg-gray-100 dark:hover:bg-gray-800 p-1 rounded"
                            >
                              rgb({color.rgb.r}, {color.rgb.g}, {color.rgb.b})
                            </button>
                            <button
                              onClick={() => copyColor(color, 'hsl')}
                              className="text-left hover:bg-gray-100 dark:hover:bg-gray-800 p-1 rounded"
                            >
                              hsl({color.hsl.h}, {color.hsl.s}%, {color.hsl.l}%)
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Export Options */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyAllColors('hex')}
                      className="flex-1"
                    >
                      Copy All HEX
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyAllColors('rgb')}
                      className="flex-1"
                    >
                      Copy All RGB
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyAllColors('hsl')}
                      className="flex-1"
                    >
                      Copy All HSL
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <Palette className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p>Color palette will appear here</p>
                  <p className="text-sm mt-1">Click "Extract Colors" to analyze the image</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Hidden Canvas */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Usage Guide */}
      <UsageGuide
        title="Color Palette Extractor"
        description="Extract and analyze dominant colors from any image with advanced frequency analysis and multiple export formats."
        examples={usageExamples}
        tips={proTips}
        bestPractices={bestPractices}
        commonUses={commonUses}
      />

      {/* Share Buttons */}
      <ShareButtons
        title="Color Palette Extractor"
        description="Extract dominant colors from any image with frequency analysis. Free color palette generator with multiple format support."
      />
    </div>
  );
}