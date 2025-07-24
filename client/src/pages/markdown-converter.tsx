import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Eye, Code, Copy, Download, FileText } from "lucide-react";
import BuyMeCoffee from "@/components/buy-me-coffee";
import { BookmarkButton } from "@/components/bookmark-button";
import { convertMarkdownToHTML, createFullHTMLDocument, sampleMarkdown } from "@/lib/utils/markdown";
import { downloadFile } from "@/lib/utils/data-converter";
import { ToolSEO } from "@/components/tool-seo";
import { ShareButtons } from "@/components/share-buttons";
import { UsageGuide } from "@/components/usage-guide";

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

  const usageExamples = [
    {
      title: "Documentation Creation",
      description: "Convert Markdown documentation to HTML for web publishing",
      steps: [
        "Write documentation in Markdown format",
        "Paste Markdown content into the converter",
        "Preview the HTML output with live rendering",
        "Download the converted HTML file",
        "Host the HTML on your website or documentation platform"
      ],
      tip: "Use the sample content to learn Markdown syntax quickly"
    },
    {
      title: "Blog Content Conversion",
      description: "Transform Markdown blog posts to HTML format",
      steps: [
        "Write blog posts in Markdown for better formatting control",
        "Convert to HTML for CMS or static site generators",
        "Preview the rendered content before publishing",
        "Copy HTML to your blogging platform",
        "Maintain Markdown originals for easy editing"
      ]
    },
    {
      title: "README File Publishing",
      description: "Convert GitHub README files to standalone HTML pages",
      steps: [
        "Copy Markdown content from GitHub README files",
        "Convert to HTML with proper styling",
        "Preview the formatted content",
        "Download as HTML for hosting on websites",
        "Share formatted documentation easily"
      ]
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <ToolSEO
        title="Markdown to HTML Converter"
        description="Convert Markdown to HTML with live preview and download. Free online Markdown converter supporting all standard syntax including tables, code blocks, and links."
        keywords={["markdown to html", "markdown converter", "md to html", "markdown parser", "markdown editor", "html converter"]}
        canonicalUrl={typeof window !== 'undefined' ? window.location.href : undefined}
      />
      
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle className="flex items-center gap-3">
              <span className="material-icons tool-red text-3xl">html</span>
              Markdown to HTML Converter
            </CardTitle>
            <BookmarkButton 
              href="/markdown-converter"
              title="Markdown Converter"
              icon="html"
              iconColor="text-red-600"
              description="Convert Markdown to HTML with live preview and download options for documents and web content"
            />
          </div>
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
      
      <ShareButtons 
        url={typeof window !== 'undefined' ? window.location.href : ''}
        title="Markdown to HTML Converter - Free Online Tool"
        description="Convert Markdown to HTML with live preview. Perfect for documentation, blogs, and web content."
      />
      
      <UsageGuide 
        examples={usageExamples}
        toolName="Markdown to HTML Converter"
      />

      <div className="text-center mt-8">
        <BuyMeCoffee />
      </div>
    </div>
  );
}
