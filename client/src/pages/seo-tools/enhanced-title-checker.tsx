import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Copy, FileText, CheckCircle, AlertCircle, Smartphone, Monitor } from "lucide-react";

interface TitleAnalysis {
  length: number;
  wordCount: number;
  hasNumbers: boolean;
  hasSpecialChars: boolean;
  keywordDensity: number;
  powerWords: string[];
  emotions: string[];
  serpPreview: {
    desktop: string;
    mobile: string;
  };
  score: number;
  recommendations: string[];
}

export function EnhancedTitleChecker() {
  const [title, setTitle] = useState('');
  const [keyword, setKeyword] = useState('');
  const [url, setUrl] = useState('');
  const [analysis, setAnalysis] = useState<TitleAnalysis | null>(null);
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');

  const powerWords = [
    'ultimate', 'secret', 'proven', 'amazing', 'incredible', 'revolutionary',
    'instant', 'exclusive', 'guaranteed', 'breakthrough', 'essential', 'complete',
    'advanced', 'premium', 'professional', 'expert', 'master', 'perfect',
    'powerful', 'effective', 'simple', 'easy', 'fast', 'quick'
  ];

  const emotionWords = {
    curiosity: ['secret', 'hidden', 'unknown', 'mystery', 'surprising'],
    urgency: ['now', 'today', 'urgent', 'immediately', 'instant', 'quick'],
    trust: ['proven', 'guaranteed', 'verified', 'trusted', 'reliable'],
    exclusivity: ['exclusive', 'limited', 'premium', 'vip', 'special'],
    achievement: ['success', 'winning', 'mastery', 'expert', 'professional']
  };

  const analyzeTitle = () => {
    if (!title.trim()) return;

    const words = title.toLowerCase().split(/\s+/);
    const foundPowerWords = powerWords.filter(word => 
      title.toLowerCase().includes(word)
    );

    const emotions: string[] = [];
    Object.entries(emotionWords).forEach(([emotion, words]) => {
      if (words.some(word => title.toLowerCase().includes(word))) {
        emotions.push(emotion);
      }
    });

    const keywordDensity = keyword ? 
      (title.toLowerCase().split(keyword.toLowerCase()).length - 1) / words.length * 100 : 0;

    const maxLength = viewMode === 'mobile' ? 78 : 60;
    const truncatedTitle = title.length > maxLength ? 
      title.substring(0, maxLength - 3) + '...' : title;

    const score = calculateScore(title, foundPowerWords, emotions, keywordDensity);
    const recommendations = generateRecommendations(title, foundPowerWords, emotions, keywordDensity);

    setAnalysis({
      length: title.length,
      wordCount: words.length,
      hasNumbers: /\d/.test(title),
      hasSpecialChars: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(title),
      keywordDensity,
      powerWords: foundPowerWords,
      emotions,
      serpPreview: {
        desktop: title.length > 60 ? title.substring(0, 57) + '...' : title,
        mobile: title.length > 78 ? title.substring(0, 75) + '...' : title
      },
      score,
      recommendations
    });
  };

  const calculateScore = (title: string, powerWords: string[], emotions: string[], keywordDensity: number) => {
    let score = 0;
    
    // Length scoring (50-60 characters is optimal)
    if (title.length >= 30 && title.length <= 60) score += 25;
    else if (title.length > 60 && title.length <= 70) score += 15;
    else if (title.length < 30) score += 10;

    // Power words
    score += Math.min(powerWords.length * 10, 20);

    // Emotional trigger words
    score += Math.min(emotions.length * 8, 15);

    // Keyword presence
    if (keywordDensity > 0) score += 15;
    if (keywordDensity > 15) score += 10; // Bonus for prominent keyword use

    // Numbers (often improve CTR)
    if (/\d/.test(title)) score += 10;

    // Brackets or parentheses (can improve CTR)
    if (/[\[\]()]/.test(title)) score += 5;

    // Word count (6-10 words is often optimal)
    const wordCount = title.split(/\s+/).length;
    if (wordCount >= 6 && wordCount <= 10) score += 10;

    return Math.min(score, 100);
  };

  const generateRecommendations = (title: string, powerWords: string[], emotions: string[], keywordDensity: number) => {
    const recommendations = [];

    if (title.length > 60) {
      recommendations.push('Consider shortening your title to under 60 characters for better display in search results');
    }
    if (title.length < 30) {
      recommendations.push('Your title might be too short. Consider adding more descriptive words');
    }
    if (powerWords.length === 0) {
      recommendations.push('Add power words like "ultimate", "complete", or "proven" to make your title more compelling');
    }
    if (emotions.length === 0) {
      recommendations.push('Include emotional trigger words to increase click-through rates');
    }
    if (keywordDensity === 0 && keyword) {
      recommendations.push(`Include your target keyword "${keyword}" in the title`);
    }
    if (!/\d/.test(title)) {
      recommendations.push('Consider adding numbers (e.g., "5 Ways", "2024 Guide") as they often improve CTR');
    }
    if (title === title.toLowerCase()) {
      recommendations.push('Use proper title case capitalization for better readability');
    }

    return recommendations;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Improvement';
  };

  const copyResults = () => {
    if (!analysis) return;
    
    const results = `Title Analysis Results

Title: ${title}
Target Keyword: ${keyword || 'None specified'}
URL: ${url || 'Not provided'}

ANALYSIS SUMMARY:
- Length: ${analysis.length} characters
- Word Count: ${analysis.wordCount} words
- SEO Score: ${analysis.score}/100 (${getScoreLabel(analysis.score)})
- Keyword Density: ${analysis.keywordDensity.toFixed(1)}%

POWER WORDS FOUND: ${analysis.powerWords.join(', ') || 'None'}
EMOTIONAL TRIGGERS: ${analysis.emotions.join(', ') || 'None'}

SERP PREVIEW:
Desktop: ${analysis.serpPreview.desktop}
Mobile: ${analysis.serpPreview.mobile}

RECOMMENDATIONS:
${analysis.recommendations.map(r => `• ${r}`).join('\n')}

---
Generated by File Converter Box
`;

    navigator.clipboard.writeText(results);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Enhanced Title Tag Checker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Input Section */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Page Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your page title..."
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Target Keyword (Optional)</label>
              <Input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="e.g., SEO tools"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Page URL (Optional)</label>
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/page"
                type="url"
              />
            </div>
          </div>

          <Button onClick={analyzeTitle} disabled={!title.trim()}>
            Analyze Title
          </Button>
        </div>

        {/* Analysis Results */}
        {analysis && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Analysis Results</h3>
              <Button onClick={copyResults} size="sm" variant="outline">
                <Copy className="w-4 h-4 mr-2" />
                Copy Results
              </Button>
            </div>

            {/* SEO Score */}
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">SEO Score</span>
                <span className={`text-lg font-bold ${getScoreColor(analysis.score)}`}>
                  {analysis.score}/100
                </span>
              </div>
              <Progress value={analysis.score} className="mb-2" />
              <span className={`text-sm ${getScoreColor(analysis.score)}`}>
                {getScoreLabel(analysis.score)}
              </span>
            </div>

            {/* Basic Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className={`text-xl font-bold ${analysis.length > 60 ? 'text-red-600' : 'text-green-600'}`}>
                  {analysis.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Characters</div>
              </div>
              <div className="text-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="text-xl font-bold text-blue-600">{analysis.wordCount}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Words</div>
              </div>
              <div className="text-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="text-xl font-bold text-purple-600">{analysis.keywordDensity.toFixed(1)}%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Keyword Density</div>
              </div>
              <div className="text-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="text-xl font-bold text-orange-600">{analysis.powerWords.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Power Words</div>
              </div>
            </div>

            {/* SERP Preview */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <h4 className="font-semibold">SERP Preview</h4>
                <div className="flex gap-2">
                  <Button
                    variant={viewMode === 'desktop' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('desktop')}
                  >
                    <Monitor className="w-4 h-4 mr-2" />
                    Desktop
                  </Button>
                  <Button
                    variant={viewMode === 'mobile' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('mobile')}
                  >
                    <Smartphone className="w-4 h-4 mr-2" />
                    Mobile
                  </Button>
                </div>
              </div>
              
              <div className={`border border-gray-300 dark:border-gray-600 rounded-lg p-4 ${viewMode === 'mobile' ? 'max-w-sm' : 'max-w-2xl'}`}>
                <div className="text-blue-600 hover:underline cursor-pointer mb-1" style={{ fontSize: viewMode === 'mobile' ? '16px' : '18px', lineHeight: '1.3' }}>
                  {analysis.serpPreview[viewMode]}
                </div>
                <div className="text-green-700 dark:text-green-500 mb-2" style={{ fontSize: viewMode === 'mobile' ? '12px' : '14px' }}>
                  {url || 'https://example.com/page'}
                </div>
                <div className="text-gray-600 dark:text-gray-400" style={{ fontSize: viewMode === 'mobile' ? '13px' : '14px', lineHeight: '1.4' }}>
                  Your meta description will appear here. Make it compelling to encourage clicks.
                </div>
              </div>
            </div>

            {/* Feature Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Power Words Found</h4>
                {analysis.powerWords.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {analysis.powerWords.map(word => (
                      <Badge key={word} variant="secondary">{word}</Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-600 dark:text-gray-400">No power words detected</p>
                )}
              </div>

              <div>
                <h4 className="font-semibold mb-3">Emotional Triggers</h4>
                {analysis.emotions.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {analysis.emotions.map(emotion => (
                      <Badge key={emotion} variant="outline">{emotion}</Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-600 dark:text-gray-400">No emotional triggers detected</p>
                )}
              </div>
            </div>

            {/* Recommendations */}
            {analysis.recommendations.length > 0 && (
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Optimization Recommendations
                </h4>
                <div className="space-y-1">
                  {analysis.recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span>{recommendation}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}