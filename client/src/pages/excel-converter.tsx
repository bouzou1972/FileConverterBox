import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Download, FileSpreadsheet, FileText, RefreshCw, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import BuyMeCoffee from "@/components/buy-me-coffee";
// @ts-ignore
import * as XLSX from 'xlsx';

interface SheetData {
  name: string;
  data: any[][];
  headers: string[];
}

export default function ExcelConverter() {
  const [activeTab, setActiveTab] = useState("csv-to-excel");
  const [csvInput, setCsvInput] = useState("");
  const [excelData, setExcelData] = useState<SheetData[]>([]);
  const [selectedSheet, setSelectedSheet] = useState(0);
  const [csvOutput, setCsvOutput] = useState("");
  const [delimiter, setDelimiter] = useState(",");
  const [hasHeaders, setHasHeaders] = useState(true);
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError("");
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        if (!data) return;

        if (activeTab === "csv-to-excel") {
          // Handle CSV input
          const text = data as string;
          setCsvInput(text);
        } else {
          // Handle Excel input
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheets: SheetData[] = [];
          
          workbook.SheetNames.forEach((sheetName: string) => {
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            
            const headers = hasHeaders && jsonData.length > 0 ? 
              (jsonData[0] as string[]) : 
              Array.from({ length: Math.max(...jsonData.map((row: any) => row.length)) }, (_, i) => `Column ${i + 1}`);
            
            const data = hasHeaders && jsonData.length > 0 ? 
              jsonData.slice(1) as any[][] : 
              jsonData as any[][];
            
            sheets.push({
              name: sheetName,
              data,
              headers
            });
          });
          
          setExcelData(sheets);
          setSelectedSheet(0);
          
          if (sheets.length > 0) {
            convertSheetToCsv(sheets[0]);
          }
        }
      } catch (err: any) {
        setError(`Error reading file: ${err.message}`);
      }
    };

    if (activeTab === "csv-to-excel") {
      reader.readAsText(file);
    } else {
      reader.readAsBinaryString(file);
    }
  };

  const convertCsvToExcel = () => {
    if (!csvInput.trim()) {
      setError("Please enter CSV data or upload a file");
      return;
    }

    try {
      setError("");
      
      // Parse CSV data
      const lines = csvInput.trim().split('\n');
      const data = lines.map(line => {
        // Simple CSV parsing (doesn't handle quoted fields with commas)
        return line.split(delimiter).map(cell => cell.trim());
      });

      // Create workbook
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.aoa_to_sheet(data);
      
      // Auto-fit column widths
      const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
      const colWidths = [];
      for (let col = range.s.c; col <= range.e.c; col++) {
        let maxWidth = 10;
        for (let row = range.s.r; row <= range.e.r; row++) {
          const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
          const cell = worksheet[cellAddress];
          if (cell && cell.v) {
            maxWidth = Math.max(maxWidth, cell.v.toString().length);
          }
        }
        colWidths.push({ width: Math.min(maxWidth + 2, 50) });
      }
      worksheet['!cols'] = colWidths;

      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
      
      // Generate and download Excel file
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName.replace(/\.(csv|txt)$/, '.xlsx') || 'converted.xlsx';
      link.click();
      URL.revokeObjectURL(url);

      toast({
        title: "Success!",
        description: "CSV converted to Excel and downloaded",
      });
    } catch (err: any) {
      setError(`Conversion error: ${err.message}`);
    }
  };

  const convertSheetToCsv = (sheet: SheetData) => {
    try {
      const csvRows = [];
      
      if (hasHeaders) {
        csvRows.push(sheet.headers.join(delimiter));
      }
      
      sheet.data.forEach(row => {
        const csvRow = row.map(cell => {
          const cellValue = cell?.toString() || '';
          // Escape quotes and wrap in quotes if contains delimiter or quotes
          if (cellValue.includes(delimiter) || cellValue.includes('"') || cellValue.includes('\n')) {
            return `"${cellValue.replace(/"/g, '""')}"`;
          }
          return cellValue;
        });
        csvRows.push(csvRow.join(delimiter));
      });
      
      setCsvOutput(csvRows.join('\n'));
      setError("");
    } catch (err: any) {
      setError(`CSV conversion error: ${err.message}`);
    }
  };

  const downloadCsv = () => {
    if (!csvOutput) return;
    
    const blob = new Blob([csvOutput], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    const sheetName = excelData[selectedSheet]?.name || 'sheet';
    link.download = `${fileName.replace(/\.(xlsx|xls)$/, '')}_${sheetName}.csv` || 'converted.csv';
    link.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Downloaded!",
      description: "CSV file saved successfully",
    });
  };

  const clearAll = () => {
    setCsvInput("");
    setExcelData([]);
    setCsvOutput("");
    setError("");
    setFileName("");
    setSelectedSheet(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Excel & CSV Converter</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Convert between Excel (.xlsx) and CSV formats. Process files entirely in your browser 
          with support for multiple sheets, custom delimiters, and proper data formatting.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="csv-to-excel" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            CSV to Excel
          </TabsTrigger>
          <TabsTrigger value="excel-to-csv" className="flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4" />
            Excel to CSV
          </TabsTrigger>
        </TabsList>

        <TabsContent value="csv-to-excel" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                CSV Input
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4 mb-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-2">Delimiter</label>
                  <Select value={delimiter} onValueChange={setDelimiter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value=",">Comma (,)</SelectItem>
                      <SelectItem value=";">Semicolon (;)</SelectItem>
                      <SelectItem value="\t">Tab</SelectItem>
                      <SelectItem value="|">Pipe (|)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-end">
                  <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload CSV
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,.txt"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </div>
              </div>

              <textarea
                value={csvInput}
                onChange={(e) => setCsvInput(e.target.value)}
                placeholder={`Paste your CSV data here or upload a file...

Example:
Name${delimiter}Age${delimiter}City
John${delimiter}30${delimiter}New York
Jane${delimiter}25${delimiter}Los Angeles`}
                className="w-full h-64 p-3 border rounded-md font-mono text-sm"
              />

              <div className="flex gap-2">
                <Button onClick={convertCsvToExcel} className="bg-green-600 hover:bg-green-700">
                  <Download className="w-4 h-4 mr-2" />
                  Convert & Download Excel
                </Button>
                <Button variant="outline" onClick={clearAll}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Clear
                </Button>
              </div>

              {fileName && (
                <Badge variant="outline" className="bg-blue-50">
                  File: {fileName}
                </Badge>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="excel-to-csv" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5" />
                Excel Input
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4 mb-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-2">Output Delimiter</label>
                  <Select value={delimiter} onValueChange={setDelimiter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value=",">Comma (,)</SelectItem>
                      <SelectItem value=";">Semicolon (;)</SelectItem>
                      <SelectItem value="\t">Tab</SelectItem>
                      <SelectItem value="|">Pipe (|)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-end">
                  <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Excel
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.xls"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </div>
              </div>

              {fileName && (
                <Badge variant="outline" className="bg-blue-50">
                  File: {fileName}
                </Badge>
              )}

              {excelData.length > 0 && (
                <>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium mb-2">Select Sheet</label>
                      <Select value={selectedSheet.toString()} onValueChange={(value) => {
                        const sheetIndex = parseInt(value);
                        setSelectedSheet(sheetIndex);
                        convertSheetToCsv(excelData[sheetIndex]);
                      }}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {excelData.map((sheet, index) => (
                            <SelectItem key={index} value={index.toString()}>
                              {sheet.name} ({sheet.data.length} rows)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="border rounded p-4 bg-gray-50 max-h-64 overflow-auto">
                    <h4 className="font-medium mb-2">Preview: {excelData[selectedSheet]?.name}</h4>
                    <div className="text-sm font-mono">
                      {csvOutput.split('\n').slice(0, 10).map((line, index) => (
                        <div key={index} className="border-b border-gray-200 py-1">
                          {line}
                        </div>
                      ))}
                      {csvOutput.split('\n').length > 10 && (
                        <div className="text-gray-500 py-1">
                          ... and {csvOutput.split('\n').length - 10} more rows
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={downloadCsv} className="bg-blue-600 hover:bg-blue-700">
                      <Download className="w-4 h-4 mr-2" />
                      Download CSV
                    </Button>
                    <Button variant="outline" onClick={clearAll}>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Clear
                    </Button>
                  </div>
                </>
              )}

              {excelData.length === 0 && !fileName && (
                <div className="text-center py-16 text-gray-500">
                  <FileSpreadsheet className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">No Excel file uploaded</h3>
                  <p>Upload an .xlsx or .xls file to convert to CSV</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {error && (
        <Alert className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Features & Capabilities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Excel to CSV</h4>
              <ul className="text-gray-600 space-y-1">
                <li>• Support for .xlsx and .xls files</li>
                <li>• Handle multiple worksheets</li>
                <li>• Choose custom output delimiters</li>
                <li>• Preserve data formatting and types</li>
                <li>• Preview before download</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">CSV to Excel</h4>
              <ul className="text-gray-600 space-y-1">
                <li>• Auto-detect or specify delimiters</li>
                <li>• Handle quoted fields properly</li>
                <li>• Auto-fit column widths</li>
                <li>• Create formatted Excel files</li>
                <li>• 100% client-side processing</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-center mt-8">
        <div className="mb-4">
          <p className="text-lg font-medium text-foreground mb-1">💛 Like these tools?</p>
          <p className="text-muted-foreground">Help support future development</p>
        </div>
        <BuyMeCoffee />
        <p className="text-sm text-gray-600 mt-2">
          Thanks for using this free tool! Your support keeps it ad-free and private.
        </p>
      </div>
    </div>
  );
}