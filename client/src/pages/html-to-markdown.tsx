import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Copy, RotateCcw, Download, Code } from "lucide-react";
import BuyMeCoffee from "@/components/buy-me-coffee";

export default function HtmlToMarkdown() {
  const [htmlInput, setHtmlInput] = useState("");
  const [markdownOutput, setMarkdownOutput] = useState("");
  const [error, setError] = useState("");
  const { toast } = useToast();

  const convertHtmlToMarkdown = () => {
    if (!htmlInput.trim()) {
      setError("Please enter HTML content to convert");
      return;
    }

    try {
      // Simple HTML to Markdown conversion
      let markdown = htmlInput;

      // Headers
      markdown = markdown.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n');
      markdown = markdown.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n');
      markdown = markdown.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n');
      markdown = markdown.replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n');
      markdown = markdown.replace(/<h5[^>]*>(.*?)<\/h5>/gi, '##### $1\n');
      markdown = markdown.replace(/<h6[^>]*>(.*?)<\/h6>/gi, '###### $1\n');

      // Bold and Italic
      markdown = markdown.replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**');
      markdown = markdown.replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**');
      markdown = markdown.replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*');
      markdown = markdown.replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*');

      // Links
      markdown = markdown.replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)');

      // Images
      markdown = markdown.replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*\/?>/gi, '![$2]($1)');
      markdown = markdown.replace(/<img[^>]*alt="([^"]*)"[^>]*src="([^"]*)"[^>]*\/?>/gi, '![$1]($2)');
      markdown = markdown.replace(/<img[^>]*src="([^"]*)"[^>]*\/?>/gi, '![]($1)');

      // Code
      markdown = markdown.replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`');
      markdown = markdown.replace(/<pre[^>]*><code[^>]*>(.*?)<\/code><\/pre>/gis, '```\n$1\n```');
      markdown = markdown.replace(/<pre[^>]*>(.*?)<\/pre>/gis, '```\n$1\n```');

      // Lists
      markdown = markdown.replace(/<ul[^>]*>/gi, '');
      markdown = markdown.replace(/<\/ul>/gi, '\n');
      markdown = markdown.replace(/<ol[^>]*>/gi, '');
      markdown = markdown.replace(/<\/ol>/gi, '\n');
      markdown = markdown.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n');

      // Blockquotes
      markdown = markdown.replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gis, '> $1\n');

      // Horizontal rule
      markdown = markdown.replace(/<hr[^>]*\/?>/gi, '\n---\n');

      // Line breaks
      markdown = markdown.replace(/<br[^>]*\/?>/gi, '\n');

      // Paragraphs
      markdown = markdown.replace(/<p[^>]*>(.*?)<\/p>/gis, '$1\n\n');

      // Divs (convert to paragraphs)
      markdown = markdown.replace(/<div[^>]*>(.*?)<\/div>/gis, '$1\n\n');

      // Tables
      markdown = markdown.replace(/<table[^>]*>/gi, '');
      markdown = markdown.replace(/<\/table>/gi, '\n');
      markdown = markdown.replace(/<thead[^>]*>/gi, '');
      markdown = markdown.replace(/<\/thead>/gi, '');
      markdown = markdown.replace(/<tbody[^>]*>/gi, '');
      markdown = markdown.replace(/<\/tbody>/gi, '');
      markdown = markdown.replace(/<tr[^>]*>/gi, '|');
      markdown = markdown.replace(/<\/tr>/gi, '|\n');
      markdown = markdown.replace(/<th[^>]*>(.*?)<\/th>/gi, ' $1 |');
      markdown = markdown.replace(/<td[^>]*>(.*?)<\/td>/gi, ' $1 |');

      // Remove remaining HTML tags
      markdown = markdown.replace(/<[^>]*>/g, '');

      // Decode HTML entities
      markdown = markdown.replace(/&nbsp;/g, ' ');
      markdown = markdown.replace(/&amp;/g, '&');
      markdown = markdown.replace(/&lt;/g, '<');
      markdown = markdown.replace(/&gt;/g, '>');
      markdown = markdown.replace(/&quot;/g, '"');
      markdown = markdown.replace(/&#39;/g, "'");

      // Clean up extra whitespace
      markdown = markdown.replace(/\n\s*\n\s*\n/g, '\n\n');
      markdown = markdown.replace(/^\s+|\s+$/g, '');

      setMarkdownOutput(markdown);
      setError("");
    } catch (err) {
      setError("Failed to convert HTML to Markdown");
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(markdownOutput);
      toast({
        title: "Copied",
        description: "Markdown copied to clipboard successfully!"
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive"
      });
    }
  };

  const downloadMarkdown = () => {
    const blob = new Blob([markdownOutput], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'converted.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    setHtmlInput("");
    setMarkdownOutput("");
    setError("");
  };

  const loadSampleHtml = () => {
    const sample = `<h1>Sample HTML Document</h1>
