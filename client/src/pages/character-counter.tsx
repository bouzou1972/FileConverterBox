import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, FileText, Timer, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import CopyButton from "@/components/copy-button";
import BuyMeCoffee from "@/components/buy-me-coffee";
import { ToolSEO } from "@/components/tool-seo";
import { ShareButtons } from "@/components/share-buttons";
import { UsageGuide } from "@/components/usage-guide";
import { BookmarkButton } from "@/components/bookmark-button";

export default function CharacterCounter() {
  const [text, setText] = useState("");
  const { toast } = useToast();

  const stats = useMemo(() => {
    const chars = text.length;
    const charsNoSpaces = text.replace(/\s/g, '').length;
    const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
    const sentences = text.trim() === '' ? 0 : text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    const paragraphs = text.trim() === '' ? 0 : text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;
    const lines = text === '' ? 0 : text.split('\n').length;
    
    // Reading time calculation (average 200 words per minute)
    const readingTimeMinutes = Math.ceil(words / 200);
    
    // Speaking time calculation (average 150 words per minute)
    const speakingTimeMinutes = Math.ceil(words / 150);
    
    // Most frequent words
    const wordFreq: { [key: string]: number } = {};
    if (text.trim()) {
      text.toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .forEach(word => {
          if (word.length > 2) { // Only count words longer than 2 characters
            wordFreq[word] = (wordFreq[word] || 0) + 1;
          }
        });
    }
    
    const topWords = Object.entries(wordFreq)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);
    
    // Character frequency
    const charFreq: { [key: string]: number } = {};
    for (const char of text.toLowerCase()) {
      if (char.match(/[a-z]/)) {
        charFreq[char] = (charFreq[char] || 0) + 1;
      }
    }
    
    const topChars = Object.entries(charFreq)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);

    return {
      characters: chars,
      charactersNoSpaces: charsNoSpaces,
      words,
      sentences,
      paragraphs,
      lines,
      readingTime: readingTimeMinutes,
      speakingTime: speakingTimeMinutes,
      topWords,
      topChars,
      averageWordsPerSentence: sentences > 0 ? Math.round((words / sentences) * 10) / 10 : 0,
      averageSentencesPerParagraph: paragraphs > 0 ? Math.round((sentences / paragraphs) * 10) / 10 : 0
    };
  }, [text]);

  const loadSampleText = () => {
    const sample = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.

Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.`;
    setText(sample);
  };

  const clearText = () => {
    setText("");
    toast({
      title: "Cleared",
      description: "Text has been cleared",
    });
  };

  const formatTime = (minutes: number) => {
    if (minutes < 1) return "< 1 min";
    if (minutes === 1) return "1 min";
    if (minutes < 60) return `${minutes} mins`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const usageExamples = [
    {
      title: "Content Analysis",
      description: "Analyze text content for writing optimization",
      steps: [
        "Paste your text content into the text area",
        "View character, word, and sentence counts",
        "Check reading and speaking time estimates",
        "Review word frequency analysis",
        "Use insights for content optimization"
      ],
      tip: "Keep sentences under 20 words for better readability"
    },
    {
      title: "Social Media Optimization",
      description: "Check text length for social media platforms",
      steps: [
        "Enter your social media post text",
        "Check character count for platform limits",
        "Review word frequency for hashtag ideas",
        "Optimize based on character analysis",
        "Ensure content fits platform requirements"
      ],
      tip: "Twitter: 280 chars, Instagram caption: 2,200 chars"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <ToolSEO
        title="Character Counter - Text Analysis & Word Count Tool"
        description="Count characters, words, sentences, and paragraphs. Analyze text with reading time, word frequency, and detailed statistics for content optimization."
        keywords={["character counter", "word counter", "text analysis", "character count", "word count tool"]}
        canonicalUrl="/character-counter"
      />
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Character & Word Counter</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Count characters, words, sentences, and paragraphs in your text. Get reading time estimates, 
          word frequency analysis, and detailed text statistics.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Text Input
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2 mb-4">
                <Button variant="outline" size="sm" onClick={loadSampleText}>
                  Load Sample
                </Button>
                <Button variant="outline" size="sm" onClick={clearText}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Clear
                </Button>
                <CopyButton text={text} label="Copy Text" />
              </div>

              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type or paste your text here to analyze..."
                className="min-h-[400px] font-mono text-sm resize-none"
              />

              <div className="flex gap-2 text-xs text-gray-500">
                <span>Live counting • Real-time analysis • No data stored</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Basic Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-blue-50 p-3 rounded">
                  <div className="font-semibold text-blue-900">Characters</div>
                  <div className="text-xl font-bold text-blue-600">{stats.characters.toLocaleString()}</div>
                </div>
                <div className="bg-green-50 p-3 rounded">
                  <div className="font-semibold text-green-900">No Spaces</div>
                  <div className="text-xl font-bold text-green-600">{stats.charactersNoSpaces.toLocaleString()}</div>
                </div>
                <div className="bg-purple-50 p-3 rounded">
                  <div className="font-semibold text-purple-900">Words</div>
                  <div className="text-xl font-bold text-purple-600">{stats.words.toLocaleString()}</div>
                </div>
                <div className="bg-orange-50 p-3 rounded">
                  <div className="font-semibold text-orange-900">Lines</div>
                  <div className="text-xl font-bold text-orange-600">{stats.lines.toLocaleString()}</div>
                </div>
                <div className="bg-indigo-50 p-3 rounded">
                  <div className="font-semibold text-indigo-900">Sentences</div>
                  <div className="text-xl font-bold text-indigo-600">{stats.sentences.toLocaleString()}</div>
                </div>
                <div className="bg-pink-50 p-3 rounded">
                  <div className="font-semibold text-pink-900">Paragraphs</div>
                  <div className="text-xl font-bold text-pink-600">{stats.paragraphs.toLocaleString()}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Timer className="w-4 h-4" />
                Time Estimates
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="bg-blue-50 p-3 rounded">
                <div className="flex items-center gap-2 mb-1">
                  <Eye className="w-4 h-4 text-blue-600" />
                  <span className="font-semibold text-blue-900">Reading Time</span>
                </div>
                <div className="text-lg font-bold text-blue-600">{formatTime(stats.readingTime)}</div>
                <div className="text-xs text-blue-700">~200 words per minute</div>
              </div>
              <div className="bg-green-50 p-3 rounded">
                <div className="flex items-center gap-2 mb-1">
                  <span className="material-icons text-green-600 text-lg">record_voice_over</span>
                  <span className="font-semibold text-green-900">Speaking Time</span>
                </div>
                <div className="text-lg font-bold text-green-600">{formatTime(stats.speakingTime)}</div>
                <div className="text-xs text-green-700">~150 words per minute</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Text Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm">
                <div className="flex justify-between mb-1">
                  <span>Avg Words/Sentence:</span>
                  <Badge variant="outline">{stats.averageWordsPerSentence}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Avg Sentences/Paragraph:</span>
                  <Badge variant="outline">{stats.averageSentencesPerParagraph}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {(stats.topWords.length > 0 || stats.topChars.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Most Frequent Words</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {stats.topWords.map(([word, count], index) => (
                  <div key={word} className="flex justify-between items-center">
                    <span className="font-mono text-sm">#{index + 1} {word}</span>
                    <Badge variant="outline">{count} times</Badge>
                  </div>
                ))}
                {stats.topWords.length === 0 && (
                  <p className="text-gray-500 text-sm">No words to analyze yet</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Character Frequency</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {stats.topChars.map(([char, count], index) => (
                  <div key={char} className="flex justify-between items-center">
                    <span className="font-mono text-sm">#{index + 1} "{char}"</span>
                    <Badge variant="outline">{count} times</Badge>
                  </div>
                ))}
                {stats.topChars.length === 0 && (
                  <p className="text-gray-500 text-sm">No characters to analyze yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Use Cases & Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Writing & Editing</h4>
              <ul className="text-gray-600 space-y-1">
                <li>• Check word counts for essays and articles</li>
                <li>• Ensure character limits for social media</li>
                <li>• Analyze sentence and paragraph structure</li>
                <li>• Track writing progress and goals</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Content Planning</h4>
              <ul className="text-gray-600 space-y-1">
                <li>• Estimate reading and speaking times</li>
                <li>• Plan content length for presentations</li>
                <li>• Optimize text for specific platforms</li>
                <li>• Analyze text complexity and readability</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Analysis Features</h4>
              <ul className="text-gray-600 space-y-1">
                <li>• Real-time character and word counting</li>
                <li>• Word frequency and repetition analysis</li>
                <li>• Character distribution statistics</li>
                <li>• Average sentence and paragraph metrics</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-center mt-8">
        <ShareButtons 
          title="Character Counter - Text Analysis & Word Count Tool"
          description="Count characters, words, sentences with reading time and word frequency analysis"
        />
        
        <UsageGuide 
          title="Character Counter"
          description="Learn how to analyze text content with detailed statistics and insights"
          examples={usageExamples}
          tips={[
            "Use for social media character limits",
            "Check reading time for blog posts",
            "Analyze word frequency for SEO",
            "Review sentence length for readability",
            "Track character distribution for content balance"
          ]}
          commonUses={[
            "Social media posts",
            "Blog content analysis",
            "Academic writing",
            "SEO optimization",
            "Content planning"
          ]}
        />

        <div className="mb-4">
          <p className="text-lg font-medium text-foreground mb-1">💛 Like these tools?</p>
          <p className="text-muted-foreground">Help support future development</p>
        </div>
        <BuyMeCoffee />
        <p className="text-sm text-gray-600 mt-2">
          Thanks for using this free tool! Your support keeps it ad-free and private.
        </p>
      </div>
    </div>
  );
}