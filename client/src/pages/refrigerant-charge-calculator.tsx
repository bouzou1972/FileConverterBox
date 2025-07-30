import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Snowflake, Calculator, Info } from 'lucide-react';
import { ToolSEO } from '@/components/tool-seo';
import { ShareButtons } from '@/components/share-buttons';
import { UsageGuide } from '@/components/usage-guide';

export default function RefrigerantChargeCalculator() {
  const [lineLength, setLineLength] = useState('');
  const [chargePerFoot, setChargePerFoot] = useState('0.6');
  const [refrigerantType, setRefrigerantType] = useState('R410A');
  const [lineSize, setLineSize] = useState('3/8');
  const [result, setResult] = useState<{additionalCharge: number, totalLength: number} | null>(null);
  const [error, setError] = useState('');

  const refrigerantData = {
    'R410A': {
      '1/4': 0.1,
      '3/8': 0.3,
      '1/2': 0.6,
      '5/8': 0.9,
      '3/4': 1.3,
      '7/8': 1.8
    },
    'R22': {
      '1/4': 0.08,
      '3/8': 0.25,
      '1/2': 0.5,
      '5/8': 0.75,
      '3/4': 1.1,
      '7/8': 1.5
    },
    'R134A': {
      '1/4': 0.06,
      '3/8': 0.2,
      '1/2': 0.4,
      '5/8': 0.6,
      '3/4': 0.9,
      '7/8': 1.2
    }
  };

  const calculateCharge = () => {
    const length = parseFloat(lineLength);
    let chargeRate = parseFloat(chargePerFoot);
    
    if (!length || length <= 0) {
      setError('Please enter a valid line length');
      setResult(null);
      return;
    }

    // Use refrigerant-specific data if custom charge rate isn't provided
    if (chargePerFoot === '0.6' || !chargePerFoot) {
      const refData = refrigerantData[refrigerantType as keyof typeof refrigerantData];
      chargeRate = refData[lineSize as keyof typeof refData] || 0.6;
    }

    const additionalCharge = length * chargeRate;
    
    setResult({
      additionalCharge,
      totalLength: length
    });
    setError('');
  };

  const clearCalculation = () => {
    setLineLength('');
    setChargePerFoot('0.6');
    setRefrigerantType('R410A');
    setLineSize('3/8');
    setResult(null);
    setError('');
  };

  const copyResult = () => {
    if (result) {
      navigator.clipboard.writeText(
        `${refrigerantType} Line: ${lineSize}" × ${result.totalLength}ft | Additional Charge: ${result.additionalCharge.toFixed(2)} oz`
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <ToolSEO
        title="Refrigerant Charge Calculator - HVAC Refrigerant Line Charge Calculator"
        description="Free refrigerant charge calculator for HVAC systems. Calculate additional refrigerant charge needed based on line length, size, and refrigerant type (R410A, R22, R134A)."
        keywords={["refrigerant charge calculator", "HVAC charge calculator", "R410A charge", "refrigerant line calculator", "HVAC refrigerant", "AC charge calculator"]}
        canonicalUrl="/refrigerant-charge-calculator"
      />

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Refrigerant Charge Calculator</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Calculate additional refrigerant charge needed for extended line sets in HVAC systems. 
          Supports R410A, R22, and R134A refrigerants with standard line sizes.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Snowflake className="w-5 h-5 text-cyan-600" />
              Line Set Parameters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="refrigerantType">Refrigerant Type</Label>
                <select 
                  id="refrigerantType"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={refrigerantType}
                  onChange={(e) => setRefrigerantType(e.target.value)}
                >
                  <option value="R410A">R410A</option>
                  <option value="R22">R22</option>
                  <option value="R134A">R134A</option>
                </select>
              </div>
              <div>
                <Label htmlFor="lineSize">Line Size (inches)</Label>
                <select 
                  id="lineSize"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={lineSize}
                  onChange={(e) => setLineSize(e.target.value)}
                >
                  <option value="1/4">1/4"</option>
                  <option value="3/8">3/8"</option>
                  <option value="1/2">1/2"</option>
                  <option value="5/8">5/8"</option>
                  <option value="3/4">3/4"</option>
                  <option value="7/8">7/8"</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="lineLength">Line Length (feet)</Label>
                <Input
                  id="lineLength"
                  type="number"
                  value={lineLength}
                  onChange={(e) => setLineLength(e.target.value)}
                  placeholder="e.g., 25"
                  min="0"
                  step="0.1"
                />
              </div>
              <div>
                <Label htmlFor="chargePerFoot">Custom Rate (oz/ft)</Label>
                <Input
                  id="chargePerFoot"
                  type="number"
                  value={chargePerFoot}
                  onChange={(e) => setChargePerFoot(e.target.value)}
                  placeholder="Auto-calculated"
                  step="0.01"
                />
              </div>
            </div>

            <div>
              <Label>Current Rate: {refrigerantData[refrigerantType as keyof typeof refrigerantData][lineSize as keyof typeof refrigerantData[keyof typeof refrigerantData]]} oz/ft</Label>
              <p className="text-sm text-gray-600 mt-1">
                Based on {refrigerantType} in {lineSize}" line. Use custom rate to override.
              </p>
            </div>

            <div className="flex gap-2">
              <Button onClick={calculateCharge} className="flex-1">
                <Calculator className="w-4 h-4 mr-2" />
                Calculate Charge
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
              <Card className="bg-cyan-50 border-cyan-200">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <h3 className="font-semibold text-lg mb-4">Additional Refrigerant Required</h3>
                    
                    <div className="space-y-2">
                      <p className="text-3xl font-bold text-cyan-700">
                        {result.additionalCharge.toFixed(2)} oz
                      </p>
                      <p className="text-lg font-semibold text-cyan-600">
                        ({(result.additionalCharge / 16).toFixed(2)} lbs)
                      </p>
                    </div>

                    <div className="text-sm mt-4 space-y-1">
                      <p>Refrigerant: {refrigerantType}</p>
                      <p>Line Size: {lineSize}" diameter</p>
                      <p>Length: {result.totalLength} feet</p>
                      <p>Rate: {(result.additionalCharge / result.totalLength).toFixed(2)} oz/ft</p>
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
                Refrigerant Charge Guidelines
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="font-semibold">Standard Rates (oz/ft)</h4>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium">R410A:</span>
                      <div className="grid grid-cols-2 gap-1 text-xs text-gray-600 ml-2">
                        <span>1/4": 0.1 oz/ft</span>
                        <span>3/8": 0.3 oz/ft</span>
                        <span>1/2": 0.6 oz/ft</span>
                        <span>5/8": 0.9 oz/ft</span>
                        <span>3/4": 1.3 oz/ft</span>
                        <span>7/8": 1.8 oz/ft</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold">Important Notes</h4>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Calculate for total additional line length</li>
                    <li>• Subtract any line length included in base charge</li>
                    <li>• Verify with manufacturer specifications</li>
                    <li>• Consider elevation and temperature factors</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold">Typical Applications</h4>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Line set extensions beyond 15-25 ft</li>
                    <li>• Mini-split installations</li>
                    <li>• Commercial unit line runs</li>
                    <li>• System relocations</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold">Safety Reminder</h4>
                  <p className="text-gray-600 text-xs">
                    Always follow EPA regulations and manufacturer guidelines for refrigerant handling and charging procedures.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <ShareButtons 
            title="Refrigerant Charge Calculator - HVAC Line Charge Calculator"
            description="Free refrigerant charge calculator for HVAC line sets. Calculate additional charge needed for R410A, R22, and R134A systems."
          />
        </div>
      </div>

      <UsageGuide
        title="Refrigerant Charge Calculator"
        description="Calculate additional refrigerant charge required for extended line sets in HVAC and refrigeration systems."
        examples={[
          {
            title: "Line Set Extension",
            description: "Calculate additional charge needed when extending line sets beyond standard length"
          },
          {
            title: "Mini-Split Installation",
            description: "Determine refrigerant requirements for ductless system installations with long line runs"
          },
          {
            title: "System Relocation",
            description: "Calculate charge adjustments when relocating outdoor units or changing line routing"
          }
        ]}
        tips={[
          "Subtract any line length already included in base system charge",
          "Use manufacturer-specific charge rates when available",
          "Account for line size changes in calculations",
          "Consider ambient temperature effects on charging"
        ]}
        bestPractices={[
          "Follow EPA regulations for refrigerant handling",
          "Use certified scales for accurate charging",
          "Verify system pressures after charging",
          "Document all refrigerant additions for compliance"
        ]}
      />
    </div>
  );
}