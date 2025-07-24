import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileText, RefreshCw, BookOpen, BarChart3, TrendingUp, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import CopyButton from "@/components/copy-button";
import BuyMeCoffee from "@/components/buy-me-coffee";

interface ReadabilityScore {
  name: string;
  score: number;
  level: string;
  description: string;
  interpretation: string;
  color: string;
}

export default function ReadabilityGrader() {
  const [text, setText] = useState("");
  const [scores, setScores] = useState<ReadabilityScore[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [stats, setStats] = useState({
    words: 0,
    sentences: 0,
    paragraphs: 0,
    characters: 0,
    averageWordsPerSentence: 0,
    averageSentencesPerParagraph: 0,
    averageSyllablesPerWord: 0
  });
  const { toast } = useToast();

  // Count syllables in a word using heuristic rules
  const countSyllables = (word: string): number => {
    word = word.toLowerCase();
    if (word.length <= 3) return 1;
    
    let count = 0;
    const vowels = 'aeiouy';
    let previousWasVowel = false;
    
    for (let i = 0; i < word.length; i++) {
      const isVowel = vowels.includes(word[i]);
      if (isVowel && !previousWasVowel) {
        count++;
      }
      previousWasVowel = isVowel;
    }
    
    // Handle silent 'e' at the end
    if (word.endsWith('e') && count > 1) {
      count--;
    }
    
    // Ensure at least 1 syllable
    return Math.max(count, 1);
  };

  // Count complex words (3+ syllables)
  const countComplexWords = (words: string[]): number => {
    return words.filter(word => countSyllables(word) >= 3).length;
  };

  // Calculate Flesch Reading Ease
  const calculateFleschReadingEase = (words: number, sentences: number, syllables: number): number => {
    if (sentences === 0 || words === 0) return 0;
    return 206.835 - (1.015 * (words / sentences)) - (84.6 * (syllables / words));
  };

  // Calculate Flesch-Kincaid Grade Level
  const calculateFleschKincaid = (words: number, sentences: number, syllables: number): number => {
    if (sentences === 0 || words === 0) return 0;
    return (0.39 * (words / sentences)) + (11.8 * (syllables / words)) - 15.59;
  };

  // Calculate Gunning Fog Index
  const calculateGunningFog = (words: number, sentences: number, complexWords: number): number => {
    if (sentences === 0) return 0;
    return 0.4 * ((words / sentences) + (100 * (complexWords / words)));
  };

  // Calculate SMOG Index
  const calculateSMOG = (sentences: number, complexWords: number): number => {
    if (sentences === 0) return 0;
    return 1.0430 * Math.sqrt(complexWords * (30 / sentences)) + 3.1291;
  };

  // Calculate Automated Readability Index
  const calculateARI = (characters: number, words: number, sentences: number): number => {
    if (words === 0 || sentences === 0) return 0;
    return (4.71 * (characters / words)) + (0.5 * (words / sentences)) - 21.43;
  };

  // Calculate Coleman-Liau Index
  const calculateColemanLiau = (characters: number, words: number, sentences: number): number => {
    if (words === 0) return 0;
    const L = (characters / words) * 100;
    const S = (sentences / words) * 100;
    return (0.0588 * L) - (0.296 * S) - 15.8;
  };

  const getReadingLevel = (score: number, type: string): { level: string; color: string } => {
    if (type === 'flesch-ease') {
      if (score >= 90) return { level: "5th Grade (Very Easy)", color: "text-green-600" };
      if (score >= 80) return { level: "6th Grade (Easy)", color: "text-green-500" };
      if (score >= 70) return { level: "7th Grade (Fairly Easy)", color: "text-blue-500" };
      if (score >= 60) return { level: "8th-9th Grade (Standard)", color: "text-yellow-600" };
      if (score >= 50) return { level: "10th-12th Grade (Fairly Difficult)", color: "text-orange-500" };
      if (score >= 30) return { level: "College Level (Difficult)", color: "text-red-500" };
      return { level: "Graduate Level (Very Difficult)", color: "text-red-700" };
    } else {
      // Grade level scores
      if (score <= 6) return { level: `${Math.round(score)}th Grade (Elementary)`, color: "text-green-600" };
      if (score <= 9) return { level: `${Math.round(score)}th Grade (Middle School)`, color: "text-blue-500" };
      if (score <= 12) return { level: `${Math.round(score)}th Grade (High School)`, color: "text-yellow-600" };
      if (score <= 16) return { level: "College Level", color: "text-orange-500" };
      return { level: "Graduate Level", color: "text-red-500" };
    }
  };

  const analyzeReadability = () => {
    if (!text.trim()) {
      toast({
        title: "No text to analyze",
        description: "Please enter some text to analyze",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      // Basic text statistics
      const characters = text.replace(/\s/g, '').length;
      const words = text.trim().split(/\s+/).filter(word => word.length > 0);
      const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
      const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);

      const wordCount = words.length;
      const sentenceCount = sentences.length;
      const paragraphCount = paragraphs.length;

      // Calculate syllables
      const totalSyllables = words.reduce((sum, word) => sum + countSyllables(word), 0);
      const complexWords = countComplexWords(words);

      // Update stats
      const newStats = {
        words: wordCount,
        sentences: sentenceCount,
        paragraphs: paragraphCount,
        characters,
        averageWordsPerSentence: sentenceCount > 0 ? wordCount / sentenceCount : 0,
        averageSentencesPerParagraph: paragraphCount > 0 ? sentenceCount / paragraphCount : 0,
        averageSyllablesPerWord: wordCount > 0 ? totalSyllables / wordCount : 0
      };
      setStats(newStats);

      // Calculate readability scores
      const fleschEase = calculateFleschReadingEase(wordCount, sentenceCount, totalSyllables);
      const fleschKincaid = calculateFleschKincaid(wordCount, sentenceCount, totalSyllables);
      const gunningFog = calculateGunningFog(wordCount, sentenceCount, complexWords);
      const smog = calculateSMOG(sentenceCount, complexWords);
      const ari = calculateARI(characters, wordCount, sentenceCount);
      const colemanLiau = calculateColemanLiau(characters, wordCount, sentenceCount);

      const readabilityScores: ReadabilityScore[] = [
        {
          name: "Flesch Reading Ease",
          score: Math.round(fleschEase * 10) / 10,
          level: getReadingLevel(fleschEase, 'flesch-ease').level,
          color: getReadingLevel(fleschEase, 'flesch-ease').color,
          description: "Higher scores indicate easier reading",
          interpretation: "Based on average sentence length and syllables per word"
        },
        {
          name: "Flesch-Kincaid Grade",
          score: Math.round(fleschKincaid * 10) / 10,
          level: getReadingLevel(fleschKincaid, 'grade').level,
          color: getReadingLevel(fleschKincaid, 'grade').color,
          description: "US grade level needed to understand the text",
          interpretation: "Most widely used readability formula"
        },
        {
          name: "Gunning Fog Index",
          score: Math.round(gunningFog * 10) / 10,
          level: getReadingLevel(gunningFog, 'grade').level,
          color: getReadingLevel(gunningFog, 'grade').color,
          description: "Grade level considering complex words",
          interpretation: "Focuses on sentence length and complex words"
        },
        {
          name: "SMOG Index",
          score: Math.round(smog * 10) / 10,
          level: getReadingLevel(smog, 'grade').level,
          color: getReadingLevel(smog, 'grade').color,
          description: "Simple Measure of Gobbledygook",
          interpretation: "Estimates years of education needed"
        },
        {
          name: "Automated Readability Index",
          score: Math.round(ari * 10) / 10,
          level: getReadingLevel(ari, 'grade').level,
          color: getReadingLevel(ari, 'grade').color,
          description: "Based on characters per word and words per sentence",
          interpretation: "Computer-friendly formula using character counts"
        },
        {
          name: "Coleman-Liau Index",
          score: Math.round(colemanLiau * 10) / 10,
          level: getReadingLevel(colemanLiau, 'grade').level,
          color: getReadingLevel(colemanLiau, 'grade').color,
          description: "Uses character count instead of syllables",
          interpretation: "Relies on characters and sentence length"
        }
      ];

      setScores(readabilityScores);
      setIsAnalyzing(false);

      toast({
        title: "Analysis complete",
        description: `Analyzed ${wordCount} words using 6 readability formulas`,
      });

    } catch (error) {
      setIsAnalyzing(false);
      toast({
        title: "Analysis failed",
        description: "An error occurred while analyzing the text",
        variant: "destructive",
      });
    }
  };

  const loadSample = () => {
    const sample = `The quick brown fox jumps over the lazy dog. This is a simple sentence used to test readability. 
    
    However, when we introduce more complex vocabulary and intricate sentence structures, the readability scores will demonstrate significant variations. Sophisticated algorithms analyze multiple linguistic parameters including syllabic complexity, sentence length, and lexical diversity to determine comprehension difficulty levels.
    
    These readability formulas were developed by educational researchers to help writers create content appropriate for their target audience. Understanding your text's readability helps ensure effective communication.`;
    setText(sample);
  };

  const clearAll = () => {
    setText("");
    setScores([]);
    setStats({
      words: 0,
      sentences: 0,
      paragraphs: 0,
      characters: 0,
      averageWordsPerSentence: 0,
      averageSentencesPerParagraph: 0,
      averageSyllablesPerWord: 0
    });
  };

  const getOverallGrade = (): { grade: number; level: string; color: string } => {
    if (scores.length === 0) return { grade: 0, level: "No analysis", color: "text-gray-500" };
    
    // Average grade level scores (excluding Flesch Reading Ease)
    const gradeScores = scores.filter(s => s.name !== "Flesch Reading Ease").map(s => s.score);
    const averageGrade = gradeScores.reduce((sum, score) => sum + score, 0) / gradeScores.length;
    
    const result = getReadingLevel(averageGrade, 'grade');
    return { grade: Math.round(averageGrade * 10) / 10, level: result.level, color: result.color };
  };

  const overall = getOverallGrade();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Readability Grader</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Analyze your text with 6 different readability formulas including Flesch-Kincaid, Gunning Fog, 
          and SMOG indices. Get detailed statistics and grade level assessments.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Text Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2 mb-4">
                <Button variant="outline" size="sm" onClick={loadSample}>
                  Load Sample
                </Button>
                <Button variant="outline" size="sm" onClick={clearAll}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Clear
                </Button>
                <CopyButton text={text} label="Copy Text" />
              </div>

              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste your text here to analyze readability. The tool works best with at least 100 words for accurate results..."
                className="min-h-[300px] font-mono text-sm resize-none"
              />

              <Button 
                onClick={analyzeReadability} 
                disabled={isAnalyzing || !text.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Analyze Readability
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Text Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-blue-50 p-3 rounded">
                  <div className="font-semibold text-blue-900">Words</div>
                  <div className="text-xl font-bold text-blue-600">{stats.words.toLocaleString()}</div>
                </div>
                <div className="bg-green-50 p-3 rounded">
                  <div className="font-semibold text-green-900">Sentences</div>
                  <div className="text-xl font-bold text-green-600">{stats.sentences.toLocaleString()}</div>
                </div>
                <div className="bg-purple-50 p-3 rounded">
                  <div className="font-semibold text-purple-900">Paragraphs</div>
                  <div className="text-xl font-bold text-purple-600">{stats.paragraphs.toLocaleString()}</div>
                </div>
                <div className="bg-orange-50 p-3 rounded">
                  <div className="font-semibold text-orange-900">Characters</div>
                  <div className="text-xl font-bold text-orange-600">{stats.characters.toLocaleString()}</div>
                </div>
              </div>
              
              <div className="border-t pt-3 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span>Avg Words/Sentence:</span>
                  <span className="font-semibold">{stats.averageWordsPerSentence.toFixed(1)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Avg Sentences/Paragraph:</span>
                  <span className="font-semibold">{stats.averageSentencesPerParagraph.toFixed(1)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Avg Syllables/Word:</span>
                  <span className="font-semibold">{stats.averageSyllablesPerWord.toFixed(1)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {scores.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Overall Grade
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2" style={{ color: overall.color.replace('text-', '') }}>
                    {overall.grade}
                  </div>
                  <div className={`font-semibold ${overall.color}`}>
                    {overall.level}
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    Average of 5 grade-level formulas
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {scores.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Readability Scores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {scores.map((score, index) => (
                <div key={index} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-sm">{score.name}</h4>
                    <Badge variant="secondary" className="ml-2">
                      {score.score}
                    </Badge>
                  </div>
                  
                  <div className={`font-medium text-sm mb-2 ${score.color}`}>
                    {score.level}
                  </div>
                  
                  <p className="text-xs text-gray-600 mb-1">
                    {score.description}
                  </p>
                  
                  <p className="text-xs text-gray-500">
                    {score.interpretation}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Alert className="mb-6">
        <Info className="w-4 h-4" />
        <AlertDescription>
          <strong>Best Results:</strong> Use at least 100 words for accurate readability assessment. 
          Different formulas may give varying results - consider your target audience and use multiple scores for context.
        </AlertDescription>
      </Alert>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Understanding Readability Scores</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Grade Level Guide</h4>
              <ul className="text-gray-600 space-y-1">
                <li>• <strong>1-6:</strong> Elementary School</li>
                <li>• <strong>7-9:</strong> Middle School</li>
                <li>• <strong>10-12:</strong> High School</li>
                <li>• <strong>13-16:</strong> College Level</li>
                <li>• <strong>17+:</strong> Graduate Level</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Writing Guidelines</h4>
              <ul className="text-gray-600 space-y-1">
                <li>• <strong>Web Content:</strong> 6th-8th grade</li>
                <li>• <strong>Business Writing:</strong> 8th-10th grade</li>
                <li>• <strong>Academic Papers:</strong> 12th-16th grade</li>
                <li>• <strong>Technical Docs:</strong> Variable by audience</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Formula Strengths</h4>
              <ul className="text-gray-600 space-y-1">
                <li>• <strong>Flesch:</strong> Most popular, balanced</li>
                <li>• <strong>Gunning Fog:</strong> Business writing</li>
                <li>• <strong>SMOG:</strong> Healthcare materials</li>
                <li>• <strong>ARI:</strong> Computer analysis</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Improvement Tips</h4>
              <ul className="text-gray-600 space-y-1">
                <li>• Use shorter sentences</li>
                <li>• Choose simpler words</li>
                <li>• Break up long paragraphs</li>
                <li>• Use active voice</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-center mt-8">
        <div className="mb-4">
          <p className="text-lg font-medium text-foreground mb-1">💛 Like these tools?</p>
          <p className="text-muted-foreground">Help support future development</p>
        </div>
        <BuyMeCoffee />
        <p className="text-sm text-gray-600 mt-2">
          All analysis happens in your browser - your text never leaves your device!
        </p>
      </div>
    </div>
  );
}