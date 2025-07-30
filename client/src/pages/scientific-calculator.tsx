import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calculator, Info, Delete } from 'lucide-react';
import { ToolSEO } from '@/components/tool-seo';
import { ShareButtons } from '@/components/share-buttons';
import { UsageGuide } from '@/components/usage-guide';

export default function ScientificCalculator() {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState<number | null>(null);
  const [history, setHistory] = useState<{expression: string, result: number}[]>([]);
  const [error, setError] = useState('');

  const calculateExpression = () => {
    if (!expression.trim()) {
      setError('Please enter an expression');
      setResult(null);
      return;
    }

    try {
      // Replace common math functions and operators
      let processedExpression = expression
        .replace(/\^/g, '**')  // Power operator
        .replace(/π/g, Math.PI.toString())  // Pi
        .replace(/e/g, Math.E.toString())   // Euler's number
        .replace(/sin\(/g, 'Math.sin(')
        .replace(/cos\(/g, 'Math.cos(')
        .replace(/tan\(/g, 'Math.tan(')
        .replace(/log\(/g, 'Math.log10(')
        .replace(/ln\(/g, 'Math.log(')
        .replace(/sqrt\(/g, 'Math.sqrt(')
        .replace(/abs\(/g, 'Math.abs(')
        .replace(/floor\(/g, 'Math.floor(')
        .replace(/ceil\(/g, 'Math.ceil(')
        .replace(/round\(/g, 'Math.round(');

      // Validate the expression contains only allowed characters
      const allowedPattern = /^[0-9+\-*/().\s,Math.sincoatlbqrfghe^πe]+$/;
      if (!allowedPattern.test(processedExpression)) {
        throw new Error('Invalid characters in expression');
      }

      const calculatedResult = Function('"use strict"; return (' + processedExpression + ')')();
      
      if (typeof calculatedResult !== 'number' || !isFinite(calculatedResult)) {
        throw new Error('Invalid calculation result');
      }

      setResult(calculatedResult);
      
      // Add to history
      const historyEntry = { expression, result: calculatedResult };
      setHistory(prev => [historyEntry, ...prev.slice(0, 9)]); // Keep last 10 entries
      
      setError('');
    } catch (err) {
      setError('Invalid expression or calculation error');
      setResult(null);
    }
  };

  const clearExpression = () => {
    setExpression('');
    setResult(null);
    setError('');
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const insertFunction = (func: string) => {
    setExpression(prev => prev + func);
  };

  const copyResult = () => {
    if (result !== null) {
      navigator.clipboard.writeText(result.toString());
    }
  };

  const useHistoryItem = (item: {expression: string, result: number}) => {
    setExpression(item.expression);
    setResult(item.result);
  };

  const mathFunctions = [
    { label: 'sin(', func: 'sin(' },
    { label: 'cos(', func: 'cos(' },
    { label: 'tan(', func: 'tan(' },
    { label: 'log(', func: 'log(' },
    { label: 'ln(', func: 'ln(' },
    { label: 'sqrt(', func: 'sqrt(' },
    { label: 'π', func: 'π' },
    { label: 'e', func: 'e' },
    { label: '^', func: '^' },
    { label: '(', func: '(' },
    { label: ')', func: ')' }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <ToolSEO
        title="Scientific Calculator - Advanced Math Calculator for Field Work"
        description="Free scientific calculator with trigonometric functions, logarithms, and advanced math operations. Perfect for engineering calculations and field work computations."
        keywords={["scientific calculator", "math calculator", "trigonometric functions", "engineering calculator", "logarithm calculator", "advanced calculator", "field calculator"]}
        canonicalUrl="/scientific-calculator"
      />

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Scientific Calculator</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Advanced mathematical calculator with trigonometric functions, logarithms, and scientific operations. 
          Perfect for engineering calculations and complex field work computations.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-purple-600" />
              Calculator Input
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Input
                value={expression}
                onChange={(e) => setExpression(e.target.value)}
                placeholder="Enter expression (e.g., 2 + 3 * sin(45) ^ 2)"
                className="text-lg font-mono"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    calculateExpression();
                  }
                }}
              />
            </div>

            <div className="grid grid-cols-4 gap-2">
              {mathFunctions.map((func) => (
                <Button
                  key={func.label}
                  variant="outline"
                  size="sm"
                  onClick={() => insertFunction(func.func)}
                  className="text-xs"
                >
                  {func.label}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setExpression(prev => prev.slice(0, -1))}
                className="text-xs"
              >
                <Delete className="w-3 h-3" />
              </Button>
            </div>

            <div className="flex gap-2">
              <Button onClick={calculateExpression} className="flex-1">
                <Calculator className="w-4 h-4 mr-2" />
                Calculate
              </Button>
              <Button variant="outline" onClick={clearExpression}>
                Clear
              </Button>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {result !== null && (
              <Card className="bg-purple-50 border-purple-200">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <h3 className="font-semibold text-lg mb-2">Result</h3>
                    <p className="text-3xl font-bold text-purple-700 mb-4 font-mono">
                      {result.toFixed(8).replace(/\.?0+$/, '')}
                    </p>
                    
                    <div className="text-sm text-gray-600 mb-4">
                      Expression: {expression}
                    </div>

                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={copyResult}
                    >
                      Copy Result
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Calculation History</span>
                {history.length > 0 && (
                  <Button
                    onClick={clearHistory}
                    size="sm"
                    variant="outline"
                  >
                    Clear History
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {history.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Calculator className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No calculations yet.</p>
                  <p className="text-sm">Complete a calculation to see history.</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {history.map((item, index) => (
                    <Card key={index} className="bg-gray-50 cursor-pointer hover:bg-gray-100"
                          onClick={() => useHistoryItem(item)}>
                      <CardContent className="p-3">
                        <div className="text-sm">
                          <p className="font-mono text-gray-700">{item.expression}</p>
                          <p className="font-bold text-purple-600 font-mono">
                            = {item.result.toFixed(6).replace(/\.?0+$/, '')}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-600" />
                Supported Functions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="font-semibold">Basic Operations</h4>
                  <p className="text-gray-600">+, -, *, /, ^, (, )</p>
                </div>
                
                <div>
                  <h4 className="font-semibold">Trigonometric</h4>
                  <p className="text-gray-600">sin(), cos(), tan() (in radians)</p>
                </div>

                <div>
                  <h4 className="font-semibold">Logarithmic</h4>
                  <p className="text-gray-600">log() (base 10), ln() (natural log)</p>
                </div>

                <div>
                  <h4 className="font-semibold">Other Functions</h4>
                  <p className="text-gray-600">sqrt(), abs(), floor(), ceil(), round()</p>
                </div>

                <div>
                  <h4 className="font-semibold">Constants</h4>
                  <p className="text-gray-600">π (pi), e (Euler's number)</p>
                </div>

                <div>
                  <h4 className="font-semibold">Examples</h4>
                  <ul className="text-gray-600 space-y-1 text-xs">
                    <li>• 2 + 3 * 4</li>
                    <li>• sqrt(16) + 2^3</li>
                    <li>• sin(π/2) * cos(0)</li>
                    <li>• log(100) + ln(e)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <ShareButtons 
            title="Scientific Calculator - Advanced Math Calculator"
            description="Free scientific calculator with trigonometric functions, logarithms, and advanced math operations for engineering calculations."
          />
        </div>
      </div>

      <UsageGuide
        title="Scientific Calculator"
        description="Perform advanced mathematical calculations with trigonometric functions, logarithms, and scientific operations for engineering and field work."
        examples={[
          {
            title: "Engineering Calculations",
            description: "Use trigonometric functions for angle calculations and structural analysis"
          },
          {
            title: "Power and Root Operations",
            description: "Calculate powers using ^ operator and square roots with sqrt() function"
          },
          {
            title: "Complex Expressions",
            description: "Combine multiple operations with proper parentheses for complex calculations"
          }
        ]}
        tips={[
          "Use parentheses to control calculation order",
          "Trigonometric functions expect angles in radians",
          "Click history items to reuse previous calculations",
          "Use π and e constants for precision"
        ]}
        bestPractices={[
          "Double-check complex expressions with parentheses",
          "Convert degrees to radians for trig functions (degrees * π/180)",
          "Save important calculations by copying results",
          "Verify results with manual calculations when critical"
        ]}
      />
    </div>
  );
}