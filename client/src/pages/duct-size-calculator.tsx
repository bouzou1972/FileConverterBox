import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Wind, Calculator, Info } from 'lucide-react';
import { ToolSEO } from '@/components/tool-seo';
import { ShareButtons } from '@/components/share-buttons';
import { UsageGuide } from '@/components/usage-guide';

export default function DuctSizeCalculator() {
  const [cfm, setCfm] = useState('');
  const [velocity, setVelocity] = useState('800');
  const [ductShape, setDuctShape] = useState('round');
  const [result, setResult] = useState<{diameter?: number, width?: number, height?: number, area: number} | null>(null);
  const [error, setError] = useState('');

  const calculateDuctSize = () => {
    const airflow = parseFloat(cfm);
    const vel = parseFloat(velocity);
    
    if (!airflow || !vel || airflow <= 0 || vel <= 0) {
      setError('Please enter valid positive values for airflow and velocity');
      setResult(null);
      return;
    }

    // Area = CFM / Velocity (in ft²)
    const area = airflow / vel;
    
    if (ductShape === 'round') {
      // A = π × r² → r = √(A/π) → d = 2r
      const diameter = 2 * Math.sqrt(area / Math.PI) * 12; // Convert to inches
      setResult({ diameter, area });
    } else {
      // Rectangular duct - assume aspect ratio of 2:1 for optimal sizing
      // A = w × h, with h = w/2 → A = w × w/2 → w = √(2A)
      const width = Math.sqrt(2 * area) * 12; // Convert to inches
      const height = width / 2;
      setResult({ width, height, area });
    }
    
    setError('');
  };

  const clearCalculation = () => {
    setCfm('');
    setVelocity('800');
    setDuctShape('round');
    setResult(null);
    setError('');
  };

  const copyResult = () => {
    if (result) {
      const resultText = ductShape === 'round' 
        ? `CFM: ${cfm} | Velocity: ${velocity} ft/min | Round Duct Diameter: ${result.diameter?.toFixed(1)}" | Area: ${result.area.toFixed(2)} ft²`
        : `CFM: ${cfm} | Velocity: ${velocity} ft/min | Rectangular Duct: ${result.width?.toFixed(1)}" × ${result.height?.toFixed(1)}" | Area: ${result.area.toFixed(2)} ft²`;
      navigator.clipboard.writeText(resultText);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <ToolSEO
        title="Duct Size Calculator - HVAC Ductwork Sizing Tool"
        description="Free duct size calculator for HVAC systems. Calculate round and rectangular duct dimensions based on airflow (CFM) and velocity requirements for optimal system design."
        keywords={["duct size calculator", "HVAC ductwork", "duct sizing", "CFM calculator", "air velocity", "HVAC design", "ductwork calculator", "HVAC tools"]}
        canonicalUrl="/duct-size-calculator"
      />

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Duct Size Calculator</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Calculate optimal duct dimensions for HVAC systems based on airflow requirements and velocity. 
          Supports both round and rectangular ductwork sizing.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wind className="w-5 h-5 text-blue-600" />
              Duct Size Calculation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cfm">Airflow (CFM)</Label>
                <Input
                  id="cfm"
                  type="number"
                  value={cfm}
                  onChange={(e) => setCfm(e.target.value)}
                  placeholder="e.g., 1200"
                  min="0"
                />
              </div>
              <div>
                <Label htmlFor="velocity">Velocity (ft/min)</Label>
                <Input
                  id="velocity"
                  type="number"
                  value={velocity}
                  onChange={(e) => setVelocity(e.target.value)}
                  placeholder="800"
                  min="0"
                />
              </div>
            </div>

            <div>
              <Label>Duct Shape</Label>
              <div className="flex gap-4 mt-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="ductShape"
                    value="round"
                    checked={ductShape === 'round'}
                    onChange={(e) => setDuctShape(e.target.value)}
                    className="mr-2"
                  />
                  Round Duct
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="ductShape"
                    value="rectangular"
                    checked={ductShape === 'rectangular'}
                    onChange={(e) => setDuctShape(e.target.value)}
                    className="mr-2"
                  />
                  Rectangular Duct
                </label>
              </div>
            </div>

            <div>
              <Label>Common Velocities</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {[
                  { label: 'Supply Trunk', value: '800' },
                  { label: 'Supply Branch', value: '600' },
                  { label: 'Return Trunk', value: '800' },
                  { label: 'Return Branch', value: '600' }
                ].map((preset) => (
                  <Button
                    key={preset.label}
                    variant="outline"
                    size="sm"
                    onClick={() => setVelocity(preset.value)}
                    className="text-xs h-auto p-2"
                  >
                    {preset.label}: {preset.value} ft/min
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={calculateDuctSize} className="flex-1">
                <Calculator className="w-4 h-4 mr-2" />
                Calculate Duct Size
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
                    <h3 className="font-semibold text-lg mb-4">Recommended Duct Size</h3>
                    
                    {ductShape === 'round' ? (
                      <div className="space-y-2">
                        <p className="text-2xl font-bold text-blue-700">
                          {result.diameter?.toFixed(1)}" Diameter
                        </p>
                        <p className="text-sm text-gray-600">
                          Cross-sectional area: {result.area.toFixed(2)} ft²
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-2xl font-bold text-blue-700">
                          {result.width?.toFixed(1)}" × {result.height?.toFixed(1)}"
                        </p>
                        <p className="text-sm text-gray-600">
                          Cross-sectional area: {result.area.toFixed(2)} ft²
                        </p>
                      </div>
                    )}

                    <div className="text-sm mt-4 space-y-1">
                      <p>Airflow: {cfm} CFM</p>
                      <p>Velocity: {velocity} ft/min</p>
                    </div>

                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={copyResult}
                      className="mt-3"
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
                Duct Sizing Guidelines
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="font-semibold">Recommended Velocities</h4>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Supply Trunks: 800-1200 ft/min</li>
                    <li>• Supply Branches: 600-800 ft/min</li>
                    <li>• Return Trunks: 800-1000 ft/min</li>
                    <li>• Return Branches: 600-700 ft/min</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold">Formula</h4>
                  <p className="text-gray-600">
                    Area (ft²) = CFM ÷ Velocity (ft/min)
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Round: Diameter = 2 × √(Area ÷ π) × 12"
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold">Standard Duct Sizes (inches)</h4>
                  <div className="space-y-1 text-gray-600">
                    <div className="flex justify-between">
                      <span>Round:</span>
                      <span>4", 6", 8", 10", 12", 14", 16"</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rectangular:</span>
                      <span>8×4, 10×6, 12×8, 14×10</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <ShareButtons 
            title="Duct Size Calculator - HVAC Ductwork Sizing Tool"
            description="Free duct size calculator for HVAC systems. Calculate optimal duct dimensions based on airflow and velocity requirements."
          />
        </div>
      </div>

      <UsageGuide
        title="Duct Size Calculator"
        description="Calculate optimal duct dimensions for HVAC systems based on airflow requirements and air velocity specifications."
        examples={[
          {
            title: "Basic Duct Sizing",
            description: "Enter CFM airflow requirements and desired velocity to calculate duct dimensions"
          },
          {
            title: "Compare Round vs Rectangular",
            description: "Switch between round and rectangular duct shapes to compare sizing options"
          },
          {
            title: "Use Standard Velocities",
            description: "Click preset buttons for common HVAC velocity recommendations"
          }
        ]}
        tips={[
          "Lower velocities reduce noise but require larger ducts",
          "Higher velocities save space but increase pressure drop",
          "Round ducts are more efficient than rectangular for the same area",
          "Consider available space when choosing between round and rectangular"
        ]}
        bestPractices={[
          "Use standard duct sizes available from manufacturers",
          "Account for fittings and transitions in pressure calculations",
          "Verify calculations meet local building codes",
          "Consider noise levels in occupied spaces when selecting velocities"
        ]}
      />
    </div>
  );
}