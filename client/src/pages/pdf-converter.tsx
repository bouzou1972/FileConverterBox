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
import BuyMeCoffee from "@/components/buy-me-coffee";
import { BookmarkButton } from "@/components/bookmark-button";
import { ToolSEO } from "@/components/tool-seo";
import { ShareButtons } from "@/components/share-buttons";
import { UsageGuide } from "@/components/usage-guide";
import { 
  convertTextToPDF, 
  convertHTMLToPDF, 
  convertImageToPDF,
  downloadPDF, 
  sampleText, 
  sampleHTML,
  type PDFConversionOptions 
} from "@/lib/utils/pdf";

export default function PDFConverter() {
  const [textContent, setTextContent] = useState("");
  const [htmlContent, setHtmlContent] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedImage(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
        setError("");
      } else {
        setError("Please select a valid image file (PNG, JPG, JPEG, etc.)");
      }
    }
  };

  const handleConvertImage = async () => {
    if (!selectedImage) {
      setError("Please select an image to convert");
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

      const result = await convertImageToPDF(selectedImage, options);

      if (result.success && result.blob) {
        downloadPDF(result.blob, `converted-${selectedImage.name.replace(/\.[^/.]+$/, "")}.pdf`);
        toast({
          title: "Success",
          description: "PDF generated and downloaded successfully!"
        });
      } else {
        setError(result.error || "Failed to convert image to PDF");
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
    setSelectedImage(null);
    setImagePreview("");
    setError("");
  };

  const usageExamples = [
    {
      title: "Convert Text Documents",
      description: "Transform plain text or formatted content into professional PDFs",
      steps: [
        "Select 'Text to PDF' tab",
        "Paste your text content or load a sample",
        "Adjust format, orientation, and font settings",
        "Click 'Convert Text to PDF' to download"
      ],
      tip: "Use Markdown-style formatting like # for headers, **bold**, *italic* for better-looking PDFs"
    },
    {
      title: "HTML to PDF Conversion",
      description: "Convert HTML content with styling to PDF format",
      steps: [
        "Switch to 'HTML to PDF' tab", 
        "Enter your HTML content with CSS styling",
        "Configure page settings as needed",
        "Generate your styled PDF document"
      ],
      tip: "Include inline CSS for better styling control in the PDF output"
    },
    {
      title: "Image to PDF Processing",
      description: "Convert images to PDF format with professional layout",
      steps: [
        "Go to 'Image to PDF' tab",
        "Upload PNG, JPG, JPEG, GIF, or WebP images",
        "Set page format and orientation",
        "Convert and download your PDF"
      ],
      tip: "Use A4 portrait for documents, landscape for presentations"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <ToolSEO
        title="PDF Converter - Convert Text, HTML & Images to PDF"
        description="Convert text, HTML, and images to PDF with customizable formatting. Support for multiple formats, orientations, and professional page settings."
        keywords={["pdf converter", "text to pdf", "html to pdf", "image to pdf", "convert pdf", "document converter"]}
        canonicalUrl="/pdf-converter"
      />
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle className="flex items-center gap-3">
              <span className="material-icons text-red-600 text-3xl">picture_as_pdf</span>
              PDF Converter
            </CardTitle>
            <BookmarkButton 
              href="/pdf-converter"
              title="PDF Converter"
              icon="picture_as_pdf"
              iconColor="text-red-600"
              description="Convert text, HTML, and images to PDF with customizable formatting options and page settings"
            />
          </div>
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
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="text">Text to PDF</TabsTrigger>
                  <TabsTrigger value="html">HTML to PDF</TabsTrigger>
                  <TabsTrigger value="image">Image to PDF</TabsTrigger>
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

                <TabsContent value="image" className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    {!imagePreview ? (
                      <div>
                        <label
                          htmlFor="image-upload"
                          className="cursor-pointer flex flex-col items-center"
                        >
                          <Upload className="w-12 h-12 text-gray-400 mb-4" />
                          <p className="text-lg font-medium text-gray-700 mb-2">
                            Upload an Image
                          </p>
                          <p className="text-sm text-gray-500">
                            PNG, JPG, JPEG, GIF, WebP files supported
                          </p>
                        </label>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="max-h-64 mx-auto rounded-lg shadow-md"
                        />
                        <div className="flex gap-2 justify-center">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedImage(null);
                              setImagePreview("");
                            }}
                          >
                            <RotateCcw className="w-4 h-4 mr-1" />
                            Remove
                          </Button>
                          <label htmlFor="image-upload">
                            <Button variant="outline" size="sm" asChild>
                              <span>
                                <Upload className="w-4 h-4 mr-1" />
                                Change
                              </span>
                            </Button>
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                  <Button
                    onClick={handleConvertImage}
                    disabled={isConverting || !selectedImage}
                    className="w-full bg-red-600 hover:bg-red-700"
                  >
                    {isConverting ? "Converting..." : "Convert Image to PDF"}
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
              <li>• Choose between Text, HTML, or Image conversion modes</li>
              <li>• Enter your content, load a sample, or upload an image to get started</li>
              <li>• Adjust PDF settings like format, orientation, and font size</li>
              <li>• Click convert to generate and download your PDF</li>
              <li>• HTML mode preserves styling and supports complex layouts</li>
              <li>• Image mode supports PNG, JPG, JPEG, GIF, and WebP formats</li>
            </ul>
          </div>
        </CardContent>
      </Card>
      
      <ShareButtons 
        title="PDF Converter - Convert Text, HTML & Images to PDF"
        description="Convert text, HTML, and images to PDF with customizable formatting and professional settings"
      />
      
      <UsageGuide 
        title="PDF Converter"
        description="Learn how to convert text, HTML, and images to PDF with professional formatting"
        examples={usageExamples}
        tips={[
          "Choose A4 format for standard documents",
          "Use HTML mode for complex layouts with styling",
          "Adjust margins for better text readability",
          "Portrait orientation works best for text documents",
          "Landscape orientation is ideal for wide content or images"
        ]}
        commonUses={[
          "Document creation",
          "Report generation", 
          "Image compilation",
          "Web page archiving",
          "Content preservation"
        ]}
      />

      <div className="text-center mt-8">
        <BuyMeCoffee />
      </div>
    </div>
  );
}