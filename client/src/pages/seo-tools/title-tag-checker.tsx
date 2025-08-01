import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertCircle, Copy, FileText } from "lucide-react";

interface TitleAnalysis {
  title: string;
  length: number;
  wordCount: number;
  isOptimalLength: boolean;
  hasKeyword: boolean;
  isTruncated: boolean;
  recommendations: string[];
}

export function TitleTagChecker() {
  const [title, setTitle] = useState('');
  const [keyword, setKeyword] = useState('');
  const [analysis, setAnalysis] = useState<TitleAnalysis | null>(null);

  const analyzeTitle = () => {
    if (!title.trim()) return;

    const length = title.length;
    const wordCount = title.trim().split(/\s+/).length;
    const isOptimalLength = length >= 30 && length <= 60;
    const hasKeyword = keyword.trim() ? title.toLowerCase().includes(keyword.toLowerCase()) : false;
    const isTruncated = length > 60;

    const recommendations: string[] = [];

    if (length < 30) {
      recommendations.push("Title is too short. Add more descriptive words (aim for 30-60 characters).");
    }
    if (length > 60) {
      recommendations.push("Title is too long and may be truncated in search results. Keep under 60 characters.");
    }
    if (keyword.trim() && !hasKeyword) {
      recommendations.push(`Include your focus keyword "${keyword}" in the title.`);
    }
    if (wordCount < 4) {
      recommendations.push("Consider adding more descriptive words to make the title more informative.");
    }
    if (title.includes('|') || title.includes('-')) {
      recommendations.push("Good use of separators to structure your title.");
    } else if (wordCount > 6) {
      recommendations.push("Consider using separators (| or -) to structure long titles.");
    }
    if (!/^[A-Z]/.test(title)) {
      recommendations.push("Start your title with a capital letter.");
    }

    if (recommendations.length === 0) {
      recommendations.push("Your title looks well-optimized!");
    }

    setAnalysis({
      title,
      length,
      wordCount,
      isOptimalLength,
      hasKeyword,
      isTruncated,
      recommendations
    });
  };

  const getPreview = () => {
    if (!analysis) return null;
    
    const maxLength = 60;
    const displayTitle = analysis.length > maxLength 
      ? analysis.title.substring(0, maxLength) + "..."
      : analysis.title;

    return displayTitle;
  };

  const copyToClipboard = () => {
    if (analysis) {
      const report = `Title Tag Analysis Report

Title: ${analysis.title}
Length: ${analysis.length} characters
Word Count: ${analysis.wordCount} words
Optimal Length: ${analysis.isOptimalLength ? 'Yes' : 'No'}
${keyword ? `Contains Keyword "${keyword}": ${analysis.hasKeyword ? 'Yes' : 'No'}` : ''}

Search Result Preview:
${getPreview()}

Recommendations:
${analysis.recommendations.map(rec => `• ${rec}`).join('\n')}

---
Generated by File Converter Box
`;
      navigator.clipboard.writeText(report);
    }
  };

  const exampleTitles = [
    "Best File Converter Tools 2024 | Free Online Utilities",
    "SEO Content Optimizer - Analyze Your Content for Better Rankings",
    "Convert PDF to Word Online Free - No Registration Required",
    "Professional Resume Builder | Create Winning Resumes Fast"
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Title Tag Checker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Input Section */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Title Tag</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your page title here..."
              className="w-full"
            />
            <div className="flex justify-between items-center mt-1 text-xs text-gray-500">
              <span>{title.length}/60 characters</span>
              <span className={title.length > 60 ? 'text-red-500' : title.length < 30 ? 'text-yellow-500' : 'text-green-500'}>
                {title.length > 60 ? 'Too long' : title.length < 30 ? 'Too short' : 'Good length'}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Focus Keyword (Optional)</label>
            <Input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Enter your target keyword..."
              className="w-full"
            />
          </div>

          <Button onClick={analyzeTitle} disabled={!title.trim()}>
            Analyze Title Tag
          </Button>
        </div>

        {/* Example Titles */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold">Example Good Titles:</h3>
          <div className="space-y-2">
            {exampleTitles.map((example, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="text-sm">{example}</span>
                <Button
                  onClick={() => setTitle(example)}
                  size="sm"
                  variant="outline"
                >
                  Use This
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Analysis Results */}
        {analysis && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Analysis Results</h3>
              <Button onClick={copyToClipboard} size="sm" variant="outline">
                <Copy className="w-4 h-4 mr-2" />
                Copy Report
              </Button>
            </div>

            {/* SERP Preview */}
            <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4">
              <h4 className="text-sm font-semibold mb-2">Search Result Preview</h4>
              <div className="bg-white dark:bg-gray-900 p-3 rounded border">
                <div className="text-blue-600 hover:underline cursor-pointer text-lg">
                  {getPreview()}
                </div>
                <div className="text-green-700 text-sm">https://example.com/page</div>
                <div className="text-gray-600 text-sm mt-1">
                  Your meta description would appear here...
                </div>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{analysis.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Characters</div>
              </div>
              <div className="text-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{analysis.wordCount}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Words</div>
              </div>
              <div className="text-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="text-2xl">
                  {analysis.isOptimalLength ? (
                    <CheckCircle className="w-8 h-8 text-green-600 mx-auto" />
                  ) : (
                    <XCircle className="w-8 h-8 text-red-600 mx-auto" />
                  )}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Length</div>
              </div>
              <div className="text-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="text-2xl">
                  {keyword.trim() ? (
                    analysis.hasKeyword ? (
                      <CheckCircle className="w-8 h-8 text-green-600 mx-auto" />
                    ) : (
                      <XCircle className="w-8 h-8 text-red-600 mx-auto" />
                    )
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Keyword</div>
              </div>
            </div>

            {/* Status Indicators */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {analysis.isOptimalLength ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
                <span className="text-sm">
                  Length: {analysis.length} characters 
                  {analysis.isOptimalLength ? ' (Optimal)' : ' (Needs adjustment)'}
                </span>
              </div>

              {keyword.trim() && (
                <div className="flex items-center gap-2">
                  {analysis.hasKeyword ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                  <span className="text-sm">
                    Keyword "{keyword}" {analysis.hasKeyword ? 'found' : 'not found'} in title
                  </span>
                </div>
              )}

              {analysis.isTruncated && (
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                  <span className="text-sm">Title may be truncated in search results</span>
                </div>
              )}
            </div>

            {/* Recommendations */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Recommendations</h4>
              <div className="space-y-2">
                {analysis.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start gap-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm">{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}