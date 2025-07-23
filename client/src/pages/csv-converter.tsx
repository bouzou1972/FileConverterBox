import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Upload, Download, Copy, RotateCcw } from "lucide-react";
import BuyMeCoffee from "@/components/buy-me-coffee";
import { 
  parseCSV, 
  parseTSV, 
  parseJSON, 
  parseYAML, 
  convertToCSV, 
  convertToTSV, 
  convertToJSON, 
  convertToYAML,
  downloadFile 
} from "@/lib/utils/data-converter";

export default function CsvConverter() {
  const [inputData, setInputData] = useState("");
  const [outputData, setOutputData] = useState("");
  const [inputFormat, setInputFormat] = useState("csv");
  const [outputFormat, setOutputFormat] = useState("json");
  const [error, setError] = useState("");
  const [isConverting, setIsConverting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setInputData(content);
        
        // Auto-detect format based on file extension
        const extension = file.name.split('.').pop()?.toLowerCase();
        if (extension && ['csv', 'json', 'yaml', 'yml', 'tsv'].includes(extension)) {
          setInputFormat(extension === 'yml' ? 'yaml' : extension);
        }
      };
      reader.readAsText(file);
    }
  };

  const convertData = () => {
    if (!inputData.trim()) {
      setError("Please enter some data to convert");
      return;
    }

    setIsConverting(true);
    setError("");

    try {
      // Parse input based on format
      let parseResult;
      switch (inputFormat) {
        case 'csv':
          parseResult = parseCSV(inputData);
          break;
        case 'json':
          parseResult = parseJSON(inputData);
          break;
        case 'yaml':
          parseResult = parseYAML(inputData);
          break;
        case 'tsv':
          parseResult = parseTSV(inputData);
          break;
        default:
          throw new Error("Unsupported input format");
      }

      if (!parseResult.success) {
        setError(parseResult.error || "Failed to parse input data");
        setOutputData("");
        return;
      }

      // Convert to output format
      let convertResult;
      switch (outputFormat) {
        case 'csv':
          convertResult = convertToCSV(parseResult.data);
          break;
        case 'json':
          convertResult = convertToJSON(parseResult.data);
          break;
        case 'yaml':
          convertResult = convertToYAML(parseResult.data);
          break;
        case 'tsv':
          convertResult = convertToTSV(parseResult.data);
          break;
        default:
          throw new Error("Unsupported output format");
      }

      if (!convertResult.success) {
        setError(convertResult.error || "Failed to convert data");
        setOutputData("");
        return;
      }

      setOutputData(convertResult.data);
      toast({
        title: "Success",
        description: "Data converted successfully!"
      });
    } catch (error) {
      setError((error as Error).message);
      setOutputData("");
    } finally {
      setIsConverting(false);
    }
  };

  const copyToClipboard = () => {
    if (outputData) {
      navigator.clipboard.writeText(outputData);
      toast({
        title: "Copied",
        description: "Output copied to clipboard!"
      });
    }
  };

  const downloadOutput = () => {
    if (outputData) {
      downloadFile(outputData, `converted_data.${outputFormat}`, 'text/plain');
      toast({
        title: "Downloaded",
        description: "File downloaded successfully!"
      });
    }
  };

  const clearAll = () => {
    setInputData("");
    setOutputData("");
    setError("");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <span className="material-icons text-blue-500 text-3xl">code</span>
            CSV ↔ JSON/YAML/TSV Converter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-700">Input Data</label>
                <div className="flex gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept=".csv,.json,.yaml,.yml,.tsv"
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-4 h-4 mr-1" />
                    Upload
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearAll}
                  >
                    <RotateCcw className="w-4 h-4 mr-1" />
                    Clear
                  </Button>
                </div>
              </div>
              
              <Textarea
                value={inputData}
                onChange={(e) => setInputData(e.target.value)}
                placeholder="Paste your CSV, JSON, YAML, or TSV data here..."
                className="h-64 font-mono text-sm resize-none"
              />
              
              <div className="flex gap-2">
                <Select value={inputFormat} onValueChange={setInputFormat}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="json">JSON</SelectItem>
                    <SelectItem value="yaml">YAML</SelectItem>
                    <SelectItem value="tsv">TSV</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button 
                  onClick={convertData} 
                  disabled={isConverting || !inputData.trim()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <span className="material-icons text-sm mr-1">transform</span>
                  {isConverting ? "Converting..." : "Convert"}
                </Button>
              </div>
            </div>

            {/* Output Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-700">Converted Output</label>
                <div className="flex gap-2">
                  <Select value={outputFormat} onValueChange={setOutputFormat}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="json">JSON</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="yaml">YAML</SelectItem>
                      <SelectItem value="tsv">TSV</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={downloadOutput}
                    disabled={!outputData}
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyToClipboard}
                    disabled={!outputData}
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    Copy
                  </Button>
                </div>
              </div>
              
              <Textarea
                value={outputData}
                readOnly
                className="h-64 font-mono text-sm bg-gray-50 resize-none"
                placeholder="Converted data will appear here..."
              />
              
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
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
