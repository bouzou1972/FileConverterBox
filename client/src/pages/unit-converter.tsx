import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeftRight, Calculator, Info } from 'lucide-react';
import { ToolSEO } from '@/components/tool-seo';
import { ShareButtons } from '@/components/share-buttons';
import { UsageGuide } from '@/components/usage-guide';

export default function UnitConverter() {
  const [value, setValue] = useState('');
  const [fromUnit, setFromUnit] = useState('feet');
  const [toUnit, setToUnit] = useState('meters');
  const [category, setCategory] = useState('length');
  const [result, setResult] = useState<{value: number, fromUnit: string, toUnit: string, category: string} | null>(null);
  const [error, setError] = useState('');

  const conversions = {
    length: {
      feet: { meters: 0.3048, inches: 12, yards: 1/3, millimeters: 304.8, centimeters: 30.48 },
      meters: { feet: 3.28084, inches: 39.3701, yards: 1.09361, millimeters: 1000, centimeters: 100 },
      inches: { feet: 1/12, meters: 0.0254, yards: 1/36, millimeters: 25.4, centimeters: 2.54 },
      yards: { feet: 3, meters: 0.9144, inches: 36, millimeters: 914.4, centimeters: 91.44 },
      millimeters: { feet: 0.00328084, meters: 0.001, inches: 0.0393701, yards: 0.00109361, centimeters: 0.1 },
      centimeters: { feet: 0.0328084, meters: 0.01, inches: 0.393701, yards: 0.0109361, millimeters: 10 }
    },
    area: {
      'square feet': { 'square meters': 0.092903, 'square inches': 144, 'square yards': 1/9 },
      'square meters': { 'square feet': 10.7639, 'square inches': 1550, 'square yards': 1.19599 },
      'square inches': { 'square feet': 1/144, 'square meters': 0.00064516, 'square yards': 1/1296 },
      'square yards': { 'square feet': 9, 'square meters': 0.836127, 'square inches': 1296 }
    },
    volume: {
      gallons: { liters: 3.78541, 'cubic feet': 0.133681, quarts: 4, pints: 8 },
      liters: { gallons: 0.264172, 'cubic feet': 0.0353147, quarts: 1.05669, pints: 2.11338 },
      'cubic feet': { gallons: 7.48052, liters: 28.3168, quarts: 29.9221, pints: 59.8442 },
      quarts: { gallons: 0.25, liters: 0.946353, 'cubic feet': 0.0334201, pints: 2 },
      pints: { gallons: 0.125, liters: 0.473176, 'cubic feet': 0.0167101, quarts: 0.5 }
    },
    temperature: {
      fahrenheit: { celsius: (f: number) => (f - 32) * 5/9, kelvin: (f: number) => (f - 32) * 5/9 + 273.15 },
      celsius: { fahrenheit: (c: number) => c * 9/5 + 32, kelvin: (c: number) => c + 273.15 },
      kelvin: { fahrenheit: (k: number) => (k - 273.15) * 9/5 + 32, celsius: (k: number) => k - 273.15 }
    },
    pressure: {
      psi: { bar: 0.0689476, kpa: 6.89476, 'inches Hg': 2.036 },
      bar: { psi: 14.5038, kpa: 100, 'inches Hg': 29.53 },
      kpa: { psi: 0.145038, bar: 0.01, 'inches Hg': 0.2953 },
      'inches Hg': { psi: 0.491154, bar: 0.0338639, kpa: 3.38639 }
    }
  };

  const getUnitsForCategory = (cat: string) => {
    return Object.keys(conversions[cat as keyof typeof conversions]);
  };

  const convertUnits = () => {
    const inputValue = parseFloat(value);
    
    if (!inputValue || inputValue < 0) {
      setError('Please enter a valid positive number');
      setResult(null);
      return;
    }

    if (fromUnit === toUnit) {
      setResult({
        value: inputValue,
        fromUnit,
        toUnit,
        category
      });
      setError('');
      return;
    }

    let convertedValue: number;
    const categoryData = conversions[category as keyof typeof conversions];
    
    if (category === 'temperature') {
      const tempConversions = categoryData as any;
      convertedValue = tempConversions[fromUnit][toUnit](inputValue);
    } else {
      const unitData = categoryData as any;
      convertedValue = inputValue * unitData[fromUnit][toUnit];
    }

    setResult({
      value: convertedValue,
      fromUnit,
      toUnit,
      category
    });
    setError('');
  };

  const swapUnits = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  };

  const clearCalculation = () => {
    setValue('');
    setResult(null);
    setError('');
  };

  const copyResult = () => {
    if (result) {
      navigator.clipboard.writeText(
        `${value} ${result.fromUnit} = ${result.value.toFixed(4)} ${result.toUnit}`
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <ToolSEO
        title="Unit Converter - Convert Length, Area, Volume, Temperature & Pressure"
        description="Free unit converter for field technicians. Convert between feet/meters, gallons/liters, Fahrenheit/Celsius, PSI/bar and more measurement units instantly."
        keywords={["unit converter", "measurement converter", "feet to meters", "celsius fahrenheit", "psi bar converter", "gallon liter", "construction converter"]}
        canonicalUrl="/unit-converter"
      />

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Unit Converter</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Convert between common measurement units used in construction, HVAC, plumbing, and electrical work. 
          Supports length, area, volume, temperature, and pressure conversions.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowLeftRight className="w-5 h-5 text-green-600" />
              Unit Conversion
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="category">Measurement Category</Label>
              <select 
                id="category"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  const units = getUnitsForCategory(e.target.value);
                  setFromUnit(units[0]);
                  setToUnit(units[1]);
                }}
              >
                <option value="length">Length</option>
                <option value="area">Area</option>
                <option value="volume">Volume</option>
                <option value="temperature">Temperature</option>
                <option value="pressure">Pressure</option>
              </select>
            </div>

            <div>
              <Label htmlFor="value">Value to Convert</Label>
              <Input
                id="value"
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Enter value"
                step="0.0001"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fromUnit">From</Label>
                <select 
                  id="fromUnit"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={fromUnit}
                  onChange={(e) => setFromUnit(e.target.value)}
                >
                  {getUnitsForCategory(category).map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="toUnit">To</Label>
                <select 
                  id="toUnit"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={toUnit}
                  onChange={(e) => setToUnit(e.target.value)}
                >
                  {getUnitsForCategory(category).map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={convertUnits} className="flex-1">
                <Calculator className="w-4 h-4 mr-2" />
                Convert
              </Button>
              <Button variant="outline" onClick={swapUnits}>
                <ArrowLeftRight className="w-4 h-4" />
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
                    <h3 className="font-semibold text-lg mb-4">Conversion Result</h3>
                    
                    <div className="space-y-2">
                      <p className="text-lg">
                        <span className="font-semibold">{value} {result.fromUnit}</span>
                      </p>
                      <p className="text-2xl font-bold text-green-700">
                        = {result.value.toFixed(4)} {result.toUnit}
                      </p>
                    </div>

                    <div className="text-sm mt-4 text-gray-600">
                      Category: {result.category.charAt(0).toUpperCase() + result.category.slice(1)}
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
                Common Conversions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="font-semibold">Length</h4>
                  <ul className="text-gray-600 space-y-1">
                    <li>• 1 foot = 0.3048 meters</li>
                    <li>• 1 inch = 2.54 centimeters</li>
                    <li>• 1 yard = 0.9144 meters</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold">Volume</h4>
                  <ul className="text-gray-600 space-y-1">
                    <li>• 1 gallon = 3.785 liters</li>
                    <li>• 1 cubic foot = 7.48 gallons</li>
                    <li>• 1 quart = 0.946 liters</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold">Temperature</h4>
                  <ul className="text-gray-600 space-y-1">
                    <li>• °C = (°F - 32) × 5/9</li>
                    <li>• °F = °C × 9/5 + 32</li>
                    <li>• K = °C + 273.15</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold">Pressure</h4>
                  <ul className="text-gray-600 space-y-1">
                    <li>• 1 PSI = 6.895 kPa</li>
                    <li>• 1 bar = 14.504 PSI</li>
                    <li>• 1 inch Hg = 0.491 PSI</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <ShareButtons 
            title="Unit Converter - Measurement Conversion Tool"
            description="Free unit converter for construction and field work. Convert length, volume, temperature, and pressure units instantly."
          />
        </div>
      </div>

      <UsageGuide
        title="Unit Converter"
        description="Convert between common measurement units used in construction, HVAC, plumbing, and electrical work for accurate project calculations."
        examples={[
          {
            title: "Construction Measurements",
            description: "Convert between feet and meters for international project specifications"
          },
          {
            title: "HVAC System Sizing",
            description: "Convert between gallons and liters for fluid system calculations"
          },
          {
            title: "Temperature Analysis",
            description: "Convert between Fahrenheit and Celsius for equipment specifications"
          }
        ]}
        tips={[
          "Use the swap button to quickly reverse conversion direction",
          "Results show 4 decimal places for precision",
          "Temperature conversions use exact formulas",
          "Copy results for use in other calculations"
        ]}
        bestPractices={[
          "Double-check units match your project requirements",
          "Use consistent units throughout calculations",
          "Round results appropriately for practical use",
          "Verify conversions with manufacturer specifications"
        ]}
      />
    </div>
  );
}