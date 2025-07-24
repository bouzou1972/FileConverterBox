import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Download, BarChart3, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import JsBarcode from "jsbarcode";

export default function BarcodeGenerator() {
  const [barcodeData, setBarcodeData] = useState("");
  const [barcodeFormat, setBarcodeFormat] = useState("CODE128");
  const [width, setWidth] = useState("2");
  const [height, setHeight] = useState("100");
  const [displayValue, setDisplayValue] = useState(true);
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [lineColor, setLineColor] = useState("#000000");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const barcodeFormats = [
    { value: "CODE128", label: "CODE128", description: "Most common, alphanumeric" },
    { value: "CODE39", label: "CODE39", description: "Alphanumeric, widely supported" },
    { value: "EAN13", label: "EAN-13", description: "Product barcodes, 12-13 digits" },
    { value: "EAN8", label: "EAN-8", description: "Short product codes, 7-8 digits" },
    { value: "UPC", label: "UPC-A", description: "US product codes, 11-12 digits" },
    { value: "ITF14", label: "ITF-14", description: "Shipping containers, 14 digits" },
    { value: "MSI", label: "MSI", description: "Inventory control, numeric only" },
    { value: "pharmacode", label: "Pharmacode", description: "Pharmaceutical, 3-131071" },
  ];

  const generateBarcode = () => {
    if (!barcodeData.trim()) {
      toast({
        title: "Error",
        description: "Please enter data to generate barcode",
        variant: "destructive",
      });
      return;
    }

    if (!canvasRef.current) return;

    try {
      // Validate input based on format
      if (barcodeFormat === "EAN13" && !/^\d{12,13}$/.test(barcodeData)) {
        throw new Error("EAN-13 requires 12-13 digits");
      }
      if (barcodeFormat === "EAN8" && !/^\d{7,8}$/.test(barcodeData)) {
        throw new Error("EAN-8 requires 7-8 digits");
      }
      if (barcodeFormat === "UPC" && !/^\d{11,12}$/.test(barcodeData)) {
        throw new Error("UPC-A requires 11-12 digits");
      }
      if (barcodeFormat === "ITF14" && !/^\d{14}$/.test(barcodeData)) {
        throw new Error("ITF-14 requires exactly 14 digits");
      }
      if (barcodeFormat === "MSI" && !/^\d+$/.test(barcodeData)) {
        throw new Error("MSI requires numeric data only");
      }
      if (barcodeFormat === "pharmacode") {
        const num = parseInt(barcodeData);
        if (isNaN(num) || num < 3 || num > 131071) {
          throw new Error("Pharmacode requires number between 3 and 131071");
        }
      }

      JsBarcode(canvasRef.current, barcodeData, {
        format: barcodeFormat,
        width: parseInt(width),
        height: parseInt(height),
        displayValue: displayValue,
        background: backgroundColor,
        lineColor: lineColor,
        margin: 10,
        fontSize: 14,
      });

      toast({
        title: "Success",
        description: "Barcode generated successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate barcode",
        variant: "destructive",
      });
    }
  };

  const downloadBarcode = () => {
    if (!canvasRef.current) return;

    const link = document.createElement('a');
    link.href = canvasRef.current.toDataURL('image/png');
    link.download = `barcode-${barcodeFormat}-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Downloaded",
      description: "Barcode saved successfully!",
    });
  };

  const copyToClipboard = async () => {
    if (!canvasRef.current) return;

    try {
      canvasRef.current.toBlob(async (blob) => {
        if (blob) {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]);
          toast({
            title: "Copied",
            description: "Barcode copied to clipboard!",
          });
        }
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy barcode to clipboard",
        variant: "destructive",
      });
    }
  };

  // Auto-generate on input change
  useEffect(() => {
    if (barcodeData.trim()) {
      const timer = setTimeout(generateBarcode, 500);
      return () => clearTimeout(timer);
    }
  }, [barcodeData, barcodeFormat, width, height, displayValue, backgroundColor, lineColor]);

  const selectedFormat = barcodeFormats.find(f => f.value === barcodeFormat);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
            <BarChart3 className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Barcode Generator</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">Create various barcode formats locally</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 justify-center">
          <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
            8 Formats Supported
          </Badge>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
            Industry Standard
          </Badge>
          <Badge variant="secondary" className="bg-purple-100 text-purple-800 border-purple-200">
            100% Local
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle>Barcode Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Barcode Format */}
            <div>
              <Label>Barcode Format</Label>
              <Select value={barcodeFormat} onValueChange={setBarcodeFormat}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {barcodeFormats.map((format) => (
                    <SelectItem key={format.value} value={format.value}>
                      <div>
                        <div className="font-medium">{format.label}</div>
                        <div className="text-xs text-gray-500">{format.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedFormat && (
                <p className="text-xs text-gray-500 mt-1">{selectedFormat.description}</p>
              )}
            </div>

            {/* Data Input */}
            <div>
              <Label htmlFor="barcode-data">Data</Label>
              <Input
                id="barcode-data"
                placeholder="Enter barcode data..."
                value={barcodeData}
                onChange={(e) => setBarcodeData(e.target.value)}
                className="font-mono"
              />
            </div>

            {/* Appearance Settings */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Bar Width</Label>
                <Select value={width} onValueChange={setWidth}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Thin (1px)</SelectItem>
                    <SelectItem value="2">Normal (2px)</SelectItem>
                    <SelectItem value="3">Thick (3px)</SelectItem>
                    <SelectItem value="4">Extra Thick (4px)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Height</Label>
                <Select value={height} onValueChange={setHeight}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="50">Short (50px)</SelectItem>
                    <SelectItem value="100">Normal (100px)</SelectItem>
                    <SelectItem value="150">Tall (150px)</SelectItem>
                    <SelectItem value="200">Extra Tall (200px)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Bar Color</Label>
                <Input
                  type="color"
                  value={lineColor}
                  onChange={(e) => setLineColor(e.target.value)}
                  className="h-10"
                />
              </div>
              <div>
                <Label>Background Color</Label>
                <Input
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="h-10"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="display-value"
                checked={displayValue}
                onChange={(e) => setDisplayValue(e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="display-value">Show text below barcode</Label>
            </div>

            <Button 
              onClick={generateBarcode}
              className="w-full bg-purple-600 hover:bg-purple-700"
              disabled={!barcodeData.trim()}
            >
              Generate Barcode
            </Button>
          </CardContent>
        </Card>

        {/* Output Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Generated Barcode
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <canvas 
                  ref={canvasRef}
                  className="max-w-full h-auto border border-gray-200 dark:border-gray-700"
                />
              </div>
              
              {barcodeData.trim() && (
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button 
                    onClick={downloadBarcode}
                    className="flex-1 bg-purple-600 hover:bg-purple-700"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download PNG
                  </Button>
                  <Button 
                    onClick={copyToClipboard}
                    variant="outline"
                    className="flex-1"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy to Clipboard
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Format Information */}
      <Card>
        <CardHeader>
          <CardTitle>Barcode Format Guide</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-semibold mb-3">Common Formats</h4>
              <div className="space-y-2">
                <div>
                  <span className="font-medium">CODE128:</span> Most versatile, supports all ASCII characters
                </div>
                <div>
                  <span className="font-medium">CODE39:</span> Alphanumeric, widely used in non-retail
                </div>
                <div>
                  <span className="font-medium">EAN-13:</span> European product codes (13 digits)
                </div>
                <div>
                  <span className="font-medium">UPC-A:</span> US/Canada product codes (12 digits)
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Specialized Uses</h4>
              <div className="space-y-2">
                <div>
                  <span className="font-medium">ITF-14:</span> Shipping containers and cases
                </div>
                <div>
                  <span className="font-medium">MSI:</span> Inventory and warehouse management
                </div>
                <div>
                  <span className="font-medium">Pharmacode:</span> Pharmaceutical packaging
                </div>
                <div>
                  <span className="font-medium">EAN-8:</span> Small products with limited space
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}