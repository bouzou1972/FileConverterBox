import { useState, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, Download, Eraser, RefreshCw, Info, Undo, Redo } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import BuyMeCoffee from "@/components/buy-me-coffee";
import { ToolSEO } from "@/components/tool-seo";
import { ShareButtons } from "@/components/share-buttons";
import { UsageGuide } from "@/components/usage-guide";
import { BookmarkButton } from "@/components/bookmark-button";

export default function LogoCleaner() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [brushSize, setBrushSize] = useState(20);
  const [tolerance, setTolerance] = useState(30);
  const [isErasing, setIsErasing] = useState(false);
  const [undoStack, setUndoStack] = useState<ImageData[]>([]);
  const [redoStack, setRedoStack] = useState<ImageData[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file (PNG, JPG, JPEG, GIF)",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 20MB",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
    const img = new Image();
    img.onload = () => {
      setOriginalImage(img);
      initializeCanvas(img);
      setUndoStack([]);
      setRedoStack([]);
    };
    img.src = URL.createObjectURL(file);
  };

  const initializeCanvas = (img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    const overlayCanvas = overlayCanvasRef.current;
    if (!canvas || !overlayCanvas) return;

    const ctx = canvas.getContext('2d')!;
    const overlayCtx = overlayCanvas.getContext('2d')!;

    // Set canvas dimensions
    const maxWidth = 800;
    const maxHeight = 600;
    const scale = Math.min(maxWidth / img.width, maxHeight / img.height, 1);
    
    canvas.width = img.width * scale;
    canvas.height = img.height * scale;
    overlayCanvas.width = canvas.width;
    overlayCanvas.height = canvas.height;

    // Draw original image
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    
    // Save initial state
    saveToUndoStack();
  };

  const saveToUndoStack = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d')!;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    setUndoStack(prev => [...prev.slice(-19), imageData]); // Keep last 20 states
    setRedoStack([]); // Clear redo stack when new action is performed
  };

  const undo = () => {
    if (undoStack.length <= 1) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d')!;
    const currentState = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const previousState = undoStack[undoStack.length - 2];

    setRedoStack(prev => [...prev, currentState]);
    setUndoStack(prev => prev.slice(0, -1));
    
    ctx.putImageData(previousState, 0, 0);
  };

  const redo = () => {
    if (redoStack.length === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d')!;
    const currentState = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const redoState = redoStack[redoStack.length - 1];

    setUndoStack(prev => [...prev, currentState]);
    setRedoStack(prev => prev.slice(0, -1));
    
    ctx.putImageData(redoState, 0, 0);
  };

  const getMousePos = (canvas: HTMLCanvasElement, e: React.MouseEvent) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  const colorDistance = (r1: number, g1: number, b1: number, r2: number, g2: number, b2: number) => {
    return Math.sqrt((r2 - r1) ** 2 + (g2 - g1) ** 2 + (b2 - b1) ** 2);
  };

  const floodFill = (startX: number, startY: number, targetColor: [number, number, number, number]) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d')!;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const width = canvas.width;
    const height = canvas.height;

    const startIndex = (Math.floor(startY) * width + Math.floor(startX)) * 4;
    const startColor: [number, number, number, number] = [
      data[startIndex],
      data[startIndex + 1], 
      data[startIndex + 2],
      data[startIndex + 3]
    ];

    if (colorDistance(startColor[0], startColor[1], startColor[2], targetColor[0], targetColor[1], targetColor[2]) < 10) {
      return; // Already similar color
    }

    const stack = [[Math.floor(startX), Math.floor(startY)]];
    const visited = new Set<string>();

    while (stack.length > 0) {
      const [x, y] = stack.pop()!;
      const key = `${x},${y}`;
      
      if (visited.has(key) || x < 0 || x >= width || y < 0 || y >= height) continue;
      visited.add(key);

      const index = (y * width + x) * 4;
      const currentColor: [number, number, number, number] = [
        data[index],
        data[index + 1],
        data[index + 2], 
        data[index + 3]
      ];

      if (colorDistance(currentColor[0], currentColor[1], currentColor[2], startColor[0], startColor[1], startColor[2]) <= tolerance) {
        // Make transparent
        data[index + 3] = 0;
        
        // Add neighboring pixels
        stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
      }
    }

    ctx.putImageData(imageData, 0, 0);
  };

  const brushErase = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d')!;
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, brushSize / 2, 0, 2 * Math.PI);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;
    
    const pos = getMousePos(canvasRef.current, e);
    setIsErasing(true);
    
    if (e.shiftKey) {
      // Magic wand mode (flood fill)
      saveToUndoStack();
      floodFill(pos.x, pos.y, [0, 0, 0, 0]);
    } else {
      // Brush mode
      saveToUndoStack();
      brushErase(pos.x, pos.y);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isErasing || e.shiftKey) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const pos = getMousePos(canvas, e);
    brushErase(pos.x, pos.y);
  };

  const handleMouseUp = () => {
    setIsErasing(false);
  };

  const resetImage = () => {
    if (!originalImage) return;
    
    initializeCanvas(originalImage);
    toast({
      title: "Image reset",
      description: "Restored original image",
    });
  };

  const downloadResult = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Create a new canvas with transparent background
    const outputCanvas = document.createElement('canvas');
    const outputCtx = outputCanvas.getContext('2d')!;
    
    outputCanvas.width = canvas.width;
    outputCanvas.height = canvas.height;
    
    // Copy the edited image
    outputCtx.drawImage(canvas, 0, 0);
    
    // Download as PNG to preserve transparency
    const link = document.createElement('a');
    link.download = `logo-cleaned-${Date.now()}.png`;
    link.href = outputCanvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Download started",
      description: "Your cleaned logo is being downloaded",
    });
  };

  const usageExamples = [
    {
      title: "Remove Logo Backgrounds",
      description: "Clean up logos and graphics by removing unwanted backgrounds",
      steps: [
        "Upload your logo or graphic image",
        "Use the magic wand tool to automatically select similar colors",
        "Adjust tolerance setting for better color selection",
        "Use brush tool for manual background removal",
        "Download the cleaned image with transparent background"
      ],
      tip: "Start with the magic wand on solid color backgrounds for quick removal"
    },
    {
      title: "Clean Product Images",
      description: "Remove backgrounds from product photos for e-commerce",
      steps: [
        "Upload your product image",
        "Use magic wand tool for solid backgrounds",
        "Switch to brush tool for detailed edges",
        "Adjust brush size for precision work",
        "Use undo/redo for corrections and download final image"
      ],
      tip: "Use smaller brush sizes around detailed edges for better results"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <ToolSEO
        title="Logo Background Remover - Remove Image Backgrounds Online"
        description="Remove backgrounds from logos and images with magic wand and brush tools. Clean up graphics with transparent backgrounds for professional use."
        keywords={["background remover", "logo cleaner", "remove background", "transparent background", "image editor"]}
        canonicalUrl="/logo-cleaner"
      />
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Logo Background Remover</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Remove backgrounds from logos and images with precision. Use brush mode for manual removal 
          or magic wand mode (hold Shift + click) for automatic color-based removal.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Upload Image
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="logo-upload"
              />
              <label htmlFor="logo-upload" className="cursor-pointer">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-700 mb-2">
                  Drop logo here or click to browse
                </p>
                <p className="text-sm text-gray-500">
                  Supports PNG, JPG, JPEG, GIF (Max 20MB)
                </p>
              </label>
            </div>

            {selectedFile && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Selected File:</h4>
                <p className="text-sm text-gray-600">{selectedFile.name}</p>
                <p className="text-sm text-gray-600">
                  Size: {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tools & Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brush Size: {brushSize}px
              </label>
              <Slider
                value={[brushSize]}
                onValueChange={(value) => setBrushSize(value[0])}
                max={100}
                min={5}
                step={5}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Magic Wand Tolerance: {tolerance}
              </label>
              <Slider
                value={[tolerance]}
                onValueChange={(value) => setTolerance(value[0])}
                max={100}
                min={0}
                step={5}
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={undo}
                disabled={undoStack.length <= 1}
              >
                <Undo className="w-4 h-4 mr-2" />
                Undo
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={redo}
                disabled={redoStack.length === 0}
              >
                <Redo className="w-4 h-4 mr-2" />
                Redo
              </Button>
            </div>

            <Button
              variant="outline"
              onClick={resetImage}
              disabled={!originalImage}
              className="w-full"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset Image
            </Button>

            <Button
              onClick={downloadResult}
              disabled={!originalImage}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Download PNG
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>How to Use</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-3">
            <div>
              <h4 className="font-semibold text-blue-600 mb-1">Brush Mode (Default)</h4>
              <p className="text-gray-600">
                Click and drag to manually erase parts of the image. 
                Adjust brush size for precision.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-blue-600 mb-1">Magic Wand Mode</h4>
              <p className="text-gray-600">
                Hold <kbd className="px-1 bg-gray-200 rounded">Shift</kbd> + click to automatically 
                remove similar colors. Adjust tolerance for sensitivity.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-blue-600 mb-1">Tips</h4>
              <ul className="text-gray-600 space-y-1">
                <li>• Use magic wand for solid backgrounds</li>
                <li>• Use brush for detailed cleanup</li>
                <li>• Lower tolerance = more precise selection</li>
                <li>• Higher tolerance = removes more similar colors</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-blue-600 mb-1">Keyboard Shortcuts</h4>
              <ul className="text-gray-600 space-y-1">
                <li>• <kbd className="px-1 bg-gray-200 rounded">Ctrl+Z</kbd> Undo</li>
                <li>• <kbd className="px-1 bg-gray-200 rounded">Ctrl+Y</kbd> Redo</li>
                <li>• <kbd className="px-1 bg-gray-200 rounded">Shift+Click</kbd> Magic Wand</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {originalImage && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eraser className="w-5 h-5" />
              Editor Canvas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative border rounded-lg overflow-hidden bg-gray-100 bg-opacity-50 bg-[linear-gradient(45deg,#f0f0f0_25%,transparent_25%),linear-gradient(-45deg,#f0f0f0_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#f0f0f0_75%),linear-gradient(-45deg,transparent_75%,#f0f0f0_75%)] bg-[length:20px_20px] bg-[position:0_0,0_10px,10px_-10px,-10px_0px]">
              <canvas
                ref={canvasRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                className="cursor-crosshair max-w-full h-auto"
                style={{ 
                  cursor: isErasing ? 'none' : 'crosshair',
                  display: 'block',
                  margin: '0 auto'
                }}
              />
              <canvas 
                ref={overlayCanvasRef}
                className="absolute inset-0 pointer-events-none"
              />
            </div>
            
            <div className="mt-4 text-center text-sm text-gray-600">
              <p>
                <strong>Brush Mode:</strong> Click and drag to erase • 
                <strong> Magic Wand:</strong> Shift + click to remove similar colors
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Alert className="mb-6">
        <Info className="w-4 h-4" />
        <AlertDescription>
          <strong>Manual Background Removal:</strong> This tool provides manual editing capabilities only. 
          For automatic AI-powered background removal, consider using specialized services like Remove.bg or Photoshop.
          The transparent areas will be saved as a PNG file.
        </AlertDescription>
      </Alert>

      <div className="text-center mt-8">
        <ShareButtons 
          title="Logo Background Remover - Remove Image Backgrounds Online"
          description="Remove backgrounds from logos and images with professional editing tools"
        />
        
        <UsageGuide 
          title="Logo Background Remover"
          description="Learn how to effectively remove backgrounds from images and logos"
          examples={usageExamples}
          tips={[
            "Start with the magic wand on solid color backgrounds",
            "Use smaller brush sizes around detailed edges",
            "Adjust tolerance setting for better color selection",
            "Use undo/redo frequently for precision work",
            "Save as PNG to preserve transparency"
          ]}
          commonUses={[
            "Logo cleanup",
            "Product photography",
            "Graphic design",
            "E-commerce images",
            "Marketing materials"
          ]}
        />

        <div className="mb-4">
          <p className="text-lg font-medium text-foreground mb-1">💛 Like these tools?</p>
          <p className="text-muted-foreground">Help support future development</p>
        </div>
        <BuyMeCoffee />
        <p className="text-sm text-gray-600 mt-2">
          All processing happens in your browser - your images never leave your device!
        </p>
      </div>
    </div>
  );
}