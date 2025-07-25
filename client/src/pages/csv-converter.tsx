import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Upload, Download, Copy, RotateCcw, Merge, FileSpreadsheet, Sparkles, TrendingUp, ExternalLink, FileText } from "lucide-react";
import { Link } from "wouter";
import BuyMeCoffee from "@/components/buy-me-coffee";
import { ToolSEO } from "@/components/tool-seo";
import { ShareButtons } from "@/components/share-buttons";
import { UsageGuide } from "@/components/usage-guide";
import { BookmarkButton } from "@/components/bookmark-button";
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

  const downloadTemplate = (templateName: string, content: string) => {
    const blob = new Blob([content], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${templateName}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Template Downloaded",
      description: `${templateName} template saved successfully!`
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Hero Section with Usage Stats */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className="material-icons text-blue-500 text-4xl">table_chart</span>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">CSV Converter</h1>
          <Badge className="bg-orange-100 text-orange-800 border-orange-200">
            <TrendingUp className="w-3 h-3 mr-1" />
            #1 Most Popular
          </Badge>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-4 max-w-2xl mx-auto">
          Easily convert, split, and clean your spreadsheet data — all in-browser. No upload needed.
        </p>
        <div className="flex items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span>📈 Used by 3,500+ users this month</span>
          </div>
          <div className="flex items-center gap-1">
            <Sparkles className="w-4 h-4 text-yellow-500" />
            <span>✨ 100% Privacy-First</span>
          </div>
        </div>
      </div>

      {/* Quick Access Ecosystem Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Link href="/csv-merger">
          <Card className="cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Merge className="w-6 h-6 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Merge CSVs</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Combine multiple files</p>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/excel-converter">
          <Card className="cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <FileSpreadsheet className="w-6 h-6 text-green-600" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Convert to Excel</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">CSV ↔ XLSX formats</p>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/data-cleaner">
          <Card className="cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-orange-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-orange-600" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Clean CSV Data</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Fix formatting issues</p>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* CSV Templates Section */}
      <Card className="mb-8 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="w-5 h-5 text-blue-600" />
            CSV Template Samples
            <Badge variant="secondary">SEO Boost</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              className="h-auto p-4 text-left flex flex-col items-start"
              onClick={() => downloadTemplate("inventory-management", "Product ID,Product Name,Category,Quantity,Price,Supplier\n1,Laptop Computer,Electronics,25,899.99,TechSupply Corp\n2,Office Chair,Furniture,15,199.99,ComfortSeating Ltd\n3,Desk Lamp,Lighting,30,49.99,BrightLights Inc")}
            >
              <div className="font-semibold">📦 Inventory Management</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Product tracking template</div>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-auto p-4 text-left flex flex-col items-start"
              onClick={() => downloadTemplate("budget-tracker", "Date,Category,Description,Amount,Type\n2024-01-15,Food,Grocery Shopping,-125.50,Expense\n2024-01-15,Salary,Monthly Salary,3500.00,Income\n2024-01-16,Transportation,Gas Station,-45.00,Expense\n2024-01-18,Utilities,Electric Bill,-89.99,Expense")}
            >
              <div className="font-semibold">💰 Budget Tracker</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Personal finance template</div>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-auto p-4 text-left flex flex-col items-start"
              onClick={() => downloadTemplate("contacts-export", "First Name,Last Name,Email,Phone,Company,Job Title\nJohn,Smith,john.smith@email.com,555-0123,TechCorp,Software Engineer\nSarah,Johnson,sarah.j@company.com,555-0456,DesignStudio,UI Designer\nMike,Wilson,mike.wilson@biz.com,555-0789,MarketingPro,Account Manager")}
            >
              <div className="font-semibold">📇 Contacts Export</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Contact list format</div>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle className="flex items-center gap-3">
              <span className="material-icons text-blue-500 text-3xl">code</span>
              CSV ↔ JSON/YAML/TSV Converter
            </CardTitle>
            <BookmarkButton 
              href="/csv-converter"
              title="CSV Converter"
              icon="table_chart"
              iconColor="text-blue-600"
              description="Convert between CSV, JSON, YAML, and TSV formats with drag-and-drop support"
            />
          </div>
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
      
      {/* SEO and Social Components */}
      <div className="mt-12 space-y-8">
        <ToolSEO 
          title="CSV Converter - Convert CSV to JSON, YAML, TSV | File Converter Box"
          description="Free CSV converter tool. Convert CSV files to JSON, YAML, TSV formats instantly. Drag-and-drop support, client-side processing for privacy. Most popular data conversion tool."
          keywords={["CSV converter", "JSON converter", "YAML converter", "TSV converter", "data format conversion", "spreadsheet converter", "file converter"]}
          canonicalUrl="/csv-converter"
        />
        
        <ShareButtons 
          title="CSV Converter - Free Data Format Conversion Tool"
          description="Convert CSV files to JSON, YAML, TSV formats with our privacy-first tool. No uploads needed!"
        />
        
        <UsageGuide 
          title="CSV Converter"
          description="Master data format conversion with our comprehensive guide"
          examples={[
            {
              title: "Upload or Paste Your Data",
              description: "Either upload a CSV/JSON/YAML/TSV file or paste your data directly into the input area.",
              steps: ["Click 'Upload' button or paste: Name,Age,City", "John,25,NYC", "Sarah,30,LA"]
            },
            {
              title: "Select Input Format",
              description: "Choose the format of your source data from the dropdown menu.",
              tip: "Format is auto-detected based on file extension"
            },
            {
              title: "Choose Output Format",
              description: "Pick the format you want to convert your data to.",
              steps: ["Select 'JSON' to get:", "[{\"Name\":\"John\",\"Age\":\"25\",\"City\":\"NYC\"}]"]
            },
            {
              title: "Convert and Download",
              description: "Click 'Convert' to transform your data, then copy or download the result.",
              tip: "Use 'Copy' for quick access or 'Download' to save as a file"
            }
          ]}
          tips={[
            "File format is auto-detected based on file extension",
            "Use the ecosystem buttons above for advanced CSV operations",
            "Download template samples for common use cases",
            "All processing happens in your browser for maximum privacy",
            "Large files are supported without size limits"
          ]}
          commonUses={[
            "Data Migration",
            "Configuration Files", 
            "Spreadsheet Integration",
            "API Development"
          ]}
        />
      </div>

      <div className="text-center mt-8">
        <BuyMeCoffee />
      </div>
    </div>
  );
}
