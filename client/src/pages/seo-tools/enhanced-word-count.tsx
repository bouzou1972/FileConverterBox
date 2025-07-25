import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, FileText, BarChart3, Eye, Download } from "lucide-react";

interface ContentAnalysis {
  wordCount: number;
  characterCount: number;
  characterCountNoSpaces: number;
  sentenceCount: number;
  paragraphCount: number;
  readingTime: number;
  avgWordsPerSentence: number;
  avgSentencesPerParagraph: number;
  keywordDensity: { [key: string]: number };
  readabilityScore: number;
  seoScore: number;
  mostCommonWords: Array<{ word: string; count: number; density: number }>;
  headingStructure: Array<{ level: number; text: string; }>;
  readabilityGrade: string;
  recommendations: string[];
}

export function EnhancedWordCount() {
  const [content, setContent] = useState('');
  const [targetKeyword, setTargetKeyword] = useState('');
  const [isUrl, setIsUrl] = useState(false);
  const [url, setUrl] = useState('');
  const [analysis, setAnalysis] = useState<ContentAnalysis | null>(null);
  const [loading, setLoading] = useState(false);

  const analyzeContent = async () => {
    let textContent = content;
    
    if (isUrl && url) {
      setLoading(true);
      try {
        // Note: In a real implementation, you'd need a backend endpoint to fetch URL content
        // For now, we'll analyze the provided content
        textContent = content || "Please paste the content from the URL for analysis.";
      } catch (error) {
        console.error('Error fetching URL content:', error);
      } finally {
        setLoading(false);
      }
    }

    if (!textContent.trim()) return;

    const words = textContent.toLowerCase().match(/\b\w+\b/g) || [];
    const sentences = textContent.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const paragraphs = textContent.split(/\n\s*\n/).filter(p => p.trim().length > 0);
    
    // Word frequency analysis
    const wordFreq: { [key: string]: number } = {};
    words.forEach(word => {
      if (word.length > 3) { // Ignore short words
        wordFreq[word] = (wordFreq[word] || 0) + 1;
      }
    });

    const mostCommonWords = Object.entries(wordFreq)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([word, count]) => ({
        word,
        count,
        density: (count / words.length) * 100
      }));

    // Keyword density
    const keywordDensity: { [key: string]: number } = {};
    if (targetKeyword) {
      const keywordCount = words.filter(word => 
        word.includes(targetKeyword.toLowerCase())
      ).length;
      keywordDensity[targetKeyword] = (keywordCount / words.length) * 100;
    }

    // Reading time (average 200 words per minute)
    const readingTime = Math.ceil(words.length / 200);

    // Basic readability score (simplified Flesch formula)
    const avgWordsPerSentence = words.length / sentences.length;
    const avgSyllablesPerWord = calculateAvgSyllables(words);
    const readabilityScore = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord);

    // Heading structure analysis
    const headingMatches = textContent.match(/<h([1-6])[^>]*>(.*?)<\/h[1-6]>/gi) || [];
    const headingStructure = headingMatches.map(heading => {
      const level = parseInt(heading.match(/<h([1-6])/)?.[1] || '1');
      const text = heading.replace(/<[^>]*>/g, '').trim();
      return { level, text };
    });

    // SEO Score calculation
    let seoScore = 0;
    if (words.length >= 300) seoScore += 20;
    if (words.length <= 2000) seoScore += 10;
    if (targetKeyword && keywordDensity[targetKeyword] >= 0.5 && keywordDensity[targetKeyword] <= 3) seoScore += 20;
    if (avgWordsPerSentence <= 20) seoScore += 15;
    if (readabilityScore >= 60) seoScore += 15;
    if (headingStructure.length > 0) seoScore += 10;
    if (paragraphs.length >= 3) seoScore += 10;

    // Recommendations
    const recommendations = [];
    if (words.length < 300) recommendations.push('Consider adding more content (minimum 300 words for SEO)');
    if (words.length > 2500) recommendations.push('Content might be too long, consider breaking into multiple pages');
    if (targetKeyword && keywordDensity[targetKeyword] < 0.5) recommendations.push('Target keyword density is too low (aim for 0.5-3%)');
    if (targetKeyword && keywordDensity[targetKeyword] > 3) recommendations.push('Target keyword density is too high (aim for 0.5-3%)');
    if (avgWordsPerSentence > 20) recommendations.push('Sentences are too long, aim for under 20 words per sentence');
    if (readabilityScore < 60) recommendations.push('Content readability could be improved');
    if (headingStructure.length === 0) recommendations.push('Add headings to improve content structure');
    if (paragraphs.length < 3) recommendations.push('Break content into more paragraphs for better readability');

    const readabilityGrade = getReadabilityGrade(readabilityScore);

    setAnalysis({
      wordCount: words.length,
      characterCount: textContent.length,
      characterCountNoSpaces: textContent.replace(/\s/g, '').length,
      sentenceCount: sentences.length,
      paragraphCount: paragraphs.length,
      readingTime,
      avgWordsPerSentence: parseFloat(avgWordsPerSentence.toFixed(1)),
      avgSentencesPerParagraph: parseFloat((sentences.length / paragraphs.length).toFixed(1)),
      keywordDensity,
      readabilityScore: parseFloat(readabilityScore.toFixed(1)),
      seoScore,
      mostCommonWords,
      headingStructure,
      readabilityGrade,
      recommendations
    });
  };

  const calculateAvgSyllables = (words: string[]): number => {
    const syllableCount = words.reduce((total, word) => {
      return total + countSyllables(word);
    }, 0);
    return syllableCount / words.length;
  };

  const countSyllables = (word: string): number => {
    word = word.toLowerCase();
    if (word.length <= 3) return 1;
    
    const vowels = 'aeiouy';
    let syllables = 0;
    let prevWasVowel = false;
    
    for (let i = 0; i < word.length; i++) {
      const isVowel = vowels.includes(word[i]);
      if (isVowel && !prevWasVowel) {
        syllables++;
      }
      prevWasVowel = isVowel;
    }
    
    if (word.endsWith('e')) syllables--;
    return Math.max(1, syllables);
  };

  const getReadabilityGrade = (score: number): string => {
    if (score >= 90) return 'Very Easy (5th grade)';
    if (score >= 80) return 'Easy (6th grade)';
    if (score >= 70) return 'Fairly Easy (7th grade)';
    if (score >= 60) return 'Standard (8th-9th grade)';
    if (score >= 50) return 'Fairly Difficult (10th-12th grade)';
    if (score >= 30) return 'Difficult (College level)';
    return 'Very Difficult (Graduate level)';
  };

  const getScoreColor = (score: number, max: number = 100) => {
    const percentage = (score / max) * 100;
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const copyResults = () => {
    if (!analysis) return;
    
    const results = `Content Analysis Report

BASIC STATISTICS:
- Word Count: ${analysis.wordCount}
- Character Count: ${analysis.characterCount}
- Character Count (no spaces): ${analysis.characterCountNoSpaces}
- Sentence Count: ${analysis.sentenceCount}
- Paragraph Count: ${analysis.paragraphCount}
- Reading Time: ${analysis.readingTime} minutes

READABILITY:
- Readability Score: ${analysis.readabilityScore}/100
- Grade Level: ${analysis.readabilityGrade}
- Avg Words per Sentence: ${analysis.avgWordsPerSentence}
- Avg Sentences per Paragraph: ${analysis.avgSentencesPerParagraph}

SEO ANALYSIS:
- SEO Score: ${analysis.seoScore}/100
- Target Keyword: ${targetKeyword || 'Not specified'}
${targetKeyword ? `- Keyword Density: ${analysis.keywordDensity[targetKeyword]?.toFixed(2)}%` : ''}

MOST COMMON WORDS:
${analysis.mostCommonWords.map(w => `- ${w.word}: ${w.count} times (${w.density.toFixed(2)}%)`).join('\n')}

RECOMMENDATIONS:
${analysis.recommendations.map(r => `• ${r}`).join('\n')}

---
Generated by File Converter Box
`;

    navigator.clipboard.writeText(results);
  };

  const downloadReport = () => {
    if (!analysis) return;
    
    const csvContent = [
      'Metric,Value',
      `Word Count,${analysis.wordCount}`,
      `Character Count,${analysis.characterCount}`,
      `Sentence Count,${analysis.sentenceCount}`,
      `Paragraph Count,${analysis.paragraphCount}`,
      `Reading Time (minutes),${analysis.readingTime}`,
      `Readability Score,${analysis.readabilityScore}`,
      `SEO Score,${analysis.seoScore}`,
      `Avg Words per Sentence,${analysis.avgWordsPerSentence}`,
      ...analysis.mostCommonWords.map(w => `"${w.word}",${w.count}`)
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'content-analysis.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Enhanced Website Word Count Tool
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="input" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="input">Content Input</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
            <TabsTrigger value="seo">SEO Insights</TabsTrigger>
            <TabsTrigger value="export">Export</TabsTrigger>
          </TabsList>

          <TabsContent value="input" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isUrl}
                    onChange={(e) => setIsUrl(e.target.checked)}
                  />
                  <span className="text-sm">Analyze URL content</span>
                </label>
              </div>

              {isUrl && (
                <div>
                  <label className="block text-sm font-medium mb-2">Website URL</label>
                  <Input
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com"
                    type="url"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">
                  {isUrl ? 'Content (paste from URL)' : 'Content to Analyze'}
                </label>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Paste your content here or HTML content from a webpage..."
                  className="min-h-40"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Target Keyword (Optional)</label>
                <Input
                  value={targetKeyword}
                  onChange={(e) => setTargetKeyword(e.target.value)}
                  placeholder="e.g., SEO tools"
                />
              </div>

              <Button onClick={analyzeContent} disabled={!content.trim() || loading}>
                {loading ? 'Analyzing...' : 'Analyze Content'}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            {analysis ? (
              <>
                {/* Basic Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{analysis.wordCount}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Words</div>
                  </div>
                  <div className="text-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{analysis.characterCount}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Characters</div>
                  </div>
                  <div className="text-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{analysis.sentenceCount}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Sentences</div>
                  </div>
                  <div className="text-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">{analysis.readingTime}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Min Read</div>
                  </div>
                </div>

                {/* Readability Score */}
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Readability Score</span>
                    <span className={`text-lg font-bold ${getScoreColor(analysis.readabilityScore)}`}>
                      {analysis.readabilityScore}/100
                    </span>
                  </div>
                  <Progress value={analysis.readabilityScore} className="mb-2" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {analysis.readabilityGrade}
                  </span>
                </div>

                {/* Most Common Words */}
                <div>
                  <h3 className="font-semibold mb-3">Most Common Words</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {analysis.mostCommonWords.map((wordData, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        <span className="font-medium">{wordData.word}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{wordData.count}</Badge>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {wordData.density.toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Heading Structure */}
                {analysis.headingStructure.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3">Heading Structure</h3>
                    <div className="space-y-2">
                      {analysis.headingStructure.map((heading, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Badge variant="outline">H{heading.level}</Badge>
                          <span className="text-sm">{heading.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center p-8 text-gray-500 dark:text-gray-400">
                Analyze content to see detailed statistics
              </div>
            )}
          </TabsContent>

          <TabsContent value="seo" className="space-y-6">
            {analysis ? (
              <>
                {/* SEO Score */}
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">SEO Score</span>
                    <span className={`text-lg font-bold ${getScoreColor(analysis.seoScore)}`}>
                      {analysis.seoScore}/100
                    </span>
                  </div>
                  <Progress value={analysis.seoScore} className="mb-2" />
                </div>

                {/* Keyword Density */}
                {targetKeyword && analysis.keywordDensity[targetKeyword] !== undefined && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h3 className="font-semibold mb-2">Keyword Analysis</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Target Keyword:</span>
                        <Badge>{targetKeyword}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Density:</span>
                        <span className={`font-medium ${
                          analysis.keywordDensity[targetKeyword] >= 0.5 && analysis.keywordDensity[targetKeyword] <= 3
                            ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {analysis.keywordDensity[targetKeyword].toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                {analysis.recommendations.length > 0 && (
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      SEO Recommendations
                    </h3>
                    <div className="space-y-2">
                      {analysis.recommendations.map((recommendation, index) => (
                        <div key={index} className="flex items-start gap-2 text-sm">
                          <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2 flex-shrink-0"></div>
                          <span>{recommendation}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Content Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <h4 className="font-semibold mb-2">Readability Metrics</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Avg Words/Sentence:</span>
                        <span className={analysis.avgWordsPerSentence <= 20 ? 'text-green-600' : 'text-red-600'}>
                          {analysis.avgWordsPerSentence}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Avg Sentences/Paragraph:</span>
                        <span>{analysis.avgSentencesPerParagraph}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <h4 className="font-semibold mb-2">Content Structure</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Paragraphs:</span>
                        <span className={analysis.paragraphCount >= 3 ? 'text-green-600' : 'text-yellow-600'}>
                          {analysis.paragraphCount}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Headings:</span>
                        <span className={analysis.headingStructure.length > 0 ? 'text-green-600' : 'text-red-600'}>
                          {analysis.headingStructure.length}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center p-8 text-gray-500 dark:text-gray-400">
                Analyze content to see SEO insights
              </div>
            )}
          </TabsContent>

          <TabsContent value="export" className="space-y-4">
            {analysis ? (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h3 className="font-semibold mb-2">Export Options</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Export your content analysis results in different formats for further use.
                  </p>
                  
                  <div className="flex gap-2">
                    <Button onClick={copyResults}>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Report
                    </Button>
                    <Button onClick={downloadReport} variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Download CSV
                    </Button>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h4 className="font-semibold mb-2">Analysis Summary</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Words:</span>
                      <div className="font-semibold">{analysis.wordCount}</div>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">SEO Score:</span>
                      <div className={`font-semibold ${getScoreColor(analysis.seoScore)}`}>
                        {analysis.seoScore}/100
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Readability:</span>
                      <div className={`font-semibold ${getScoreColor(analysis.readabilityScore)}`}>
                        {analysis.readabilityScore}/100
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Reading Time:</span>
                      <div className="font-semibold">{analysis.readingTime} min</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center p-8 text-gray-500 dark:text-gray-400">
                Analyze content to enable export options
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}