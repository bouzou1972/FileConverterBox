import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Upload, Search, SortAsc, SortDesc, Eye, EyeOff, Download, FileSpreadsheet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import BuyMeCoffee from "@/components/buy-me-coffee";
import { ToolSEO } from "@/components/tool-seo";
import { ShareButtons } from "@/components/share-buttons";
import { UsageGuide } from "@/components/usage-guide";
import { BookmarkButton } from "@/components/bookmark-button";

interface CsvData {
  headers: string[];
  rows: string[][];
}

export default function CsvViewerPage() {
  const [csvData, setCsvData] = useState<CsvData | null>(null);
  const [delimiter, setDelimiter] = useState(",");
  const [hasHeaders, setHasHeaders] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{ column: number; direction: 'asc' | 'desc' } | null>(null);
  const [hiddenColumns, setHiddenColumns] = useState<Set<number>>(new Set());
  const [error, setError] = useState("");
  const { toast } = useToast();

  const parseCsv = (content: string) => {
    const lines = content.trim().split('\n');
    if (lines.length === 0) return null;

    const rows: string[][] = [];
    const delimiterRegex = new RegExp(`(?:^|${delimiter})("(?:[^"]+|"")*"|[^${delimiter}]*)`, 'g');

    for (const line of lines) {
      const row: string[] = [];
      let match;
      
      while ((match = delimiterRegex.exec(line)) !== null) {
        let value = match[1];
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.slice(1, -1).replace(/""/g, '"');
        }
        row.push(value);
      }
      
      if (row.length > 0) {
        rows.push(row);
      }
    }

    if (rows.length === 0) return null;

    let headers: string[];
    let dataRows: string[][];

    if (hasHeaders && rows.length > 0) {
      headers = rows[0];
      dataRows = rows.slice(1);
    } else {
      const maxColumns = Math.max(...rows.map(row => row.length));
      headers = Array.from({ length: maxColumns }, (_, i) => `Column ${i + 1}`);
      dataRows = rows;
    }

    return { headers, rows: dataRows };
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.csv') && !file.name.toLowerCase().endsWith('.tsv')) {
      setError("Please upload a CSV or TSV file");
      return;
    }

    // Auto-detect delimiter for TSV files
    if (file.name.toLowerCase().endsWith('.tsv')) {
      setDelimiter('\t');
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsed = parseCsv(content);
        
        if (!parsed) {
          setError("Unable to parse CSV file. Please check the format.");
          return;
        }

        setCsvData(parsed);
        setError("");
        setSearchTerm("");
        setSortConfig(null);
        setHiddenColumns(new Set());

        toast({
          title: "Success",
          description: `Loaded ${parsed.rows.length} rows with ${parsed.headers.length} columns`,
        });
      } catch (err) {
        setError("Error reading file. Please ensure it's a valid CSV/TSV file.");
      }
    };
    reader.readAsText(file);
  };

  const filteredAndSortedData = useMemo(() => {
    if (!csvData) return null;

    let filtered = csvData.rows;

    // Apply search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(row =>
        row.some(cell => cell.toLowerCase().includes(searchLower))
      );
    }

    // Apply sorting
    if (sortConfig) {
      filtered = [...filtered].sort((a, b) => {
        const aVal = a[sortConfig.column] || '';
        const bVal = b[sortConfig.column] || '';
        
        // Try to parse as numbers first
        const aNum = parseFloat(aVal);
        const bNum = parseFloat(bVal);
        
        let comparison;
        if (!isNaN(aNum) && !isNaN(bNum)) {
          comparison = aNum - bNum;
        } else {
          comparison = aVal.localeCompare(bVal);
        }
        
        return sortConfig.direction === 'asc' ? comparison : -comparison;
      });
    }

    return filtered;
  }, [csvData, searchTerm, sortConfig]);

  const handleSort = (columnIndex: number) => {
    setSortConfig(prev => {
      if (prev?.column === columnIndex) {
        return prev.direction === 'asc' 
          ? { column: columnIndex, direction: 'desc' }
          : null; // Remove sort
      }
      return { column: columnIndex, direction: 'asc' };
    });
  };

  const toggleColumnVisibility = (columnIndex: number) => {
    setHiddenColumns(prev => {
      const newSet = new Set(prev);
      if (newSet.has(columnIndex)) {
        newSet.delete(columnIndex);
      } else {
        newSet.add(columnIndex);
      }
      return newSet;
    });
  };

  const exportVisibleData = () => {
    if (!csvData || !filteredAndSortedData) return;

    const visibleHeaders = csvData.headers.filter((_, index) => !hiddenColumns.has(index));
    const visibleRows = filteredAndSortedData.map(row => 
      row.filter((_, index) => !hiddenColumns.has(index))
    );

    const csvContent = [
      visibleHeaders.join(','),
      ...visibleRows.map(row => row.map(cell => 
        cell.includes(',') || cell.includes('"') ? `"${cell.replace(/"/g, '""')}"` : cell
      ).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'filtered_data.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const visibleColumns = csvData?.headers.filter((_, index) => !hiddenColumns.has(index));
  const stats = {
    totalRows: csvData?.rows.length || 0,
    filteredRows: filteredAndSortedData?.length || 0,
    totalColumns: csvData?.headers.length || 0,
    visibleColumns: visibleColumns?.length || 0
  };

  const usageExamples = [
    {
      title: "View Large CSV Files",
      description: "Browse and analyze large CSV datasets with sorting and filtering",
      steps: [
        "Upload your CSV file or paste CSV content",
        "Choose the correct delimiter (comma, semicolon, tab)",
        "Toggle headers if your data includes column names",
        "Use search to find specific data",
        "Sort columns by clicking column headers"
      ],
      tip: "Use the search feature to quickly locate specific data points"
    },
    {
      title: "Analyze Data Structure",
      description: "Examine CSV structure and data quality",
      steps: [
        "Load your CSV file",
        "Review column headers and data types",
        "Hide unnecessary columns for focused analysis",
        "Sort data to identify patterns",
        "Export filtered results if needed"
      ],
      tip: "Hide columns you don't need to focus on relevant data"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <ToolSEO
        title="CSV Viewer - View and Analyze CSV Files Online"
        description="View, sort, filter, and analyze CSV files with a powerful online viewer. Support for custom delimiters, search, and column management."
        keywords={["csv viewer", "csv file viewer", "csv analyzer", "view csv online", "csv reader"]}
        canonicalUrl="/csv-viewer"
      />
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">CSV/TSV Viewer</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          View, sort, filter, and analyze CSV/TSV files in a user-friendly table format. All processing happens in your browser for maximum privacy.
        </p>
      </div>

      {error && (
        <Alert className="mb-6 border-red-200 bg-red-50">
          <AlertDescription className="text-red-700">{error}</AlertDescription>
        </Alert>
      )}

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5" />
            Upload CSV/TSV File
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4 items-center">
            <Button variant="outline" onClick={() => document.getElementById('csv-file')?.click()}>
              <Upload className="w-4 h-4 mr-2" />
              Choose File
            </Button>
            <input
              id="csv-file"
              type="file"
              accept=".csv,.tsv"
              className="hidden"
              onChange={handleFileUpload}
            />
            
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Delimiter:</label>
              <Select value={delimiter} onValueChange={setDelimiter}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value=",">Comma</SelectItem>
                  <SelectItem value=";">Semicolon</SelectItem>
                  <SelectItem value="\t">Tab</SelectItem>
                  <SelectItem value="|">Pipe</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="has-headers"
                checked={hasHeaders}
                onCheckedChange={(checked) => setHasHeaders(checked === true)}
              />
              <label htmlFor="has-headers" className="text-sm font-medium">
                First row contains headers
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {csvData && (
        <>
          <div className="flex flex-wrap gap-4 items-center mb-6">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-gray-500" />
              <Input
                placeholder="Search in all columns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
            
            <div className="flex gap-2">
              <Badge variant="outline">
                {stats.filteredRows} of {stats.totalRows} rows
              </Badge>
              <Badge variant="outline">
                {stats.visibleColumns} of {stats.totalColumns} columns
              </Badge>
            </div>

            {filteredAndSortedData && filteredAndSortedData.length !== csvData.rows.length && (
              <Button variant="outline" size="sm" onClick={exportVisibleData}>
                <Download className="w-4 h-4 mr-2" />
                Export Filtered
              </Button>
            )}
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Column Visibility
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setHiddenColumns(new Set())}
                  disabled={hiddenColumns.size === 0}
                >
                  Show All
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {csvData.headers.map((header, index) => (
                  <Button
                    key={index}
                    variant={hiddenColumns.has(index) ? "outline" : "secondary"}
                    size="sm"
                    onClick={() => toggleColumnVisibility(index)}
                    className="text-xs"
                  >
                    {hiddenColumns.has(index) ? (
                      <EyeOff className="w-3 h-3 mr-1" />
                    ) : (
                      <Eye className="w-3 h-3 mr-1" />
                    )}
                    {header}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data View</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="w-full">
                <div className="max-h-[600px] overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {csvData.headers.map((header, index) => {
                          if (hiddenColumns.has(index)) return null;
                          
                          const isSorted = sortConfig?.column === index;
                          return (
                            <TableHead 
                              key={index} 
                              className="cursor-pointer hover:bg-gray-50 select-none"
                              onClick={() => handleSort(index)}
                            >
                              <div className="flex items-center gap-2">
                                {header}
                                {isSorted && (
                                  sortConfig.direction === 'asc' ? 
                                    <SortAsc className="w-4 h-4" /> : 
                                    <SortDesc className="w-4 h-4" />
                                )}
                              </div>
                            </TableHead>
                          );
                        })}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAndSortedData?.slice(0, 1000).map((row, rowIndex) => (
                        <TableRow key={rowIndex}>
                          {row.map((cell, cellIndex) => {
                            if (hiddenColumns.has(cellIndex)) return null;
                            return (
                              <TableCell key={cellIndex} className="font-mono text-sm">
                                {cell}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </ScrollArea>
              
              {filteredAndSortedData && filteredAndSortedData.length > 1000 && (
                <div className="mt-4 text-center">
                  <Badge variant="outline" className="text-orange-600">
                    Showing first 1000 rows of {filteredAndSortedData.length} total
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {!csvData && (
        <Card>
          <CardContent className="py-16">
            <div className="text-center text-gray-500">
              <FileSpreadsheet className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No file loaded</h3>
              <p>Upload a CSV or TSV file to start viewing your data</p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Data Viewing</h4>
              <ul className="text-gray-600 space-y-1">
                <li>• Support for CSV and TSV files</li>
                <li>• Automatic delimiter detection</li>
                <li>• Configurable header detection</li>
                <li>• Clean table visualization</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Data Analysis</h4>
              <ul className="text-gray-600 space-y-1">
                <li>• Search across all columns</li>
                <li>• Sort by any column (numeric/text)</li>
                <li>• Show/hide columns selectively</li>
                <li>• Export filtered results</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="text-center mt-8">
        <ShareButtons 
          title="CSV Viewer - View and Analyze CSV Files Online"
          description="View, sort, filter, and analyze CSV files with powerful online tools"
        />
        
        <UsageGuide 
          title="CSV Viewer"
          description="Learn how to effectively view and analyze CSV files with advanced features"
          examples={usageExamples}
          tips={[
            "Choose the correct delimiter for proper data parsing",
            "Use search to quickly locate specific data points",
            "Hide unnecessary columns to focus on relevant data",
            "Sort columns to identify patterns and outliers",
            "Enable headers option if your data includes column names"
          ]}
          commonUses={[
            "Data analysis",
            "Report review",
            "Database exports",
            "Spreadsheet validation",
            "CSV file debugging"
          ]}
        />

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