import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Copy, RefreshCw } from "lucide-react";
import BuyMeCoffee from "@/components/buy-me-coffee";
import { BookmarkButton } from "@/components/bookmark-button";
import { useToast } from "@/hooks/use-toast";
import { ToolSEO } from "@/components/tool-seo";
import { ShareButtons } from "@/components/share-buttons";
import { UsageGuide } from "@/components/usage-guide";

export default function NumberBaseConverter() {
  const [input, setInput] = useState("");
  const [fromBase, setFromBase] = useState("10");
  const [results, setResults] = useState({
    binary: "",
    octal: "",
    decimal: "",
    hexadecimal: ""
  });
  const [error, setError] = useState("");
  const { toast } = useToast();

  const bases = [
    { value: "2", label: "Binary (Base 2)" },
    { value: "8", label: "Octal (Base 8)" },
    { value: "10", label: "Decimal (Base 10)" },
    { value: "16", label: "Hexadecimal (Base 16)" }
  ];

  const validateInput = (value: string, base: number): boolean => {
    if (!value.trim()) return false;
    
    const cleanValue = value.replace(/\s/g, '').toLowerCase();
    
    switch (base) {
      case 2:
        return /^[01]+$/.test(cleanValue);
      case 8:
        return /^[0-7]+$/.test(cleanValue);
      case 10:
        return /^[0-9]+$/.test(cleanValue);
      case 16:
        return /^[0-9a-f]+$/.test(cleanValue);
      default:
        return false;
    }
  };

  const convertNumber = () => {
    try {
      setError("");
      
      if (!input.trim()) {
        setError("Please enter a number to convert");
        return;
      }

      const baseNum = parseInt(fromBase);
      const cleanInput = input.replace(/\s/g, '').toLowerCase();
      
      if (!validateInput(cleanInput, baseNum)) {
        const baseName = bases.find(b => b.value === fromBase)?.label || "Unknown";
        setError(`Invalid input for ${baseName}. Please check your number format.`);
        return;
      }

      // Convert to decimal first
      const decimalValue = parseInt(cleanInput, baseNum);
      
      if (isNaN(decimalValue)) {
        setError("Invalid number format");
        return;
      }

      // Convert to all bases
      setResults({
        binary: decimalValue.toString(2),
        octal: decimalValue.toString(8),
        decimal: decimalValue.toString(10),
        hexadecimal: decimalValue.toString(16).toUpperCase()
      });

      toast({
        title: "Success",
        description: "Number converted to all bases successfully",
      });
    } catch (err) {
      setError("Error converting number. Please check your input.");
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: `${label} value copied to clipboard`,
    });
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    // Auto-convert on input change if valid
    if (value.trim()) {
      setTimeout(() => convertNumber(), 100);
    } else {
      setResults({ binary: "", octal: "", decimal: "", hexadecimal: "" });
      setError("");
    }
  };

  const getInputPlaceholder = () => {
    switch (fromBase) {
      case "2": return "Enter binary number (e.g., 1010)";
      case "8": return "Enter octal number (e.g., 755)";
      case "10": return "Enter decimal number (e.g., 123)";
      case "16": return "Enter hexadecimal number (e.g., FF)";
      default: return "Enter number";
    }
  };

  const formatWithSpaces = (value: string) => {
    if (!value) return value;
    // Add spaces every 4 characters for better readability
    return value.replace(/(.{4})/g, '$1 ').trim();
  };

  const usageExamples = [
    {
      title: "Programming & Computer Science",
      description: "Convert between number systems for programming tasks",
      steps: [
        "Enter a decimal number like 255 to see its hex equivalent (FF)",
        "Convert binary patterns to decimal for calculations",
        "Use hexadecimal for color codes and memory addresses",
        "Convert file permissions from octal to binary representation"
      ],
      tip: "Programmers often use hex (base 16) for memory addresses and color codes"
    },
    {
      title: "Digital Electronics",
      description: "Work with binary representations in digital systems",
      steps: [
        "Convert logic gate outputs from binary to decimal",
        "Analyze digital signal patterns using different bases",
        "Convert between bases for digital circuit design",
        "Understand binary representations of digital data"
      ]
    },
    {
      title: "Data Analysis", 
      description: "Convert between bases for data interpretation",
      steps: [
        "Convert hexadecimal error codes to decimal",
        "Analyze binary flags and bit patterns",
        "Convert octal file permissions to understand access rights",
        "Work with different encoding systems"
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <ToolSEO
        title="Number Base Converter"
        description="Convert numbers between binary, octal, decimal, and hexadecimal formats instantly. Free online base converter for programming and computer science."
        keywords={["number base converter", "binary converter", "hexadecimal converter", "octal converter", "decimal converter", "base conversion"]}
        canonicalUrl={typeof window !== 'undefined' ? window.location.href : undefined}
      />
      
      <div className="flex items-start justify-between mb-8">
        <div className="text-center flex-1">
          <h1 className="text-3xl font-bold mb-4">Number Base Converter</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Convert numbers between binary, octal, decimal, and hexadecimal formats instantly. Perfect for programming and computer science tasks.
          </p>
        </div>
        <BookmarkButton 
          href="/number-base-converter"
          title="Number Base Converter"
          icon="calculate"
          iconColor="text-blue-600"
          description="Convert numbers between binary, octal, decimal, and hexadecimal formats with live conversion"
        />
      </div>

      {error && (
        <Alert className="mb-6 border-red-200 bg-red-50">
          <AlertDescription className="text-red-700">{error}</AlertDescription>
        </Alert>
      )}

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="material-icons text-blue-600">calculate</span>
            Input Number
          </CardTitle>
          <CardDescription>Enter a number and select its current base format</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                value={input}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder={getInputPlaceholder()}
                className="font-mono text-lg"
              />
            </div>
            <div className="w-48">
              <Select value={fromBase} onValueChange={(value) => {
                setFromBase(value);
                setInput("");
                setResults({ binary: "", octal: "", decimal: "", hexadecimal: "" });
                setError("");
              }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {bases.map((base) => (
                    <SelectItem key={base.value} value={base.value}>
                      {base.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={convertNumber} className="w-full" disabled={!input.trim()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Convert to All Bases
          </Button>
        </CardContent>
      </Card>
      
      <div className="text-center mt-8">
        <BuyMeCoffee />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-blue-500 rounded"></span>
                Binary (Base 2)
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(results.binary, "Binary")}
                disabled={!results.binary}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-mono text-lg bg-gray-50 p-4 rounded border min-h-[60px] flex items-center">
              {results.binary ? formatWithSpaces(results.binary) : "Binary result will appear here"}
            </div>
          </CardContent>
        </Card>
      
      <div className="text-center mt-8">
        <BuyMeCoffee />
      </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-green-500 rounded"></span>
                Octal (Base 8)
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(results.octal, "Octal")}
                disabled={!results.octal}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-mono text-lg bg-gray-50 p-4 rounded border min-h-[60px] flex items-center">
              {results.octal ? formatWithSpaces(results.octal) : "Octal result will appear here"}
            </div>
          </CardContent>
        </Card>
      
      <div className="text-center mt-8">
        <BuyMeCoffee />
      </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-purple-500 rounded"></span>
                Decimal (Base 10)
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(results.decimal, "Decimal")}
                disabled={!results.decimal}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-mono text-lg bg-gray-50 p-4 rounded border min-h-[60px] flex items-center">
              {results.decimal ? formatWithSpaces(results.decimal) : "Decimal result will appear here"}
            </div>
          </CardContent>
        </Card>
      
      <div className="text-center mt-8">
        <BuyMeCoffee />
      </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-red-500 rounded"></span>
                Hexadecimal (Base 16)
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(results.hexadecimal, "Hexadecimal")}
                disabled={!results.hexadecimal}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-mono text-lg bg-gray-50 p-4 rounded border min-h-[60px] flex items-center">
              {results.hexadecimal ? formatWithSpaces(results.hexadecimal) : "Hexadecimal result will appear here"}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Quick Reference</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Binary (Base 2)</h4>
              <p className="text-gray-600">Uses digits: 0, 1</p>
              <p className="text-gray-600">Example: 1010 = 10₁₀</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Octal (Base 8)</h4>
              <p className="text-gray-600">Uses digits: 0-7</p>
              <p className="text-gray-600">Example: 755 = 493₁₀</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Decimal (Base 10)</h4>
              <p className="text-gray-600">Uses digits: 0-9</p>
              <p className="text-gray-600">Standard number system</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Hexadecimal (Base 16)</h4>
              <p className="text-gray-600">Uses: 0-9, A-F</p>
              <p className="text-gray-600">Example: FF = 255₁₀</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <ShareButtons 
        url={typeof window !== 'undefined' ? window.location.href : ''}
        title="Number Base Converter - Free Binary Hex Decimal Tool"
        description="Convert numbers between binary, octal, decimal, and hexadecimal formats instantly. Perfect for programming and computer science."
      />
      
      <UsageGuide 
        examples={usageExamples}
        toolName="Number Base Converter"
      />

      <div className="text-center mt-8">
        <BuyMeCoffee />
        <p className="text-sm text-gray-600 mt-2">
          Thanks for using this free tool! Your support keeps it ad-free and private.
        </p>
      </div>
    </div>
  );
}