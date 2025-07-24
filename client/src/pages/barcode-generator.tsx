import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Download, BarChart3, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ToolSEO } from "@/components/tool-seo";
import { ShareButtons } from "@/components/share-buttons";
import { UsageGuide } from "@/components/usage-guide";
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

  const usageExamples = [
    {
      title: "Product Barcode (EAN-13)",
      description: "Create standard retail product barcodes",
      steps: [
        "Select 'EAN-13' format",
        "Enter 12-13 digit product code",
        "Adjust height for label size requirements",
        "Generate and download for packaging"
      ],
      tip: "EAN-13 codes must be registered with GS1 for retail use"
    },
    {
      title: "Inventory Management (CODE128)",
      description: "Generate barcodes for internal inventory tracking",
      steps: [
        "Choose 'CODE128' format for alphanumeric data",
        "Enter your internal product ID or SKU",
        "Set appropriate bar width for scanning distance",
        "Print and apply to inventory items"
      ],
      tip: "CODE128 supports letters, numbers, and symbols for flexible inventory codes"
    },
    {
      title: "Shipping Labels (ITF-14)",
      description: "Create barcodes for cartons and shipping containers",
      steps: [
        "Select 'ITF-14' format",
        "Enter exactly 14 digits for the container code",
        "Use thicker bars and larger height for warehouse scanning",
        "Apply to shipping cartons"
      ]
    }
  ];

  const proTips = [
    "Test barcode scanning with your target devices before mass printing",
    "Higher bar width settings work better for longer scanning distances",
    "Keep background color light and bars dark for optimal contrast",
    "Different formats have specific data requirements - validate before printing",
    "Consider the scanning environment when choosing bar thickness and height"
  ];

  const bestPractices = [
    "Always verify barcode data accuracy before printing large quantities",
    "Choose the right format for your specific industry or use case",
    "Maintain adequate white space (quiet zone) around barcodes",
    "Test barcodes with the actual scanners that will be used",
    "Use high-quality printing to ensure clean, sharp bars",
    "Store master barcode files in a high-resolution format"
  ];

  const commonUses = [
    "Retail products",
    "Inventory tracking",
    "Shipping labels",
    "Asset management",
    "Document tracking",
    "Event tickets",
    "Library books",
    "Medical supplies"
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <ToolSEO
        title="Barcode Generator"
        description="Create professional barcodes in multiple formats including Code128, EAN-13, UPC, and more. Free online barcode maker with customizable settings."
        keywords={["barcode generator", "barcode maker", "ean13 barcode", "code128 barcode", "free barcode generator"]}
        canonicalUrl={window.location.href}
      />
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

      {/* Usage Guide */}
      <UsageGuide
        title="Barcode Generator"
        description="Create industry-standard barcodes for retail, inventory, shipping, and asset management with professional formatting options."
        examples={usageExamples}
        tips={proTips}
        bestPractices={bestPractices}
        commonUses={commonUses}
      />

      {/* Share Buttons */}
      <ShareButtons
        title="Professional Barcode Generator"
        description="Create industry-standard barcodes in multiple formats. Free barcode maker with Code128, EAN-13, UPC support."
      />
    </div>
  );
}