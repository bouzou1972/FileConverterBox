import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { FileText, Copy, Download } from "lucide-react";
import BuyMeCoffee from "@/components/buy-me-coffee";
import { BookmarkButton } from "@/components/bookmark-button";
import { generateLorem, type LoremOptions } from "@/lib/utils/lorem";
import { downloadFile } from "@/lib/utils/data-converter";
import { ToolSEO } from "@/components/tool-seo";
import { ShareButtons } from "@/components/share-buttons";
import { UsageGuide } from "@/components/usage-guide";

export default function LoremGenerator() {
  const [type, setType] = useState<"words" | "sentences" | "paragraphs">("paragraphs");
  const [count, setCount] = useState(3);
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [includeHtml, setIncludeHtml] = useState(false);
  const [output, setOutput] = useState("");
  const [stats, setStats] = useState({ words: 0, sentences: 0, paragraphs: 0 });
  const { toast } = useToast();

  const generate = () => {
    const options: LoremOptions = {
      type,
      count,
      startWithLorem,
      includeHtml
    };

    const result = generateLorem(options);
    setOutput(result.text);
    setStats(result.stats);
  };

  const copyToClipboard = () => {
    if (output) {
      navigator.clipboard.writeText(output);
      toast({
        title: "Copied",
        description: "Lorem ipsum text copied to clipboard!"
      });
    }
  };

  const downloadText = () => {
    if (output) {
      const extension = includeHtml ? 'html' : 'txt';
      downloadFile(output, `lorem_ipsum.${extension}`, 'text/plain');
      toast({
        title: "Downloaded",
        description: "File downloaded successfully!"
      });
    }
  };

  const usageExamples = [
    {
      title: "Web Design & Development",
      description: "Create placeholder content for websites and applications",
      steps: [
        "Generate 3-5 paragraphs for page content mockups",
        "Use HTML formatting for styled text previews",
        "Create different lengths for responsive design testing",
        "Generate varied content for different page sections"
      ],
      tip: "Start with Lorem ipsum to maintain the traditional placeholder text format"
    },
    {
      title: "Print Design & Layout",
      description: "Fill design layouts with placeholder text",
      steps: [
        "Generate specific word counts for headlines and body text",
        "Create multiple paragraphs for magazine layouts",
        "Generate sentences for caption placeholders",
        "Download as text file for design software import"
      ]
    },
    {
      title: "Content Planning",
      description: "Estimate content length and layout requirements",
      steps: [
        "Generate sample content to test reading flow",
        "Create placeholder text for content management systems",
        "Test typography and spacing with realistic text lengths",
        "Plan content structure with varied paragraph sizes"
      ]
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <ToolSEO
        title="Lorem Ipsum Generator"
        description="Generate Lorem Ipsum placeholder text in words, sentences, or paragraphs. Free Lorem generator with HTML formatting and download options."
        keywords={["lorem ipsum generator", "placeholder text", "dummy text", "lorem generator", "ipsum generator", "text placeholder"]}
        canonicalUrl={typeof window !== 'undefined' ? window.location.href : undefined}
      />
      
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle className="flex items-center gap-3">
              <span className="material-icons tool-indigo text-3xl">text_snippet</span>
              Lorem Ipsum Generator
            </CardTitle>
            <BookmarkButton 
              href="/lorem-generator"
              title="Lorem Ipsum Generator"
              icon="text_snippet"
              iconColor="text-indigo-600"
              description="Generate placeholder text in words, sentences, or paragraphs with HTML formatting options"
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <Select value={type} onValueChange={(value) => setType(value as "words" | "sentences" | "paragraphs")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="paragraphs">Paragraphs</SelectItem>
                  <SelectItem value="words">Words</SelectItem>
                  <SelectItem value="sentences">Sentences</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Count</label>
              <Input
                type="number"
                min="1"
                max="100"
                value={count}
                onChange={(e) => setCount(parseInt(e.target.value) || 1)}
              />
            </div>
            
            <div className="flex items-end">
              <Button
                onClick={generate}
                className="w-full bg-indigo-600 hover:bg-indigo-700"
              >
                <FileText className="w-4 h-4 mr-1" />
                Generate
              </Button>
            </div>
          </div>

          {/* Options */}
          <div className="flex gap-6">
            <label className="flex items-center space-x-2">
              <Checkbox
                checked={startWithLorem}
                onCheckedChange={(checked) => setStartWithLorem(checked as boolean)}
              />
              <span className="text-sm">Start with "Lorem ipsum..."</span>
            </label>
            <label className="flex items-center space-x-2">
              <Checkbox
                checked={includeHtml}
                onCheckedChange={(checked) => setIncludeHtml(checked as boolean)}
              />
              <span className="text-sm">Include HTML tags</span>
            </label>
          </div>

          {/* Output */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="text-sm font-medium text-gray-700">Generated Text</label>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyToClipboard}
                  disabled={!output}
                >
                  <Copy className="w-4 h-4 mr-1" />
                  Copy
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={downloadText}
                  disabled={!output}
                >
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </Button>
              </div>
            </div>
            
            <Textarea
              value={output}
              readOnly
              className="h-80 bg-gray-50 resize-none"
              placeholder="Generated lorem ipsum text will appear here..."
            />
            
            {output && (
              <div className="mt-2 text-sm text-gray-500">
                {stats.words} words, {stats.sentences} sentences, {stats.paragraphs} paragraphs
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <ShareButtons 
        url={typeof window !== 'undefined' ? window.location.href : ''}
        title="Lorem Ipsum Generator - Free Placeholder Text Tool"
        description="Generate Lorem Ipsum placeholder text in words, sentences, or paragraphs with HTML formatting options."
      />
      
      <UsageGuide 
        examples={usageExamples}
        toolName="Lorem Ipsum Generator"
      />

      <div className="text-center mt-8">
        <BuyMeCoffee />
      </div>
    </div>
  );
}
