import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Copy, RotateCcw, Type } from "lucide-react";
import BuyMeCoffee from "@/components/buy-me-coffee";
import { BookmarkButton } from "@/components/bookmark-button";
import { ToolSEO } from "@/components/tool-seo";
import { ShareButtons } from "@/components/share-buttons";
import { UsageGuide } from "@/components/usage-guide";

export default function TextCaseConverter() {
  const [inputText, setInputText] = useState("");
  const [results, setResults] = useState({
    uppercase: "",
    lowercase: "",
    titlecase: "",
    camelcase: "",
    pascalcase: "",
    snakecase: "",
    kebabcase: "",
    constantcase: "",
    dotcase: "",
    pathcase: ""
  });
  
  const { toast } = useToast();

  const convertText = (text: string) => {
    if (!text.trim()) {
      setResults({
        uppercase: "",
        lowercase: "",
        titlecase: "",
        camelcase: "",
        pascalcase: "",
        snakecase: "",
        kebabcase: "",
        constantcase: "",
        dotcase: "",
        pathcase: ""
      });
      return;
    }

    // Helper function to convert to camelCase
    const toCamelCase = (str: string) => {
      return str
        .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
          return index === 0 ? word.toLowerCase() : word.toUpperCase();
        })
        .replace(/\s+/g, '');
    };

    // Helper function to convert to PascalCase
    const toPascalCase = (str: string) => {
      return str
        .replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => {
          return word.toUpperCase();
        })
        .replace(/\s+/g, '');
    };

    // Helper function to convert to snake_case
    const toSnakeCase = (str: string) => {
      return str
        .replace(/\W+/g, ' ')
        .split(/ |\B(?=[A-Z])/)
        .map(word => word.toLowerCase())
        .join('_');
    };

    // Helper function to convert to kebab-case
    const toKebabCase = (str: string) => {
      return str
        .replace(/\W+/g, ' ')
        .split(/ |\B(?=[A-Z])/)
        .map(word => word.toLowerCase())
        .join('-');
    };

    // Helper function to convert to Title Case
    const toTitleCase = (str: string) => {
      return str.replace(/\w\S*/g, (txt) => {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
    };

    setResults({
      uppercase: text.toUpperCase(),
      lowercase: text.toLowerCase(),
      titlecase: toTitleCase(text),
      camelcase: toCamelCase(text),
      pascalcase: toPascalCase(text),
      snakecase: toSnakeCase(text),
      kebabcase: toKebabCase(text),
      constantcase: toSnakeCase(text).toUpperCase(),
      dotcase: toSnakeCase(text).replace(/_/g, '.'),
      pathcase: toSnakeCase(text).replace(/_/g, '/')
    });
  };

  const handleInputChange = (value: string) => {
    setInputText(value);
    convertText(value);
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied",
        description: `${type} text copied to clipboard!`
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive"
      });
    }
  };

  const clearAll = () => {
    setInputText("");
    setResults({
      uppercase: "",
      lowercase: "",
      titlecase: "",
      camelcase: "",
      pascalcase: "",
      snakecase: "",
      kebabcase: "",
      constantcase: "",
      dotcase: "",
      pathcase: ""
    });
  };

  const caseTypes = [
    { key: 'uppercase', label: 'UPPERCASE', description: 'ALL LETTERS IN CAPS' },
    { key: 'lowercase', label: 'lowercase', description: 'all letters in small case' },
    { key: 'titlecase', label: 'Title Case', description: 'First Letter Of Each Word Capitalized' },
    { key: 'camelcase', label: 'camelCase', description: 'firstWordLowerRestCapitalized' },
    { key: 'pascalcase', label: 'PascalCase', description: 'FirstLetterOfEachWordCapitalized' },
    { key: 'snakecase', label: 'snake_case', description: 'words_separated_by_underscores' },
    { key: 'kebabcase', label: 'kebab-case', description: 'words-separated-by-hyphens' },
    { key: 'constantcase', label: 'CONSTANT_CASE', description: 'WORDS_SEPARATED_BY_UNDERSCORES_IN_CAPS' },
    { key: 'dotcase', label: 'dot.case', description: 'words.separated.by.dots' },
    { key: 'pathcase', label: 'path/case', description: 'words/separated/by/slashes' }
  ];

  const usageExamples = [
    {
      title: "Programming & Development",
      description: "Convert variable names between different coding conventions",
      steps: [
        "Enter text in any format (spaces, mixed case, etc.)",
        "Choose the appropriate case format for your code",
        "Copy camelCase for JavaScript variables",
        "Use snake_case for Python functions and variables",
        "Apply PascalCase for class names and components"
      ],
      tip: "Most programming languages have specific naming conventions"
    },
    {
      title: "Content & Writing",
      description: "Format text for different content needs",
      steps: [
        "Convert headings to Title Case for proper formatting",
        "Use UPPERCASE for emphasis or constants",
        "Apply sentence case for readable content",
        "Convert between formats for consistency"
      ]
    },
    {
      title: "Data Processing",
      description: "Standardize text data formats in bulk operations",
      steps: [
        "Convert file names to consistent formats",
        "Standardize database field names",
        "Format API endpoint names consistently",
        "Clean up imported data with mixed case formats"
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <ToolSEO
        title="Text Case Converter"
        description="Convert text between 10 different case formats including camelCase, snake_case, PascalCase, and more. Free online text case converter for developers and writers."
        keywords={["text case converter", "camelcase", "snake_case", "pascalcase", "uppercase", "lowercase", "title case"]}
        canonicalUrl={typeof window !== 'undefined' ? window.location.href : undefined}
      />
      
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-3">
                <Type className="text-green-600 text-3xl" />
                Text Case Converter
              </CardTitle>
              <p className="text-gray-600">
                Convert text between different case formats like camelCase, snake_case, kebab-case, and more
              </p>
            </div>
            <BookmarkButton 
              href="/text-case-converter"
              title="Text Case Converter"
              icon="format_shapes"
              iconColor="text-green-600"
              description="Convert text between 10 different case formats including camelCase, snake_case, and kebab-case"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Enter Text to Convert
              </label>
              <Textarea
                value={inputText}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder="Enter text to convert between different cases..."
                className="min-h-24"
              />
              <div className="flex gap-2 mt-2">
                <Button variant="outline" onClick={clearAll}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Clear
                </Button>
              </div>
            </div>

            {inputText.trim() && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {caseTypes.map(({ key, label, description }) => (
                  <div key={key} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium text-gray-900">{label}</h3>
                        <p className="text-xs text-gray-500">{description}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(results[key as keyof typeof results], label)}
                        disabled={!results[key as keyof typeof results]}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                    <div className="bg-white p-2 rounded border min-h-[3rem] font-mono text-sm break-all">
                      {results[key as keyof typeof results] || (
                        <span className="text-gray-400">Converted text will appear here</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-8 p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">Text Case Converter Features:</h4>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• Convert text to 10 different case formats instantly</li>
                <li>• Perfect for developers working with different naming conventions</li>
                <li>• Copy any converted format to clipboard with one click</li>
                <li>• Real-time conversion as you type</li>
                <li>• Handles special characters and numbers appropriately</li>
                <li>• Useful for API naming, variable names, file names, and more</li>
              </ul>
            </div>

            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Common Use Cases:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• <strong>camelCase:</strong> JavaScript variables and functions</li>
                <li>• <strong>PascalCase:</strong> Class names and components</li>
                <li>• <strong>snake_case:</strong> Python variables and database columns</li>
                <li>• <strong>kebab-case:</strong> CSS classes and URL slugs</li>
                <li>• <strong>CONSTANT_CASE:</strong> Environment variables and constants</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <ShareButtons 
        url={typeof window !== 'undefined' ? window.location.href : ''}
        title="Text Case Converter - Free Case Format Tool"
        description="Convert text between 10 different case formats including camelCase, snake_case, PascalCase, and more."
      />
      
      <UsageGuide 
        examples={usageExamples}
        toolName="Text Case Converter"
      />

      <div className="text-center mt-8">
        <BuyMeCoffee />
      </div>
    </div>
  );
}