import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Download, QrCode, Wifi, Link as LinkIcon, Type } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import QRCode from "qrcode";

export default function QRGenerator() {
  const [activeTab, setActiveTab] = useState("text");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  // Text/URL QR Code
  const [textInput, setTextInput] = useState("");

  // WiFi QR Code
  const [wifiSSID, setWifiSSID] = useState("");
  const [wifiPassword, setWifiPassword] = useState("");
  const [wifiSecurity, setWifiSecurity] = useState("WPA");
  const [wifiHidden, setWifiHidden] = useState(false);

  // QR Code settings
  const [size, setSize] = useState("256");
  const [foregroundColor, setForegroundColor] = useState("#000000");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [errorCorrectionLevel, setErrorCorrectionLevel] = useState("M");

  const generateQRCode = async (data: string) => {
    if (!data.trim()) {
      toast({
        title: "Error",
        description: "Please enter some text or data to generate QR code",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const url = await QRCode.toDataURL(data, {
        width: parseInt(size),
        color: {
          dark: foregroundColor,
          light: backgroundColor,
        },
        errorCorrectionLevel: errorCorrectionLevel as 'L' | 'M' | 'Q' | 'H',
        margin: 2,
      });
      
      setQrCodeUrl(url);
      toast({
        title: "Success",
        description: "QR code generated successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate QR code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTextGenerate = () => {
    generateQRCode(textInput);
  };

  const handleWifiGenerate = () => {
    if (!wifiSSID.trim()) {
      toast({
        title: "Error",
        description: "Please enter a WiFi network name (SSID)",
        variant: "destructive",
      });
      return;
    }

    const wifiString = `WIFI:T:${wifiSecurity};S:${wifiSSID};P:${wifiPassword};H:${wifiHidden ? 'true' : 'false'};;`;
    generateQRCode(wifiString);
  };

  const downloadQRCode = () => {
    if (!qrCodeUrl) return;

    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `qr-code-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Downloaded",
      description: "QR code saved successfully!",
    });
  };

  const copyToClipboard = async () => {
    if (!qrCodeUrl) return;

    try {
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      
      toast({
        title: "Copied",
        description: "QR code copied to clipboard!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy QR code to clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
            <QrCode className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">QR Code Generator</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">Generate QR codes locally for URLs, text, and WiFi credentials</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 justify-center">
          <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
            100% Local Processing
          </Badge>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
            Multiple Formats
          </Badge>
          <Badge variant="secondary" className="bg-purple-100 text-purple-800 border-purple-200">
            Customizable
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Type className="w-5 h-5" />
              QR Code Input
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="text" className="flex items-center gap-2">
                  <Type className="w-4 h-4" />
                  Text/URL
                </TabsTrigger>
                <TabsTrigger value="wifi" className="flex items-center gap-2">
                  <Wifi className="w-4 h-4" />
                  WiFi
                </TabsTrigger>
              </TabsList>

              <TabsContent value="text" className="space-y-4">
                <div>
                  <Label htmlFor="text-input">Text or URL</Label>
                  <Textarea
                    id="text-input"
                    placeholder="Enter text, URL, or any data you want to encode..."
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
                <Button 
                  onClick={handleTextGenerate} 
                  disabled={isGenerating}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  {isGenerating ? "Generating..." : "Generate QR Code"}
                </Button>
              </TabsContent>

              <TabsContent value="wifi" className="space-y-4">
                <div>
                  <Label htmlFor="wifi-ssid">Network Name (SSID)</Label>
                  <Input
                    id="wifi-ssid"
                    placeholder="Enter WiFi network name"
                    value={wifiSSID}
                    onChange={(e) => setWifiSSID(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="wifi-password">Password</Label>
                  <Input
                    id="wifi-password"
                    type="password"
                    placeholder="Enter WiFi password"
                    value={wifiPassword}
                    onChange={(e) => setWifiPassword(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Security Type</Label>
                  <Select value={wifiSecurity} onValueChange={setWifiSecurity}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="WPA">WPA/WPA2</SelectItem>
                      <SelectItem value="WEP">WEP</SelectItem>
                      <SelectItem value="nopass">Open Network</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  onClick={handleWifiGenerate} 
                  disabled={isGenerating}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  {isGenerating ? "Generating..." : "Generate WiFi QR Code"}
                </Button>
              </TabsContent>
            </Tabs>

            {/* QR Code Settings */}
            <div className="pt-4 border-t">
              <h3 className="font-semibold mb-3">Customization</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Size (px)</Label>
                  <Select value={size} onValueChange={setSize}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="128">128×128</SelectItem>
                      <SelectItem value="256">256×256</SelectItem>
                      <SelectItem value="512">512×512</SelectItem>
                      <SelectItem value="1024">1024×1024</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Error Correction</Label>
                  <Select value={errorCorrectionLevel} onValueChange={setErrorCorrectionLevel}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="L">Low (~7%)</SelectItem>
                      <SelectItem value="M">Medium (~15%)</SelectItem>
                      <SelectItem value="Q">Quartile (~25%)</SelectItem>
                      <SelectItem value="H">High (~30%)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Foreground Color</Label>
                  <Input
                    type="color"
                    value={foregroundColor}
                    onChange={(e) => setForegroundColor(e.target.value)}
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
            </div>
          </CardContent>
        </Card>

        {/* Output Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="w-5 h-5" />
              Generated QR Code
            </CardTitle>
          </CardHeader>
          <CardContent>
            {qrCodeUrl ? (
              <div className="space-y-4">
                <div className="flex justify-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <img 
                    src={qrCodeUrl} 
                    alt="Generated QR Code" 
                    className="max-w-full h-auto"
                    style={{ imageRendering: 'pixelated' }}
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button 
                    onClick={downloadQRCode}
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
                    Copy to Clipboard
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <QrCode className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p>Your QR code will appear here</p>
                <p className="text-sm mt-1">Enter some data and click generate</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Usage Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Text/URL QR Codes</h4>
              <ul className="space-y-1 text-gray-600 dark:text-gray-300">
                <li>• Perfect for sharing website links</li>
                <li>• Can encode up to 4,296 characters</li>
                <li>• Include https:// for proper URL recognition</li>
                <li>• Works with email addresses and phone numbers</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">WiFi QR Codes</h4>
              <ul className="space-y-1 text-gray-600 dark:text-gray-300">
                <li>• Guests can connect by scanning the code</li>
                <li>• Works on most modern smartphones</li>
                <li>• Password is hidden but encoded in QR</li>
                <li>• Choose appropriate security type</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}