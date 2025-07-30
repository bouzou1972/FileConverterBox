import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Thermometer, Calculator, Info } from 'lucide-react';
import { ToolSEO } from '@/components/tool-seo';
import { ShareButtons } from '@/components/share-buttons';
import { UsageGuide } from '@/components/usage-guide';

export default function HVACBTUCalculator() {
  const [roomSize, setRoomSize] = useState('');
  const [btuResult, setBtuResult] = useState<number | null>(null);
  const [error, setError] = useState('');

  const calculateBTU = () => {
    const size = parseFloat(roomSize);
    
    if (!size || size <= 0) {
      setError('Please enter a valid room size in square feet');
      setBtuResult(null);
      return;
    }

    // Standard calculation: 20 BTU per square foot (rough estimate)
    // More precise calculation considers ceiling height, insulation, windows, etc.
    const btu = size * 20;
    setBtuResult(btu);
    setError('');
  };

  const clearCalculation = () => {
    setRoomSize('');
    setBtuResult(null);
    setError('');
  };

  const copyResult = () => {
    if (btuResult) {
      navigator.clipboard.writeText(`Room Size: ${roomSize} sq ft | Required Cooling: ${btuResult.toLocaleString()} BTU`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <ToolSEO
        title="HVAC BTU Calculator - Calculate Air Conditioning & Heating Requirements"
        description="Free HVAC BTU calculator for determining air conditioning and heating requirements. Calculate cooling and heating BTU needs based on room size for proper HVAC system sizing."
        keywords={["HVAC BTU calculator", "air conditioning calculator", "heating calculator", "BTU requirements", "cooling capacity", "HVAC sizing", "room size calculator", "AC unit size"]}
        canonicalUrl="/hvac-btu-calculator"
      />

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">HVAC BTU Calculator</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Calculate the required BTU (British Thermal Units) for heating and cooling your space. 
          Get accurate HVAC system sizing recommendations based on room dimensions.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Thermometer className="w-5 h-5 text-blue-600" />
              BTU Calculation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="roomSize">Room Size (Square Feet)</Label>
              <Input
                id="roomSize"
                type="number"
                value={roomSize}
                onChange={(e) => setRoomSize(e.target.value)}
                placeholder="e.g., 300"
                min="1"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={calculateBTU} className="flex-1">
                <Calculator className="w-4 h-4 mr-2" />
                Calculate BTU
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

            {btuResult && (
              <Card className="bg-green-50 border-green-200">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <h3 className="font-semibold text-lg mb-2">Required Cooling Capacity</h3>
                    <p className="text-2xl font-bold text-green-700">
                      {btuResult.toLocaleString()} BTU/hr
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      Room Size: {roomSize} sq ft
                    </p>
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
                BTU Calculation Guide
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="font-semibold">Basic Formula</h4>
                  <p className="text-gray-600">Room Size (sq ft) × 20 BTU = Required Cooling</p>
                </div>
                
                <div>
                  <h4 className="font-semibold">Additional Factors</h4>
                  <ul className="text-gray-600 space-y-1">
                    <li>• High ceilings: Add 10% for ceilings over 8 feet</li>
                    <li>• Windows: Add 1,000 BTU per window</li>
                    <li>• Kitchen: Add 4,000 BTU for cooking appliances</li>
                    <li>• Occupancy: Add 600 BTU per person over 2</li>
                    <li>• Sun exposure: Add 10% for south-facing rooms</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold">Room Type Guidelines</h4>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Living Room: 20-25 BTU/sq ft</li>
                    <li>• Bedroom: 15-20 BTU/sq ft</li>
                    <li>• Kitchen: 25-35 BTU/sq ft</li>
                    <li>• Office: 20-25 BTU/sq ft</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <ShareButtons 
            title="HVAC BTU Calculator - Calculate Air Conditioning Requirements"
            description="Free HVAC BTU calculator for determining air conditioning and heating requirements based on room size."
          />
        </div>
      </div>

      <UsageGuide
        title="HVAC BTU Calculator"
        description="Calculate the required BTU capacity for heating and cooling systems based on room size and environmental factors."
        examples={[
          {
            title: "Basic Room Calculation",
            description: "Enter room size in square feet (e.g., 300 sq ft) and click calculate to get BTU requirements"
          },
          {
            title: "Apply Adjustments",
            description: "Factor in ceiling height, windows, sun exposure, and occupancy for more accurate results"
          },
          {
            title: "Equipment Selection",
            description: "Choose HVAC equipment with BTU capacity matching or slightly exceeding your calculation"
          }
        ]}
        tips={[
          "Oversizing can lead to poor humidity control and energy waste",
          "Undersizing will result in inadequate cooling and overworked equipment",
          "Consider energy efficiency ratings (SEER) when selecting units",
          "Consult with HVAC professionals for complex installations"
        ]}
        bestPractices={[
          "Use actual room measurements for accurate calculations",
          "Factor in additional heat sources like appliances and occupancy",
          "Consider insulation quality and window efficiency",
          "Account for local climate conditions in your calculations"
        ]}
      />
    </div>
  );
}