<p>This is a <strong>sample</strong> HTML document with various elements.</p>

<h2>Features Included</h2>
<ul>
  <li><em>Italic text</em></li>
  <li><strong>Bold text</strong></li>
  <li><a href="https://example.com">Links</a></li>
  <li><code>Inline code</code></li>
</ul>

<h3>Code Block</h3>
<pre><code>function hello() {
  console.log("Hello World!");
}</code></pre>

<blockquote>
  <p>This is a blockquote with some important information.</p>
</blockquote>

<p>Here's an image: <img src="https://via.placeholder.com/150" alt="Sample Image" /></p>`;
    
    setHtmlInput(sample);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Code className="text-indigo-600 text-3xl" />
            HTML to Markdown Converter
          </CardTitle>
          <p className="text-gray-600">
            Convert HTML content to clean Markdown format with support for headers, links, images, and more
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* HTML Input */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-medium">
                    HTML Input
                  </label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={loadSampleHtml}
                  >
                    Load Sample
                  </Button>
                </div>
                <Textarea
                  value={htmlInput}
                  onChange={(e) => setHtmlInput(e.target.value)}
                  placeholder="Paste your HTML content here..."
                  className="min-h-80 font-mono text-sm"
                />
              </div>

              {/* Markdown Output */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-medium">
                    Markdown Output
                  </label>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyToClipboard}
                      disabled={!markdownOutput}
                    >
                      <Copy className="w-3 h-3 mr-1" />
                      Copy
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={downloadMarkdown}
                      disabled={!markdownOutput}
                    >
                      <Download className="w-3 h-3 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
                <Textarea
                  value={markdownOutput}
                  readOnly
                  placeholder="Converted Markdown will appear here..."
                  className="min-h-80 font-mono text-sm bg-gray-50"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={convertHtmlToMarkdown} 
                className="bg-indigo-600 hover:bg-indigo-700"
                disabled={!htmlInput.trim()}
              >
                Convert to Markdown
              </Button>
              <Button variant="outline" onClick={clearAll}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="mt-8 p-4 bg-indigo-50 rounded-lg">
              <h4 className="font-medium text-indigo-900 mb-2">HTML to Markdown Converter Features:</h4>
              <ul className="text-sm text-indigo-800 space-y-1">
                <li>• Converts headers (h1-h6) to Markdown heading syntax</li>
                <li>• Preserves text formatting (bold, italic, code)</li>
                <li>• Converts links and images with proper Markdown syntax</li>
                <li>• Handles lists, blockquotes, and code blocks</li>
                <li>• Removes HTML tags while preserving content structure</li>
                <li>• Decodes common HTML entities</li>
              </ul>
            </div>

            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Supported HTML Elements:</h4>
              <div className="text-sm text-blue-800 grid grid-cols-2 md:grid-cols-3 gap-2">
                <div>• Headers (h1-h6)</div>
                <div>• Paragraphs (p)</div>
                <div>• Bold (strong, b)</div>
                <div>• Italic (em, i)</div>
                <div>• Links (a)</div>
                <div>• Images (img)</div>
                <div>• Lists (ul, ol, li)</div>
                <div>• Code (code, pre)</div>
                <div>• Blockquotes</div>
                <div>• Line breaks (br)</div>
                <div>• Horizontal rules (hr)</div>
                <div>• Tables (basic)</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="text-center mt-8">
        <BuyMeCoffee />
        <p className="text-sm text-gray-600 mt-2">
          Thanks for using this free tool! Your support keeps it ad-free and private.
        </p>
      </div>
    </div>
  );
}