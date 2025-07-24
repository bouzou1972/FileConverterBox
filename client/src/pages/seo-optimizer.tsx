import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Search, BarChart3, FileText, Eye } from "lucide-react";
import { ToolSEO } from "@/components/tool-seo";
import { ShareButtons } from "@/components/share-buttons";
import { UsageGuide } from "@/components/usage-guide";

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
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="e.g., file converter, SEO optimization"
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter the main keyword you want to optimize for
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