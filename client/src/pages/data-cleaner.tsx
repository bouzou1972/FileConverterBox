import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Copy, RefreshCw, Wand2, TrendingUp, DollarSign, Percent } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import CopyButton from "@/components/copy-button";
import BuyMeCoffee from "@/components/buy-me-coffee";

interface CleaningOptions {
  removeSymbols: boolean;
  removeCommas: boolean;
  convertPercent: boolean;
  trimWhitespace: boolean;
  removeLeadingZeros: boolean;
  handleCurrency: boolean;
  convertToNumber: boolean;
}

export default function DataCleaner() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [stats, setStats] = useState({ processed: 0, converted: 0, errors: 0 });
  const [options, setOptions] = useState<CleaningOptions>({
    removeSymbols: true,
    removeCommas: true,
    convertPercent: true,
    trimWhitespace: true,
    removeLeadingZeros: true,
    handleCurrency: true,
    convertToNumber: true,
  });
  const { toast } = useToast();

  const cleanValue = (value: string): string => {
    let cleaned = value;
    
    if (options.trimWhitespace) {
      cleaned = cleaned.trim();
    }
    
    if (options.handleCurrency) {
      // Remove currency symbols: $, €, £, ¥, etc.
      cleaned = cleaned.replace(/[\$€£¥₹₽¢₿]/g, '');
    }
    
    if (options.removeCommas) {
      // Remove thousands separators
      cleaned = cleaned.replace(/,/g, '');
    }
    
    if (options.removeSymbols) {
      // Remove other symbols but keep decimal points and minus signs
      cleaned = cleaned.replace(/[^\d.-]/g, '');
    }
    
    if (options.convertPercent) {
      // Convert percentage: "50%" -> "0.5"
      if (cleaned.includes('%')) {
        const numStr = cleaned.replace(/%/g, '');
        const num = parseFloat(numStr);
        if (!isNaN(num)) {
          cleaned = (num / 100).toString();
        }
      }
    }
    
    if (options.removeLeadingZeros) {
      // Remove leading zeros: "00123" -> "123"
      cleaned = cleaned.replace(/^0+(?=\d)/, '');
    }
    
    if (options.convertToNumber) {
      // Ensure it's a valid number
      const num = parseFloat(cleaned);
      if (!isNaN(num)) {
        cleaned = num.toString();
      }
    }
    
    return cleaned;
  };

  const processData = () => {
    if (!input.trim()) {
      toast({
        title: "Error",
        description: "Please enter some data to clean",
        variant: "destructive",
      });
      return;
    }

    const lines = input.split('\n');
    const results: string[] = [];
    let processed = 0;
    let converted = 0;
    let errors = 0;

    lines.forEach((line) => {
      if (line.trim() === '') {
        results.push('');
        return;
      }

      // Split by tabs or multiple spaces to handle Excel-like data
      const values = line.split(/\t|  +/);
      const cleanedValues: string[] = [];

      values.forEach((value) => {
        processed++;
        try {
          const original = value.trim();
          const cleaned = cleanValue(original);
          
          if (original !== cleaned && cleaned !== '') {
            converted++;
          }
          
          cleanedValues.push(cleaned);
        } catch (err) {
          errors++;
          cleanedValues.push(value); // Keep original on error
        }
      });

      results.push(cleanedValues.join('\t'));
    });

    setOutput(results.join('\n'));
    setStats({ processed, converted, errors });

    toast({
      title: "Data Cleaned!",
      description: `Processed ${processed} values, converted ${converted}, ${errors} errors`,
    });
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
    setStats({ processed: 0, converted: 0, errors: 0 });
  };

  const loadSampleData = () => {
    const sample = `Product     Price   Discount        Quantity
Widget A        $1,234.50       15%     00123
Widget B        €2,450.00       20%     00456
Widget C        £999.99 10%     00789
Widget D        ¥5,678  25%     01000`;
    setInput(sample);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Smart Data Cleaner</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Clean and format messy Excel data. Convert text to numbers, remove currency symbols, 
          handle percentages, and fix common formatting issues in spreadsheet data.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wand2 className="w-5 h-5" />
                Raw Data Input
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2 mb-4">
                <Button variant="outline" size="sm" onClick={loadSampleData}>
                  Load Sample
                </Button>
                <Button variant="outline" size="sm" onClick={clearAll}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Clear
                </Button>
              </div>

              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Paste your messy Excel data here...

Example:
Product Price   Discount        Quantity
Widget A        $1,234.50       15%     00123
Widget B        €2,450.00       20%     00456

Supports tab-separated or space-separated values.`}
                className="min-h-[300px] font-mono text-sm"
              />

              <div className="flex gap-2">
                <Button onClick={processData} className="bg-blue-600 hover:bg-blue-700">
                  <Wand2 className="w-4 h-4 mr-2" />
                  Clean Data
                </Button>
              </div>

              {stats.processed > 0 && (
                <div className="flex gap-4 text-sm">
                  <Badge variant="outline" className="bg-blue-50">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {stats.processed} processed
                  </Badge>
                  <Badge variant="outline" className="bg-green-50">
                    ✓ {stats.converted} converted
                  </Badge>
                  {stats.errors > 0 && (
                    <Badge variant="outline" className="bg-red-50">
                      ⚠ {stats.errors} errors
                    </Badge>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="material-icons text-green-600">cleaning_services</span>
                Cleaned Output
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={output}
                readOnly
                placeholder="Cleaned data will appear here..."
                className="min-h-[300px] font-mono text-sm bg-gray-50"
              />

              <div className="flex gap-2">
                <CopyButton 
                  text={output} 
                  label="Copy Cleaned Data"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Cleaning Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="trimWhitespace"
                  checked={options.trimWhitespace}
                  onCheckedChange={(checked) => setOptions(prev => ({ ...prev, trimWhitespace: checked }))}
                />
                <Label htmlFor="trimWhitespace" className="text-sm">
                  Trim whitespace
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="handleCurrency"
                  checked={options.handleCurrency}
                  onCheckedChange={(checked) => setOptions(prev => ({ ...prev, handleCurrency: checked }))}
                />
                <Label htmlFor="handleCurrency" className="text-sm">
                  Remove currency symbols ($, €, £, ¥)
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="removeCommas"
                  checked={options.removeCommas}
                  onCheckedChange={(checked) => setOptions(prev => ({ ...prev, removeCommas: checked }))}
                />
                <Label htmlFor="removeCommas" className="text-sm">
                  Remove thousands separators (,)
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="convertPercent"
                  checked={options.convertPercent}
                  onCheckedChange={(checked) => setOptions(prev => ({ ...prev, convertPercent: checked }))}
                />
                <Label htmlFor="convertPercent" className="text-sm">
                  Convert percentages (50% → 0.5)
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="removeLeadingZeros"
                  checked={options.removeLeadingZeros}
                  onCheckedChange={(checked) => setOptions(prev => ({ ...prev, removeLeadingZeros: checked }))}
                />
                <Label htmlFor="removeLeadingZeros" className="text-sm">
                  Remove leading zeros (00123 → 123)
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="removeSymbols"
                  checked={options.removeSymbols}
                  onCheckedChange={(checked) => setOptions(prev => ({ ...prev, removeSymbols: checked }))}
                />
                <Label htmlFor="removeSymbols" className="text-sm">
                  Remove non-numeric symbols
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="convertToNumber"
                  checked={options.convertToNumber}
                  onCheckedChange={(checked) => setOptions(prev => ({ ...prev, convertToNumber: checked }))}
                />
                <Label htmlFor="convertToNumber" className="text-sm">
                  Ensure valid number format
                </Label>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Common Use Cases</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Clean imported financial data</li>
                <li>• Convert Excel text to numbers</li>
                <li>• Remove formatting from copy-pasted data</li>
                <li>• Standardize currency and percentage values</li>
                <li>• Fix leading zeros in ID numbers</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Examples of Data Cleaning</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Currency & Numbers
              </h4>
              <div className="bg-gray-50 p-3 rounded space-y-1 font-mono">
                <div><span className="text-red-600">"$1,234.50"</span> → <span className="text-green-600">1234.5</span></div>
                <div><span className="text-red-600">"€2,450.00"</span> → <span className="text-green-600">2450</span></div>
                <div><span className="text-red-600">"£999.99"</span> → <span className="text-green-600">999.99</span></div>
                <div><span className="text-red-600">"¥5,678"</span> → <span className="text-green-600">5678</span></div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Percent className="w-4 h-4" />
                Percentages & IDs
              </h4>
              <div className="bg-gray-50 p-3 rounded space-y-1 font-mono">
                <div><span className="text-red-600">"15%"</span> → <span className="text-green-600">0.15</span></div>
                <div><span className="text-red-600">"25.5%"</span> → <span className="text-green-600">0.255</span></div>
                <div><span className="text-red-600">"00123"</span> → <span className="text-green-600">123</span></div>
                <div><span className="text-red-600">"007890"</span> → <span className="text-green-600">7890</span></div>
              </div>
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