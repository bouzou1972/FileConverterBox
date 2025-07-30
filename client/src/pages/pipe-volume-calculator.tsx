import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calculator, Info, Circle } from 'lucide-react';
import { ToolSEO } from '@/components/tool-seo';
import { ShareButtons } from '@/components/share-buttons';
import { UsageGuide } from '@/components/usage-guide';

export default function PipeVolumeCalculator() {
  const [diameter, setDiameter] = useState('');
  const [length, setLength] = useState('');
  const [units, setUnits] = useState('inches');
  const [result, setResult] = useState<{gallons: number, liters: number, cubicFeet: number} | null>(null);
  const [error, setError] = useState('');

  const calculateVolume = () => {
    const d = parseFloat(diameter);
    const l = parseFloat(length);
    
    if (!d || !l || d <= 0 || l <= 0) {
      setError('Please enter valid positive values for diameter and length');
      setResult(null);
      return;
    }

    let radiusFt: number;
    let lengthFt: number;

    // Convert to feet
    if (units === 'inches') {
      radiusFt = (d / 2) / 12; // diameter to radius, inches to feet
      lengthFt = l;
    } else {
      radiusFt = d / 2; // diameter to radius in feet
      lengthFt = l;
    }

    // Volume = π × r² × L (in cubic feet)
    const cubicFeet = Math.PI * radiusFt * radiusFt * lengthFt;
    const gallons = cubicFeet * 7.48052; // 1 cubic foot = 7.48052 gallons
    const liters = gallons * 3.78541; // 1 gallon = 3.78541 liters

    setResult({ gallons, liters, cubicFeet });
    setError('');
  };

  const clearCalculation = () => {
    setDiameter('');
    setLength('');
    setUnits('inches');
    setResult(null);
    setError('');
  };

  const copyResult = () => {
    if (result) {
      navigator.clipboard.writeText(
        `Pipe: ${diameter}${units === 'inches' ? '"' : 'ft'} × ${length}ft | Volume: ${result.gallons.toFixed(2)} gal (${result.liters.toFixed(1)} L)`
      );
    }
  };

  const commonPipeSizes = [
    { size: '1/2"', diameter: '0.5' },
    { size: '3/4"', diameter: '0.75' },
    { size: '1"', diameter: '1' },
    { size: '1.5"', diameter: '1.5' },
    { size: '2"', diameter: '2' },
    { size: '3"', diameter: '3' },
    { size: '4"', diameter: '4' },
    { size: '6"', diameter: '6' }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <ToolSEO
        title="Pipe Volume Calculator - Calculate Water Volume in Pipes"
        description="Free pipe volume calculator for plumbing and HVAC systems. Calculate water volume in gallons and liters for any pipe diameter and length."
        keywords={["pipe volume calculator", "water volume calculator", "pipe capacity", "plumbing calculator", "HVAC calculator", "gallons in pipe", "pipe sizing"]}
        canonicalUrl="/pipe-volume-calculator"
      />

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Pipe Volume Calculator</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Calculate the volume of water or fluid contained in pipes for plumbing, HVAC, and irrigation systems. 
          Get results in gallons, liters, and cubic feet.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Circle className="w-5 h-5 text-blue-600" />
              Pipe Dimensions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Diameter Units</Label>
              <div className="flex gap-4 mt-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="units"
                    value="inches"
                    checked={units === 'inches'}
                    onChange={(e) => setUnits(e.target.value)}
                    className="mr-2"
                  />
                  Inches
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="units"
                    value="feet"
                    checked={units === 'feet'}
                    onChange={(e) => setUnits(e.target.value)}
                    className="mr-2"
                  />
                  Feet
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="diameter">
                  Pipe Diameter ({units === 'inches' ? 'inches' : 'feet'})
                </Label>
                <Input
                  id="diameter"
                  type="number"
                  value={diameter}
                  onChange={(e) => setDiameter(e.target.value)}
                  placeholder={units === 'inches' ? 'e.g., 4' : 'e.g., 0.33'}
                  step={units === 'inches' ? '0.1' : '0.01'}
                />
              </div>
              <div>
                <Label htmlFor="length">Pipe Length (feet)</Label>
                <Input
                  id="length"
                  type="number"
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                  placeholder="e.g., 100"
                  step="0.1"
                />
              </div>
            </div>

            {units === 'inches' && (
              <div>
                <Label>Common Pipe Sizes</Label>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {commonPipeSizes.map((pipe) => (
                    <Button
                      key={pipe.size}
                      variant="outline"
                      size="sm"
                      onClick={() => setDiameter(pipe.diameter)}
                      className="text-xs h-auto p-2"
                    >
                      {pipe.size}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button onClick={calculateVolume} className="flex-1">
                <Calculator className="w-4 h-4 mr-2" />
                Calculate Volume
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
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <h3 className="font-semibold text-lg mb-4">Pipe Volume</h3>
                    
                    <div className="space-y-3">
                      <div>
                        <p className="text-2xl font-bold text-blue-700">
                          {result.gallons.toFixed(2)} gallons
                        </p>
                        <p className="text-sm text-gray-600">US gallons</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-semibold">{result.liters.toFixed(1)} L</p>
                          <p className="text-gray-600">Liters</p>
                        </div>
                        <div>
                          <p className="font-semibold">{result.cubicFeet.toFixed(3)} ft³</p>
                          <p className="text-gray-600">Cubic feet</p>
                        </div>
                      </div>
                    </div>

                    <div className="text-sm mt-4 space-y-1">
                      <p>Diameter: {diameter} {units === 'inches' ? 'inches' : 'feet'}</p>
                      <p>Length: {length} feet</p>
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
                Volume Calculation Guide
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="font-semibold">Formula</h4>
                  <p className="text-gray-600">
                    Volume = π × r² × L
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Where r = radius (diameter ÷ 2), L = length
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold">Conversions</h4>
                  <ul className="text-gray-600 space-y-1">
                    <li>• 1 cubic foot = 7.48 gallons</li>
                    <li>• 1 gallon = 3.785 liters</li>
                    <li>• 1 inch = 0.0833 feet</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold">Common Applications</h4>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Water system sizing</li>
                    <li>• Chemical treatment dosing</li>
                    <li>• Drain down calculations</li>
                    <li>• System fill time estimates</li>
                    <li>• Thermal expansion calculations</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold">Standard Pipe Sizes</h4>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Residential: 1/2" to 1"</li>
                    <li>• Commercial: 1" to 4"</li>
                    <li>• Industrial: 4" to 12"+</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <ShareButtons 
            title="Pipe Volume Calculator - Calculate Water Volume in Pipes"
            description="Free pipe volume calculator for plumbing systems. Calculate water volume in gallons and liters for any pipe size."
          />
        </div>
      </div>

      <UsageGuide
        title="Pipe Volume Calculator"
        description="Calculate the volume of water or fluid contained within pipes for system sizing, chemical dosing, and capacity planning."
        examples={[
          {
            title: "Water System Sizing",
            description: "Calculate total water volume in distribution systems for proper pump and tank sizing"
          },
          {
            title: "Chemical Treatment",
            description: "Determine pipe volume for accurate chemical dosing and treatment calculations"
          },
          {
            title: "Drain Down Planning",
            description: "Calculate volume to drain for maintenance or freeze protection procedures"
          }
        ]}
        tips={[
          "Use inside diameter for accurate volume calculations",
          "Add volumes of multiple pipe sections for total system capacity",
          "Consider fittings and valves that add to total volume",
          "Account for pipe wall thickness when measuring"
        ]}
        bestPractices={[
          "Measure actual pipe inside diameter when possible",
          "Include all system components in total volume calculations",
          "Consider temperature effects on fluid density",
          "Use calculations for system commissioning and maintenance planning"
        ]}
      />
    </div>
  );
}