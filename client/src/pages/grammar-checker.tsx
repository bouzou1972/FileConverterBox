import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertTriangle, FileText, RefreshCw, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import CopyButton from "@/components/copy-button";
import BuyMeCoffee from "@/components/buy-me-coffee";

interface GrammarIssue {
  type: 'spelling' | 'grammar' | 'punctuation' | 'style';
  word: string;
  suggestion: string;
  description: string;
  position: number;
}

export default function GrammarChecker() {
  const [text, setText] = useState("");
  const [issues, setIssues] = useState<GrammarIssue[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [stats, setStats] = useState({ words: 0, sentences: 0, issues: 0 });
  const { toast } = useToast();

  // Extended grammar and spelling rules
  const grammarRules = [
    // Common spelling mistakes
    { word: "alot", suggest: "a lot", type: "spelling", desc: "Two words, not one" },
    { word: "definately", suggest: "definitely", type: "spelling", desc: "Common misspelling" },
    { word: "recieve", suggest: "receive", type: "spelling", desc: "I before E except after C" },
    { word: "seperate", suggest: "separate", type: "spelling", desc: "Common misspelling" },
    { word: "occured", suggest: "occurred", type: "spelling", desc: "Double R needed" },
    { word: "begining", suggest: "beginning", type: "spelling", desc: "Double N needed" },
    { word: "necesary", suggest: "necessary", type: "spelling", desc: "Double S needed" },
    { word: "accomodate", suggest: "accommodate", type: "spelling", desc: "Double C and M" },
    { word: "maintainance", suggest: "maintenance", type: "spelling", desc: "Common misspelling" },
    { word: "embarass", suggest: "embarrass", type: "spelling", desc: "Double R and S" },
    
    // Grammar mistakes
    { word: "should of", suggest: "should have", type: "grammar", desc: "Use 'have' not 'of'" },
    { word: "would of", suggest: "would have", type: "grammar", desc: "Use 'have' not 'of'" },
    { word: "could of", suggest: "could have", type: "grammar", desc: "Use 'have' not 'of'" },
    { word: "loose", suggest: "lose (if meaning to misplace)", type: "grammar", desc: "Loose = not tight, Lose = misplace" },
    { word: "affect", suggest: "effect (if used as noun)", type: "grammar", desc: "Affect = verb, Effect = noun" },
    { word: "then", suggest: "than (for comparisons)", type: "grammar", desc: "Then = time, Than = comparison" },
    
    // Homophones and commonly confused words
    { word: "your", suggest: "you're (if meaning 'you are')", type: "grammar", desc: "Your = possessive, You're = you are" },
    { word: "there", suggest: "their/they're", type: "grammar", desc: "There = place, Their = possessive, They're = they are" },
    { word: "its", suggest: "it's (if meaning 'it is')", type: "grammar", desc: "Its = possessive, It's = it is" },
    { word: "who's", suggest: "whose (if showing possession)", type: "grammar", desc: "Who's = who is, Whose = possessive" },
    { word: "accept", suggest: "except (if meaning 'but not')", type: "grammar", desc: "Accept = receive, Except = excluding" },
    { word: "complement", suggest: "compliment (if meaning praise)", type: "grammar", desc: "Complement = complete, Compliment = praise" },
    
    // Style and redundancy
    { word: "very unique", suggest: "unique", type: "style", desc: "Unique is absolute - no degree needed" },
    { word: "most unique", suggest: "unique", type: "style", desc: "Unique is absolute - no degree needed" },
    { word: "more perfect", suggest: "perfect", type: "style", desc: "Perfect is absolute - no degree needed" },
    { word: "irregardless", suggest: "regardless", type: "style", desc: "Irregardless is not a standard word" },
    { word: "for free", suggest: "free", type: "style", desc: "Redundant - just use 'free'" },
    { word: "end result", suggest: "result", type: "style", desc: "Redundant - results are always at the end" },
    { word: "past history", suggest: "history", type: "style", desc: "Redundant - history is always past" },
    
    // Punctuation patterns
    { word: " ,", suggest: ",", type: "punctuation", desc: "No space before comma" },
    { word: " .", suggest: ".", type: "punctuation", desc: "No space before period" },
    { word: " !", suggest: "!", type: "punctuation", desc: "No space before exclamation" },
    { word: " ?", suggest: "?", type: "punctuation", desc: "No space before question mark" },
  ];

  const checkGrammar = () => {
    if (!text.trim()) {
      toast({
        title: "No text to check",
        description: "Please enter some text to analyze",
        variant: "destructive",
      });
      return;
    }

    setIsChecking(true);
    const foundIssues: GrammarIssue[] = [];
    
    // Check each rule against the text
    grammarRules.forEach(rule => {
      const regex = new RegExp(`\\b${rule.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
      let match;
      
      while ((match = regex.exec(text)) !== null) {
        foundIssues.push({
          type: rule.type as 'spelling' | 'grammar' | 'punctuation' | 'style',
          word: match[0],
          suggestion: rule.suggest,
          description: rule.desc,
          position: match.index
        });
      }
    });

    // Check for double spaces
    const doubleSpaceRegex = /  +/g;
    let match;
    while ((match = doubleSpaceRegex.exec(text)) !== null) {
      foundIssues.push({
        type: 'style',
        word: match[0],
        suggestion: ' ',
        description: 'Multiple spaces should be single space',
        position: match.index
      });
    }

    // Sort issues by position
    foundIssues.sort((a, b) => a.position - b.position);
    
    setIssues(foundIssues);
    
    // Calculate stats
    const words = text.trim().split(/\s+/).length;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    
    setStats({
      words,
      sentences,
      issues: foundIssues.length
    });

    setIsChecking(false);
    
    toast({
      title: "Grammar check complete",
      description: `Found ${foundIssues.length} potential issue${foundIssues.length !== 1 ? 's' : ''}`,
    });
  };

  const loadSample = () => {
    const sample = `Your going to loose you're mind when you see this! I definately recieve alot of feedback about my grammer. Their are many common mistakes that people make, irregardless of there education level. Its important to seperate good writing from poor writing  . This is a very unique opportunity to improve you're skills.`;
    setText(sample);
  };

  const clearAll = () => {
    setText("");
    setIssues([]);
    setStats({ words: 0, sentences: 0, issues: 0 });
  };

  const applySuggestion = (issue: GrammarIssue) => {
    const before = text.substring(0, issue.position);
    const after = text.substring(issue.position + issue.word.length);
    const newText = before + issue.suggestion + after;
    setText(newText);
    
    // Re-run grammar check with updated text
    setTimeout(() => {
      checkGrammar();
    }, 100);
  };

  const getIssueIcon = (type: string) => {
    switch (type) {
      case 'spelling': return '📝';
      case 'grammar': return '📚';
      case 'punctuation': return '✏️';
      case 'style': return '🎨';
      default: return '❓';
    }
  };

  const getIssueColor = (type: string) => {
    switch (type) {
      case 'spelling': return 'destructive';
      case 'grammar': return 'destructive';
      case 'punctuation': return 'default';
      case 'style': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Grammar Checker</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Check your text for common grammar, spelling, punctuation, and style issues. 
          Get suggestions to improve your writing quality and readability.
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
                placeholder="Type or paste your text here to check for grammar, spelling, and style issues..."
                className="min-h-[300px] font-mono text-sm resize-none"
              />

              <Button 
                onClick={checkGrammar} 
                disabled={isChecking || !text.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isChecking ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Checking...
                  </>
                ) : (
                  <>
                    <BookOpen className="w-4 h-4 mr-2" />
                    Check Grammar
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
              <div className="grid grid-cols-1 gap-3 text-sm">
                <div className="bg-blue-50 p-3 rounded">
                  <div className="font-semibold text-blue-900">Words</div>
                  <div className="text-xl font-bold text-blue-600">{stats.words.toLocaleString()}</div>
                </div>
                <div className="bg-green-50 p-3 rounded">
                  <div className="font-semibold text-green-900">Sentences</div>
                  <div className="text-xl font-bold text-green-600">{stats.sentences.toLocaleString()}</div>
                </div>
                <div className={`p-3 rounded ${stats.issues === 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                  <div className={`font-semibold ${stats.issues === 0 ? 'text-green-900' : 'text-red-900'}`}>Issues Found</div>
                  <div className={`text-xl font-bold ${stats.issues === 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {stats.issues.toLocaleString()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Check Types</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm space-y-2">
                <div className="flex items-center gap-2">
                  <span>📝</span>
                  <span>Spelling mistakes</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>📚</span>
                  <span>Grammar errors</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>✏️</span>
                  <span>Punctuation issues</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>🎨</span>
                  <span>Style improvements</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {issues.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Issues Found ({issues.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {issues.map((issue, index) => (
                <div key={index} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">{getIssueIcon(issue.type)}</span>
                        <Badge variant={getIssueColor(issue.type) as any} className="capitalize">
                          {issue.type}
                        </Badge>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="font-semibold">
                          Found: "<span className="font-mono text-red-600">{issue.word}</span>"
                        </div>
                        <div className="text-sm text-gray-600">
                          Suggestion: <span className="font-mono text-green-600">{issue.suggestion}</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {issue.description}
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => applySuggestion(issue)}
                      className="shrink-0"
                    >
                      Apply Fix
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {issues.length === 0 && stats.words > 0 && (
        <Card className="mb-6">
          <CardContent className="py-8">
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-green-700 mb-2">Great Job!</h3>
              <p className="text-gray-600">No common grammar or spelling issues found in your text.</p>
            </div>
          </CardContent>
        </Card>
      )}

      <Alert className="mb-6">
        <BookOpen className="w-4 h-4" />
        <AlertDescription>
          <strong>Note:</strong> This is a basic grammar checker that catches common mistakes. 
          For comprehensive grammar analysis, consider using professional tools like Grammarly or LanguageTool.
        </AlertDescription>
      </Alert>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>What This Tool Checks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Spelling Issues</h4>
              <ul className="text-gray-600 space-y-1">
                <li>• Common misspellings (alot → a lot)</li>
                <li>• Frequently confused spellings</li>
                <li>• Double letter mistakes</li>
                <li>• I before E exceptions</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Grammar Errors</h4>
              <ul className="text-gray-600 space-y-1">
                <li>• Your vs You're confusion</li>
                <li>• Their/There/They're mix-ups</li>
                <li>• Could of → Could have</li>
                <li>• Affect vs Effect usage</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Style Improvements</h4>
              <ul className="text-gray-600 space-y-1">
                <li>• Redundant phrases</li>
                <li>• Absolute word misuse</li>
                <li>• Non-standard words</li>
                <li>• Multiple spaces</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Punctuation</h4>
              <ul className="text-gray-600 space-y-1">
                <li>• Spacing before punctuation</li>
                <li>• Missing punctuation patterns</li>
                <li>• Comma and period placement</li>
                <li>• Question and exclamation marks</li>
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
          Thanks for using this free tool! Your support keeps it ad-free and private.
        </p>
      </div>
    </div>
  );
}