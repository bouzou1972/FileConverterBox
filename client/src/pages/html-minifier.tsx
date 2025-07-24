import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Copy, Download, Upload, FileText, Minimize2, Maximize2 } from "lucide-react";
import BuyMeCoffee from "@/components/buy-me-coffee";
import { BookmarkButton } from "@/components/bookmark-button";
import { useToast } from "@/hooks/use-toast";
import { ToolSEO } from "@/components/tool-seo";
import { ShareButtons } from "@/components/share-buttons";
import { UsageGuide } from "@/components/usage-guide";

export default function HtmlMinifier() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [options, setOptions] = useState({
    removeWhitespace: true,
    removeComments: true,
    removeEmptyAttributes: false,
    collapseWhitespace: true,
    minifyCSS: false,
    minifyJS: false
  });
  const { toast } = useToast();

  const minifyHtml = (html: string) => {
    let result = html;

    // Remove HTML comments
    if (options.removeComments) {
      result = result.replace(/<!--[\s\S]*?-->/g, '');
    }

    // Remove whitespace between tags
    if (options.removeWhitespace) {
      result = result.replace(/>\s+</g, '><');
    }

    // Collapse whitespace
    if (options.collapseWhitespace) {
      result = result.replace(/\s+/g, ' ');
    }

    // Remove empty attributes
    if (options.removeEmptyAttributes) {
      result = result.replace(/\s+[\w-]+=["'][\s]*["']/g, '');
    }

    // Basic CSS minification
    if (options.minifyCSS) {
      result = result.replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, (match, css) => {
        const minifiedCSS = css
          .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
          .replace(/\s+/g, ' ') // Collapse whitespace
          .replace(/;\s*}/g, '}') // Remove last semicolon
          .replace(/{\s*/g, '{')
          .replace(/}\s*/g, '}')
          .replace(/:\s*/g, ':')
          .replace(/;\s*/g, ';')
          .trim();
        return match.replace(css, minifiedCSS);
      });
    }

    // Basic JS minification
    if (options.minifyJS) {
      result = result.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, (match, js) => {
        const minifiedJS = js
          .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
          .replace(/\/\/.*$/gm, '') // Remove line comments
          .replace(/\s+/g, ' ') // Collapse whitespace
          .replace(/;\s*}/g, '}')
          .replace(/{\s*/g, '{')
          .replace(/}\s*/g, '}')
          .trim();
        return match.replace(js, minifiedJS);
      });
    }

    return result.trim();
  };

  const beautifyHtml = (html: string) => {
    let result = html;
    let indent = 0;
    const indentSize = 2;

    // Split by tags and process
    const parts = result.split(/(<\/?[^>]+>)/);
    let formatted = '';
    
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i].trim();
      if (!part) continue;

      if (part.startsWith('</')) {
        // Closing tag
        indent = Math.max(0, indent - indentSize);
        formatted += ' '.repeat(indent) + part + '\n';
      } else if (part.startsWith('<') && !part.endsWith('/>')) {
        // Opening tag
        formatted += ' '.repeat(indent) + part + '\n';
        if (!part.match(/<(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)/i)) {
          indent += indentSize;
        }
      } else if (part.startsWith('<') && part.endsWith('/>')) {
        // Self-closing tag
        formatted += ' '.repeat(indent) + part + '\n';
      } else {
        // Text content
        if (part.length > 0) {
          formatted += ' '.repeat(indent) + part + '\n';
        }
      }
    }

    return formatted.trim();
  };

  const handleMinify = () => {
    try {
      setError("");
      if (!input.trim()) {
        setError("Please enter HTML content to minify");
        return;
      }
      const minified = minifyHtml(input);
      setOutput(minified);
      toast({
        title: "Success",
        description: "HTML minified successfully",
      });
    } catch (err) {
      setError("Error minifying HTML. Please check your input.");
    }
  };

  const handleBeautify = () => {
    try {
      setError("");
      if (!input.trim()) {
        setError("Please enter HTML content to beautify");
        return;
      }
      const beautified = beautifyHtml(input);
      setOutput(beautified);
      toast({
        title: "Success",
        description: "HTML beautified successfully",
      });
    } catch (err) {
      setError("Error beautifying HTML. Please check your input.");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Content copied to clipboard",
    });
  };

  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setInput(content);
      };
      reader.readAsText(file);
    }
  };

  const getFileSizeReduction = () => {
    if (!input || !output) return null;
    const originalSize = new Blob([input]).size;
    const minifiedSize = new Blob([output]).size;
    const reduction = ((originalSize - minifiedSize) / originalSize * 100).toFixed(1);
    return { originalSize, minifiedSize, reduction };
  };

  const sizeReduction = getFileSizeReduction();

  const usageExamples = [
    {
      title: "Website Optimization",
      description: "Reduce HTML file sizes for faster website loading",
      steps: [
        "Copy HTML code from your website files",
        "Choose minification options (remove comments, whitespace)",
        "Click 'Minify' to compress the HTML",
        "Compare file size reduction statistics",
        "Download or copy the optimized HTML"
      ],
      tip: "Enable all minification options for maximum file size reduction"
    },
    {
      title: "Code Formatting & Beautification", 
      description: "Clean up messy HTML code for better readability",
      steps: [
        "Paste minified or messy HTML code",
        "Click 'Beautify' to format with proper indentation",
        "Review the clean, readable HTML structure",
        "Copy the formatted code for development",
        "Use for code reviews and documentation"
      ]
    },
    {
      title: "Email Template Optimization",
      description: "Compress HTML email templates for better deliverability",
      steps: [
        "Upload HTML email template files",
        "Remove unnecessary whitespace and comments",
        "Minify inline CSS for smaller email size",
        "Test the compressed template",
        "Use in email marketing campaigns"
      ]
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <ToolSEO
        title="HTML Minifier & Beautifier"
        description="Minify HTML to reduce file size or beautify HTML for better readability. Free online HTML optimizer with customizable compression options."
        keywords={["html minifier", "html beautifier", "html optimizer", "compress html", "html formatter", "minify html"]}
        canonicalUrl={typeof window !== 'undefined' ? window.location.href : undefined}
      />
      
      <div className="flex items-start justify-between mb-8">
        <div className="text-center flex-1">
          <h1 className="text-3xl font-bold mb-4">HTML Minifier / Beautifier</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Minify HTML to reduce file size or beautify HTML for better readability. All processing happens locally in your browser.
          </p>
        </div>
        <BookmarkButton 
          href="/html-minifier"
          title="HTML Minifier"
          icon="code"
          iconColor="text-orange-600"
          description="Minify HTML to reduce file size or beautify for readability with customizable options"
        />
      </div>

      {error && (
        <Alert className="mb-6 border-red-200 bg-red-50">
          <AlertDescription className="text-red-700">{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              HTML Input
            </CardTitle>
            <CardDescription>Paste your HTML code or upload a file</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => document.getElementById('html-file')?.click()}>
                <Upload className="w-4 h-4 mr-2" />
                Upload File
              </Button>
              <input
                id="html-file"
                type="file"
                accept=".html,.htm"
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="<!DOCTYPE html>
<html>
  <head>
    <title>Example</title>
  </head>
  <body>
    <h1>Hello World</h1>
    <!-- Comment -->
    <p>This is a paragraph.</p>
  </body>
</html>"
              className="min-h-[400px] font-mono text-sm"
            />
          </CardContent>
        </Card>
      
      <div className="text-center mt-8">
        <BuyMeCoffee />
      </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-green-600" />
              HTML Output
            </CardTitle>
            <CardDescription>
              Processed HTML
              {sizeReduction && (
                <span className="ml-2 text-sm text-green-600">
                  ({sizeReduction.reduction}% smaller)
                </span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => copyToClipboard(output)} disabled={!output}>
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
              <Button variant="outline" size="sm" onClick={() => downloadFile(output, "processed.html")} disabled={!output}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
            <Textarea
              value={output}
              readOnly
              placeholder="Processed HTML will appear here..."
              className="min-h-[400px] font-mono text-sm bg-gray-50"
            />
            {sizeReduction && (
              <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                <div>Original: {sizeReduction.originalSize} bytes</div>
                <div>Processed: {sizeReduction.minifiedSize} bytes</div>
                <div className="font-medium text-green-600">
                  Reduction: {sizeReduction.reduction}% ({sizeReduction.originalSize - sizeReduction.minifiedSize} bytes saved)
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Processing Options</CardTitle>
          <CardDescription>Configure how the HTML should be processed</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex items-center space-x-2">
              <Switch
                id="removeWhitespace"
                checked={options.removeWhitespace}
                onCheckedChange={(checked) => setOptions(prev => ({ ...prev, removeWhitespace: checked }))}
              />
              <Label htmlFor="removeWhitespace">Remove whitespace between tags</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="removeComments"
                checked={options.removeComments}
                onCheckedChange={(checked) => setOptions(prev => ({ ...prev, removeComments: checked }))}
              />
              <Label htmlFor="removeComments">Remove HTML comments</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="collapseWhitespace"
                checked={options.collapseWhitespace}
                onCheckedChange={(checked) => setOptions(prev => ({ ...prev, collapseWhitespace: checked }))}
              />
              <Label htmlFor="collapseWhitespace">Collapse whitespace</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="removeEmptyAttributes"
                checked={options.removeEmptyAttributes}
                onCheckedChange={(checked) => setOptions(prev => ({ ...prev, removeEmptyAttributes: checked }))}
              />
              <Label htmlFor="removeEmptyAttributes">Remove empty attributes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="minifyCSS"
                checked={options.minifyCSS}
                onCheckedChange={(checked) => setOptions(prev => ({ ...prev, minifyCSS: checked }))}
              />
              <Label htmlFor="minifyCSS">Minify inline CSS</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="minifyJS"
                checked={options.minifyJS}
                onCheckedChange={(checked) => setOptions(prev => ({ ...prev, minifyJS: checked }))}
              />
              <Label htmlFor="minifyJS">Minify inline JavaScript</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4 justify-center">
        <Button onClick={handleMinify} size="lg" className="px-8">
          <Minimize2 className="w-4 h-4 mr-2" />
          Minify HTML
        </Button>
        <Button onClick={handleBeautify} variant="outline" size="lg" className="px-8">
          <Maximize2 className="w-4 h-4 mr-2" />
          Beautify HTML
        </Button>
      </div>
      
      <ShareButtons 
        url={typeof window !== 'undefined' ? window.location.href : ''}
        title="HTML Minifier & Beautifier - Free Code Optimizer"
        description="Minify HTML to reduce file size or beautify HTML for better readability with customizable compression options."
      />
      
      <UsageGuide 
        examples={usageExamples}
        toolName="HTML Minifier & Beautifier"
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