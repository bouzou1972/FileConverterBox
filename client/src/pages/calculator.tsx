import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calculator as CalculatorIcon, History, RefreshCw, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import CopyButton from "@/components/copy-button";
import BuyMeCoffee from "@/components/buy-me-coffee";
import { ToolSEO } from "@/components/tool-seo";
import { ShareButtons } from "@/components/share-buttons";
import { UsageGuide } from "@/components/usage-guide";
import { BookmarkButton } from "@/components/bookmark-button";

interface CalculationHistory {
  expression: string;
  result: string;
  timestamp: Date;
}

export default function Calculator() {
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState("");
  const [history, setHistory] = useState<CalculationHistory[]>([]);
  const [error, setError] = useState("");
  const { toast } = useToast();

  // Math constants and functions
  const mathConstants = {
    pi: Math.PI,
    e: Math.E,
    phi: (1 + Math.sqrt(5)) / 2, // Golden ratio
    ln2: Math.LN2,
    ln10: Math.LN10,
    log2e: Math.LOG2E,
    log10e: Math.LOG10E,
    sqrt2: Math.SQRT2,
    sqrt1_2: Math.SQRT1_2
  };

  const mathFunctions = {
    abs: Math.abs,
    acos: Math.acos,
    asin: Math.asin,
    atan: Math.atan,
    atan2: Math.atan2,
    ceil: Math.ceil,
    cos: Math.cos,
    exp: Math.exp,
    floor: Math.floor,
    log: Math.log,
    log10: Math.log10,
    log2: Math.log2,
    max: Math.max,
    min: Math.min,
    pow: Math.pow,
    random: Math.random,
    round: Math.round,
    sin: Math.sin,
    sqrt: Math.sqrt,
    tan: Math.tan,
    trunc: Math.trunc,
    deg: (x: number) => x * (180 / Math.PI), // radians to degrees
    rad: (x: number) => x * (Math.PI / 180), // degrees to radians
    fact: (n: number) => {
      if (n < 0) return NaN;
      if (n === 0 || n === 1) return 1;
      let result = 1;
      for (let i = 2; i <= n; i++) {
        result *= i;
      }
      return result;
    }
  };

  const safeEval = (expr: string): number => {
    // Replace constants
    let processedExpr = expr.toLowerCase();
    Object.entries(mathConstants).forEach(([name, value]) => {
      const regex = new RegExp(`\\b${name}\\b`, 'g');
      processedExpr = processedExpr.replace(regex, value.toString());
    });

    // Replace functions
    Object.entries(mathFunctions).forEach(([name, func]) => {
      const regex = new RegExp(`\\b${name}\\s*\\(`, 'g');
      processedExpr = processedExpr.replace(regex, `Math.${name}(`);
    });

    // Replace ^ with Math.pow for exponentiation
    processedExpr = processedExpr.replace(/(\d+\.?\d*|\([^)]+\))\s*\^\s*(\d+\.?\d*|\([^)]+\))/g, 'Math.pow($1, $2)');

    // Add Math. prefix to remaining math functions if not already present
    processedExpr = processedExpr.replace(/\b(abs|acos|asin|atan|atan2|ceil|cos|exp|floor|log|max|min|pow|random|round|sin|sqrt|tan|trunc)\(/g, 'Math.$1(');

    // Validate the expression contains only allowed characters
    if (!/^[0-9+\-*/().,\s\w]+$/.test(processedExpr)) {
      throw new Error('Invalid characters in expression');
    }

    // Use Function constructor for safer evaluation than eval
    try {
      const func = new Function('Math', `return ${processedExpr}`);
      return func(Math);
    } catch (err) {
      throw new Error('Invalid mathematical expression');
    }
  };

  const calculate = () => {
    if (!expression.trim()) {
      setError("Please enter an expression");
      return;
    }

    try {
      setError("");
      const calculationResult = safeEval(expression);
      
      if (!isFinite(calculationResult)) {
        throw new Error("Result is not a finite number");
      }

      const resultStr = calculationResult.toString();
      setResult(resultStr);

      // Add to history
      const newEntry: CalculationHistory = {
        expression: expression.trim(),
        result: resultStr,
        timestamp: new Date()
      };
      setHistory(prev => [newEntry, ...prev.slice(0, 9)]); // Keep last 10 entries

      toast({
        title: "Calculated!",
        description: `${expression} = ${resultStr}`,
      });
    } catch (err: any) {
      setError(`Error: ${err.message}`);
      setResult("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      calculate();
    }
  };

  const insertFunction = (func: string) => {
    const cursorPos = (document.getElementById('expression-input') as HTMLInputElement)?.selectionStart || expression.length;
    const newExpression = expression.slice(0, cursorPos) + func + expression.slice(cursorPos);
    setExpression(newExpression);
  };

  const clearAll = () => {
    setExpression("");
    setResult("");
    setError("");
    setHistory([]);
  };

  const loadSample = () => {
    setExpression("sqrt(pow(3, 2) + pow(4, 2)) * pi / 2");
  };

  const usageExamples = [
    {
      title: "Basic Arithmetic Calculations",
      description: "Perform standard mathematical operations",
      steps: [
        "Enter a mathematical expression like '2 + 3 * 4'",
        "Click 'Calculate' or press Enter",
        "View the result and copy if needed",
        "See the calculation added to history"
      ],
      tip: "Use parentheses for complex expressions: (2 + 3) * 4"
    },
    {
      title: "Scientific Functions",
      description: "Use advanced mathematical functions",
      steps: [
        "Use functions like sin(pi/2) or sqrt(16)",
        "Access constants like pi, e, or phi",
        "Combine functions: log(exp(5)) or pow(2, 3)",
        "View detailed calculation history"
      ],
      tip: "All trigonometric functions work in radians"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <ToolSEO
        title="Advanced Calculator - Scientific & Programming Calculator"
        description="Advanced calculator with scientific functions, programming operations, and calculation history. Supports trigonometry, logarithms, and mathematical constants."
        keywords={["calculator", "scientific calculator", "math calculator", "programming calculator", "advanced calculator"]}
        canonicalUrl="/calculator"
      />
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Expression Calculator</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Evaluate mathematical expressions with support for functions, constants, and advanced operations. 
          Works entirely offline with no external dependencies.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalculatorIcon className="w-5 h-5" />
                Expression Input
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2 mb-4">
                <Button variant="outline" size="sm" onClick={loadSample}>
                  Load Sample
                </Button>
                <Button variant="outline" size="sm" onClick={clearAll}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Clear All
                </Button>
              </div>

              <Input
                id="expression-input"
                value={expression}
                onChange={(e) => setExpression(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter mathematical expression... (e.g., sqrt(16) + pi * 2)"
                className="font-mono text-lg"
              />

              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {['sin(', 'cos(', 'tan(', 'sqrt(', 'log(', 'ln('].map(func => (
                  <Button 
                    key={func}
                    variant="outline" 
                    size="sm" 
                    onClick={() => insertFunction(func)}
                    className="text-xs"
                  >
                    {func.replace('(', '')}
                  </Button>
                ))}
                {['abs(', 'ceil(', 'floor(', 'round(', 'pow(', 'max('].map(func => (
                  <Button 
                    key={func}
                    variant="outline" 
                    size="sm" 
                    onClick={() => insertFunction(func)}
                    className="text-xs"
                  >
                    {func.replace('(', '')}
                  </Button>
                ))}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {['pi', 'e', '^', 'fact('].map(item => (
                  <Button 
                    key={item}
                    variant="outline" 
                    size="sm" 
                    onClick={() => insertFunction(item)}
                    className="text-xs"
                  >
                    {item === '^' ? 'x^y' : item.replace('(', '')}
                  </Button>
                ))}
              </div>

              <Button onClick={calculate} className="w-full bg-blue-600 hover:bg-blue-700">
                <CalculatorIcon className="w-4 h-4 mr-2" />
                Calculate
              </Button>

              {result && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-green-700">Result:</div>
                      <div className="text-2xl font-bold text-green-800 font-mono">{result}</div>
                    </div>
                    <CopyButton text={result} label="Copy Result" />
                  </div>
                </div>
              )}

              {error && (
                <Alert>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Constants</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span>pi</span>
                  <Badge variant="outline" className="font-mono text-xs">3.14159...</Badge>
                </div>
                <div className="flex justify-between">
                  <span>e</span>
                  <Badge variant="outline" className="font-mono text-xs">2.71828...</Badge>
                </div>
                <div className="flex justify-between">
                  <span>phi</span>
                  <Badge variant="outline" className="font-mono text-xs">1.61803...</Badge>
                </div>
                <div className="flex justify-between">
                  <span>sqrt2</span>
                  <Badge variant="outline" className="font-mono text-xs">1.41421...</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Operators</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span>+, -, *, /</span>
                  <Badge variant="outline">Basic</Badge>
                </div>
                <div className="flex justify-between">
                  <span>^</span>
                  <Badge variant="outline">Power</Badge>
                </div>
                <div className="flex justify-between">
                  <span>()</span>
                  <Badge variant="outline">Grouping</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {history.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <History className="w-4 h-4" />
                  History
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="max-h-64 overflow-auto space-y-2">
                  {history.map((entry, index) => (
                    <div 
                      key={index} 
                      className="text-xs p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100"
                      onClick={() => setExpression(entry.expression)}
                    >
                      <div className="font-mono text-blue-600">{entry.expression}</div>
                      <div className="font-mono font-bold text-green-600">= {entry.result}</div>
                      <div className="text-gray-500">{entry.timestamp.toLocaleTimeString()}</div>
                    </div>
                  ))}
                </div>
                <div className="text-xs text-gray-500">Click any entry to reuse</div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Supported Functions & Examples</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Trigonometric</h4>
              <ul className="text-gray-600 space-y-1 font-mono">
                <li>sin(pi/2) = 1</li>
                <li>cos(0) = 1</li>
                <li>tan(pi/4) = 1</li>
                <li>deg(pi) = 180</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Algebraic</h4>
              <ul className="text-gray-600 space-y-1 font-mono">
                <li>sqrt(16) = 4</li>
                <li>pow(2, 3) = 8</li>
                <li>2^3 = 8</li>
                <li>abs(-5) = 5</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Logarithmic</h4>
              <ul className="text-gray-600 space-y-1 font-mono">
                <li>log(100) = 4.605</li>
                <li>log10(100) = 2</li>
                <li>log2(8) = 3</li>
                <li>exp(1) = e</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-center mt-8">
        <ShareButtons 
          title="Advanced Calculator - Scientific & Programming Calculator"
          description="Advanced calculator with scientific functions and calculation history"
        />
        
        <UsageGuide 
          title="Advanced Calculator"
          description="Learn how to use scientific functions and mathematical constants"
          examples={usageExamples}
          tips={[
            "Use parentheses to control order of operations",
            "All trigonometric functions work in radians",
            "Access constants like pi, e, phi, sqrt2",
            "View calculation history for reference",
            "Copy results directly to clipboard"
          ]}
          commonUses={[
            "Scientific calculations",
            "Engineering computations",
            "Mathematical analysis",
            "Homework assistance",
            "Quick calculations"
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