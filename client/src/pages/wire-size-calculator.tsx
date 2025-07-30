import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Cable, Calculator, Info, AlertTriangle } from 'lucide-react';
import { ToolSEO } from '@/components/tool-seo';
import { ShareButtons } from '@/components/share-buttons';
import { UsageGuide } from '@/components/usage-guide';

export default function WireSizeCalculator() {
  const [current, setCurrent] = useState('');
  const [distance, setDistance] = useState('');
  const [voltage, setVoltage] = useState('120');
  const [maxDrop, setMaxDrop] = useState('3');
  const [wireType, setWireType] = useState('copper');
  const [result, setResult] = useState<{awg: string, actualDrop: number, recommendation: string} | null>(null);
  const [error, setError] = useState('');

  const wireData = {
    copper: [
      { awg: '14', resistance: 3.07, ampacity: 15 },
      { awg: '12', resistance: 1.93, ampacity: 20 },
      { awg: '10', resistance: 1.21, ampacity: 30 },
      { awg: '8', resistance: 0.764, ampacity: 50 },
      { awg: '6', resistance: 0.491, ampacity: 65 },
      { awg: '4', resistance: 0.308, ampacity: 85 },
      { awg: '2', resistance: 0.194, ampacity: 115 },
      { awg: '1/0', resistance: 0.154, ampacity: 150 },
      { awg: '2/0', resistance: 0.122, ampacity: 175 },
      { awg: '3/0', resistance: 0.0967, ampacity: 200 }
    ],
    aluminum: [
      { awg: '12', resistance: 3.18, ampacity: 15 },
      { awg: '10', resistance: 2.00, ampacity: 25 },
      { awg: '8', resistance: 1.26, ampacity: 40 },
      { awg: '6', resistance: 0.808, ampacity: 50 },
      { awg: '4', resistance: 0.508, ampacity: 65 },
      { awg: '2', resistance: 0.319, ampacity: 90 },
      { awg: '1/0', resistance: 0.253, ampacity: 120 },
      { awg: '2/0', resistance: 0.201, ampacity: 135 },
      { awg: '3/0', resistance: 0.159, ampacity: 155 }
    ]
  };

  const calculateWireSize = () => {
    const load = parseFloat(current);
    const dist = parseFloat(distance);
    const sys_voltage = parseFloat(voltage);
    const max_drop = parseFloat(maxDrop);
    
    if (!load || !dist || !sys_voltage || !max_drop || load <= 0 || dist <= 0) {
      setError('Please enter valid positive values');
      setResult(null);
      return;
    }

    // Calculate maximum allowed voltage drop
    const maxDropVolts = (max_drop / 100) * sys_voltage;
    
    // Calculate required resistance: R = V_drop / (2 × I × distance)
    const maxResistance = maxDropVolts / (2 * load * dist / 1000); // Convert feet to thousands
    
    const wires = wireData[wireType as keyof typeof wireData];
    
    // Find the smallest wire that meets both ampacity and voltage drop requirements
    let selectedWire = null;
    
    for (const wire of wires) {
      if (wire.ampacity >= load && wire.resistance <= maxResistance) {
        selectedWire = wire;
        break;
      }
    }
    
    if (!selectedWire) {
      // If no wire meets requirements, suggest the largest available
      selectedWire = wires[wires.length - 1];
    }
    
    // Calculate actual voltage drop with selected wire
    const actualDrop = (2 * dist * selectedWire.resistance * load) / 1000;
    const actualDropPercent = (actualDrop / sys_voltage) * 100;
    
    let recommendation = '';
    if (selectedWire.ampacity < load) {
      recommendation = 'Warning: Wire ampacity is below load current!';
    } else if (actualDropPercent > max_drop) {
      recommendation = 'Warning: Voltage drop exceeds maximum allowed!';
    } else {
      recommendation = 'Wire size meets all requirements';
    }
    
    setResult({
      awg: selectedWire.awg,
      actualDrop: actualDropPercent,
      recommendation
    });
    setError('');
  };

  const clearCalculation = () => {
    setCurrent('');
    setDistance('');
    setVoltage('120');
    setMaxDrop('3');
    setWireType('copper');
    setResult(null);
    setError('');
  };

  const copyResult = () => {
    if (result) {
      navigator.clipboard.writeText(
        `Load: ${current}A | Distance: ${distance}ft | Recommended: ${result.awg} AWG ${wireType} | Voltage Drop: ${result.actualDrop.toFixed(2)}%`
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <ToolSEO
        title="Wire Size Calculator - Electrical Wire Gauge Calculator"
        description="Free wire size calculator for electrical installations. Determine proper wire gauge (AWG) based on current load, distance, and voltage drop requirements for safe electrical wiring."
        keywords={["wire size calculator", "wire gauge calculator", "AWG calculator", "electrical wire sizing", "conductor sizing", "voltage drop", "ampacity calculator", "electrical code"]}
        canonicalUrl="/wire-size-calculator"
      />

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Wire Size Calculator</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Calculate the proper wire gauge (AWG) for electrical circuits based on current load, distance, 
          and voltage drop requirements. Ensures safe and code-compliant installations.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cable className="w-5 h-5 text-orange-600" />
              Circuit Parameters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="current">Load Current (Amps)</Label>
                <Input
                  id="current"
                  type="number"
                  value={current}
                  onChange={(e) => setCurrent(e.target.value)}
                  placeholder="e.g., 20"
                  min="0"
                  step="0.1"
                />
              </div>
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
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="voltage">System Voltage</Label>
                <select 
                  id="voltage"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={voltage}
                  onChange={(e) => setVoltage(e.target.value)}
                >
                  <option value="120">120V</option>
                  <option value="240">240V</option>
                  <option value="208">208V</option>
                  <option value="277">277V</option>
                  <option value="480">480V</option>
                </select>
              </div>
              <div>
                <Label htmlFor="maxDrop">Max Voltage Drop (%)</Label>
                <Input
                  id="maxDrop"
                  type="number"
                  value={maxDrop}
                  onChange={(e) => setMaxDrop(e.target.value)}
                  placeholder="3"
                  min="0"
                  max="10"
                  step="0.1"
                />
              </div>
            </div>

            <div>
              <Label>Wire Material</Label>
              <div className="flex gap-4 mt-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="wireType"
                    value="copper"
                    checked={wireType === 'copper'}
                    onChange={(e) => setWireType(e.target.value)}
                    className="mr-2"
                  />
                  Copper
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="wireType"
                    value="aluminum"
                    checked={wireType === 'aluminum'}
                    onChange={(e) => setWireType(e.target.value)}
                    className="mr-2"
                  />
                  Aluminum
                </label>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={calculateWireSize} className="flex-1">
                <Calculator className="w-4 h-4 mr-2" />
                Calculate Wire Size
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
              <Card className={`${result.recommendation.includes('Warning') ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <h3 className="font-semibold text-lg mb-2">Recommended Wire Size</h3>
                    <p className="text-3xl font-bold mb-2">
                      {result.awg} AWG
                    </p>
                    <p className="text-lg font-semibold mb-4">
                      {wireType.charAt(0).toUpperCase() + wireType.slice(1)} Wire
                    </p>
                    
                    <div className="text-sm space-y-1 mb-4">
                      <p>Load: {current} A</p>
                      <p>Distance: {distance} ft</p>
                      <p>Actual Voltage Drop: {result.actualDrop.toFixed(2)}%</p>
                    </div>

                    <Alert className={`text-left ${result.recommendation.includes('Warning') ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}`}>
                      {result.recommendation.includes('Warning') ? (
                        <AlertTriangle className="w-4 h-4" />
                      ) : (
                        <Info className="w-4 h-4" />
                      )}
                      <AlertDescription>{result.recommendation}</AlertDescription>
                    </Alert>

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
                Wire Sizing Guidelines
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="font-semibold">NEC Requirements</h4>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Wire must handle the full load current</li>
                    <li>• Voltage drop should not exceed 3% for branch circuits</li>
                    <li>• Total drop (feeder + branch) limited to 5%</li>
                    <li>• Consider derating factors for temperature/bundling</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold">Common Wire Sizes</h4>
                  <div className="space-y-1 text-gray-600">
                    <div className="flex justify-between">
                      <span>14 AWG:</span>
                      <span>15A max (lighting circuits)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>12 AWG:</span>
                      <span>20A max (general outlets)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>10 AWG:</span>
                      <span>30A max (appliances)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>8 AWG:</span>
                      <span>50A max (large appliances)</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold">Material Comparison</h4>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Copper: Higher ampacity, better conductivity</li>
                    <li>• Aluminum: Lower cost, requires larger size</li>
                    <li>• Aluminum connections need special care</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <ShareButtons 
            title="Wire Size Calculator - Electrical Wire Gauge Calculator"
            description="Free wire size calculator for electrical installations. Calculate proper wire gauge based on current load and voltage drop requirements."
          />
        </div>
      </div>

      <UsageGuide
        title="Wire Size Calculator"
        description="Determine the proper wire gauge for electrical circuits based on load current, distance, and voltage drop requirements."
        examples={[
          {
            title: "Basic Circuit Sizing",
            description: "Enter load current and circuit distance to calculate minimum wire size requirements"
          },
          {
            title: "Voltage Drop Analysis",
            description: "Adjust maximum voltage drop percentage to see how it affects wire size selection"
          },
          {
            title: "Material Comparison",
            description: "Compare copper vs aluminum wire sizing for the same circuit requirements"
          }
        ]}
        tips={[
          "Always verify calculations against local electrical codes",
          "Consider future load expansion when selecting wire size",
          "Account for ambient temperature and bundling derating factors",
          "Use next larger standard wire size when in doubt"
        ]}
        bestPractices={[
          "Never exceed wire ampacity ratings for safety",
          "Keep voltage drop below 3% for optimal performance",
          "Consider the cost difference between wire sizes vs voltage drop",
          "Consult with licensed electricians for complex installations"
        ]}
      />
    </div>
  );
}