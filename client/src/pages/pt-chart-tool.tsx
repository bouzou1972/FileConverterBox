import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Copy, Download, Thermometer, Gauge } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Common refrigerants with their PT data points
const refrigerantData = {
  "R-410A": [
    { temp: -40, pressure: 14.7 }, { temp: -30, pressure: 21.9 }, { temp: -20, pressure: 31.1 },
    { temp: -10, pressure: 42.7 }, { temp: 0, pressure: 57.2 }, { temp: 10, pressure: 75.1 },
    { temp: 20, pressure: 96.9 }, { temp: 30, pressure: 122.9 }, { temp: 40, pressure: 153.4 },
    { temp: 50, pressure: 189.0 }, { temp: 60, pressure: 230.0 }, { temp: 70, pressure: 277.2 },
    { temp: 80, pressure: 331.3 }, { temp: 90, pressure: 392.8 }, { temp: 100, pressure: 462.4 },
    { temp: 110, pressure: 540.8 }, { temp: 120, pressure: 628.7 }
  ],
  "R-32": [
    { temp: -40, pressure: 17.2 }, { temp: -30, pressure: 25.1 }, { temp: -20, pressure: 35.4 },
    { temp: -10, pressure: 48.6 }, { temp: 0, pressure: 65.2 }, { temp: 10, pressure: 85.9 },
    { temp: 20, pressure: 111.5 }, { temp: 30, pressure: 142.8 }, { temp: 40, pressure: 180.7 },
    { temp: 50, pressure: 226.2 }, { temp: 60, pressure: 280.4 }, { temp: 70, pressure: 344.3 },
    { temp: 80, pressure: 419.1 }, { temp: 90, pressure: 506.0 }, { temp: 100, pressure: 606.2 },
    { temp: 110, pressure: 720.9 }, { temp: 120, pressure: 851.4 }
  ],
  "R-22": [
    { temp: -40, pressure: 10.1 }, { temp: -30, pressure: 16.8 }, { temp: -20, pressure: 25.9 },
    { temp: -10, pressure: 37.7 }, { temp: 0, pressure: 52.5 }, { temp: 10, pressure: 70.9 },
    { temp: 20, pressure: 93.2 }, { temp: 30, pressure: 120.0 }, { temp: 40, pressure: 151.9 },
    { temp: 50, pressure: 189.5 }, { temp: 60, pressure: 233.4 }, { temp: 70, pressure: 284.1 },
    { temp: 80, pressure: 342.4 }, { temp: 90, pressure: 408.9 }, { temp: 100, pressure: 484.4 },
    { temp: 110, pressure: 569.6 }, { temp: 120, pressure: 665.4 }
  ],
  "R-134a": [
    { temp: -40, pressure: 7.4 }, { temp: -30, pressure: 12.9 }, { temp: -20, pressure: 21.0 },
    { temp: -10, pressure: 32.3 }, { temp: 0, pressure: 47.7 }, { temp: 10, pressure: 67.7 },
    { temp: 20, pressure: 93.2 }, { temp: 30, pressure: 124.4 }, { temp: 40, pressure: 162.2 },
    { temp: 50, pressure: 207.5 }, { temp: 60, pressure: 261.2 }, { temp: 70, pressure: 324.2 },
    { temp: 80, pressure: 397.3 }, { temp: 90, pressure: 481.4 }, { temp: 100, pressure: 577.5 },
    { temp: 110, pressure: 686.6 }, { temp: 120, pressure: 809.7 }
  ],
  "R-407C": [
    { temp: -40, pressure: 13.2 }, { temp: -30, pressure: 19.7 }, { temp: -20, pressure: 28.4 },
    { temp: -10, pressure: 39.8 }, { temp: 0, pressure: 54.3 }, { temp: 10, pressure: 72.4 },
    { temp: 20, pressure: 94.8 }, { temp: 30, pressure: 122.0 }, { temp: 40, pressure: 154.7 },
    { temp: 50, pressure: 193.5 }, { temp: 60, pressure: 239.1 }, { temp: 70, pressure: 292.2 },
    { temp: 80, pressure: 353.6 }, { temp: 90, pressure: 424.0 }, { temp: 100, pressure: 504.2 },
    { temp: 110, pressure: 595.0 }, { temp: 120, pressure: 697.1 }
  ],
  "R-404A": [
    { temp: -40, pressure: 18.3 }, { temp: -30, pressure: 26.4 }, { temp: -20, pressure: 36.7 },
    { temp: -10, pressure: 49.7 }, { temp: 0, pressure: 65.8 }, { temp: 10, pressure: 85.4 },
    { temp: 20, pressure: 109.0 }, { temp: 30, pressure: 137.1 }, { temp: 40, pressure: 170.2 },
    { temp: 50, pressure: 208.9 }, { temp: 60, pressure: 253.8 }, { temp: 70, pressure: 305.5 },
    { temp: 80, pressure: 364.7 }, { temp: 90, pressure: 432.1 }, { temp: 100, pressure: 508.4 },
    { temp: 110, pressure: 594.3 }, { temp: 120, pressure: 690.6 }
  ],
  "R-507A": [
    { temp: -40, pressure: 17.9 }, { temp: -30, pressure: 25.8 }, { temp: -20, pressure: 35.9 },
    { temp: -10, pressure: 48.6 }, { temp: 0, pressure: 64.4 }, { temp: 10, pressure: 83.7 },
    { temp: 20, pressure: 107.0 }, { temp: 30, pressure: 134.8 }, { temp: 40, pressure: 167.7 },
    { temp: 50, pressure: 206.2 }, { temp: 60, pressure: 250.9 }, { temp: 70, pressure: 302.5 },
    { temp: 80, pressure: 361.7 }, { temp: 90, pressure: 429.1 }, { temp: 100, pressure: 505.5 },
    { temp: 110, pressure: 591.6 }, { temp: 120, pressure: 688.1 }
  ]
};

