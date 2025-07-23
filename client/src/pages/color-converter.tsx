import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Copy, Palette, RefreshCw } from "lucide-react";
import BuyMeCoffee from "@/components/buy-me-coffee";
import { useToast } from "@/hooks/use-toast";

interface ColorValues {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
}

export default function ColorConverter() {
  const [color, setColor] = useState<ColorValues>({
    hex: "#3B82F6",
    rgb: { r: 59, g: 130, b: 246 },
    hsl: { h: 217, s: 91, l: 60 }
  });
  const [error, setError] = useState("");
  const { toast } = useToast();

  // Convert HEX to RGB
  const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  // Convert RGB to HEX
  const rgbToHex = (r: number, g: number, b: number): string => {
    return "#" + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    }).join("");
  };

  // Convert RGB to HSL
  const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

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

  // Convert HSL to RGB
  const hslToRgb = (h: number, s: number, l: number): { r: number; g: number; b: number } => {
    h /= 360;
    s /= 100;
    l /= 100;

    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    let r, g, b;

    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };
  };

  // Update color from HEX input
  const updateFromHex = (hex: string) => {
    try {
      setError("");
      if (!/^#[0-9A-F]{6}$/i.test(hex)) {
        setError("Invalid HEX format. Use #RRGGBB format (e.g., #FF5733)");
        return;
      }

      const rgb = hexToRgb(hex);
      if (!rgb) {
        setError("Invalid HEX color");
        return;
      }

      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      setColor({ hex: hex.toUpperCase(), rgb, hsl });
    } catch (err) {
      setError("Error parsing HEX color");
    }
  };

  // Update color from RGB input
  const updateFromRgb = (r: number, g: number, b: number) => {
    try {
      setError("");
      if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) {
        setError("RGB values must be between 0 and 255");
        return;
      }

      const hex = rgbToHex(r, g, b);
      const hsl = rgbToHsl(r, g, b);
      setColor({ hex: hex.toUpperCase(), rgb: { r, g, b }, hsl });
    } catch (err) {
      setError("Error parsing RGB color");
    }
  };

  // Update color from HSL input
  const updateFromHsl = (h: number, s: number, l: number) => {
    try {
      setError("");
      if (h < 0 || h > 360 || s < 0 || s > 100 || l < 0 || l > 100) {
        setError("HSL values must be: H(0-360), S(0-100), L(0-100)");
        return;
      }

      const rgb = hslToRgb(h, s, l);
      const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
      setColor({ hex: hex.toUpperCase(), rgb, hsl: { h, s, l } });
    } catch (err) {
      setError("Error parsing HSL color");
    }
  };

  const copyToClipboard = (text: string, format: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: `${format} color copied to clipboard`,
    });
  };

  const generateRandomColor = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    updateFromRgb(r, g, b);
  };

  const getColorFormats = () => {
    return {
      hex: color.hex,
      rgb: `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`,
      rgba: `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, 1)`,
      hsl: `hsl(${color.hsl.h}, ${color.hsl.s}%, ${color.hsl.l}%)`,
      hsla: `hsla(${color.hsl.h}, ${color.hsl.s}%, ${color.hsl.l}%, 1)`,
      css: `background-color: ${color.hex};`,
      tailwind: getClosestTailwindColor()
    };
  };

  const getClosestTailwindColor = (): string => {
    // Simplified Tailwind color matching - you could expand this
    const { r, g, b } = color.rgb;
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    
    if (r > g && r > b) return "red-500";
    if (g > r && g > b) return "green-500";
    if (b > r && b > g) return "blue-500";
    if (brightness < 128) return "gray-800";
    return "gray-200";
  };

  const formats = getColorFormats();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Color Converter</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Convert colors between HEX, RGB, and HSL formats. Pick colors visually or enter values manually for precise color matching.
        </p>
      </div>

      {error && (
        <Alert className="mb-6 border-red-200 bg-red-50">
          <AlertDescription className="text-red-700">{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Color Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-blue-600" />
              Color Preview
            </CardTitle>
            <CardDescription>Visual representation of your selected color</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div 
              className="w-full h-32 rounded-lg border shadow-sm"
              style={{ backgroundColor: color.hex }}
            ></div>
            <div className="text-center">
              <div className="text-lg font-mono font-bold">{color.hex}</div>
              <div className="text-sm text-gray-600">
                RGB({color.rgb.r}, {color.rgb.g}, {color.rgb.b}) • 
                HSL({color.hsl.h}, {color.hsl.s}%, {color.hsl.l}%)
              </div>
            </div>
            <Button onClick={generateRandomColor} variant="outline" className="w-full">
              <RefreshCw className="w-4 h-4 mr-2" />
              Generate Random Color
            </Button>
          </CardContent>
        </Card>
      
      <div className="text-center mt-8">
        <BuyMeCoffee />
      </div>

        {/* Color Input Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Color Input</CardTitle>
            <CardDescription>Enter color values or use sliders to adjust</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* HEX Input */}
            <div className="space-y-2">
              <Label htmlFor="hex-input">HEX Color</Label>
              <Input
                id="hex-input"
                value={color.hex}
                onChange={(e) => updateFromHex(e.target.value)}
                placeholder="#FF5733"
                className="font-mono"
              />
            </div>

            {/* RGB Sliders */}
            <div className="space-y-4">
              <Label>RGB Values</Label>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Red</span>
                    <span className="text-sm font-mono">{color.rgb.r}</span>
                  </div>
                  <Slider
                    value={[color.rgb.r]}
                    onValueChange={([value]) => updateFromRgb(value, color.rgb.g, color.rgb.b)}
                    max={255}
                    step={1}
                    className="w-full"
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Green</span>
                    <span className="text-sm font-mono">{color.rgb.g}</span>
                  </div>
                  <Slider
                    value={[color.rgb.g]}
                    onValueChange={([value]) => updateFromRgb(color.rgb.r, value, color.rgb.b)}
                    max={255}
                    step={1}
                    className="w-full"
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Blue</span>
                    <span className="text-sm font-mono">{color.rgb.b}</span>
                  </div>
                  <Slider
                    value={[color.rgb.b]}
                    onValueChange={([value]) => updateFromRgb(color.rgb.r, color.rgb.g, value)}
                    max={255}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* HSL Sliders */}
            <div className="space-y-4">
              <Label>HSL Values</Label>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Hue</span>
                    <span className="text-sm font-mono">{color.hsl.h}°</span>
                  </div>
                  <Slider
                    value={[color.hsl.h]}
                    onValueChange={([value]) => updateFromHsl(value, color.hsl.s, color.hsl.l)}
                    max={360}
                    step={1}
                    className="w-full"
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Saturation</span>
                    <span className="text-sm font-mono">{color.hsl.s}%</span>
                  </div>
                  <Slider
                    value={[color.hsl.s]}
                    onValueChange={([value]) => updateFromHsl(color.hsl.h, value, color.hsl.l)}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Lightness</span>
                    <span className="text-sm font-mono">{color.hsl.l}%</span>
                  </div>
                  <Slider
                    value={[color.hsl.l]}
                    onValueChange={([value]) => updateFromHsl(color.hsl.h, color.hsl.s, value)}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      
      <div className="text-center mt-8">
        <BuyMeCoffee />
      </div>
      </div>

      {/* Color Format Outputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(formats).map(([format, value]) => (
          <Card key={format}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="capitalize">{format.replace('rgba', 'RGBA').replace('hsla', 'HSLA')}</span>
                <Button variant="outline" size="sm" onClick={() => copyToClipboard(value, format.toUpperCase())}>
                  <Copy className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="font-mono text-sm bg-gray-50 p-3 rounded border break-all">
                {value}
              </div>
            </CardContent>
          </Card>
      
      <div className="text-center mt-8">
        <BuyMeCoffee />
      </div>
        ))}
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Color Format Guide</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div>
              <h4 className="font-semibold mb-2">HEX Colors</h4>
              <p className="text-gray-600 mb-2">Hexadecimal notation using base-16</p>
              <ul className="text-gray-600 space-y-1">
                <li>• Format: #RRGGBB</li>
                <li>• Range: 00-FF per channel</li>
                <li>• Most common in web design</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">RGB Colors</h4>
              <p className="text-gray-600 mb-2">Red, Green, Blue color model</p>
              <ul className="text-gray-600 space-y-1">
                <li>• Format: rgb(r, g, b)</li>
                <li>• Range: 0-255 per channel</li>
                <li>• Additive color model</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">HSL Colors</h4>
              <p className="text-gray-600 mb-2">Hue, Saturation, Lightness</p>
              <ul className="text-gray-600 space-y-1">
                <li>• Hue: 0-360° (color wheel)</li>
                <li>• Saturation: 0-100% (intensity)</li>
                <li>• Lightness: 0-100% (brightness)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="text-center mt-8">
        <BuyMeCoffee />
      </div>
    </div>
  );
}