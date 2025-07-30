import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Zap, Calculator, Info, AlertTriangle } from 'lucide-react';
import { ToolSEO } from '@/components/tool-seo';
import { ShareButtons } from '@/components/share-buttons';
import { UsageGuide } from '@/components/usage-guide';

export default function VoltageDropCalculator() {
  const [distance, setDistance] = useState('');
  const [current, setCurrent] = useState('');
  const [resistance, setResistance] = useState('0.0008');
  const [voltageSystem, setVoltageSystem] = useState('120');
  const [result, setResult] = useState<{drop: number, percentage: number} | null>(null);
  const [error, setError] = useState('');

  const calculateVD = () => {
    const d = parseFloat(distance);
    const i = parseFloat(current);
    const r = parseFloat(resistance);
    const systemVoltage = parseFloat(voltageSystem);
    
    if (!d || !i || !r || !systemVoltage || d <= 0 || i <= 0 || r <= 0 || systemVoltage <= 0) {
      setError('Please enter valid positive values for all fields');
      setResult(null);
      return;
    }

    // Voltage drop formula: VD = 2 × Distance × Resistance × Current
    // Factor of 2 accounts for round trip (hot and neutral conductors)
    const drop = 2 * d * r * i;
    const percentage = (drop / systemVoltage) * 100;
    
    setResult({ drop, percentage });
    setError('');
  };

  const clearCalculation = () => {
    setDistance('');
    setCurrent('');
    setResistance('0.0008');
    setVoltageSystem('120');
    setResult(null);
    setError('');
  };

  const copyResult = () => {
    if (result) {
      navigator.clipboard.writeText(
        `Distance: ${distance}ft | Current: ${current}A | Voltage Drop: ${result.drop.toFixed(2)}V (${result.percentage.toFixed(1)}%)`
      );
    }
  };

  const getWireResistanceOptions = () => [
    { awg: '14 AWG', resistance: '0.0031', description: '15A circuits' },
    { awg: '12 AWG', resistance: '0.0020', description: '20A circuits' },
    { awg: '10 AWG', resistance: '0.0012', description: '30A circuits' },
    { awg: '8 AWG', resistance: '0.0008', description: '50A circuits' },
    { awg: '6 AWG', resistance: '0.0005', description: '65A circuits' },
    { awg: '4 AWG', resistance: '0.0003', description: '85A circuits' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <ToolSEO
        title="Voltage Drop Calculator - Electrical Wire Sizing & Voltage Loss Calculator"
        description="Free voltage drop calculator for electrical circuits. Calculate voltage loss in wires, determine proper wire gauge, and ensure electrical code compliance for residential and commercial wiring."
        keywords={["voltage drop calculator", "electrical calculator", "wire sizing", "voltage loss", "electrical code", "wire gauge calculator", "electrical circuits", "electrician tools"]}
        canonicalUrl="/voltage-drop-calculator"
      />

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Voltage Drop Calculator</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Calculate voltage drop in electrical circuits to ensure proper wire sizing and code compliance. 
          Determine voltage loss over distance for residential and commercial electrical installations.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-600" />
              Voltage Drop Calculation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="distance">Distance (feet)</Label>
                <Input
                  id="distance"
                  type="number"
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                  placeholder="e.g., 100"
                  min="0"
                  step="0.1"
                />
              </div>
              <div>
                <Label htmlFor="current">Current Load (Amps)</Label>
                <Input
                  id="current"
                  type="number"
                  value={current}
                  onChange={(e) => setCurrent(e.target.value)}
                  placeholder="e.g., 15"
                  min="0"
                  step="0.1"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="resistance">Wire Resistance (Ohms/ft)</Label>
                <Input
                  id="resistance"
                  type="number"
                  value={resistance}
                  onChange={(e) => setResistance(e.target.value)}
                  placeholder="0.0008"
                  min="0"
                  step="0.0001"
                />
              </div>
              <div>
                <Label htmlFor="voltageSystem">System Voltage</Label>
                <select 
                  id="voltageSystem"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={voltageSystem}
                  onChange={(e) => setVoltageSystem(e.target.value)}
                >
                  <option value="120">120V</option>
                  <option value="240">240V</option>
                  <option value="208">208V</option>
                  <option value="277">277V</option>
                  <option value="480">480V</option>
                </select>
              </div>
            </div>

            <div>
              <Label>Common Wire Resistances</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {getWireResistanceOptions().map((wire) => (
                  <Button
                    key={wire.awg}
                    variant="outline"
                    size="sm"
                    onClick={() => setResistance(wire.resistance)}
                    className="text-xs h-auto p-2 flex flex-col"
                  >
                    <span className="font-semibold">{wire.awg}</span>
                    <span className="text-gray-500">{wire.description}</span>
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={calculateVD} className="flex-1">
                <Calculator className="w-4 h-4 mr-2" />
                Calculate Voltage Drop
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
              <Card className={`${result.percentage > 5 ? 'bg-red-50 border-red-200' : result.percentage > 3 ? 'bg-yellow-50 border-yellow-200' : 'bg-green-50 border-green-200'}`}>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <h3 className="font-semibold text-lg mb-2">Voltage Drop Results</h3>
                    <div className="space-y-2">
                      <p className="text-2xl font-bold">
                        {result.drop.toFixed(2)} V
                      </p>
                      <p className="text-lg font-semibold">
                        {result.percentage.toFixed(1)}% Drop
                      </p>
                      <div className="text-sm space-y-1">
                        <p>Distance: {distance} ft</p>
                        <p>Current: {current} A</p>
                        <p>Wire: {resistance} Ω/ft</p>
                      </div>
                    </div>
                    
                    {result.percentage > 5 && (
                      <Alert variant="destructive" className="mt-4 text-left">
                        <AlertTriangle className="w-4 h-4" />
                        <AlertDescription>
                          Voltage drop exceeds 5% - Consider larger wire gauge or shorter run
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    {result.percentage > 3 && result.percentage <= 5 && (
                      <Alert className="mt-4 text-left bg-yellow-50 border-yellow-200">
                        <Info className="w-4 h-4" />
                        <AlertDescription>
                          Voltage drop is between 3-5% - Acceptable but consider optimization
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
                Voltage Drop Guidelines
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="font-semibold">NEC Code Requirements</h4>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Maximum 3% drop for branch circuits</li>
                    <li>• Maximum 5% total drop (feeders + branch)</li>
                    <li>• 2% recommended for critical loads</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold">Formula</h4>
                  <p className="text-gray-600">
                    VD = 2 × Distance × Resistance × Current
                  </p>
                  <p className="text-xs text-gray-500">
                    Factor of 2 accounts for round trip (hot + neutral)
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold">Common Wire Gauges</h4>
                  <div className="space-y-1 text-gray-600">
                    <div className="flex justify-between">
                      <span>14 AWG:</span>
                      <span>0.00308 Ω/ft (15A)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>12 AWG:</span>
                      <span>0.00193 Ω/ft (20A)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>10 AWG:</span>
                      <span>0.00123 Ω/ft (30A)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>8 AWG:</span>
                      <span>0.000764 Ω/ft (50A)</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <ShareButtons 
            title="Voltage Drop Calculator - Electrical Wire Sizing Calculator"
            description="Free voltage drop calculator for electrical circuits. Calculate voltage loss and ensure proper wire sizing for electrical installations."
          />
        </div>
      </div>

      <UsageGuide
        title="Voltage Drop Calculator"
        description="Calculate voltage drop in electrical circuits to ensure proper wire sizing and code compliance for residential and commercial installations."
        examples={[
          {
            title: "Enter Circuit Parameters",
            description: "Input distance from panel to load in feet and the actual current draw in amperes"
          },
          {
            title: "Select Wire Specifications",
            description: "Enter wire resistance or use quick buttons for common gauges (12 AWG, 10 AWG, etc.)"
          },
          {
            title: "Calculate and Evaluate",
            description: "Choose system voltage and calculate to determine if voltage drop meets code requirements"
          }
        ]}
        tips={[
          "Use actual measured current, not circuit breaker rating",
          "Consider voltage drop for both feeders and branch circuits",
          "Aluminum wire has higher resistance than copper",
          "Temperature affects wire resistance - consider ambient conditions"
        ]}
        bestPractices={[
          "Keep voltage drop under 3% for branch circuits per NEC",
          "Calculate total drop including feeders and branch circuits",
          "Use next larger wire size if drop exceeds recommendations",
          "Consider future load expansion when sizing conductors"
        ]}
      />
    </div>
  );
}