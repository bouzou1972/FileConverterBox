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

export default function HVACTonnageCalculator() {
  const [squareFootage, setSquareFootage] = useState('');
  const [ceilingHeight, setCeilingHeight] = useState('8');
  const [insulation, setInsulation] = useState('average');
  const [windowArea, setWindowArea] = useState('');
  const [occupants, setOccupants] = useState('2');
  const [climate, setClimate] = useState('moderate');
  const [sunExposure, setSunExposure] = useState('average');
  const [appliances, setAppliances] = useState('average');
  const [result, setResult] = useState<{tonnage: number, btu: number, details: any} | null>(null);
  const [error, setError] = useState('');

  const calculateTonnage = () => {
    const sqft = parseFloat(squareFootage);
    const height = parseFloat(ceilingHeight);
    const windows = parseFloat(windowArea) || 0;
    const people = parseFloat(occupants);
    
    if (!sqft || sqft <= 0) {
      setError('Please enter valid square footage');
      setResult(null);
      return;
    }

    // Base BTU calculation (25 BTU per sq ft for moderate climate)
    let baseBTU = sqft * 25;

    // Climate adjustments
    const climateMultipliers = {
      hot: 1.3,      // Hot climates need 30% more
      warm: 1.15,    // Warm climates need 15% more
      moderate: 1.0, // Baseline
      cool: 0.85     // Cool climates need 15% less
    };

    // Insulation adjustments
    const insulationMultipliers = {
      poor: 1.25,    // Poor insulation needs 25% more
      average: 1.0,  // Baseline
      good: 0.85,    // Good insulation needs 15% less
      excellent: 0.75 // Excellent insulation needs 25% less
    };

    // Sun exposure adjustments
    const sunMultipliers = {
      high: 1.15,    // High sun exposure needs 15% more
      average: 1.0,  // Baseline
      low: 0.9       // Low sun exposure needs 10% less
    };

    // Appliance load adjustments
    const applianceMultipliers = {
      high: 1.2,     // High appliance load needs 20% more
      average: 1.0,  // Baseline
      low: 0.9       // Low appliance load needs 10% less
    };

    // Apply multipliers
    let adjustedBTU = baseBTU * 
      climateMultipliers[climate as keyof typeof climateMultipliers] *
      insulationMultipliers[insulation as keyof typeof insulationMultipliers] *
      sunMultipliers[sunExposure as keyof typeof sunMultipliers] *
      applianceMultipliers[appliances as keyof typeof applianceMultipliers];

    // Ceiling height adjustment (standard is 8ft)
    if (height > 8) {
      adjustedBTU *= (height / 8);
    }

    // Window area adjustment (add 1000 BTU per 100 sq ft of windows)
    if (windows > 0) {
      adjustedBTU += (windows / 100) * 1000;
    }

    // Occupant adjustment (add 600 BTU per person beyond 2)
    if (people > 2) {
      adjustedBTU += (people - 2) * 600;
    }

    // Convert BTU to tonnage (12,000 BTU = 1 ton)
    const tonnage = adjustedBTU / 12000;

    const details = {
      baseBTUperSqFt: 25,
      climateAdjustment: climateMultipliers[climate as keyof typeof climateMultipliers],
      insulationAdjustment: insulationMultipliers[insulation as keyof typeof insulationMultipliers],
      sunAdjustment: sunMultipliers[sunExposure as keyof typeof sunMultipliers],
      applianceAdjustment: applianceMultipliers[appliances as keyof typeof applianceMultipliers],
      ceilingAdjustment: height > 8 ? (height / 8) : 1,
      windowBTU: windows > 0 ? (windows / 100) * 1000 : 0,
      occupantBTU: people > 2 ? (people - 2) * 600 : 0
    };

    setResult({
      tonnage: Math.round(tonnage * 4) / 4, // Round to nearest quarter ton
      btu: Math.round(adjustedBTU),
      details
    });
    setError('');
  };

  const clearCalculation = () => {
    setSquareFootage('');
    setCeilingHeight('8');
    setInsulation('average');
    setWindowArea('');
    setOccupants('2');
    setClimate('moderate');
    setSunExposure('average');
    setAppliances('average');
    setResult(null);
    setError('');
  };

  const copyResult = () => {
    if (result) {
      navigator.clipboard.writeText(
        `HVAC Tonnage: ${result.tonnage} tons (${result.btu.toLocaleString()} BTU) for ${squareFootage} sq ft`
      );
    }
  };

  const getRecommendedSizes = (tonnage: number) => {
    const sizes = [];
    const baseTon = Math.floor(tonnage);
    const fraction = tonnage - baseTon;
    
    if (fraction <= 0.25) {
      sizes.push(`${baseTon} ton`, `${baseTon + 0.5} ton`);
    } else if (fraction <= 0.75) {
      sizes.push(`${baseTon + 0.5} ton`, `${baseTon + 1} ton`);
    } else {
      sizes.push(`${baseTon + 1} ton`, `${baseTon + 1.5} ton`);
    }
    
    return sizes;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <ToolSEO
        title="HVAC Tonnage Calculator - Air Conditioning Unit Size Calculator"
        description="Free HVAC tonnage calculator for proper AC unit sizing. Calculate required cooling capacity in tons and BTU based on square footage, insulation, climate, and other factors."
        keywords={["HVAC tonnage calculator", "AC unit size calculator", "air conditioning sizing", "BTU calculator", "cooling load calculator", "HVAC sizing", "tonnage calculation"]}
        canonicalUrl="/hvac-tonnage-calculator"
      />

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">HVAC Tonnage Calculator</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Calculate the proper air conditioning unit size needed for your space. Considers square footage, 
          insulation, climate, windows, and other factors for accurate HVAC sizing.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Thermometer className="w-5 h-5 text-blue-600" />
              Space & Environmental Factors
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="squareFootage">Square Footage</Label>
                <Input
                  id="squareFootage"
                  type="number"
                  value={squareFootage}
                  onChange={(e) => setSquareFootage(e.target.value)}
                  placeholder="e.g., 1500"
                  min="0"
                />
              </div>
              <div>
                <Label htmlFor="ceilingHeight">Ceiling Height (ft)</Label>
                <Input
                  id="ceilingHeight"
                  type="number"
                  value={ceilingHeight}
                  onChange={(e) => setCeilingHeight(e.target.value)}
                  placeholder="8"
                  min="6"
                  max="20"
                  step="0.5"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="windowArea">Window Area (sq ft)</Label>
                <Input
                  id="windowArea"
                  type="number"
                  value={windowArea}
                  onChange={(e) => setWindowArea(e.target.value)}
                  placeholder="Optional"
                  min="0"
                />
              </div>
              <div>
                <Label htmlFor="occupants">Number of Occupants</Label>
                <Input
                  id="occupants"
                  type="number"
                  value={occupants}
                  onChange={(e) => setOccupants(e.target.value)}
                  placeholder="2"
                  min="1"
                  max="20"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="climate">Climate Zone</Label>
                <select 
                  id="climate"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={climate}
                  onChange={(e) => setClimate(e.target.value)}
                >
                  <option value="cool">Cool (Northern regions)</option>
                  <option value="moderate">Moderate (Most of US)</option>
                  <option value="warm">Warm (Southern regions)</option>
                  <option value="hot">Hot (Desert/Tropical)</option>
                </select>
              </div>
              <div>
                <Label htmlFor="insulation">Insulation Quality</Label>
                <select 
                  id="insulation"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={insulation}
                  onChange={(e) => setInsulation(e.target.value)}
                >
                  <option value="poor">Poor (Old building)</option>
                  <option value="average">Average (Standard)</option>
                  <option value="good">Good (Well insulated)</option>
                  <option value="excellent">Excellent (New/Energy efficient)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sunExposure">Sun Exposure</Label>
                <select 
                  id="sunExposure"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={sunExposure}
                  onChange={(e) => setSunExposure(e.target.value)}
                >
                  <option value="low">Low (Shaded/North facing)</option>
                  <option value="average">Average (Mixed exposure)</option>
                  <option value="high">High (South/West facing)</option>
                </select>
              </div>
              <div>
                <Label htmlFor="appliances">Heat-Generating Appliances</Label>
                <select 
                  id="appliances"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={appliances}
                  onChange={(e) => setAppliances(e.target.value)}
                >
                  <option value="low">Low (Minimal appliances)</option>
                  <option value="average">Average (Normal use)</option>
                  <option value="high">High (Kitchen/Many appliances)</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={calculateTonnage} className="flex-1">
                <Calculator className="w-4 h-4 mr-2" />
                Calculate Tonnage
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
                    <h3 className="font-semibold text-lg mb-4">Recommended HVAC Size</h3>
                    
                    <div className="space-y-3">
                      <div>
                        <p className="text-3xl font-bold text-blue-700">
                          {result.tonnage} Tons
                        </p>
                        <p className="text-xl font-semibold text-blue-600">
                          {result.btu.toLocaleString()} BTU/hr
                        </p>
                      </div>
                      
                      <div className="bg-white rounded-lg p-4 mt-4">
                        <h4 className="font-semibold text-sm mb-2">Standard Unit Sizes</h4>
                        <div className="flex justify-center gap-2">
                          {getRecommendedSizes(result.tonnage).map((size, index) => (
                            <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                              {size}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="text-sm mt-4 space-y-1 text-left">
                      <p><strong>Space:</strong> {squareFootage} sq ft</p>
                      <p><strong>Climate:</strong> {climate.charAt(0).toUpperCase() + climate.slice(1)}</p>
                      <p><strong>Insulation:</strong> {insulation.charAt(0).toUpperCase() + insulation.slice(1)}</p>
                      {parseFloat(windowArea) > 0 && <p><strong>Windows:</strong> {windowArea} sq ft</p>}
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
                HVAC Sizing Guidelines
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="font-semibold">Rule of Thumb</h4>
                  <p className="text-gray-600">Generally 20-25 BTU per square foot for moderate climates, but many factors affect this.</p>
                </div>
                
                <div>
                  <h4 className="font-semibold">Standard Unit Sizes</h4>
                  <ul className="text-gray-600 space-y-1">
                    <li>• 1.5 ton = 18,000 BTU</li>
                    <li>• 2 ton = 24,000 BTU</li>
                    <li>• 2.5 ton = 30,000 BTU</li>
                    <li>• 3 ton = 36,000 BTU</li>
                    <li>• 3.5 ton = 42,000 BTU</li>
                    <li>• 4 ton = 48,000 BTU</li>
                    <li>• 5 ton = 60,000 BTU</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold">Important Factors</h4>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Proper insulation reduces cooling needs</li>
                    <li>• High ceilings require more capacity</li>
                    <li>• South/west facing windows add heat load</li>
                    <li>• More occupants = more cooling needed</li>
                    <li>• Kitchen appliances add significant heat</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold">Sizing Warnings</h4>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Oversized units cycle too frequently</li>
                    <li>• Undersized units run constantly</li>
                    <li>• Both reduce efficiency and comfort</li>
                    <li>• Consider Manual J calculation for precision</li>
                  </ul>
                </div>

                <Alert>
                  <AlertDescription className="text-xs">
                    This calculator provides estimates. For critical applications, consult an HVAC professional and consider a full Manual J load calculation.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>

          <ShareButtons 
            title="HVAC Tonnage Calculator - AC Unit Sizing Tool"
            description="Free HVAC tonnage calculator for proper air conditioning unit sizing. Calculate cooling capacity in tons and BTU."
          />
        </div>
      </div>

      <UsageGuide
        title="HVAC Tonnage Calculator"
        description="Calculate the proper air conditioning unit size needed for optimal cooling efficiency and comfort in residential and commercial spaces."
        examples={[
          {
            title: "Residential Home Sizing",
            description: "Calculate AC tonnage for a home considering insulation, windows, and local climate conditions"
          },
          {
            title: "Commercial Space Planning",
            description: "Determine cooling requirements for office spaces with high occupancy and equipment loads"
          },
          {
            title: "HVAC System Replacement",
            description: "Size replacement units when upgrading old HVAC systems or improving insulation"
          }
        ]}
        tips={[
          "Enter accurate square footage including all conditioned spaces",
          "Consider window orientation and shading when selecting sun exposure",
          "Account for heat-generating appliances like ovens and servers",
          "Choose climate zone based on local summer temperatures"
        ]}
        bestPractices={[
          "Never undersize - it's better to go slightly larger than too small",
          "Consider Manual J calculation for new construction or major renovations",
          "Factor in future additions or changes to the space",
          "Consult local HVAC professionals for final sizing verification"
        ]}
      />
    </div>
  );
}