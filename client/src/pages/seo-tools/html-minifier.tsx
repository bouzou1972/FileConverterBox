import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Copy, Download, Code, Upload } from "lucide-react";

export function HtmlMinifier() {
  const [htmlInput, setHtmlInput] = useState('');
  const [minifiedHtml, setMinifiedHtml] = useState('');
  const [options, setOptions] = useState({
    removeComments: true,
    removeWhitespace: true,
    removeEmptyLines: true,
    removeQuotes: false,
    collapseWhitespace: true,
    removeRedundantAttributes: false
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.type === 'text/html' || file.name.endsWith('.html'))) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setHtmlInput(text);
      };
      reader.readAsText(file);
    }
  };

  const minifyHtml = () => {
    let html = htmlInput;

    if (options.removeComments) {
      // Remove HTML comments but preserve conditional comments
      html = html.replace(/<!--(?!\[if)[\s\S]*?-->/g, '');
    }

    if (options.removeWhitespace || options.collapseWhitespace) {
      // Collapse multiple whitespace characters into single spaces
      html = html.replace(/\s+/g, ' ');
    }

    if (options.removeEmptyLines) {
      // Remove empty lines
      html = html.replace(/^\s*\n/gm, '');
    }

    if (options.collapseWhitespace) {
      // Remove whitespace between tags
      html = html.replace(/>\s+</g, '><');
      // Remove leading/trailing whitespace
      html = html.trim();
    }

    if (options.removeQuotes) {
      // Remove quotes around attribute values when safe
      html = html.replace(/=["']([a-zA-Z0-9\-_]+)["']/g, '=$1');
    }

    if (options.removeRedundantAttributes) {
      // Remove redundant attributes
      html = html.replace(/\s*type=["']text\/javascript["']/g, '');
      html = html.replace(/\s*type=["']text\/css["']/g, '');
      html = html.replace(/\s*method=["']get["']/g, '');
    }

    setMinifiedHtml(html);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(minifiedHtml);
  };

  const downloadFile = () => {
    const blob = new Blob([minifiedHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'minified.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getCompressionStats = () => {
    const originalSize = new Blob([htmlInput]).size;
    const minifiedSize = new Blob([minifiedHtml]).size;
    const savings = originalSize - minifiedSize;
    const percentage = originalSize > 0 ? (savings / originalSize * 100).toFixed(1) : '0';
    
    return {
      originalSize: (originalSize / 1024).toFixed(2),
      minifiedSize: (minifiedSize / 1024).toFixed(2),
      savings: (savings / 1024).toFixed(2),
      percentage
    };
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code className="w-5 h-5" />
          HTML Minifier
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Input Section */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">HTML Input</label>
            <Textarea
              value={htmlInput}
              onChange={(e) => setHtmlInput(e.target.value)}
              placeholder="Paste your HTML code here..."
              className="min-h-40 font-mono text-sm"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="file"
              accept=".html,.htm"
              onChange={handleFileUpload}
              className="hidden"
              id="html-file-upload"
            />
            <label htmlFor="html-file-upload">
              <Button variant="outline" size="sm" asChild>
                <span className="cursor-pointer">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload HTML File
                </span>
              </Button>
            </label>
            <Button onClick={minifyHtml} disabled={!htmlInput.trim()}>
              Minify HTML
            </Button>
          </div>
        </div>

        {/* Options */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Minification Options</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="removeComments"
                checked={options.removeComments}
                onCheckedChange={(checked) => 
                  setOptions(prev => ({ ...prev, removeComments: !!checked }))
                }
              />
              <label htmlFor="removeComments" className="text-sm font-medium">
                Remove HTML comments
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="collapseWhitespace"
                checked={options.collapseWhitespace}
                onCheckedChange={(checked) => 
                  setOptions(prev => ({ ...prev, collapseWhitespace: !!checked }))
                }
              />
              <label htmlFor="collapseWhitespace" className="text-sm font-medium">
                Collapse whitespace
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="removeEmptyLines"
                checked={options.removeEmptyLines}
                onCheckedChange={(checked) => 
                  setOptions(prev => ({ ...prev, removeEmptyLines: !!checked }))
                }
              />
              <label htmlFor="removeEmptyLines" className="text-sm font-medium">
                Remove empty lines
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="removeQuotes"
                checked={options.removeQuotes}
                onCheckedChange={(checked) => 
                  setOptions(prev => ({ ...prev, removeQuotes: !!checked }))
                }
              />
              <label htmlFor="removeQuotes" className="text-sm font-medium">
                Remove unnecessary quotes
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="removeRedundantAttributes"
                checked={options.removeRedundantAttributes}
                onCheckedChange={(checked) => 
                  setOptions(prev => ({ ...prev, removeRedundantAttributes: !!checked }))
                }
              />
              <label htmlFor="removeRedundantAttributes" className="text-sm font-medium">
                Remove redundant attributes
              </label>
            </div>
          </div>
        </div>

        {/* Output Section */}
        {minifiedHtml && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Minified HTML</h3>
              <div className="flex gap-2">
                <Button onClick={copyToClipboard} size="sm" variant="outline">
                  <Copy className="w-4 h-4 mr-2" />
                  Copy HTML
                </Button>
                <Button onClick={downloadFile} size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 max-h-64 overflow-y-auto">
              <pre className="text-sm whitespace-pre-wrap font-mono">
                {minifiedHtml}
              </pre>
            </div>

            {/* Compression Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">
                  {getCompressionStats().originalSize} KB
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Original</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">
                  {getCompressionStats().minifiedSize} KB
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Minified</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">
                  {getCompressionStats().savings} KB
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Saved</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">
                  {getCompressionStats().percentage}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Reduction</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}