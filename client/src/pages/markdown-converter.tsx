import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Eye, Code, Copy, Download, FileText } from "lucide-react";
import { convertMarkdownToHTML, createFullHTMLDocument, sampleMarkdown } from "@/lib/utils/markdown";
import { downloadFile } from "@/lib/utils/data-converter";

export default function MarkdownConverter() {
  const [markdown, setMarkdown] = useState("");
  const [html, setHtml] = useState("");
  const [previewMode, setPreviewMode] = useState<"preview" | "html">("preview");
  const { toast } = useToast();

  const convertMarkdown = () => {
    const convertedHtml = convertMarkdownToHTML(markdown);
    setHtml(convertedHtml);
  };

  useEffect(() => {
    convertMarkdown();
  }, [markdown]);

  const loadSample = () => {
    setMarkdown(sampleMarkdown);
  };

  const togglePreviewMode = () => {
    setPreviewMode(prev => prev === "preview" ? "html" : "preview");
  };

  const copyToClipboard = () => {
    const textToCopy = previewMode === "html" ? html : markdown;
    navigator.clipboard.writeText(textToCopy);
    toast({
      title: "Copied",
      description: `${previewMode === "html" ? "HTML" : "Markdown"} copied to clipboard!`
    });
  };

  const downloadHTML = () => {
    if (html) {
      const fullHtml = createFullHTMLDocument(html);
      downloadFile(fullHtml, 'converted.html', 'text/html');
      toast({
        title: "Downloaded",
        description: "HTML file downloaded successfully!"
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <span className="material-icons tool-red text-3xl">html</span>
            Markdown to HTML Converter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-700">Markdown Input</label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadSample}
                >
                  <FileText className="w-4 h-4 mr-1" />
                  Load Sample
                </Button>
              </div>
              
              <Textarea
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                placeholder="# Hello World&#10;&#10;This is **bold** and *italic* text.&#10;&#10;- List item 1&#10;- List item 2&#10;&#10;[Link](https://example.com)"
                className="h-96 font-mono text-sm resize-none"
              />
            </div>

            {/* Output Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-700">Live Preview</label>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={togglePreviewMode}
                  >
                    {previewMode === "preview" ? (
                      <>
                        <Code className="w-4 h-4 mr-1" />
                        HTML
                      </>
                    ) : (
                      <>
                        <Eye className="w-4 h-4 mr-1" />
                        Preview
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyToClipboard}
                    disabled={!html}
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    Copy
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={downloadHTML}
                    disabled={!html}
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                </div>
              </div>
              
              {previewMode === "preview" ? (
                <div 
                  className="h-96 p-4 border border-gray-300 rounded-lg bg-gray-50 overflow-auto prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              ) : (
                <Textarea
                  value={html}
                  readOnly
                  className="h-96 font-mono text-sm bg-gray-50 resize-none"
                  placeholder="Converted HTML will appear here..."
                />
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
