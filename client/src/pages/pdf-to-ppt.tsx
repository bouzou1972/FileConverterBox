import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Upload, Download, FileText, Presentation } from "lucide-react";
import BuyMeCoffee from "@/components/buy-me-coffee";
import { ToolSEO } from "@/components/tool-seo";
import { ShareButtons } from "@/components/share-buttons";
import { UsageGuide } from "@/components/usage-guide";
import { BookmarkButton } from "@/components/bookmark-button";
import { convertPdfToPpt } from "@/lib/utils/pdf-to-ppt";

export default function PdfToPpt() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState("");
  const [slideLayout, setSlideLayout] = useState<"text-only" | "title-content" | "image-text">("title-content");
  const [extractImages, setExtractImages] = useState(true);
  const [maxSlides, setMaxSlides] = useState(50);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setError("");
    } else {
      setError("Please select a valid PDF file");
      setSelectedFile(null);
    }
  };

  const handleConvert = async () => {
    if (!selectedFile) {
      setError("Please select a PDF file to convert");
      return;
    }

    setIsConverting(true);
    setError("");

    try {
      const options = {
        slideLayout,
        extractImages,
        maxSlides
      };

      const result = await convertPdfToPpt(selectedFile, options);

      if (result.success) {
        toast({
          title: "Success",
          description: `PDF converted to PowerPoint successfully! ${result.slideCount} slides created.`
        });
      } else {
        setError(result.error || "Failed to convert PDF to PowerPoint");
      }
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setIsConverting(false);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const usageExamples = [
    {
      title: "Convert Academic PDFs",
      description: "Transform research papers and academic documents into presentations",
      steps: [
        "Upload your PDF document (research paper, thesis, etc.)",
        "Choose slide layout style (title-content recommended)",
        "Set maximum slides limit for manageable presentations",
        "Enable image extraction for visual content",
        "Download the generated PowerPoint presentation"
      ],
      tip: "Academic PDFs work best with title-content layout for structured content"
    },
    {
      title: "Business Report Conversion",
      description: "Convert business documents into presentation format",
      steps: [
        "Select your business PDF (report, proposal, whitepaper)",
        "Use title-content layout for professional appearance",
        "Keep slide limit reasonable (20-50 slides)",
        "Extract images to maintain visual elements",
        "Review and edit the generated presentation"
      ],
      tip: "Limit slides to 30-40 for effective business presentations"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <ToolSEO
        title="PDF to PowerPoint Converter - Convert PDF to PPT Online"
        description="Convert PDF documents to PowerPoint presentations with automatic slide generation. Extract content and images from PDFs to create editable PPT files."
        keywords={["pdf to ppt", "pdf to powerpoint", "pdf converter", "slides generator", "presentation converter"]}
        canonicalUrl="/pdf-to-ppt"
      />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <span className="material-icons text-orange-600 text-3xl">slideshow</span>
            PDF to PPT Converter
          </CardTitle>
          <p className="text-gray-600">
            Convert PDF documents to PowerPoint presentations with automatic slide generation
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* File Upload Section */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Select PDF File</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-4 h-4 mr-1" />
                  Upload PDF
                </Button>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".pdf,application/pdf"
                className="hidden"
              />

              {!selectedFile ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">
                    Upload PDF to Convert
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Select a PDF file to convert to PowerPoint presentation
                  </p>
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Choose PDF File
                  </Button>
                </div>
              ) : (
                <div className="border rounded-lg p-6 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="w-8 h-8 text-red-600" />
                      <div>
                        <p className="font-medium">{selectedFile.name}</p>
                        <p className="text-sm text-gray-500">
                          Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={removeFile}
                      disabled={isConverting}
                    >
                      Remove
                    </Button>
                  </div>

                  <Button
                    onClick={handleConvert}
                    disabled={isConverting}
                    className="w-full mt-4 bg-orange-600 hover:bg-orange-700"
                    size="lg"
                  >
                    {isConverting ? (
                      <>Converting PDF to PowerPoint...</>
                    ) : (
                      <>
                        <Presentation className="w-4 h-4 mr-2" />
                        Convert to PowerPoint
                      </>
                    )}
                  </Button>
                </div>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>

            {/* Conversion Settings */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Conversion Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="slideLayout">Slide Layout</Label>
                  <Select value={slideLayout} onValueChange={(value) => setSlideLayout(value as any)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="title-content">Title + Content</SelectItem>
                      <SelectItem value="text-only">Text Only</SelectItem>
                      <SelectItem value="image-text">Image + Text</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500 mt-1">
                    How content should be organized on slides
                  </p>
                </div>

                <div>
                  <Label htmlFor="maxSlides">Maximum Slides</Label>
                  <Input
                    id="maxSlides"
                    type="number"
                    min="1"
                    max="100"
                    value={maxSlides}
                    onChange={(e) => setMaxSlides(parseInt(e.target.value) || 50)}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Limit the number of slides to generate
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="extractImages"
                    checked={extractImages}
                    onChange={(e) => setExtractImages(e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="extractImages" className="text-sm">
                    Extract and include images
                  </Label>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Current Settings</h4>
                  <p className="text-sm text-gray-600">
                    Layout: {slideLayout.replace('-', ' ')}<br />
                    Max slides: {maxSlides}<br />
                    Images: {extractImages ? 'Included' : 'Text only'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-orange-50 rounded-lg">
            <h4 className="font-medium text-orange-900 mb-2">PDF to PPT Converter Features:</h4>
            <ul className="text-sm text-orange-800 space-y-1">
              <li>• Automatically extracts text content from PDF pages</li>
              <li>• Creates structured PowerPoint slides with proper formatting</li>
              <li>• Supports multiple slide layouts and customization options</li>
              <li>• Extracts and includes images from PDF (optional)</li>
              <li>• Maintains text hierarchy and structure when possible</li>
              <li>• Generates downloadable .pptx files compatible with PowerPoint</li>
            </ul>
          </div>

          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">How it works:</h4>
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>Upload your PDF file using the file selector above</li>
              <li>Choose your preferred slide layout and conversion settings</li>
              <li>Click "Convert to PowerPoint" to start the conversion process</li>
              <li>The converter will analyze each page and extract text content</li>
              <li>A PowerPoint file will be automatically generated and downloaded</li>
            </ol>
          </div>
        </CardContent>
      </Card>
      
      <div className="text-center mt-8">
        <ShareButtons 
          title="PDF to PowerPoint Converter - Convert PDF to PPT Online"
          description="Convert PDF documents to PowerPoint presentations with automatic slide generation"
        />
        
        <UsageGuide 
          title="PDF to PowerPoint Converter"
          description="Learn how to effectively convert PDF documents into editable PowerPoint presentations"
          examples={usageExamples}
          tips={[
            "Academic PDFs work best with title-content layout",
            "Limit slides to 30-40 for effective presentations",
            "Enable image extraction to preserve visual elements",
            "Review generated slides for formatting adjustments",
            "Use structured PDFs for better conversion results"
          ]}
          commonUses={[
            "Academic presentations",
            "Business reports",
            "Research papers",
            "Training materials",
            "Conference presentations"
          ]}
        />

        <BuyMeCoffee />
      </div>
    </div>
  );
}