import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { FileText, Download, Upload, RotateCcw } from "lucide-react";
import { 
  convertTextToPDF, 
  convertHTMLToPDF, 
  downloadPDF, 
  sampleText, 
  sampleHTML,
  type PDFConversionOptions 
} from "@/lib/utils/pdf";

export default function PDFConverter() {
  const [textContent, setTextContent] = useState("");
  const [htmlContent, setHtmlContent] = useState("");
  const [format, setFormat] = useState<"A4" | "A3" | "Letter">("A4");
  const [orientation, setOrientation] = useState<"portrait" | "landscape">("portrait");
  const [fontSize, setFontSize] = useState(12);
  const [margin, setMargin] = useState(20);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("text");
  const { toast } = useToast();

  const handleConvertText = async () => {
    if (!textContent.trim()) {
      setError("Please enter some text to convert");
      return;
    }

    setIsConverting(true);
    setError("");

    try {
      const options: PDFConversionOptions = {
        format,
        orientation,
        fontSize,
        margin
      };

      const result = await convertTextToPDF(textContent, options);

      if (result.success && result.blob) {
        downloadPDF(result.blob, 'converted-text.pdf');
        toast({
          title: "Success",
          description: "PDF generated and downloaded successfully!"
        });
      } else {
        setError(result.error || "Failed to convert text to PDF");
      }
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setIsConverting(false);
    }
  };

  const handleConvertHTML = async () => {
    if (!htmlContent.trim()) {
      setError("Please enter some HTML content to convert");
      return;
    }

    setIsConverting(true);
    setError("");

    try {
      const options: PDFConversionOptions = {
        format,
        orientation,
        fontSize,
        margin
      };

      const result = await convertHTMLToPDF(htmlContent, options);

      if (result.success && result.blob) {
        downloadPDF(result.blob, 'converted-html.pdf');
        toast({
          title: "Success",
          description: "PDF generated and downloaded successfully!"
        });
      } else {
        setError(result.error || "Failed to convert HTML to PDF");
      }
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setIsConverting(false);
    }
  };

  const loadSampleText = () => {
    setTextContent(sampleText);
    setActiveTab("text");
  };

  const loadSampleHTML = () => {
    setHtmlContent(sampleHTML);
    setActiveTab("html");
  };

  const clearContent = () => {
    setTextContent("");
    setHtmlContent("");
    setError("");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <span className="material-icons text-red-600 text-3xl">picture_as_pdf</span>
            PDF Converter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Content Input */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Content Input</h3>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={loadSampleText}
                  >
                    <FileText className="w-4 h-4 mr-1" />
                    Sample Text
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={loadSampleHTML}
                  >
                    <Upload className="w-4 h-4 mr-1" />
                    Sample HTML
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearContent}
                  >
                    <RotateCcw className="w-4 h-4 mr-1" />
                    Clear
                  </Button>
                </div>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="text">Text to PDF</TabsTrigger>
                  <TabsTrigger value="html">HTML to PDF</TabsTrigger>
                </TabsList>
                
                <TabsContent value="text" className="space-y-4">
                  <Textarea
                    value={textContent}
                    onChange={(e) => setTextContent(e.target.value)}
                    placeholder="Enter your text content here. You can use Markdown-style formatting like # headers, **bold**, *italic*, etc."
                    className="h-80 resize-none"
                  />
                  <Button
                    onClick={handleConvertText}
                    disabled={isConverting || !textContent.trim()}
                    className="w-full bg-red-600 hover:bg-red-700"
                  >
                    {isConverting ? "Converting..." : "Convert Text to PDF"}
                  </Button>
                </TabsContent>
                
                <TabsContent value="html" className="space-y-4">
                  <Textarea
                    value={htmlContent}
                    onChange={(e) => setHtmlContent(e.target.value)}
                    placeholder="Enter your HTML content here. You can include styling, lists, headings, etc."
                    className="h-80 font-mono text-sm resize-none"
                  />
                  <Button
                    onClick={handleConvertHTML}
                    disabled={isConverting || !htmlContent.trim()}
                    className="w-full bg-red-600 hover:bg-red-700"
                  >
                    {isConverting ? "Converting..." : "Convert HTML to PDF"}
                  </Button>
                </TabsContent>
              </Tabs>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>

            {/* PDF Settings */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">PDF Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="format">Page Format</Label>
                  <Select value={format} onValueChange={(value) => setFormat(value as "A4" | "A3" | "Letter")}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A4">A4 (210 × 297 mm)</SelectItem>
                      <SelectItem value="A3">A3 (297 × 420 mm)</SelectItem>
                      <SelectItem value="Letter">Letter (8.5 × 11 in)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="orientation">Orientation</Label>
                  <Select value={orientation} onValueChange={(value) => setOrientation(value as "portrait" | "landscape")}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="portrait">Portrait</SelectItem>
                      <SelectItem value="landscape">Landscape</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="fontSize">Font Size (pt)</Label>
                  <Input
                    id="fontSize"
                    type="number"
                    min="8"
                    max="24"
                    value={fontSize}
                    onChange={(e) => setFontSize(parseInt(e.target.value) || 12)}
                  />
                </div>

                <div>
                  <Label htmlFor="margin">Margin (mm)</Label>
                  <Input
                    id="margin"
                    type="number"
                    min="10"
                    max="50"
                    value={margin}
                    onChange={(e) => setMargin(parseInt(e.target.value) || 20)}
                  />
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Preview Settings</h4>
                  <p className="text-sm text-gray-600">
                    Format: {format} {orientation}<br />
                    Font: {fontSize}pt<br />
                    Margins: {margin}mm
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">How to use:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Choose between Text or HTML conversion modes</li>
              <li>• Enter your content or load a sample to get started</li>
              <li>• Adjust PDF settings like format, orientation, and font size</li>
              <li>• Click convert to generate and download your PDF</li>
              <li>• HTML mode preserves styling and supports complex layouts</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}