import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Snowflake, Calculator, Info, AlertTriangle } from 'lucide-react';
import { ToolSEO } from '@/components/tool-seo';
import { ShareButtons } from '@/components/share-buttons';
import { UsageGuide } from '@/components/usage-guide';

export default function SuperheatCalculator() {
  const [lineTemp, setLineTemp] = useState('');
  const [satTemp, setSatTemp] = useState('');
  const [result, setResult] = useState<{superheat: number, status: string} | null>(null);
  const [error, setError] = useState('');

  const calcSuperheat = () => {
    const line = parseFloat(lineTemp);
    const sat = parseFloat(satTemp);
    
    if (isNaN(line) || isNaN(sat)) {
      setError('Please enter valid temperature values');
      setResult(null);
      return;
    }

    const superheat = line - sat;
    let status = '';
    
    // Standard superheat ranges for different applications
    if (superheat < 5) {
      status = 'Low - Risk of liquid refrigerant return';
    } else if (superheat >= 5 && superheat <= 15) {
      status = 'Normal - Optimal range for most systems';
    } else if (superheat > 15 && superheat <= 25) {
      status = 'High - Check refrigerant charge';
    } else {
      status = 'Very High - System needs attention';
    }
    
    setResult({ superheat, status });
    setError('');
  };

  const clearCalculation = () => {
    setLineTemp('');
    setSatTemp('');
    setResult(null);
    setError('');
  };

  const copyResult = () => {
    if (result) {
      navigator.clipboard.writeText(
        `Suction Line: ${lineTemp}°F | Saturation: ${satTemp}°F | Superheat: ${result.superheat.toFixed(1)}°F | Status: ${result.status}`
      );
    }
  };

  const getStatusColor = (superheat: number) => {
    if (superheat < 5) return 'bg-red-50 border-red-200 text-red-700';
    if (superheat >= 5 && superheat <= 15) return 'bg-green-50 border-green-200 text-green-700';
    if (superheat > 15 && superheat <= 25) return 'bg-yellow-50 border-yellow-200 text-yellow-700';
    return 'bg-red-50 border-red-200 text-red-700';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <ToolSEO
        title="Superheat Calculator - HVAC Refrigeration System Diagnostic Tool"
        description="Free superheat calculator for HVAC and refrigeration systems. Calculate superheat values to diagnose refrigerant charge levels and system performance. Essential tool for HVAC technicians."
        keywords={["superheat calculator", "HVAC calculator", "refrigeration calculator", "HVAC diagnostic", "refrigerant charge", "HVAC tools", "air conditioning calculator", "HVAC technician tools"]}
        canonicalUrl="/superheat-calculator"
      />

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Superheat Calculator</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Calculate superheat values for HVAC and refrigeration systems. 
          Diagnose refrigerant charge levels and system performance with accurate superheat measurements.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Snowflake className="w-5 h-5 text-blue-600" />
              Superheat Calculation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="lineTemp">Suction Line Temperature (°F)</Label>
              <Input
                id="lineTemp"
                type="number"
                value={lineTemp}
                onChange={(e) => setLineTemp(e.target.value)}
                placeholder="e.g., 45"
                step="0.1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Temperature measured at suction line near evaporator outlet
              </p>
            </div>

            <div>
              <Label htmlFor="satTemp">Saturation Temperature (°F)</Label>
              <Input
                id="satTemp"
                type="number"
                value={satTemp}
                onChange={(e) => setSatTemp(e.target.value)}
                placeholder="e.g., 35"
                step="0.1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Temperature corresponding to suction pressure on P-T chart
              </p>
            </div>

            <div className="flex gap-2">
              <Button onClick={calcSuperheat} className="flex-1">
                <Calculator className="w-4 h-4 mr-2" />
                Calculate Superheat
              </Button>
              <Button variant="outline" onClick={clearCalculation}>
                Clear
              </Button>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {result && (
              <Card className={getStatusColor(result.superheat)}>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <h3 className="font-semibold text-lg mb-2">Superheat Results</h3>
                    <p className="text-3xl font-bold mb-2">
                      {result.superheat.toFixed(1)}°F
                    </p>
                    <p className="font-semibold mb-4">
                      {result.status}
                    </p>
                    <div className="text-sm space-y-1 mb-4">
                      <p>Suction Line: {lineTemp}°F</p>
                      <p>Saturation: {satTemp}°F</p>
                      <p>Difference: {result.superheat.toFixed(1)}°F</p>
                    </div>

                    {(result.superheat < 5 || result.superheat > 25) && (
                      <Alert variant="destructive" className="mt-4 text-left">
                        <AlertTriangle className="w-4 h-4" />
                        <AlertDescription>
                          {result.superheat < 5 
                            ? "Low superheat may indicate overcharge or TXV issues"
                            : "High superheat may indicate undercharge or restricted TXV"
                          }
                        </AlertDescription>
                      </Alert>
                    )}

                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={copyResult}
                      className="mt-3"
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
              <CardTitle className="flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-600" />
                Superheat Guidelines
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="font-semibold">Optimal Superheat Ranges</h4>
                  <ul className="text-gray-600 space-y-1">
                    <li>• <span className="text-green-600 font-semibold">5-15°F:</span> Normal operation</li>
                    <li>• <span className="text-red-600 font-semibold">&lt;5°F:</span> Risk of liquid return</li>
                    <li>• <span className="text-yellow-600 font-semibold">15-25°F:</span> High, check charge</li>
                    <li>• <span className="text-red-600 font-semibold">&gt;25°F:</span> Very high, needs attention</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold">Measurement Points</h4>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Suction line: 6-12" from evaporator</li>
                    <li>• Use insulated temp probe</li>
                    <li>• Allow system to stabilize (15+ min)</li>
                    <li>• Record both temperature and pressure</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold">System Types</h4>
                  <ul className="text-gray-600 space-y-1">
                    <li>• <strong>TXV Systems:</strong> 8-12°F target</li>
                    <li>• <strong>Fixed Orifice:</strong> 5-20°F range</li>
                    <li>• <strong>Heat Pumps:</strong> 10-15°F typical</li>
                    <li>• <strong>Commercial:</strong> 8-12°F standard</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold">Troubleshooting</h4>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Low superheat: Overcharge, bad TXV</li>
                    <li>• High superheat: Undercharge, restriction</li>
                    <li>• Fluctuating: TXV hunting, system issues</li>
                    <li>• Zero superheat: Liquid return danger</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <ShareButtons 
            title="Superheat Calculator - HVAC Refrigeration Diagnostic Tool"
            description="Free superheat calculator for HVAC systems. Calculate superheat values to diagnose refrigerant charge and system performance."
          />
        </div>
      </div>

      <UsageGuide
        title="Superheat Calculator"
        description="Calculate superheat values for HVAC and refrigeration systems to diagnose refrigerant charge levels and system performance."
        examples={[
          {
            title: "Measure Suction Line Temperature",
            description: "Use a digital thermometer to measure temperature 6-12 inches from the evaporator outlet"
          },
          {
            title: "Determine Saturation Temperature", 
            description: "Read suction pressure and convert to temperature using a P-T chart for your refrigerant"
          },
          {
            title: "Calculate and Interpret",
            description: "Enter both temperatures and analyze results (5-15°F is normal operating range)"
          }
        ]}
        tips={[
          "Allow system to run for 15+ minutes before taking measurements",
          "Insulate temperature probes to get accurate readings",
          "Consider ambient conditions and system load when interpreting results",
          "Use manufacturer specifications for target superheat values"
        ]}
        bestPractices={[
          "Take measurements during steady-state operation",
          "Use calibrated digital instruments for accuracy",
          "Record both temperature and pressure readings",
          "Compare results to manufacturer specifications"
        ]}
      />
    </div>
  );
}