import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Gauge, Calculator, Info, Plus, X } from 'lucide-react';
import { ToolSEO } from '@/components/tool-seo';
import { ShareButtons } from '@/components/share-buttons';
import { UsageGuide } from '@/components/usage-guide';

interface PressureComponent {
  id: number;
  name: string;
  value: string;
}

export default function StaticPressureCalculator() {
  const [components, setComponents] = useState<PressureComponent[]>([
    { id: 1, name: 'Filter', value: '' },
    { id: 2, name: 'Heat Exchanger', value: '' }
  ]);
  const [totalPressure, setTotalPressure] = useState<number | null>(null);
  const [error, setError] = useState('');

  const addComponent = () => {
    const newId = Math.max(...components.map(c => c.id)) + 1;
    setComponents([...components, { id: newId, name: '', value: '' }]);
  };

  const removeComponent = (id: number) => {
    if (components.length > 1) {
      setComponents(components.filter(c => c.id !== id));
    }
  };

  const updateComponent = (id: number, field: 'name' | 'value', newValue: string) => {
    setComponents(components.map(c => 
      c.id === id ? { ...c, [field]: newValue } : c
    ));
  };

  const calculateStaticPressure = () => {
    const validComponents = components.filter(c => c.value && !isNaN(parseFloat(c.value)));
    
    if (validComponents.length === 0) {
      setError('Please enter at least one pressure drop value');
      setTotalPressure(null);
      return;
    }

    const total = validComponents.reduce((sum, component) => {
      return sum + parseFloat(component.value);
    }, 0);

    setTotalPressure(total);
    setError('');
  };

  const clearCalculation = () => {
    setComponents([
      { id: 1, name: 'Filter', value: '' },
      { id: 2, name: 'Heat Exchanger', value: '' }
    ]);
    setTotalPressure(null);
    setError('');
  };

  const copyResult = () => {
    if (totalPressure !== null) {
      const componentList = components
        .filter(c => c.value && !isNaN(parseFloat(c.value)))
        .map(c => `${c.name || 'Component'}: ${c.value}"`)
        .join(' | ');
      navigator.clipboard.writeText(
        `Static Pressure Components: ${componentList} | Total: ${totalPressure.toFixed(2)}" W.C.`
      );
    }
  };

  const commonComponents = [
    { name: 'Filter (1" pleated)', value: '0.15' },
    { name: 'Filter (2" pleated)', value: '0.10' },
    { name: 'Heat Exchanger', value: '0.20' },
    { name: 'Cooling Coil', value: '0.25' },
    { name: 'Damper (fully open)', value: '0.05' },
    { name: 'Ductwork (per 100ft)', value: '0.08' },
    { name: '90° Elbow', value: '0.15' },
    { name: 'Diffuser/Grille', value: '0.03' }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <ToolSEO
        title="Static Pressure Calculator - HVAC System Pressure Drop Calculator"
        description="Free static pressure calculator for HVAC systems. Calculate total system static pressure by adding pressure drops across filters, coils, ductwork, and other components."
        keywords={["static pressure calculator", "HVAC pressure drop", "system static pressure", "pressure loss calculator", "HVAC design", "fan selection", "ductwork pressure"]}
        canonicalUrl="/static-pressure-calculator"
      />

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Static Pressure Calculator</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Calculate total static pressure for HVAC systems by adding pressure drops across 
          filters, coils, ductwork, and other system components.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gauge className="w-5 h-5 text-blue-600" />
              System Components
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {components.map((component, index) => (
                <div key={component.id} className="flex gap-2 items-center">
                  <div className="flex-1">
                    <Input
                      placeholder="Component name"
                      value={component.name}
                      onChange={(e) => updateComponent(component.id, 'name', e.target.value)}
                    />
                  </div>
                  <div className="w-24">
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={component.value}
                      onChange={(e) => updateComponent(component.id, 'value', e.target.value)}
                      step="0.01"
                    />
                  </div>
                  <span className="text-sm text-gray-500 w-12">" W.C.</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeComponent(component.id)}
                    disabled={components.length === 1}
                    className="p-2"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            <Button
              variant="outline"
              onClick={addComponent}
              className="w-full flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Component
            </Button>

            <div>
              <Label className="text-sm font-medium mb-2 block">Quick Add Common Components</Label>
              <div className="grid grid-cols-1 gap-2">
                {commonComponents.map((preset, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newId = Math.max(...components.map(c => c.id)) + 1;
                      setComponents([...components, { 
                        id: newId, 
                        name: preset.name, 
                        value: preset.value 
                      }]);
                    }}
                    className="text-xs justify-between h-auto p-2"
                  >
                    <span>{preset.name}</span>
                    <span className="text-gray-500">{preset.value}" W.C.</span>
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={calculateStaticPressure} className="flex-1">
                <Calculator className="w-4 h-4 mr-2" />
                Calculate Total Pressure
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

            {totalPressure !== null && (
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <h3 className="font-semibold text-lg mb-2">Total Static Pressure</h3>
                    <p className="text-3xl font-bold text-blue-700 mb-4">
                      {totalPressure.toFixed(2)}" W.C.
                    </p>
                    
                    <div className="text-sm space-y-1 mb-4">
                      <h4 className="font-medium">Component Breakdown:</h4>
                      {components
                        .filter(c => c.value && !isNaN(parseFloat(c.value)))
                        .map((component, index) => (
                          <div key={index} className="flex justify-between">
                            <span>{component.name || `Component ${index + 1}`}:</span>
                            <span>{parseFloat(component.value).toFixed(2)}" W.C.</span>
                          </div>
                        ))}
                    </div>

                    {totalPressure > 1.0 && (
                      <Alert className="text-left mb-4">
                        <Info className="w-4 h-4" />
                        <AlertDescription>
                          High static pressure ({totalPressure.toFixed(2)}" W.C.) - Consider higher capacity fan or system redesign
                        </AlertDescription>
                      </Alert>
                    )}

                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={copyResult}
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
                Static Pressure Guidelines
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="font-semibold">Typical System Pressures</h4>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Residential: 0.5 - 0.8" W.C.</li>
                    <li>• Light Commercial: 0.8 - 1.5" W.C.</li>
                    <li>• Heavy Commercial: 1.5 - 3.0" W.C.</li>
                    <li>• Industrial: 3.0+" W.C.</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold">Common Pressure Drops</h4>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Clean filter: 0.10 - 0.15" W.C.</li>
                    <li>• Dirty filter: 0.25 - 0.50" W.C.</li>
                    <li>• Cooling coil: 0.20 - 0.30" W.C.</li>
                    <li>• Heat exchanger: 0.15 - 0.25" W.C.</li>
                    <li>• Ductwork: 0.08" per 100 ft</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold">Fan Selection Tips</h4>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Select fan for calculated static pressure</li>
                    <li>• Add 10-20% safety margin</li>
                    <li>• Higher pressure = more energy consumption</li>
                    <li>• Consider variable speed drives</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold">Units</h4>
                  <p className="text-gray-600 text-xs">
                    " W.C. = inches of water column<br/>
                    1" W.C. = 249 Pa = 0.036 PSI
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <ShareButtons 
            title="Static Pressure Calculator - HVAC System Pressure Calculator"
            description="Free static pressure calculator for HVAC systems. Calculate total system pressure drops for proper fan selection and system design."
          />
        </div>
      </div>

      <UsageGuide
        title="Static Pressure Calculator"
        description="Calculate total static pressure for HVAC systems by summing pressure drops across all system components for proper fan selection."
        examples={[
          {
            title: "Basic System Calculation",
            description: "Add pressure drops for filters, coils, and ductwork to calculate total system static pressure"
          },
          {
            title: "Component Analysis",
            description: "Use quick-add buttons for common components or enter custom values for specific equipment"
          },
          {
            title: "Fan Selection",
            description: "Use calculated total pressure to select appropriate fan capacity and speed"
          }
        ]}
        tips={[
          "Include all system components for accurate pressure calculations",
          "Account for dirty filter conditions in residential applications",
          "Add 10-20% safety margin for fan selection",
          "Higher static pressure increases energy consumption"
        ]}
        bestPractices={[
          "Measure actual pressures during commissioning",
          "Document all system components and their pressure drops",
          "Consider pressure drops of dampers and diffusers",
          "Design for filter replacement intervals and dirt loading"
        ]}
      />
    </div>
  );
}