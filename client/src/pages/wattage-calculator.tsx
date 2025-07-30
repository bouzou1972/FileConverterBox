import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Zap, Calculator, Info } from 'lucide-react';
import { ToolSEO } from '@/components/tool-seo';
import { ShareButtons } from '@/components/share-buttons';
import { UsageGuide } from '@/components/usage-guide';

export default function WattageCalculator() {
  const [voltage, setVoltage] = useState('');
  const [current, setCurrent] = useState('');
  const [powerFactor, setPowerFactor] = useState('1.0');
  const [circuitType, setCircuitType] = useState('dc');
  const [result, setResult] = useState<{watts: number, kw: number} | null>(null);
  const [error, setError] = useState('');

  const calculateWattage = () => {
    const V = parseFloat(voltage);
    const I = parseFloat(current);
    const PF = parseFloat(powerFactor);
    
    if (!V || !I || !PF || V <= 0 || I <= 0 || PF <= 0 || PF > 1) {
      setError('Please enter valid positive values (Power factor must be ≤ 1.0)');
      setResult(null);
      return;
    }

    let watts: number;
    
    if (circuitType === 'dc' || circuitType === 'ac-single') {
      // DC or Single-phase AC: P = V × I × PF
      watts = V * I * PF;
    } else {
      // Three-phase AC: P = √3 × V × I × PF
      watts = Math.sqrt(3) * V * I * PF;
    }

    const kw = watts / 1000;
    
    setResult({ watts, kw });
    setError('');
  };

  const clearCalculation = () => {
    setVoltage('');
    setCurrent('');
    setPowerFactor('1.0');
    setCircuitType('dc');
    setResult(null);
    setError('');
  };

  const copyResult = () => {
    if (result) {
      navigator.clipboard.writeText(
        `Voltage: ${voltage}V | Current: ${current}A | Power: ${result.watts.toFixed(2)}W (${result.kw.toFixed(3)}kW)`
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <ToolSEO
        title="Wattage Calculator - Electrical Power Consumption Calculator"
        description="Free wattage calculator for electrical circuits. Calculate power consumption in watts and kilowatts from voltage and current for DC, single-phase, and three-phase circuits."
        keywords={["wattage calculator", "power calculator", "electrical power", "watts calculator", "kilowatt calculator", "power consumption", "electrical load", "P=VI"]}
        canonicalUrl="/wattage-calculator"
      />

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Wattage Calculator</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Calculate electrical power consumption in watts and kilowatts from voltage and current. 
          Supports DC, single-phase AC, and three-phase AC circuits with power factor correction.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-600" />
              Power Calculation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="voltage">Voltage (V)</Label>
                <Input
                  id="voltage"
                  type="number"
                  value={voltage}
                  onChange={(e) => setVoltage(e.target.value)}
                  placeholder="e.g., 120"
                  step="0.1"
                />
              </div>
              <div>
                <Label htmlFor="current">Current (A)</Label>
                <Input
                  id="current"
                  type="number"
                  value={current}
                  onChange={(e) => setCurrent(e.target.value)}
                  placeholder="e.g., 10"
                  step="0.1"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="circuitType">Circuit Type</Label>
                <select 
                  id="circuitType"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={circuitType}
                  onChange={(e) => setCircuitType(e.target.value)}
                >
                  <option value="dc">DC Circuit</option>
                  <option value="ac-single">Single-Phase AC</option>
                  <option value="ac-three">Three-Phase AC</option>
                </select>
              </div>
              <div>
                <Label htmlFor="powerFactor">Power Factor</Label>
                <Input
                  id="powerFactor"
                  type="number"
                  value={powerFactor}
                  onChange={(e) => setPowerFactor(e.target.value)}
                  placeholder="1.0"
                  min="0"
                  max="1"
                  step="0.01"
                />
              </div>
            </div>

            <div>
              <Label>Common Power Factors</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {[
                  { label: 'Resistive Load', value: '1.0' },
                  { label: 'LED Lighting', value: '0.95' },
                  { label: 'Fluorescent', value: '0.85' },
                  { label: 'Motor (avg)', value: '0.8' }
                ].map((preset) => (
                  <Button
                    key={preset.label}
                    variant="outline"
                    size="sm"
                    onClick={() => setPowerFactor(preset.value)}
                    className="text-xs h-auto p-2"
                  >
                    {preset.label}: {preset.value}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={calculateWattage} className="flex-1">
                <Calculator className="w-4 h-4 mr-2" />
                Calculate Wattage
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
              <Card className="bg-green-50 border-green-200">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <h3 className="font-semibold text-lg mb-4">Power Consumption</h3>
                    
                    <div className="space-y-2">
                      <p className="text-3xl font-bold text-green-700">
                        {result.watts.toFixed(2)} W
                      </p>
                      <p className="text-xl font-semibold text-green-600">
                        {result.kw.toFixed(3)} kW
                      </p>
                    </div>

                    <div className="text-sm mt-4 space-y-1">
                      <p>Voltage: {voltage} V</p>
                      <p>Current: {current} A</p>
                      <p>Power Factor: {powerFactor}</p>
                      <p>Circuit: {circuitType === 'dc' ? 'DC' : circuitType === 'ac-single' ? 'Single-Phase AC' : 'Three-Phase AC'}</p>
                    </div>

                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={copyResult}
                      className="mt-4"
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
                Power Formulas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="font-semibold">Basic Formulas</h4>
                  <ul className="text-gray-600 space-y-1">
                    <li>• DC: P = V × I</li>
                    <li>• Single-Phase AC: P = V × I × PF</li>
                    <li>• Three-Phase AC: P = √3 × V × I × PF</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold">Power Factor (PF)</h4>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Resistive loads: PF = 1.0</li>
                    <li>• Inductive loads: PF &lt; 1.0</li>
                    <li>• Motors typically: 0.7 - 0.9</li>
                    <li>• LED lighting: 0.9 - 0.95</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold">Common Applications</h4>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Energy consumption calculations</li>
                    <li>• Circuit breaker sizing</li>
                    <li>• Electrical load analysis</li>
                    <li>• Cost estimation (kWh × rate)</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold">Units</h4>
                  <ul className="text-gray-600 space-y-1">
                    <li>• W = Watts</li>
                    <li>• kW = Kilowatts (1000 watts)</li>
                    <li>• kWh = Kilowatt-hours (energy)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <ShareButtons 
            title="Wattage Calculator - Electrical Power Calculator"
            description="Free wattage calculator for electrical circuits. Calculate power consumption from voltage and current for any electrical load."
          />
        </div>
      </div>

      <UsageGuide
        title="Wattage Calculator"
        description="Calculate electrical power consumption in watts and kilowatts from voltage, current, and power factor measurements."
        examples={[
          {
            title: "Basic DC Power Calculation",
            description: "Enter voltage and current for DC circuits to calculate power consumption"
          },
          {
            title: "AC Circuit Analysis",
            description: "Select AC circuit type and adjust power factor for accurate AC power calculations"
          },
          {
            title: "Load Assessment",
            description: "Calculate power consumption for electrical equipment sizing and energy analysis"
          }
        ]}
        tips={[
          "Use power factor 1.0 for resistive loads like heaters and incandescent bulbs",
          "Inductive loads like motors have power factors less than 1.0",
          "Three-phase calculations automatically include √3 factor",
          "Convert watts to kW by dividing by 1000"
        ]}
        bestPractices={[
          "Measure actual current under load conditions",
          "Account for power factor in AC circuit calculations",
          "Consider power factor correction for large inductive loads",
          "Use calculated power for energy cost estimation"
        ]}
      />
    </div>
  );
}