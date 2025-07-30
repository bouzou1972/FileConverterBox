import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Square, Calculator, Info } from 'lucide-react';
import { ToolSEO } from '@/components/tool-seo';
import { ShareButtons } from '@/components/share-buttons';
import { UsageGuide } from '@/components/usage-guide';

export default function AreaVolumeCalculator() {
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [shape, setShape] = useState('rectangle');
  const [units, setUnits] = useState('feet');
  const [result, setResult] = useState<{area: number, volume?: number, perimeter?: number} | null>(null);
  const [error, setError] = useState('');

  const calculateAreaVolume = () => {
    const l = parseFloat(length);
    const w = parseFloat(width);
    const h = height ? parseFloat(height) : null;
    
    if (!l || l <= 0 || (shape !== 'circle' && (!w || w <= 0))) {
      setError('Please enter valid positive values');
      setResult(null);
      return;
    }

    let area: number;
    let perimeter: number;

    switch (shape) {
      case 'rectangle':
        if (!w) return;
        area = l * w;
        perimeter = 2 * (l + w);
        break;
      case 'square':
        area = l * l;
        perimeter = 4 * l;
        break;
      case 'circle':
        // Length is treated as diameter
        const radius = l / 2;
        area = Math.PI * radius * radius;
        perimeter = Math.PI * l; // circumference
        break;
      case 'triangle':
        if (!w) return;
        area = (l * w) / 2;
        // For perimeter, we'd need all three sides, so we'll calculate for a right triangle
        const hypotenuse = Math.sqrt(l * l + w * w);
        perimeter = l + w + hypotenuse;
        break;
      default:
        area = l * w;
        perimeter = 2 * (l + w);
    }

    const volume = h ? area * h : undefined;

    setResult({ area, volume, perimeter });
    setError('');
  };

  const clearCalculation = () => {
    setLength('');
    setWidth('');
    setHeight('');
    setShape('rectangle');
    setUnits('feet');
    setResult(null);
    setError('');
  };

  const copyResult = () => {
    if (result) {
      const areaText = `Area: ${result.area.toFixed(2)} ${units}²`;
      const volumeText = result.volume ? ` | Volume: ${result.volume.toFixed(2)} ${units}³` : '';
      const perimeterText = result.perimeter ? ` | Perimeter: ${result.perimeter.toFixed(2)} ${units}` : '';
      navigator.clipboard.writeText(areaText + volumeText + perimeterText);
    }
  };

  const getInputLabels = () => {
    switch (shape) {
      case 'rectangle':
        return { first: 'Length', second: 'Width' };
      case 'square':
        return { first: 'Side Length', second: null };
      case 'circle':
        return { first: 'Diameter', second: null };
      case 'triangle':
        return { first: 'Base', second: 'Height' };
      default:
        return { first: 'Length', second: 'Width' };
    }
  };

  const labels = getInputLabels();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <ToolSEO
        title="Area & Volume Calculator - Calculate Square Footage and Cubic Measurements"
        description="Free area and volume calculator for construction and field work. Calculate square footage, cubic feet, perimeter for rectangles, squares, circles, and triangles."
        keywords={["area calculator", "square footage", "volume calculator", "cubic feet", "construction calculator", "floor area", "room calculator", "perimeter calculator"]}
        canonicalUrl="/area-volume-calculator"
      />

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Area & Volume Calculator</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Calculate area, volume, and perimeter for common shapes. Perfect for construction, 
          flooring, painting, and material estimation projects.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Square className="w-5 h-5 text-green-600" />
              Measurement Input
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Shape</Label>
                <select 
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={shape}
                  onChange={(e) => setShape(e.target.value)}
                >
                  <option value="rectangle">Rectangle</option>
                  <option value="square">Square</option>
                  <option value="circle">Circle</option>
                  <option value="triangle">Triangle</option>
                </select>
              </div>
              <div>
                <Label>Units</Label>
                <select 
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={units}
                  onChange={(e) => setUnits(e.target.value)}
                >
                  <option value="feet">Feet</option>
                  <option value="inches">Inches</option>
                  <option value="meters">Meters</option>
                  <option value="yards">Yards</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="length">{labels.first} ({units})</Label>
                <Input
                  id="length"
                  type="number"
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                  placeholder="e.g., 12"
                  step="0.1"
                />
              </div>
              {labels.second && (
                <div>
                  <Label htmlFor="width">{labels.second} ({units})</Label>
                  <Input
                    id="width"
                    type="number"
                    value={width}
                    onChange={(e) => setWidth(e.target.value)}
                    placeholder="e.g., 10"
                    step="0.1"
                  />
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="height">Height ({units}) - Optional for Volume</Label>
              <Input
                id="height"
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="e.g., 8"
                step="0.1"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={calculateAreaVolume} className="flex-1">
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

            {result && (
              <Card className="bg-green-50 border-green-200">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <h3 className="font-semibold text-lg mb-4">Calculation Results</h3>
                    
                    <div className="space-y-3">
                      <div>
                        <p className="text-2xl font-bold text-green-700">
                          {result.area.toFixed(2)} {units}²
                        </p>
                        <p className="text-sm text-gray-600">Area</p>
                      </div>
                      
                      {result.volume && (
                        <div>
                          <p className="text-xl font-semibold text-green-600">
                            {result.volume.toFixed(2)} {units}³
                          </p>
                          <p className="text-sm text-gray-600">Volume</p>
                        </div>
                      )}

                      {result.perimeter && (
                        <div>
                          <p className="text-lg font-semibold text-green-600">
                            {result.perimeter.toFixed(2)} {units}
                          </p>
                          <p className="text-sm text-gray-600">
                            {shape === 'circle' ? 'Circumference' : 'Perimeter'}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="text-sm mt-4 space-y-1">
                      <p>Shape: {shape.charAt(0).toUpperCase() + shape.slice(1)}</p>
                      <p>{labels.first}: {length} {units}</p>
                      {labels.second && <p>{labels.second}: {width} {units}</p>}
                      {height && <p>Height: {height} {units}</p>}
                    </div>

                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={copyResult}
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
                Calculation Formulas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="font-semibold">Area Formulas</h4>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Rectangle: Length × Width</li>
                    <li>• Square: Side × Side</li>
                    <li>• Circle: π × (Diameter ÷ 2)²</li>
                    <li>• Triangle: (Base × Height) ÷ 2</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold">Volume Formula</h4>
                  <p className="text-gray-600">Volume = Area × Height</p>
                </div>

                <div>
                  <h4 className="font-semibold">Common Applications</h4>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Flooring material estimation</li>
                    <li>• Paint coverage calculations</li>
                    <li>• Concrete volume requirements</li>
                    <li>• Room capacity planning</li>
                    <li>• Landscaping area calculations</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold">Unit Conversions</h4>
                  <ul className="text-gray-600 space-y-1">
                    <li>• 1 square foot = 144 square inches</li>
                    <li>• 1 square yard = 9 square feet</li>
                    <li>• 1 square meter = 10.76 square feet</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <ShareButtons 
            title="Area & Volume Calculator - Construction Measurement Tool"
            description="Free area and volume calculator for construction projects. Calculate square footage, cubic measurements, and perimeter."
          />
        </div>
      </div>

      <UsageGuide
        title="Area & Volume Calculator"
        description="Calculate area, volume, and perimeter measurements for construction, renovation, and material estimation projects."
        examples={[
          {
            title: "Flooring Estimation",
            description: "Calculate room square footage to determine flooring material requirements"
          },
          {
            title: "Paint Coverage",
            description: "Use area calculations to estimate paint quantities for walls and surfaces"
          },
          {
            title: "Material Volume",
            description: "Calculate cubic volume for concrete, soil, or other bulk materials"
          }
        ]}
        tips={[
          "Add 10% extra for material waste and cuts",
          "Measure twice to ensure accurate calculations",
          "Consider shape complexity when measuring irregular areas",
          "Use consistent units throughout your project"
        ]}
        bestPractices={[
          "Break complex shapes into simpler geometric forms",
          "Account for doorways and windows in wall area calculations",
          "Include perimeter calculations for trim and molding estimates",
          "Keep measurements and calculations documented for future reference"
        ]}
      />
    </div>
  );
}