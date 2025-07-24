import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Copy, RotateCcw, FileText, GitCompare } from "lucide-react";
import BuyMeCoffee from "@/components/buy-me-coffee";
import { BookmarkButton } from "@/components/bookmark-button";

interface DiffResult {
  type: 'equal' | 'delete' | 'insert' | 'replace';
  oldText: string;
  newText: string;
  oldIndex: number;
  newIndex: number;
}

export default function TextDiffChecker() {
  const [originalText, setOriginalText] = useState("");
  const [modifiedText, setModifiedText] = useState("");
  const [diffResults, setDiffResults] = useState<DiffResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const { toast } = useToast();

  const computeDiff = () => {
    if (!originalText.trim() && !modifiedText.trim()) {
      toast({
        title: "Warning",
        description: "Please enter text in both fields to compare",
        variant: "destructive"
      });
      return;
    }

    const original = originalText.split('\n');
    const modified = modifiedText.split('\n');
    const results: DiffResult[] = [];

    // Simple line-by-line diff algorithm
    let i = 0, j = 0;

    while (i < original.length || j < modified.length) {
      if (i >= original.length) {
        // Only modified text remains
        results.push({
          type: 'insert',
          oldText: '',
          newText: modified[j],
          oldIndex: i,
          newIndex: j
        });
        j++;
      } else if (j >= modified.length) {
        // Only original text remains
        results.push({
          type: 'delete',
          oldText: original[i],
          newText: '',
          oldIndex: i,
          newIndex: j
        });
        i++;
      } else if (original[i] === modified[j]) {
        // Lines are equal
        results.push({
          type: 'equal',
          oldText: original[i],
          newText: modified[j],
          oldIndex: i,
          newIndex: j
        });
        i++;
        j++;
      } else {
        // Lines are different - check if it's a replacement or separate delete/insert
        let foundMatch = false;
        
        // Look ahead to see if this line appears later
        for (let k = j + 1; k < Math.min(modified.length, j + 5); k++) {
          if (original[i] === modified[k]) {
            // Found the line later, so current modified line is an insert
            results.push({
              type: 'insert',
              oldText: '',
              newText: modified[j],
              oldIndex: i,
              newIndex: j
            });
            j++;
            foundMatch = true;
            break;
          }
        }
        
        if (!foundMatch) {
          // Look ahead in original to see if modified line appears later
          for (let k = i + 1; k < Math.min(original.length, i + 5); k++) {
            if (modified[j] === original[k]) {
              // Found the line later, so current original line is a delete
              results.push({
                type: 'delete',
                oldText: original[i],
                newText: '',
                oldIndex: i,
                newIndex: j
              });
              i++;
              foundMatch = true;
              break;
            }
          }
        }
        
        if (!foundMatch) {
          // Lines are different, treat as replacement
          results.push({
            type: 'replace',
            oldText: original[i],
            newText: modified[j],
            oldIndex: i,
            newIndex: j
          });
          i++;
          j++;
        }
      }
    }

    setDiffResults(results);
    setShowResults(true);
  };

  const copyDiffReport = async () => {
    const report = generateDiffReport();
    try {
      await navigator.clipboard.writeText(report);
      toast({
        title: "Copied",
        description: "Diff report copied to clipboard!"
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive"
      });
    }
  };

  const generateDiffReport = () => {
    const stats = {
      additions: diffResults.filter(d => d.type === 'insert').length,
      deletions: diffResults.filter(d => d.type === 'delete').length,
      modifications: diffResults.filter(d => d.type === 'replace').length,
      unchanged: diffResults.filter(d => d.type === 'equal').length
    };

    let report = "=== TEXT DIFF REPORT ===\n\n";
    report += `Statistics:\n`;
    report += `• Additions: ${stats.additions} lines\n`;
    report += `• Deletions: ${stats.deletions} lines\n`;
    report += `• Modifications: ${stats.modifications} lines\n`;
    report += `• Unchanged: ${stats.unchanged} lines\n\n`;
    
    report += "Detailed Changes:\n";
    report += "==================\n\n";

    diffResults.forEach((diff, index) => {
      if (diff.type !== 'equal') {
        report += `Line ${diff.oldIndex + 1}:\n`;
        if (diff.type === 'delete') {
          report += `- ${diff.oldText}\n`;
        } else if (diff.type === 'insert') {
          report += `+ ${diff.newText}\n`;
        } else if (diff.type === 'replace') {
          report += `- ${diff.oldText}\n`;
          report += `+ ${diff.newText}\n`;
        }
        report += "\n";
      }
    });

    return report;
  };

  const clearAll = () => {
    setOriginalText("");
    setModifiedText("");
    setDiffResults([]);
    setShowResults(false);
  };

  const getDiffTypeColor = (type: string) => {
    switch (type) {
      case 'insert': return 'bg-green-100 border-green-300 text-green-800';
      case 'delete': return 'bg-red-100 border-red-300 text-red-800';
      case 'replace': return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-600';
    }
  };

  const getDiffSymbol = (type: string) => {
    switch (type) {
      case 'insert': return '+';
      case 'delete': return '-';
      case 'replace': return '±';
      default: return ' ';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-3">
                <GitCompare className="text-purple-600 text-3xl" />
                Text Diff Checker
              </CardTitle>
              <p className="text-gray-600">
                Compare two blocks of text to find differences, additions, and deletions
              </p>
            </div>
            <BookmarkButton 
              href="/text-diff-checker"
              title="Text Diff Checker"
              icon="compare"
              iconColor="text-purple-600"
              description="Compare text blocks with detailed difference analysis and statistics for changes, additions, and deletions"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Original Text
                </label>
                <Textarea
                  value={originalText}
                  onChange={(e) => setOriginalText(e.target.value)}
                  placeholder="Enter the original text here..."
                  className="min-h-48 font-mono text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Modified Text
                </label>
                <Textarea
                  value={modifiedText}
                  onChange={(e) => setModifiedText(e.target.value)}
                  placeholder="Enter the modified text here..."
                  className="min-h-48 font-mono text-sm"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={computeDiff} className="bg-purple-600 hover:bg-purple-700">
                <GitCompare className="w-4 h-4 mr-2" />
                Compare Text
              </Button>
              {showResults && (
                <Button variant="outline" onClick={copyDiffReport}>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Report
                </Button>
              )}
              <Button variant="outline" onClick={clearAll}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            </div>

            {showResults && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-green-50 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {diffResults.filter(d => d.type === 'insert').length}
                    </div>
                    <div className="text-sm text-green-700">Additions</div>
                  </div>
                  <div className="bg-red-50 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {diffResults.filter(d => d.type === 'delete').length}
                    </div>
                    <div className="text-sm text-red-700">Deletions</div>
                  </div>
                  <div className="bg-yellow-50 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                      {diffResults.filter(d => d.type === 'replace').length}
                    </div>
                    <div className="text-sm text-yellow-700">Changes</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-gray-600">
                      {diffResults.filter(d => d.type === 'equal').length}
                    </div>
                    <div className="text-sm text-gray-700">Unchanged</div>
                  </div>
                </div>

                <div className="border rounded-lg p-4 bg-gray-50 max-h-96 overflow-y-auto">
                  <h3 className="font-medium mb-3">Diff Results:</h3>
                  <div className="space-y-1">
                    {diffResults.map((diff, index) => (
                      <div
                        key={index}
                        className={`p-2 rounded border text-sm font-mono ${getDiffTypeColor(diff.type)}`}
                      >
                        <div className="flex items-start gap-2">
                          <span className="w-4 text-center font-bold">
                            {getDiffSymbol(diff.type)}
                          </span>
                          <span className="w-8 text-xs text-gray-500">
                            {diff.type === 'delete' ? diff.oldIndex + 1 : diff.newIndex + 1}
                          </span>
                          <span className="flex-1">
                            {diff.type === 'delete' ? diff.oldText : diff.newText}
                            {diff.type === 'replace' && (
                              <>
                                <br />
                                <span className="text-red-600">- {diff.oldText}</span>
                                <br />
                                <span className="text-green-600">+ {diff.newText}</span>
                              </>
                            )}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 p-4 bg-purple-50 rounded-lg">
              <h4 className="font-medium text-purple-900 mb-2">Text Diff Checker Features:</h4>
              <ul className="text-sm text-purple-800 space-y-1">
                <li>• Line-by-line comparison of two text blocks</li>
                <li>• Highlights additions, deletions, and modifications</li>
                <li>• Statistical summary of changes</li>
                <li>• Color-coded diff visualization</li>
                <li>• Copy comprehensive diff report to clipboard</li>
                <li>• Perfect for code reviews, document comparisons, and content analysis</li>
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