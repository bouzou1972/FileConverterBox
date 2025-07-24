import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, RefreshCw, Target, TrendingDown, Lightbulb, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import CopyButton from "@/components/copy-button";
import BuyMeCoffee from "@/components/buy-me-coffee";

interface PassiveVoiceMatch {
  sentence: string;
  passivePhrase: string;
  suggestion: string;
  startIndex: number;
  endIndex: number;
  confidence: 'high' | 'medium' | 'low';
  type: string;
}

export default function PassiveVoiceDetector() {
  const [text, setText] = useState("");
  const [matches, setMatches] = useState<PassiveVoiceMatch[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [stats, setStats] = useState({
    totalSentences: 0,
    passiveSentences: 0,
    passivePercentage: 0,
    activeVoiceScore: 0
  });
  const [showHighlights, setShowHighlights] = useState(true);
  const { toast } = useToast();

  // Common "to be" verbs in various forms
  const beVerbs = [
    'am', 'is', 'are', 'was', 'were', 'being', 'been', 'be',
    'will be', 'would be', 'could be', 'should be', 'might be', 'may be',
    'has been', 'have been', 'had been', 'will have been'
  ];

  // Past participles (common ones - this could be expanded)
  const pastParticiples = [
    'accepted', 'achieved', 'acted', 'added', 'admitted', 'affected', 'agreed', 'allowed', 'announced', 'answered',
    'appeared', 'applied', 'appointed', 'approached', 'approved', 'argued', 'arranged', 'arrived', 'asked', 'assigned',
    'assumed', 'attacked', 'attempted', 'attended', 'attracted', 'avoided', 'awarded', 'based', 'beaten', 'become',
    'begun', 'believed', 'belonged', 'born', 'bought', 'brought', 'built', 'called', 'carried', 'caught',
    'caused', 'changed', 'charged', 'chosen', 'claimed', 'cleaned', 'cleared', 'closed', 'collected', 'combined',
    'come', 'committed', 'compared', 'completed', 'concerned', 'concluded', 'conducted', 'confirmed', 'connected', 'considered',
    'constructed', 'contained', 'continued', 'controlled', 'converted', 'cooked', 'copied', 'corrected', 'cost', 'counted',
    'covered', 'created', 'crossed', 'cut', 'damaged', 'decided', 'declared', 'defeated', 'delivered', 'demonstrated',
    'denied', 'departed', 'depended', 'described', 'designed', 'destroyed', 'determined', 'developed', 'died', 'directed',
    'discovered', 'discussed', 'displayed', 'distributed', 'divided', 'done', 'drawn', 'driven', 'dropped', 'earned',
    'eaten', 'educated', 'elected', 'employed', 'enabled', 'encouraged', 'ended', 'enjoyed', 'entered', 'equipped',
    'established', 'estimated', 'evaluated', 'examined', 'exceeded', 'exchanged', 'executed', 'exercised', 'existed', 'expanded',
    'expected', 'experienced', 'explained', 'explored', 'expressed', 'extended', 'faced', 'failed', 'fallen', 'felt',
    'filled', 'filmed', 'finished', 'fitted', 'fixed', 'followed', 'forced', 'forgotten', 'formed', 'found',
    'founded', 'frozen', 'gained', 'gathered', 'given', 'gone', 'governed', 'grown', 'handled', 'happened',
    'heard', 'held', 'helped', 'hidden', 'hit', 'hoped', 'identified', 'ignored', 'imagined', 'implemented',
    'implied', 'improved', 'included', 'increased', 'influenced', 'informed', 'installed', 'introduced', 'invented', 'invested',
    'involved', 'joined', 'judged', 'kept', 'killed', 'known', 'launched', 'learned', 'left', 'led',
    'linked', 'listed', 'lived', 'loaded', 'located', 'locked', 'looked', 'lost', 'loved', 'made',
    'managed', 'marked', 'married', 'matched', 'measured', 'mentioned', 'met', 'missed', 'mixed', 'moved',
    'named', 'needed', 'noted', 'noticed', 'obtained', 'occurred', 'offered', 'opened', 'operated', 'ordered',
    'organized', 'owned', 'paid', 'painted', 'passed', 'performed', 'permitted', 'picked', 'placed', 'planned',
    'planted', 'played', 'pointed', 'prepared', 'presented', 'pressed', 'prevented', 'printed', 'produced', 'promised',
    'protected', 'provided', 'published', 'pulled', 'purchased', 'pushed', 'put', 'raised', 'reached', 'read',
    'realized', 'received', 'recognized', 'recommended', 'recorded', 'reduced', 'referred', 'reflected', 'refused', 'regarded',
    'related', 'released', 'remained', 'remembered', 'removed', 'repeated', 'replaced', 'reported', 'represented', 'required',
    'resolved', 'responded', 'resulted', 'returned', 'revealed', 'reviewed', 'revised', 'run', 'said', 'saved',
    'searched', 'secured', 'seen', 'selected', 'sent', 'served', 'set', 'settled', 'shared', 'shown',
    'signed', 'sold', 'solved', 'sorted', 'spent', 'spoken', 'started', 'stated', 'stayed', 'stopped',
    'stored', 'studied', 'submitted', 'succeeded', 'suggested', 'supported', 'supposed', 'taken', 'talked', 'taught',
    'tested', 'thought', 'told', 'trained', 'transferred', 'treated', 'tried', 'turned', 'understood', 'updated',
    'used', 'valued', 'viewed', 'visited', 'wanted', 'watched', 'welcomed', 'won', 'worked', 'written'
  ];

  // Words that often appear in passive constructions
  const passiveIndicators = ['by', 'with', 'through', 'via', 'using'];

  const detectPassiveVoice = (): PassiveVoiceMatch[] => {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const passiveMatches: PassiveVoiceMatch[] = [];

    sentences.forEach((sentence, index) => {
      const cleanSentence = sentence.trim().toLowerCase();
      const words = cleanSentence.split(/\s+/);
      
      // Look for patterns: [be verb] + [past participle]
      for (let i = 0; i < words.length - 1; i++) {
        const currentWord = words[i];
        const nextWord = words[i + 1];
        
        // Check for simple passive: be verb + past participle
        if (beVerbs.includes(currentWord) && pastParticiples.includes(nextWord)) {
          let confidence: 'high' | 'medium' | 'low' = 'medium';
          let type = 'Simple Passive';
          
          // Increase confidence if there's a "by" phrase
          if (sentence.toLowerCase().includes(' by ')) {
            confidence = 'high';
            type = 'Passive with Agent';
          }
          
          // Check for adverbs between be verb and past participle
          if (i < words.length - 2) {
            const middleWord = words[i + 1];
            const thirdWord = words[i + 2];
            if (pastParticiples.includes(thirdWord) && 
                (middleWord.endsWith('ly') || ['not', 'never', 'often', 'always', 'sometimes'].includes(middleWord))) {
              confidence = 'high';
              type = 'Passive with Adverb';
            }
          }
          
          const passivePhrase = `${currentWord} ${nextWord}`;
          const suggestion = generateActiveSuggestion(sentence, currentWord, nextWord);
          
          passiveMatches.push({
            sentence: sentence.trim(),
            passivePhrase,
            suggestion,
            startIndex: sentence.toLowerCase().indexOf(passivePhrase),
            endIndex: sentence.toLowerCase().indexOf(passivePhrase) + passivePhrase.length,
            confidence,
            type
          });
        }
      }
      
      // Check for other passive patterns
      // Pattern: modal + be + past participle
      for (let i = 0; i < words.length - 2; i++) {
        const modal = words[i];
        const beWord = words[i + 1];
        const participle = words[i + 2];
        
        if (['will', 'would', 'could', 'should', 'might', 'may', 'must', 'can'].includes(modal) &&
            ['be', 'been'].includes(beWord) &&
            pastParticiples.includes(participle)) {
          
          const passivePhrase = `${modal} ${beWord} ${participle}`;
          const suggestion = generateActiveSuggestion(sentence, passivePhrase, '');
          
          passiveMatches.push({
            sentence: sentence.trim(),
            passivePhrase,
            suggestion,
            startIndex: sentence.toLowerCase().indexOf(passivePhrase.toLowerCase()),
            endIndex: sentence.toLowerCase().indexOf(passivePhrase.toLowerCase()) + passivePhrase.length,
            confidence: 'high',
            type: 'Modal Passive'
          });
        }
      }
    });

    return passiveMatches;
  };

  const generateActiveSuggestion = (sentence: string, beVerb: string, participle: string): string => {
    // This is a simplified suggestion generator
    // In a real implementation, this would be much more sophisticated
    
    if (sentence.toLowerCase().includes(' by ')) {
      return "Consider moving the subject after 'by' to the beginning and make it active.";
    }
    
    if (beVerb.includes('will') || beVerb.includes('would')) {
      return "Try: 'Someone/something will [action]' instead of 'will be [past participle]'.";
    }
    
    return "Consider rewriting in active voice by identifying who/what performs the action.";
  };

  const analyzePassiveVoice = () => {
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
      const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
      const passiveMatches = detectPassiveVoice();
      
      const uniquePassiveSentences = new Set(passiveMatches.map(m => m.sentence)).size;
      const passivePercentage = sentences.length > 0 ? (uniquePassiveSentences / sentences.length) * 100 : 0;
      const activeVoiceScore = Math.max(0, 100 - passivePercentage);

      setMatches(passiveMatches);
      setStats({
        totalSentences: sentences.length,
        passiveSentences: uniquePassiveSentences,
        passivePercentage: Math.round(passivePercentage * 10) / 10,
        activeVoiceScore: Math.round(activeVoiceScore * 10) / 10
      });

      setIsAnalyzing(false);

      toast({
        title: "Analysis complete",
        description: `Found ${passiveMatches.length} passive voice instances in ${sentences.length} sentences`,
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

  const highlightPassiveVoice = (text: string): string => {
    if (!showHighlights || matches.length === 0) return text;

    let highlightedText = text;
    const sortedMatches = [...matches].sort((a, b) => b.startIndex - a.startIndex);

    sortedMatches.forEach((match, index) => {
      const beforeMatch = highlightedText.substring(0, match.startIndex);
      const matchText = highlightedText.substring(match.startIndex, match.endIndex);
      const afterMatch = highlightedText.substring(match.endIndex);

      const confidenceClass = match.confidence === 'high' ? 'bg-red-200 border-b-2 border-red-500' :
                             match.confidence === 'medium' ? 'bg-orange-200 border-b-2 border-orange-500' :
                             'bg-yellow-200 border-b-2 border-yellow-500';

      highlightedText = beforeMatch + 
        `<span class="${confidenceClass} rounded px-1 cursor-pointer" title="${match.type}: ${match.suggestion}">${matchText}</span>` + 
        afterMatch;
    });

    return highlightedText;
  };

  const loadSample = () => {
    const sample = `The report was written by the team last week. Mistakes were made during the process, and several revisions will be required. The document has been reviewed by management and feedback was provided. 

    Active voice version: The team wrote the report last week. We made mistakes during the process, and we will require several revisions. Management has reviewed the document and provided feedback.

    The passive voice should be avoided when possible because it can make writing less direct and harder to understand. Clear communication is improved when active voice is used consistently.`;
    setText(sample);
  };

  const clearAll = () => {
    setText("");
    setMatches([]);
    setStats({
      totalSentences: 0,
      passiveSentences: 0,
      passivePercentage: 0,
      activeVoiceScore: 0
    });
  };

  const getScoreColor = (score: number): string => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreLabel = (score: number): string => {
    if (score >= 90) return "Excellent";
    if (score >= 80) return "Good";
    if (score >= 70) return "Fair";
    if (score >= 60) return "Needs Improvement";
    return "Poor";
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Passive Voice Detector</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Identify passive voice constructions in your writing and get suggestions for converting them to active voice. 
          Make your writing more direct, engaging, and easier to read.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Text Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2 mb-4 flex-wrap">
                <Button variant="outline" size="sm" onClick={loadSample}>
                  Load Sample
                </Button>
                <Button variant="outline" size="sm" onClick={clearAll}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Clear
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowHighlights(!showHighlights)}
                  className={showHighlights ? "bg-blue-50 text-blue-600" : ""}
                >
                  {showHighlights ? <Eye className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2 opacity-50" />}
                  {showHighlights ? "Hide" : "Show"} Highlights
                </Button>
                <CopyButton text={text} label="Copy Text" />
              </div>

              <div className="relative">
                {showHighlights && matches.length > 0 && (
                  <div
                    className="absolute inset-0 min-h-[300px] font-mono text-sm whitespace-pre-wrap break-words overflow-hidden pointer-events-none z-10 p-3 border rounded-md"
                    style={{
                      color: 'transparent',
                      background: 'transparent',
                      border: '1px solid transparent'
                    }}
                    dangerouslySetInnerHTML={{ __html: highlightPassiveVoice(text) }}
                  />
                )}

                <Textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Paste your text here to detect passive voice constructions. The tool will highlight potential passive voice instances and suggest active alternatives..."
                  className={`min-h-[300px] font-mono text-sm resize-none relative z-20 ${showHighlights && matches.length > 0 ? 'bg-transparent' : ''}`}
                  style={{
                    background: showHighlights && matches.length > 0 ? 'transparent' : undefined
                  }}
                />
              </div>

              <Button 
                onClick={analyzePassiveVoice} 
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
                    <Target className="w-4 h-4 mr-2" />
                    Detect Passive Voice
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Analysis Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 gap-3 text-sm">
                <div className="bg-blue-50 p-3 rounded">
                  <div className="font-semibold text-blue-900">Total Sentences</div>
                  <div className="text-xl font-bold text-blue-600">{stats.totalSentences}</div>
                </div>
                <div className="bg-red-50 p-3 rounded">
                  <div className="font-semibold text-red-900">Passive Sentences</div>
                  <div className="text-xl font-bold text-red-600">{stats.passiveSentences}</div>
                </div>
                <div className="bg-orange-50 p-3 rounded">
                  <div className="font-semibold text-orange-900">Passive %</div>
                  <div className="text-xl font-bold text-orange-600">{stats.passivePercentage}%</div>
                </div>
                <div className={`p-3 rounded ${stats.activeVoiceScore >= 80 ? 'bg-green-50' : stats.activeVoiceScore >= 60 ? 'bg-yellow-50' : 'bg-red-50'}`}>
                  <div className={`font-semibold ${getScoreColor(stats.activeVoiceScore).replace('text-', 'text-').replace('-600', '-900')}`}>
                    Active Voice Score
                  </div>
                  <div className={`text-xl font-bold ${getScoreColor(stats.activeVoiceScore)}`}>
                    {stats.activeVoiceScore}
                  </div>
                  <div className={`text-xs ${getScoreColor(stats.activeVoiceScore)}`}>
                    {getScoreLabel(stats.activeVoiceScore)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Writing Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-3">
              <div>
                <h4 className="font-semibold text-green-600 mb-1">Target Ranges</h4>
                <ul className="text-gray-600 space-y-1">
                  <li>• Business writing: &lt;10% passive</li>
                  <li>• Academic writing: &lt;20% passive</li>
                  <li>• Web content: &lt;5% passive</li>
                  <li>• Technical docs: Variable</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-blue-600 mb-1">Benefits of Active Voice</h4>
                <ul className="text-gray-600 space-y-1">
                  <li>• More direct and clear</li>
                  <li>• Engages readers better</li>
                  <li>• Uses fewer words</li>
                  <li>• Shows responsibility</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {matches.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="w-5 h-5" />
              Passive Voice Instances ({matches.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {matches.map((match, index) => (
                <div key={index} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={match.confidence === 'high' ? 'destructive' : 
                                match.confidence === 'medium' ? 'default' : 'secondary'}
                      >
                        {match.confidence} confidence
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {match.type}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <span className="font-semibold text-sm">Sentence:</span>
                      <p className="text-sm text-gray-700 mt-1">
                        {match.sentence}
                      </p>
                    </div>
                    
                    <div>
                      <span className="font-semibold text-sm">Passive phrase:</span>
                      <span className="text-sm font-mono bg-red-100 px-2 py-1 rounded ml-2">
                        {match.passivePhrase}
                      </span>
                    </div>
                    
                    <div>
                      <span className="font-semibold text-sm">Suggestion:</span>
                      <p className="text-sm text-blue-600 mt-1">
                        {match.suggestion}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {matches.length === 0 && stats.totalSentences > 0 && (
        <Card className="mb-6">
          <CardContent className="py-8">
            <div className="text-center">
              <TrendingDown className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-green-700 mb-2">Excellent!</h3>
              <p className="text-gray-600">No passive voice constructions detected in your text.</p>
            </div>
          </CardContent>
        </Card>
      )}

      <Alert className="mb-6">
        <Info className="w-4 h-4" />
        <AlertDescription>
          <strong>Note:</strong> Some passive voice is acceptable, especially in academic writing or when the actor is unknown/unimportant. 
          Focus on converting passive voice when it makes your writing unclear or wordy.
        </AlertDescription>
      </Alert>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5" />
            Active Voice Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Converting Passive to Active</h4>
              <div className="space-y-3">
                <div>
                  <p className="text-red-600 font-mono">❌ The report was written by Sarah.</p>
                  <p className="text-green-600 font-mono">✅ Sarah wrote the report.</p>
                </div>
                <div>
                  <p className="text-red-600 font-mono">❌ Mistakes were made.</p>
                  <p className="text-green-600 font-mono">✅ We made mistakes.</p>
                </div>
                <div>
                  <p className="text-red-600 font-mono">❌ The decision will be announced.</p>
                  <p className="text-green-600 font-mono">✅ We will announce the decision.</p>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">When Passive Voice is OK</h4>
              <ul className="text-gray-600 space-y-1">
                <li>• When the actor is unknown: "The window was broken."</li>
                <li>• In scientific writing: "The solution was heated to 100°C."</li>
                <li>• When the action is more important than the actor</li>
                <li>• To maintain consistent focus in a paragraph</li>
                <li>• When you want to avoid assigning blame</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <style>{`
        .bg-red-200 { background-color: rgb(254 202 202); }
        .bg-orange-200 { background-color: rgb(254 215 170); }
        .bg-yellow-200 { background-color: rgb(254 240 138); }
        .border-red-500 { border-color: rgb(239 68 68); }
        .border-orange-500 { border-color: rgb(249 115 22); }
        .border-yellow-500 { border-color: rgb(234 179 8); }
      `}</style>

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