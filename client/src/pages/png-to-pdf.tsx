import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Upload, Download, RotateCcw, Image } from "lucide-react";
import { 
  convertImageToPDF, 
  downloadPDF,
  type PDFConversionOptions 
} from "@/lib/utils/pdf";

export default function PngToPdf() {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [format, setFormat] = useState<"A4" | "A3" | "Letter">("A4");
  const [orientation, setOrientation] = useState<"portrait" | "landscape">("portrait");
  const [margin, setMargin] = useState(20);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      const validImages = files.filter(file => file.type.startsWith('image/'));
      
      if (validImages.length !== files.length) {
        setError("Some files were not valid images and were skipped");
      } else {
        setError("");
      }

      setSelectedImages(validImages);
      
      // Create previews
      const previews: (string | undefined)[] = new Array(validImages.length);
      let loadedCount = 0;
      
      validImages.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          previews[index] = e.target?.result as string;
          loadedCount++;
          if (loadedCount === validImages.length) {
            setImagePreviews(previews.filter((p): p is string => p !== undefined));
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleConvertSingle = async (imageFile: File, index: number) => {
    setIsConverting(true);
    setError("");

    try {
      const options: PDFConversionOptions = {
        format,
        orientation,
        fontSize: 12, // Not used for images but required by interface
        margin
      };

      const result = await convertImageToPDF(imageFile, options);

      if (result.success && result.blob) {
        const fileName = imageFile.name.replace(/\.[^/.]+$/, "");
        downloadPDF(result.blob, `${fileName}.pdf`);
        toast({
          title: "Success",
          description: `${imageFile.name} converted to PDF successfully!`
        });
      } else {
        setError(result.error || `Failed to convert ${imageFile.name} to PDF`);
      }
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setIsConverting(false);
    }
  };

  const handleConvertAll = async () => {
    if (selectedImages.length === 0) {
      setError("Please select at least one image to convert");
      return;
    }

    setIsConverting(true);
    setError("");

    try {
      for (let i = 0; i < selectedImages.length; i++) {
        const imageFile = selectedImages[i];
        const options: PDFConversionOptions = {
          format,
          orientation,
          fontSize: 12,
          margin
        };

        const result = await convertImageToPDF(imageFile, options);

        if (result.success && result.blob) {
          const fileName = imageFile.name.replace(/\.[^/.]+$/, "");
          downloadPDF(result.blob, `${fileName}.pdf`);
        } else {
          console.error(`Failed to convert ${imageFile.name}`);
        }
      }

      toast({
        title: "Success",
        description: `All ${selectedImages.length} images converted to PDF successfully!`
      });
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setIsConverting(false);
    }
  };

  const removeImage = (index: number) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setSelectedImages(newImages);
    setImagePreviews(newPreviews);
  };

  const clearAll = () => {
    setSelectedImages([]);
    setImagePreviews([]);
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <span className="material-icons text-orange-600 text-3xl">image</span>
            PNG to PDF Converter
          </CardTitle>
          <p className="text-gray-600">
            Convert PNG, JPG, JPEG, GIF, and WebP images to PDF format with customizable settings
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Image Upload Section */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Select Images</h3>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-4 h-4 mr-1" />
                    Upload Images
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearAll}
                    disabled={selectedImages.length === 0}
                  >
                    <RotateCcw className="w-4 h-4 mr-1" />
                    Clear All
                  </Button>
                </div>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                multiple
                className="hidden"
              />

              {selectedImages.length === 0 ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                  <Image className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">
                    Upload Images to Convert
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Select one or more images to convert to PDF format
                  </p>
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Choose Images
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {selectedImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <div className="border rounded-lg p-2 bg-white shadow-sm">
                          {imagePreviews[index] && (
                            <img
                              src={imagePreviews[index]}
                              alt={image.name}
                              className="w-full h-32 object-cover rounded mb-2"
                            />
                          )}
                          <p className="text-xs text-gray-600 truncate" title={image.name}>
                            {image.name}
                          </p>
                          <div className="flex gap-1 mt-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleConvertSingle(image, index)}
                              disabled={isConverting}
                              className="flex-1 text-xs"
                            >
                              Convert
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => removeImage(index)}
                              disabled={isConverting}
                              className="text-red-600 hover:text-red-700 text-xs"
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button
                    onClick={handleConvertAll}
                    disabled={isConverting || selectedImages.length === 0}
                    className="w-full bg-orange-600 hover:bg-orange-700"
                    size="lg"
                  >
                    {isConverting ? "Converting..." : `Convert All ${selectedImages.length} Images to PDF`}
                  </Button>
                </div>
              )}

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
                  <h4 className="font-medium mb-2">Current Settings</h4>
                  <p className="text-sm text-gray-600">
                    Format: {format} {orientation}<br />
                    Margins: {margin}mm<br />
                    Images: {selectedImages.length} selected
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-orange-50 rounded-lg">
            <h4 className="font-medium text-orange-900 mb-2">PNG to PDF Converter Features:</h4>
            <ul className="text-sm text-orange-800 space-y-1">
              <li>• Convert PNG, JPG, JPEG, GIF, and WebP images to PDF</li>
              <li>• Multiple image upload and batch conversion</li>
              <li>• Individual or bulk conversion options</li>
              <li>• Automatic image scaling and centering</li>
              <li>• Maintains original aspect ratios</li>
              <li>• Customizable page formats and orientations</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}