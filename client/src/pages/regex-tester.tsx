import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import BuyMeCoffee from "@/components/buy-me-coffee";

interface RegexMatch {
  match: string;
  index: number;
  groups?: string[];
}

export default function RegexTester() {
  const [pattern, setPattern] = useState("");
  const [testString, setTestString] = useState("");
  const [globalFlag, setGlobalFlag] = useState(true);
  const [ignoreCaseFlag, setIgnoreCaseFlag] = useState(false);
  const [multilineFlag, setMultilineFlag] = useState(false);
  const [matches, setMatches] = useState<RegexMatch[]>([]);
  const [error, setError] = useState("");
  const [highlightedText, setHighlightedText] = useState("");

  const testRegex = () => {
    if (!pattern || !testString) {
      setMatches([]);
      setHighlightedText(testString);
      setError("");
      return;
    }

    try {
      setError("");
      
      let flags = '';
      if (globalFlag) flags += 'g';
      if (ignoreCaseFlag) flags += 'i';
      if (multilineFlag) flags += 'm';
      
      const regex = new RegExp(pattern, flags);
      const matchResults = [...testString.matchAll(regex)];
      
      const matchData: RegexMatch[] = matchResults.map((match) => ({
        match: match[0],
        index: match.index || 0,
        groups: match.slice(1)
      }));
      
      setMatches(matchData);
      
      // Create highlighted text
      if (matchData.length === 0) {
        setHighlightedText(testString);
      } else {
        let highlighted = testString;
        let offset = 0;
        
        matchData.forEach((match) => {
          const start = match.index + offset;
          const end = start + match.match.length;
          const highlightedMatch = `<mark class="bg-yellow-200 px-1 rounded">${match.match}</mark>`;
          highlighted = highlighted.slice(0, start) + highlightedMatch + highlighted.slice(end);
          offset += highlightedMatch.length - match.match.length;
        });
        
        setHighlightedText(highlighted);
      }
    } catch (err) {
      setError(`Invalid regex: ${(err as Error).message}`);
      setMatches([]);
      setHighlightedText(testString);
    }
  };

  useEffect(() => {
    testRegex();
  }, [pattern, testString, globalFlag, ignoreCaseFlag, multilineFlag]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <span className="material-icons tool-green text-3xl">filter_alt</span>
            Regex Tester
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Pattern Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Regular Expression
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-mono">
                /
              </span>
              <Input
                type="text"
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                placeholder="Enter your regex pattern"
                className="pl-8 pr-12 font-mono"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-mono">
                /{globalFlag ? 'g' : ''}{ignoreCaseFlag ? 'i' : ''}{multilineFlag ? 'm' : ''}
              </span>
            </div>
            
            <div className="flex gap-6 mt-3">
              <label className="flex items-center space-x-2">
                <Checkbox
                  checked={globalFlag}
                  onCheckedChange={(checked) => setGlobalFlag(checked as boolean)}
                />
                <span className="text-sm">Global (g)</span>
              </label>
              <label className="flex items-center space-x-2">
                <Checkbox
                  checked={ignoreCaseFlag}
                  onCheckedChange={(checked) => setIgnoreCaseFlag(checked as boolean)}
                />
                <span className="text-sm">Ignore Case (i)</span>
              </label>
              <label className="flex items-center space-x-2">
                <Checkbox
                  checked={multilineFlag}
                  onCheckedChange={(checked) => setMultilineFlag(checked as boolean)}
                />
                <span className="text-sm">Multiline (m)</span>
              </label>
            </div>
          </div>

          {/* Test String */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Test String
            </label>
            <Textarea
              value={testString}
              onChange={(e) => setTestString(e.target.value)}
              placeholder="Enter text to test against your regex pattern..."
              className="h-40 font-mono resize-none"
            />
          </div>

          {/* Results */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Matches */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Matches ({matches.length})
              </label>
              <div className="h-32 p-4 border border-gray-300 rounded-lg bg-gray-50 overflow-y-auto">
                {matches.length === 0 ? (
                  <span className="text-gray-400 text-sm">
                    {pattern && testString ? "No matches found" : "Enter pattern and test string"}
                  </span>
                ) : (
                  <div className="space-y-2">
                    {matches.map((match, index) => (
                      <div key={index} className="p-2 bg-green-50 rounded text-sm">
                        <div className="font-medium">Match {index + 1}: "{match.match}"</div>
                        <div className="text-xs text-gray-600">
                          Position: {match.index}-{match.index + match.match.length}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Highlighted Text */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Highlighted Text
              </label>
              <div 
                className="h-32 p-4 border border-gray-300 rounded-lg bg-gray-50 overflow-y-auto text-sm font-mono whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: highlightedText }}
              />
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
      
      <div className="text-center mt-8">
        <BuyMeCoffee />
        <p className="text-sm text-gray-600 mt-2">
          Thanks for using this free tool! Your support keeps it ad-free and private.
        </p>
      </div>
    </div>
  );
}
