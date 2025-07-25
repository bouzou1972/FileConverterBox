import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Search, BarChart3, FileText, Eye, Download, FileDown } from "lucide-react";
import { ToolSEO } from "@/components/tool-seo";
import { ShareButtons } from "@/components/share-buttons";
import { UsageGuide } from "@/components/usage-guide";
import jsPDF from "jspdf";

interface SEOReport {
  keywordMatches: number;
  keywordDensity: string;
  titleMatch: boolean;
  h1Match: boolean;
  metaDescMatch: boolean;
  fleschScore: number;
  wordCount: number;
  sentenceCount: number;
  readabilityLevel: string;
}

export default function SEOOptimizer() {
  const [keyword, setKeyword] = useState('');
  const [content, setContent] = useState('');
  const [report, setReport] = useState<SEOReport | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const analyzeContent = async () => {
    if (!keyword.trim() || !content.trim()) {
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate processing time for better UX
    await new Promise(resolve => setTimeout(resolve, 500));

    const words = content.trim().split(/\s+/);
    const wordCount = words.length;
    const sentenceCount = Math.max(content.split(/[.!?]+/).filter(s => s.trim().length > 0).length, 1);
    
    const keywordRegex = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    const keywordMatches = (content.match(keywordRegex) || []).length;
    const keywordDensity = wordCount ? ((keywordMatches / wordCount) * 100).toFixed(2) : '0';

    const titleMatch = content.toLowerCase().includes(`<title>`) && 
                     content.toLowerCase().includes(keyword.toLowerCase());
    const h1Match = content.toLowerCase().includes(`<h1>`) && 
                   content.toLowerCase().includes(keyword.toLowerCase());
    const metaDescMatch = content.toLowerCase().includes('meta name="description"');

    const fleschScore = getFleschReadingEase(content, wordCount, sentenceCount);
    const readabilityLevel = getReadabilityLevel(fleschScore);

    setReport({
      keywordMatches,
      keywordDensity,
      titleMatch,
      h1Match,
      metaDescMatch,
      fleschScore,
      wordCount,
      sentenceCount,
      readabilityLevel
    });
    
    setIsAnalyzing(false);
  };

  const getFleschReadingEase = (text: string, wordCount: number, sentenceCount: number): number => {
    const words = text.trim().split(/\s+/);
    const syllableCount = words.reduce((total, word) => total + countSyllables(word), 0);
    
    if (wordCount === 0 || sentenceCount === 0) return 0;
    
    return 206.835 - 1.015 * (wordCount / sentenceCount) - 84.6 * (syllableCount / wordCount);
  };

  const countSyllables = (word: string): number => {
    word = word.toLowerCase().replace(/[^a-z]/g, '');
    if (word.length <= 3) return 1;
    
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    word = word.replace(/^y/, '');
    
    const syllables = word.match(/[aeiouy]{1,2}/g);
    return syllables ? syllables.length : 1;
  };

  const getReadabilityLevel = (score: number): string => {
    if (score >= 90) return "Very Easy";
    if (score >= 80) return "Easy";
    if (score >= 70) return "Fairly Easy";
    if (score >= 60) return "Standard";
    if (score >= 50) return "Fairly Difficult";
    if (score >= 30) return "Difficult";
    return "Very Difficult";
  };

  const getDensityColor = (density: string): string => {
    const num = parseFloat(density);
    if (num < 1) return "text-red-600";
    if (num <= 3) return "text-green-600";
    if (num <= 5) return "text-yellow-600";
    return "text-red-600";
  };

  const getDensityLabel = (density: string): string => {
    const num = parseFloat(density);
    if (num < 1) return "Too Low";
    if (num <= 3) return "Optimal";
    if (num <= 5) return "High";
    return "Too High";
  };

  const getKeywordSuggestions = (inputKeyword: string): string[] => {
    const related: Record<string, string[]> = {
      "converter": ["file converter", "online converter", "PDF converter", "CSV to JSON", "document converter", "format converter"],
      "seo": ["seo tools", "on-page seo", "keyword optimization", "seo checker", "search engine optimization", "seo analysis"],
      "ai": ["ai content", "ai tools", "ai writer", "chatbot seo", "artificial intelligence", "machine learning"],
      "file": ["file converter", "file upload", "file processing", "file format", "document management", "file sharing"],
      "json": ["json formatter", "json validator", "json converter", "api response", "data structure", "javascript object"],
      "pdf": ["pdf converter", "pdf generator", "pdf tools", "document processing", "pdf editor", "file conversion"],
      "csv": ["csv converter", "data processing", "spreadsheet tools", "excel converter", "data analysis", "file import"],
      "text": ["text processing", "text analyzer", "content optimization", "writing tools", "text formatter", "document editor"],
      "image": ["image converter", "photo editor", "image optimization", "graphics tools", "picture processing", "visual content"],
      "color": ["color picker", "color palette", "design tools", "hex colors", "rgb converter", "color scheme"],
      "html": ["html formatter", "web development", "html validator", "markup language", "frontend tools", "code editor"],
      "javascript": ["js tools", "javascript formatter", "web development", "frontend programming", "code optimization", "js validator"],
      "markdown": ["markdown editor", "documentation tools", "content writing", "text formatting", "readme generator", "markup language"],
      "base64": ["base64 encoder", "data encoding", "file encoding", "binary data", "string conversion", "encoding tools"],
      "password": ["password generator", "security tools", "strong passwords", "authentication", "password manager", "cybersecurity"],
      "qr": ["qr code generator", "barcode tools", "mobile scanning", "quick response", "contact sharing", "wifi qr codes"],
      "excel": ["excel converter", "spreadsheet tools", "data processing", "xlsx files", "office tools", "data analysis"],
      "regex": ["regular expressions", "pattern matching", "text validation", "string processing", "search patterns", "regex tester"],
      "hash": ["hash generator", "data integrity", "checksum", "security verification", "file validation", "cryptographic hash"],
      "timestamp": ["time converter", "date tools", "unix timestamp", "datetime formatting", "time zone converter", "epoch time"],
      "uuid": ["unique identifier", "guid generator", "database keys", "random id", "identifier tools", "uuid v4"],
      "minify": ["code minification", "file compression", "optimization tools", "build tools", "performance", "size reduction"],
      "beautify": ["code formatter", "pretty print", "code organization", "syntax highlighting", "code readability", "development tools"],
      "api": ["api tools", "rest api", "json api", "web services", "backend development", "api testing"],
      "database": ["database tools", "sql converter", "data migration", "database design", "query tools", "data management"],
      "web": ["web tools", "frontend development", "web optimization", "website tools", "web performance", "online utilities"],
      "content": ["content optimization", "content marketing", "seo content", "writing tools", "content analysis", "digital marketing"],
      "marketing": ["digital marketing", "seo marketing", "content marketing", "online promotion", "marketing tools", "brand optimization"],
      "analytics": ["web analytics", "data analysis", "performance metrics", "tracking tools", "business intelligence", "data insights"],
      "optimization": ["seo optimization", "performance optimization", "code optimization", "website speed", "conversion optimization", "efficiency tools"],
      "security": ["web security", "data protection", "encryption tools", "security audit", "vulnerability check", "cybersecurity tools"],
      "mobile": ["mobile optimization", "responsive design", "mobile seo", "app development", "mobile tools", "device compatibility"],
      "social": ["social media", "social sharing", "social seo", "social marketing", "social tools", "social optimization"],
      "email": ["email marketing", "email tools", "email validation", "newsletter tools", "email optimization", "email automation"],
      "ecommerce": ["ecommerce seo", "product optimization", "online store", "shopping cart", "product pages", "conversion tools"],
      "wordpress": ["wordpress seo", "wp optimization", "wordpress tools", "cms tools", "blog optimization", "website builder"],
      "google": ["google tools", "google seo", "search console", "google analytics", "google ads", "search optimization"],
      "bing": ["bing seo", "microsoft search", "search engine", "bing webmaster", "search optimization", "search marketing"],
      "local": ["local seo", "local search", "google my business", "local marketing", "location-based", "local optimization"],
      "technical": ["technical seo", "website audit", "seo analysis", "site performance", "crawling", "indexing"],
      "link": ["link building", "backlinks", "internal linking", "link analysis", "authority building", "link optimization"],
      "keyword": ["keyword research", "keyword analysis", "search terms", "keyword density", "long tail keywords", "keyword planning"],
      "meta": ["meta tags", "meta description", "title tags", "meta optimization", "html meta", "seo meta"],
      "schema": ["schema markup", "structured data", "rich snippets", "json-ld", "seo schema", "search results"],
      "sitemap": ["xml sitemap", "sitemap generator", "site structure", "crawling", "indexing", "seo sitemap"],
      "robots": ["robots.txt", "crawl directives", "search bots", "indexing control", "seo robots", "crawling rules"]
    };

    const lower = inputKeyword.toLowerCase().trim();
    if (!lower) return [];

    // Direct match
    if (related[lower]) {
      return related[lower];
    }

    // Partial matches
    const partialMatches: string[] = [];
    Object.entries(related).forEach(([key, values]) => {
      if (key.includes(lower) || lower.includes(key)) {
        partialMatches.push(...values);
      }
    });

    // Remove duplicates and limit to 6 suggestions
    return [...new Set(partialMatches)].slice(0, 6);
  };

  const handleKeywordChange = (value: string) => {
    setKeyword(value);
    const newSuggestions = getKeywordSuggestions(value);
    setSuggestions(newSuggestions);
  };

  const selectSuggestion = (suggestion: string) => {
    setKeyword(suggestion);
    setSuggestions([]);
  };

  const exportToPDF = () => {
    if (!report || !keyword.trim()) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;
    let yPosition = 30;

    // Title
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("SEO Content Analysis Report", margin, yPosition);
    yPosition += 20;

    // Keyword
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text(`Focus Keyword: ${keyword}`, margin, yPosition);
    yPosition += 15;

    // Date
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, margin, yPosition);
    yPosition += 20;

    // Content Statistics
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Content Statistics", margin, yPosition);
    yPosition += 15;

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Word Count: ${report.wordCount}`, margin, yPosition);
    yPosition += 10;
    doc.text(`Sentence Count: ${report.sentenceCount}`, margin, yPosition);
    yPosition += 10;
    doc.text(`Keyword Matches: ${report.keywordMatches}`, margin, yPosition);
    yPosition += 10;
    doc.text(`Keyword Density: ${report.keywordDensity}% (${getDensityLabel(report.keywordDensity)})`, margin, yPosition);
    yPosition += 20;

    // SEO Elements
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("SEO Elements Check", margin, yPosition);
    yPosition += 15;

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Keyword in Title: ${report.titleMatch ? '✓ Yes' : '✗ No'}`, margin, yPosition);
    yPosition += 10;
    doc.text(`Keyword in H1: ${report.h1Match ? '✓ Yes' : '✗ No'}`, margin, yPosition);
    yPosition += 10;
    doc.text(`Meta Description Present: ${report.metaDescMatch ? '✓ Yes' : '✗ No'}`, margin, yPosition);
    yPosition += 20;

    // Readability
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Readability Analysis", margin, yPosition);
    yPosition += 15;

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Flesch Reading Ease Score: ${report.fleschScore.toFixed(1)}`, margin, yPosition);
    yPosition += 10;
    doc.text(`Reading Level: ${report.readabilityLevel}`, margin, yPosition);
    yPosition += 20;

    // Recommendations
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Recommendations", margin, yPosition);
    yPosition += 15;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const recommendations = [
      "• Aim for keyword density between 1-3% for optimal SEO",
      "• Include your focus keyword in title tags and H1 headings",
      "• Target a Flesch Reading Ease score of 60-70 for general audiences",
      "• Ensure proper HTML structure with semantic tags",
      "• Use natural keyword placement rather than keyword stuffing"
    ];

    recommendations.forEach(rec => {
      doc.text(rec, margin, yPosition);
      yPosition += 8;
    });

    doc.save(`seo-analysis-${keyword.replace(/\s+/g, '-')}.pdf`);
  };

  const exportToMarkdown = () => {
    if (!report || !keyword.trim()) return;

    const markdown = `# SEO Content Analysis Report

**Focus Keyword:** ${keyword}  
**Generated:** ${new Date().toLocaleDateString()}

## Content Statistics

- **Word Count:** ${report.wordCount}
- **Sentence Count:** ${report.sentenceCount}
- **Keyword Matches:** ${report.keywordMatches}
- **Keyword Density:** ${report.keywordDensity}% (${getDensityLabel(report.keywordDensity)})

## SEO Elements Check

- **Keyword in Title:** ${report.titleMatch ? '✅ Yes' : '❌ No'}
- **Keyword in H1:** ${report.h1Match ? '✅ Yes' : '❌ No'}
- **Meta Description Present:** ${report.metaDescMatch ? '✅ Yes' : '❌ No'}

## Readability Analysis

- **Flesch Reading Ease Score:** ${report.fleschScore.toFixed(1)}
- **Reading Level:** ${report.readabilityLevel}

## Recommendations

- Aim for keyword density between 1-3% for optimal SEO
- Include your focus keyword in title tags and H1 headings
- Target a Flesch Reading Ease score of 60-70 for general audiences
- Ensure proper HTML structure with semantic tags
- Use natural keyword placement rather than keyword stuffing

---
*Report generated by File Converter Box SEO Optimizer*
`;

    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `seo-analysis-${keyword.replace(/\s+/g, '-')}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <ToolSEO 
        title="SEO Content Optimizer"
        description="Analyze and optimize your content for search engines with keyword density analysis, readability scoring, and SEO best practices."
      />
      
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-blue-100 rounded-xl">
            <Search className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">SEO Content Optimizer</h1>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Analyze your content for SEO optimization with keyword density analysis, readability scoring, and search engine best practices.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Content Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Focus Keyword
              </label>
              <Input
                type="text"
                value={keyword}
                onChange={(e) => handleKeywordChange(e.target.value)}
                placeholder="e.g., file converter, SEO optimization"
                className="w-full"
              />
              
              {/* Keyword Suggestions */}
              {suggestions.length > 0 && (
                <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Search className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Related keywords:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => selectSuggestion(suggestion)}
                        className="px-2 py-1 text-xs bg-white dark:bg-gray-700 border border-blue-300 dark:border-blue-600 rounded-md hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors text-blue-700 dark:text-blue-300"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              <p className="text-xs text-gray-500 mt-1">
                Enter the main keyword you want to optimize for. Click on suggestions for quick input.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Content to Analyze
              </label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Paste your HTML content, blog post, or web page content here..."
                className="w-full h-40 resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                Supports HTML content, plain text, and mixed formats
              </p>
            </div>

            <Button 
              onClick={analyzeContent}
              disabled={!keyword.trim() || !content.trim() || isAnalyzing}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isAnalyzing ? (
                <>
                  <BarChart3 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing Content...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Analyze SEO Content
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              SEO Analysis Report
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!report ? (
              <div className="text-center py-8">
                <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  Enter your focus keyword and content to see the SEO analysis
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Basic Stats */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{report.wordCount}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Words</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{report.keywordMatches}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Keyword Matches</div>
                  </div>
                </div>

                {/* Keyword Density */}
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Keyword Density</span>
                    <Badge variant="outline" className={getDensityColor(report.keywordDensity)}>
                      {getDensityLabel(report.keywordDensity)}
                    </Badge>
                  </div>
                  <div className="text-2xl font-bold mb-1">{report.keywordDensity}%</div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Optimal range: 1-3%. Current: {report.keywordDensity}%
                  </p>
                </div>

                {/* SEO Elements */}
                <div className="space-y-3">
                  <h3 className="font-medium text-gray-900 dark:text-white">SEO Elements</h3>
                  
                  <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <span className="text-sm">Keyword in Title Tag</span>
                    {report.titleMatch ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                  </div>

                  <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <span className="text-sm">Keyword in H1 Tag</span>
                    {report.h1Match ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                  </div>

                  <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <span className="text-sm">Meta Description Present</span>
                    {report.metaDescMatch ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                </div>

                {/* Readability */}
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Readability Score</span>
                    <Badge variant="outline">{report.readabilityLevel}</Badge>
                  </div>
                  <div className="text-2xl font-bold mb-1">{report.fleschScore.toFixed(1)}</div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Flesch Reading Ease Score (0-100, higher = easier)
                  </p>
                </div>

                {/* Export Buttons */}
                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">Export Report</h4>
                  <div className="flex gap-2">
                    <Button
                      onClick={exportToPDF}
                      size="sm"
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export PDF
                    </Button>
                    <Button
                      onClick={exportToMarkdown}
                      size="sm"
                      variant="outline"
                    >
                      <FileDown className="w-4 h-4 mr-2" />
                      Export Markdown
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Share Buttons */}
      <ShareButtons 
        title="SEO Content Optimizer - Analyze Content for Search Engine Optimization"
        description="Free SEO analyzer tool with keyword density analysis, readability scoring, and search engine optimization best practices."
      />

      {/* Usage Guide */}
      <UsageGuide 
        title="SEO Content Optimizer"
        description="Analyze and optimize your content for search engines with comprehensive keyword analysis, readability scoring, and SEO element validation."
        examples={[
          {
            title: "Blog Post SEO Analysis",
            description: "Optimize blog content for target keywords and improve search rankings",
            steps: [
              "Enter target keyword: 'digital marketing'",
              "Paste blog post HTML content",
              "Analyze keyword density and readability",
              "Optimize based on recommendations"
            ]
          },
          {
            title: "Landing Page Optimization", 
            description: "Ensure your landing pages are properly optimized for search engines",
            steps: [
              "Set focus keyword: 'project management software'",
              "Input landing page content",
              "Check SEO elements presence",
              "Improve content structure"
            ]
          }
        ]}
        tips={[
          "Aim for keyword density between 1-3% for optimal SEO",
          "Include your focus keyword in title tags, H1 headings, and meta descriptions",
          "Target a Flesch Reading Ease score of 60-70 for general audiences",
          "Ensure your content has proper HTML structure with semantic tags",
          "Use natural keyword placement rather than keyword stuffing"
        ]}
        commonUses={[
          "Blog Post Optimization",
          "Landing Page SEO",
          "Content Auditing",
          "Competitor Analysis",
          "Product Page SEO"
        ]}
      />
    </div>
  );
}