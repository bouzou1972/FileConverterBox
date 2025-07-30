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
  const [refrigerantType, setRefrigerantType] = useState('R410A');
  const [result, setResult] = useState<{superheat: number, status: string, targetRange: string} | null>(null);
  const [error, setError] = useState('');

  // Refrigerant-specific superheat targets
  const superheatTargets = {
    'R410A': { min: 8, max: 15, ideal: '8-15°F' },
    'R32': { min: 6, max: 12, ideal: '6-12°F' },
    'R22': { min: 8, max: 18, ideal: '8-18°F' },
    'R134A': { min: 10, max: 20, ideal: '10-20°F' },
    'R407C': { min: 10, max: 18, ideal: '10-18°F' },
    'R404A': { min: 6, max: 12, ideal: '6-12°F' },
    'R507A': { min: 6, max: 12, ideal: '6-12°F' }
  };

  const calcSuperheat = () => {
    const line = parseFloat(lineTemp);
    const sat = parseFloat(satTemp);
    
    if (isNaN(line) || isNaN(sat)) {
      setError('Please enter valid temperature values');
      setResult(null);
      return;
    }

    const superheat = line - sat;
    const target = superheatTargets[refrigerantType as keyof typeof superheatTargets];
    let status = '';
    
    // Refrigerant-specific superheat ranges
    if (superheat < target.min - 2) {
      status = 'Very Low - Risk of liquid refrigerant return to compressor';
    } else if (superheat < target.min) {
      status = 'Low - May indicate overcharged system';
    } else if (superheat >= target.min && superheat <= target.max) {
      status = 'Normal - System operating within optimal range';
    } else if (superheat > target.max && superheat <= target.max + 10) {
      status = 'High - May indicate undercharged system or restricted airflow';
    } else {
      status = 'Very High - System requires immediate attention';
    }
    
    setResult({ superheat, status, targetRange: target.ideal });
    setError('');
  };

  const clearCalculation = () => {
    setLineTemp('');
    setSatTemp('');
    setRefrigerantType('R410A');
    setResult(null);
    setError('');
  };

  const copyResult = () => {
    if (result) {
      navigator.clipboard.writeText(
        `${refrigerantType} Superheat | Suction Line: ${lineTemp}°F | Saturation: ${satTemp}°F | Superheat: ${result.superheat.toFixed(1)}°F | Target: ${result.targetRange} | Status: ${result.status}`
      );
    }
  };

  const getStatusColor = (superheat: number, refrigerant: string) => {
    const target = superheatTargets[refrigerant as keyof typeof superheatTargets];
    if (superheat < target.min - 2) return 'bg-red-50 border-red-200 text-red-700';
    if (superheat < target.min) return 'bg-yellow-50 border-yellow-200 text-yellow-700';
    if (superheat >= target.min && superheat <= target.max) return 'bg-green-50 border-green-200 text-green-700';
    if (superheat > target.max && superheat <= target.max + 10) return 'bg-yellow-50 border-yellow-200 text-yellow-700';
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
          Calculate superheat values for HVAC and refrigeration systems with refrigerant-specific target ranges.
          Supports 7 common refrigerants including R410A, R32, R22, R134A, R407C, R404A, and R507A.
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
              <Label htmlFor="refrigerantType">Refrigerant Type</Label>
              <select 
                id="refrigerantType"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                value={refrigerantType}
                onChange={(e) => setRefrigerantType(e.target.value)}
              >
                <option value="R410A">R410A (Most Common)</option>
                <option value="R32">R32 (Eco-Friendly)</option>
                <option value="R22">R22 (Legacy)</option>
                <option value="R134A">R134A (Automotive)</option>
                <option value="R407C">R407C (R22 Replacement)</option>
                <option value="R404A">R404A (Commercial)</option>
                <option value="R507A">R507A (Low-Temp)</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Target superheat: {superheatTargets[refrigerantType as keyof typeof superheatTargets]?.ideal}
              </p>
            </div>

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
              <Card className={getStatusColor(result.superheat, refrigerantType)}>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <h3 className="font-semibold text-lg mb-2">{refrigerantType} Superheat Results</h3>
                    <p className="text-3xl font-bold mb-2">
                      {result.superheat.toFixed(1)}°F
                    </p>
                    <p className="font-semibold mb-2">
                      Target Range: {result.targetRange}
                    </p>
                    <p className="font-semibold mb-4">
                      {result.status}
                    </p>
                    <div className="text-sm space-y-1 mb-4">
                      <p>Suction Line: {lineTemp}°F</p>
                      <p>Saturation: {satTemp}°F</p>
                      <p>Difference: {result.superheat.toFixed(1)}°F</p>
                    </div>

                    {(result.superheat < superheatTargets[refrigerantType as keyof typeof superheatTargets].min - 2 || 
                      result.superheat > superheatTargets[refrigerantType as keyof typeof superheatTargets].max + 10) && (
                      <Alert variant="destructive" className="mt-4 text-left">
                        <AlertTriangle className="w-4 h-4" />
                        <AlertDescription>
                          {result.superheat < superheatTargets[refrigerantType as keyof typeof superheatTargets].min - 2
                            ? `Very low superheat for ${refrigerantType} - risk of liquid refrigerant return to compressor`
                            : `Very high superheat for ${refrigerantType} - system requires immediate attention`
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