export default function PTChartTool() {
  const [selectedRefrigerant, setSelectedRefrigerant] = useState("R-410A");
  const [inputTemp, setInputTemp] = useState("");
  const [inputPressure, setInputPressure] = useState("");
  const [tempUnit, setTempUnit] = useState("F");
  const [pressureUnit, setPressureUnit] = useState("PSIG");
  const [lookupResult, setLookupResult] = useState<{ temp?: number; pressure?: number } | null>(null);
  const { toast } = useToast();

  // Interpolate pressure from temperature
  const interpolatePressure = (temp: number, data: { temp: number; pressure: number }[]) => {
    if (temp <= data[0].temp) return data[0].pressure;
    if (temp >= data[data.length - 1].temp) return data[data.length - 1].pressure;

    for (let i = 0; i < data.length - 1; i++) {
      if (temp >= data[i].temp && temp <= data[i + 1].temp) {
        const ratio = (temp - data[i].temp) / (data[i + 1].temp - data[i].temp);
        return data[i].pressure + ratio * (data[i + 1].pressure - data[i].pressure);
      }
    }
    return 0;
  };

  // Interpolate temperature from pressure
  const interpolateTemperature = (pressure: number, data: { temp: number; pressure: number }[]) => {
    if (pressure <= data[0].pressure) return data[0].temp;
    if (pressure >= data[data.length - 1].pressure) return data[data.length - 1].temp;

    for (let i = 0; i < data.length - 1; i++) {
      if (pressure >= data[i].pressure && pressure <= data[i + 1].pressure) {
        const ratio = (pressure - data[i].pressure) / (data[i + 1].pressure - data[i].pressure);
        return data[i].temp + ratio * (data[i + 1].temp - data[i].temp);
      }
    }
    return 0;
  };

  const handleTempLookup = () => {
    const temp = parseFloat(inputTemp);
    if (isNaN(temp)) {
      toast({ title: "Error", description: "Please enter a valid temperature", variant: "destructive" });
      return;
    }

    let convertedTemp = temp;
    if (tempUnit === "C") {
      convertedTemp = (temp * 9/5) + 32; // Convert C to F
    }

    const data = refrigerantData[selectedRefrigerant as keyof typeof refrigerantData];
    const pressure = interpolatePressure(convertedTemp, data);
    
    let displayPressure = pressure;
    if (pressureUnit === "kPa") {
      displayPressure = pressure * 6.895; // Convert PSIG to kPa
    }

    setLookupResult({ pressure: Math.round(displayPressure * 10) / 10 });
  };

  const handlePressureLookup = () => {
    const pressure = parseFloat(inputPressure);
    if (isNaN(pressure)) {
      toast({ title: "Error", description: "Please enter a valid pressure", variant: "destructive" });
      return;
    }

    let convertedPressure = pressure;
    if (pressureUnit === "kPa") {
      convertedPressure = pressure / 6.895; // Convert kPa to PSIG
    }

    const data = refrigerantData[selectedRefrigerant as keyof typeof refrigerantData];
    const temp = interpolateTemperature(convertedPressure, data);
    
    let displayTemp = temp;
    if (tempUnit === "C") {
      displayTemp = (temp - 32) * 5/9; // Convert F to C
    }

    setLookupResult({ temp: Math.round(displayTemp * 10) / 10 });
  };

  const copyResult = () => {
    const result = lookupResult?.temp 
      ? `Temperature: ${lookupResult.temp}°${tempUnit}`
      : `Pressure: ${lookupResult?.pressure} ${pressureUnit}`;
    
    navigator.clipboard.writeText(result);
    toast({ title: "Copied!", description: "Result copied to clipboard" });
  };

  const downloadChart = () => {
    const data = refrigerantData[selectedRefrigerant as keyof typeof refrigerantData];
    let csvContent = `Temperature (°F),Pressure (PSIG)\n`;
    
    data.forEach(point => {
      let temp = point.temp;
      let pressure = point.pressure;
      
      if (tempUnit === "C") {
        temp = (point.temp - 32) * 5/9;
      }
      if (pressureUnit === "kPa") {
        pressure = point.pressure * 6.895;
      }
      
      csvContent += `${Math.round(temp * 10) / 10},${Math.round(pressure * 10) / 10}\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = `${selectedRefrigerant}-PT-Chart.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast({ title: "Downloaded!", description: `${selectedRefrigerant} PT chart downloaded` });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            PT Chart Tool
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Look up pressure-temperature relationships for 7 common refrigerants including R-410A, R-32, and other modern refrigerants. Essential for HVAC diagnostics and system charging.
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              100% Private
            </Badge>
            <Badge variant="secondary">Professional Tool</Badge>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* PT Lookup Tool */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Thermometer className="w-5 h-5 text-blue-600" />
                PT Lookup
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="refrigerant">Refrigerant Type</Label>
                <Select value={selectedRefrigerant} onValueChange={setSelectedRefrigerant}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="R-410A">R-410A (Most Common Residential)</SelectItem>
                    <SelectItem value="R-32">R-32 (New Eco-Friendly)</SelectItem>
                    <SelectItem value="R-22">R-22 (Legacy Systems)</SelectItem>
                    <SelectItem value="R-134a">R-134a (Automotive/Chillers)</SelectItem>
                    <SelectItem value="R-407C">R-407C (R-22 Replacement)</SelectItem>
                    <SelectItem value="R-404A">R-404A (Commercial Refrigeration)</SelectItem>
                    <SelectItem value="R-507A">R-507A (Low-Temp Commercial)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Temperature Unit</Label>
                  <Select value={tempUnit} onValueChange={setTempUnit}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="F">Fahrenheit (°F)</SelectItem>
                      <SelectItem value="C">Celsius (°C)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Pressure Unit</Label>
                  <Select value={pressureUnit} onValueChange={setPressureUnit}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PSIG">PSIG</SelectItem>
                      <SelectItem value="kPa">kPa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Tabs defaultValue="temp-to-pressure">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="temp-to-pressure">Temp → Pressure</TabsTrigger>
                  <TabsTrigger value="pressure-to-temp">Pressure → Temp</TabsTrigger>
                </TabsList>
                
                <TabsContent value="temp-to-pressure" className="space-y-4">
                  <div>
                    <Label htmlFor="temp-input">Temperature (°{tempUnit})</Label>
                    <Input
                      id="temp-input"
                      type="number"
                      value={inputTemp}
                      onChange={(e) => setInputTemp(e.target.value)}
                      placeholder={`Enter temperature in °${tempUnit}`}
                    />
                  </div>
                  <Button onClick={handleTempLookup} className="w-full">
                    <Gauge className="w-4 h-4 mr-2" />
                    Find Pressure
                  </Button>
                </TabsContent>
                
                <TabsContent value="pressure-to-temp" className="space-y-4">
                  <div>
                    <Label htmlFor="pressure-input">Pressure ({pressureUnit})</Label>
                    <Input
                      id="pressure-input"
                      type="number"
                      value={inputPressure}
                      onChange={(e) => setInputPressure(e.target.value)}
                      placeholder={`Enter pressure in ${pressureUnit}`}
                    />
                  </div>
                  <Button onClick={handlePressureLookup} className="w-full">
                    <Thermometer className="w-4 h-4 mr-2" />
                    Find Temperature
                  </Button>
                </TabsContent>
              </Tabs>

              {lookupResult && (
                <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                  <CardContent className="pt-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-800 dark:text-green-200">
                        {lookupResult.temp !== undefined 
                          ? `${lookupResult.temp}°${tempUnit}`
                          : `${lookupResult.pressure} ${pressureUnit}`
                        }
                      </div>
                      <div className="text-sm text-green-600 dark:text-green-400 mt-1">
                        {selectedRefrigerant} at saturation
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-3"
                        onClick={copyResult}
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Result
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>

          {/* PT Chart Display */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Gauge className="w-5 h-5 text-indigo-600" />
                  {selectedRefrigerant} PT Chart
                </span>
                <Button variant="outline" size="sm" onClick={downloadChart}>
                  <Download className="w-4 h-4 mr-2" />
                  Download CSV
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Temp (°{tempUnit})</th>
                      <th className="text-left py-2">Pressure ({pressureUnit})</th>
                    </tr>
                  </thead>
                  <tbody>
                    {refrigerantData[selectedRefrigerant as keyof typeof refrigerantData]
                      .filter((_, index) => index % 2 === 0) // Show every other entry to fit
                      .map((point, index) => {
                        let temp = point.temp;
                        let pressure = point.pressure;
                        
                        if (tempUnit === "C") {
                          temp = (point.temp - 32) * 5/9;
                        }
                        if (pressureUnit === "kPa") {
                          pressure = point.pressure * 6.895;
                        }
                        
                        return (
                          <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800">
                            <td className="py-2 font-mono">{Math.round(temp * 10) / 10}</td>
                            <td className="py-2 font-mono">{Math.round(pressure * 10) / 10}</td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Usage Tips:</h4>
                <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                  <li>• These are saturation pressures at given temperatures</li>
                  <li>• Use for system diagnostics and charging procedures</li>
                  <li>• Higher pressures indicate higher refrigerant temperatures</li>
                  <li>• Always follow manufacturer specifications</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Common Applications */}
        <Card className="mt-8 shadow-lg">
          <CardHeader>
            <CardTitle>Common Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-2xl mb-2">🔧</div>
                <h3 className="font-semibold mb-2">System Diagnostics</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Compare actual pressures to expected values for troubleshooting
                </p>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-2xl mb-2">⚡</div>
                <h3 className="font-semibold mb-2">Refrigerant Charging</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Determine proper charge levels based on temperature readings
                </p>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-2xl mb-2">📊</div>
                <h3 className="font-semibold mb-2">Performance Analysis</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Evaluate system efficiency and identify potential issues
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}