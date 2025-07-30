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

export default function OhmsLawCalculator() {
  const [voltage, setVoltage] = useState('');
  const [current, setCurrent] = useState('');
  const [resistance, setResistance] = useState('');
  const [power, setPower] = useState('');
  const [results, setResults] = useState<{V?: number, I?: number, R?: number, P?: number} | null>(null);
  const [error, setError] = useState('');

  const calculateOhmsLaw = () => {
    const V = voltage ? parseFloat(voltage) : null;
    const I = current ? parseFloat(current) : null;
    const R = resistance ? parseFloat(resistance) : null;
    const P = power ? parseFloat(power) : null;

    const values = [V, I, R, P].filter(v => v !== null);
    
    if (values.length < 2) {
      setError('Please enter at least 2 values to calculate the others');
      setResults(null);
      return;
    }

    if (values.some(v => v! <= 0)) {
      setError('Please enter positive values only');
      setResults(null);
      return;
    }

    let calcV = V, calcI = I, calcR = R, calcP = P;

    try {
      // Calculate based on available values
      if (V && I) {
        calcR = V / I;  // R = V / I
        calcP = V * I;  // P = V * I
      } else if (V && R) {
        calcI = V / R;  // I = V / R
        calcP = (V * V) / R;  // P = V² / R
      } else if (V && P) {
        calcI = P / V;  // I = P / V
        calcR = (V * V) / P;  // R = V² / P
      } else if (I && R) {
        calcV = I * R;  // V = I * R
        calcP = I * I * R;  // P = I² * R
      } else if (I && P) {
        calcV = P / I;  // V = P / I
        calcR = P / (I * I);  // R = P / I²
      } else if (R && P) {
        calcV = Math.sqrt(P * R);  // V = √(P * R)
        calcI = Math.sqrt(P / R);  // I = √(P / R)
      }

      setResults({
        V: calcV || undefined,
        I: calcI || undefined,
        R: calcR || undefined,
        P: calcP || undefined
      });
      setError('');
    } catch (err) {
      setError('Error in calculation. Please check your values.');
      setResults(null);
    }
  };

  const clearCalculation = () => {
    setVoltage('');
    setCurrent('');
    setResistance('');
    setPower('');
    setResults(null);
    setError('');
  };

  const copyResults = () => {
    if (results) {
      const resultText = `Ohm's Law Results: V=${results.V?.toFixed(2)}V | I=${results.I?.toFixed(2)}A | R=${results.R?.toFixed(2)}Ω | P=${results.P?.toFixed(2)}W`;
      navigator.clipboard.writeText(resultText);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <ToolSEO
        title="Ohm's Law Calculator - Voltage, Current, Resistance & Power Calculator"
        description="Free Ohm's Law calculator for electrical circuits. Calculate voltage, current, resistance, and power using V=IR and P=VI formulas. Essential tool for electricians and engineers."
        keywords={["ohms law calculator", "electrical calculator", "voltage calculator", "current calculator", "resistance calculator", "power calculator", "V=IR", "electrical formulas"]}
        canonicalUrl="/ohms-law-calculator"
      />

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Ohm's Law Calculator</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Calculate voltage, current, resistance, and power in electrical circuits using Ohm's Law formulas. 
          Enter any two values to calculate the remaining parameters.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-600" />
              Electrical Parameters
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
                  placeholder="e.g., 12.0"
                  step="0.01"
                />
              </div>
              <div>
                <Label htmlFor="current">Current (A)</Label>
                <Input
                  id="current"
                  type="number"
                  value={current}
                  onChange={(e) => setCurrent(e.target.value)}
                  placeholder="e.g., 2.5"
                  step="0.01"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="resistance">Resistance (Ω)</Label>
                <Input
                  id="resistance"
                  type="number"
                  value={resistance}
                  onChange={(e) => setResistance(e.target.value)}
                  placeholder="e.g., 4.8"
                  step="0.01"
                />
              </div>
              <div>
                <Label htmlFor="power">Power (W)</Label>
                <Input
                  id="power"
                  type="number"
                  value={power}
                  onChange={(e) => setPower(e.target.value)}
                  placeholder="e.g., 30.0"
                  step="0.01"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={calculateOhmsLaw} className="flex-1">
                <Calculator className="w-4 h-4 mr-2" />
                Calculate
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

            {results && (
              <Card className="bg-green-50 border-green-200">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <h3 className="font-semibold text-lg mb-4">Calculated Results</h3>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="font-medium">Voltage:</span>
                          <span className="text-green-700 font-semibold">
                            {results.V?.toFixed(3)} V
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Current:</span>
                          <span className="text-green-700 font-semibold">
                            {results.I?.toFixed(3)} A
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="font-medium">Resistance:</span>
                          <span className="text-green-700 font-semibold">
                            {results.R?.toFixed(3)} Ω
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Power:</span>
                          <span className="text-green-700 font-semibold">
                            {results.P?.toFixed(3)} W
                          </span>
                        </div>
                      </div>
                    </div>

                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={copyResults}
                      className="mt-4"
                    >
                      Copy Results
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
                Ohm's Law Formulas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="font-semibold">Basic Formulas</h4>
                  <ul className="text-gray-600 space-y-1">
                    <li>• V = I × R (Voltage = Current × Resistance)</li>
                    <li>• I = V ÷ R (Current = Voltage ÷ Resistance)</li>
                    <li>• R = V ÷ I (Resistance = Voltage ÷ Current)</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold">Power Formulas</h4>
                  <ul className="text-gray-600 space-y-1">
                    <li>• P = V × I (Power = Voltage × Current)</li>
                    <li>• P = I² × R (Power = Current² × Resistance)</li>
                    <li>• P = V² ÷ R (Power = Voltage² ÷ Resistance)</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold">Units</h4>
                  <ul className="text-gray-600 space-y-1">
                    <li>• V = Voltage (Volts)</li>
                    <li>• I = Current (Amperes)</li>
                    <li>• R = Resistance (Ohms Ω)</li>
                    <li>• P = Power (Watts)</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold">Memory Aid</h4>
                  <p className="text-gray-600 text-xs">
                    Think of the "PIE" wheel: P=Power, I=Current, E=Voltage (EMF)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <ShareButtons 
            title="Ohm's Law Calculator - Electrical Circuit Calculator"
            description="Free Ohm's Law calculator for electrical circuits. Calculate voltage, current, resistance, and power using standard electrical formulas."
          />
        </div>
      </div>

      <UsageGuide
        title="Ohm's Law Calculator"
        description="Calculate electrical circuit parameters using Ohm's Law and power formulas for troubleshooting and design work."
        examples={[
          {
            title: "Basic Circuit Analysis",
            description: "Enter any two known values (voltage, current, resistance, or power) to calculate the unknown parameters"
          },
          {
            title: "Power Consumption",
            description: "Calculate power consumption by entering voltage and current, or voltage and resistance"
          },
          {
            title: "Component Selection",
            description: "Determine required component ratings by calculating current draw and power dissipation"
          }
        ]}
        tips={[
          "Enter at least 2 values to calculate the remaining parameters",
          "Use decimal values for precise calculations (e.g., 12.5V instead of 12V)",
          "Power calculations help determine component heating and sizing",
          "Verify results make sense for your specific application"
        ]}
        bestPractices={[
          "Always double-check calculations before working with live circuits",
          "Consider component tolerances in real-world applications",
          "Use appropriate safety margins for power ratings",
          "Account for temperature effects on resistance values"
        ]}
      />
    </div>
  );
}