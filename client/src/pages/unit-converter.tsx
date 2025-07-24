import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Ruler, Thermometer, Weight, Clock, HardDrive, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import CopyButton from "@/components/copy-button";
import BuyMeCoffee from "@/components/buy-me-coffee";

interface ConversionUnit {
  name: string;
  symbol: string;
  toBase: number; // Multiplier to convert to base unit
  fromBase: number; // Multiplier to convert from base unit
}

const conversionCategories = {
  length: {
    name: "Length & Distance",
    icon: "ruler",
    baseUnit: "meter",
    units: [
      { name: "Millimeter", symbol: "mm", toBase: 0.001, fromBase: 1000 },
      { name: "Centimeter", symbol: "cm", toBase: 0.01, fromBase: 100 },
      { name: "Meter", symbol: "m", toBase: 1, fromBase: 1 },
      { name: "Kilometer", symbol: "km", toBase: 1000, fromBase: 0.001 },
      { name: "Inch", symbol: "in", toBase: 0.0254, fromBase: 39.3701 },
      { name: "Foot", symbol: "ft", toBase: 0.3048, fromBase: 3.28084 },
      { name: "Yard", symbol: "yd", toBase: 0.9144, fromBase: 1.09361 },
      { name: "Mile", symbol: "mi", toBase: 1609.34, fromBase: 0.000621371 },
      { name: "Nautical Mile", symbol: "nmi", toBase: 1852, fromBase: 0.000539957 }
    ]
  },
  weight: {
    name: "Weight & Mass",
    icon: "weight",
    baseUnit: "kilogram",
    units: [
      { name: "Milligram", symbol: "mg", toBase: 0.000001, fromBase: 1000000 },
      { name: "Gram", symbol: "g", toBase: 0.001, fromBase: 1000 },
      { name: "Kilogram", symbol: "kg", toBase: 1, fromBase: 1 },
      { name: "Ounce", symbol: "oz", toBase: 0.0283495, fromBase: 35.274 },
      { name: "Pound", symbol: "lb", toBase: 0.453592, fromBase: 2.20462 },
      { name: "Stone", symbol: "st", toBase: 6.35029, fromBase: 0.157473 },
      { name: "Ton (metric)", symbol: "t", toBase: 1000, fromBase: 0.001 },
      { name: "Ton (US)", symbol: "ton", toBase: 907.185, fromBase: 0.00110231 }
    ]
  },
  temperature: {
    name: "Temperature",
    icon: "thermometer",
    baseUnit: "celsius",
    units: [
      { name: "Celsius", symbol: "°C", toBase: 1, fromBase: 1 },
      { name: "Fahrenheit", symbol: "°F", toBase: 1, fromBase: 1 }, // Special handling needed
      { name: "Kelvin", symbol: "K", toBase: 1, fromBase: 1 }, // Special handling needed
      { name: "Rankine", symbol: "°R", toBase: 1, fromBase: 1 } // Special handling needed
    ]
  },
  time: {
    name: "Time",
    icon: "clock",
    baseUnit: "second",
    units: [
      { name: "Nanosecond", symbol: "ns", toBase: 0.000000001, fromBase: 1000000000 },
      { name: "Microsecond", symbol: "μs", toBase: 0.000001, fromBase: 1000000 },
      { name: "Millisecond", symbol: "ms", toBase: 0.001, fromBase: 1000 },
      { name: "Second", symbol: "s", toBase: 1, fromBase: 1 },
      { name: "Minute", symbol: "min", toBase: 60, fromBase: 1/60 },
      { name: "Hour", symbol: "h", toBase: 3600, fromBase: 1/3600 },
      { name: "Day", symbol: "d", toBase: 86400, fromBase: 1/86400 },
      { name: "Week", symbol: "wk", toBase: 604800, fromBase: 1/604800 },
      { name: "Month", symbol: "mo", toBase: 2629746, fromBase: 1/2629746 },
      { name: "Year", symbol: "yr", toBase: 31556952, fromBase: 1/31556952 }
    ]
  },
  data: {
    name: "Data Size",
    icon: "hard-drive",
    baseUnit: "byte",
    units: [
      { name: "Bit", symbol: "bit", toBase: 0.125, fromBase: 8 },
      { name: "Byte", symbol: "B", toBase: 1, fromBase: 1 },
      { name: "Kilobyte", symbol: "KB", toBase: 1000, fromBase: 0.001 },
      { name: "Megabyte", symbol: "MB", toBase: 1000000, fromBase: 0.000001 },
      { name: "Gigabyte", symbol: "GB", toBase: 1000000000, fromBase: 0.000000001 },
      { name: "Terabyte", symbol: "TB", toBase: 1000000000000, fromBase: 0.000000000001 },
      { name: "Kibibyte", symbol: "KiB", toBase: 1024, fromBase: 1/1024 },
      { name: "Mebibyte", symbol: "MiB", toBase: 1048576, fromBase: 1/1048576 },
      { name: "Gibibyte", symbol: "GiB", toBase: 1073741824, fromBase: 1/1073741824 },
      { name: "Tebibyte", symbol: "TiB", toBase: 1099511627776, fromBase: 1/1099511627776 }
    ]
  }
};

export default function UnitConverter() {
  const [activeCategory, setActiveCategory] = useState("length");
  const [fromUnit, setFromUnit] = useState("");
  const [toUnit, setToUnit] = useState("");
  const [fromValue, setFromValue] = useState("");
  const [toValue, setToValue] = useState("");
  const { toast } = useToast();

  const category = conversionCategories[activeCategory as keyof typeof conversionCategories];

  const convertTemperature = (value: number, from: string, to: string): number => {
    // Convert to Celsius first
    let celsius = value;
    switch (from) {
      case "Fahrenheit":
        celsius = (value - 32) * 5/9;
        break;
      case "Kelvin":
        celsius = value - 273.15;
        break;
      case "Rankine":
        celsius = (value - 491.67) * 5/9;
        break;
    }

    // Convert from Celsius to target
    switch (to) {
      case "Celsius":
        return celsius;
      case "Fahrenheit":
        return celsius * 9/5 + 32;
      case "Kelvin":
        return celsius + 273.15;
      case "Rankine":
        return celsius * 9/5 + 491.67;
      default:
        return celsius;
    }
  };

  const performConversion = (value: string, fromUnitName: string, toUnitName: string) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      setToValue("");
      return;
    }

    if (activeCategory === "temperature") {
      const result = convertTemperature(numValue, fromUnitName, toUnitName);
      setToValue(result.toFixed(6).replace(/\.?0+$/, ""));
      return;
    }

    const fromUnitData = category.units.find(u => u.name === fromUnitName);
    const toUnitData = category.units.find(u => u.name === toUnitName);
    
    if (!fromUnitData || !toUnitData) {
      setToValue("");
      return;
    }

    // Convert to base unit, then to target unit
    const baseValue = numValue * fromUnitData.toBase;
    const result = baseValue * toUnitData.fromBase;
    
    setToValue(result.toFixed(6).replace(/\.?0+$/, ""));
  };

  const handleFromValueChange = (value: string) => {
    setFromValue(value);
    if (fromUnit && toUnit) {
      performConversion(value, fromUnit, toUnit);
    }
  };

  const handleToValueChange = (value: string) => {
    setToValue(value);
    if (fromUnit && toUnit) {
      performConversion(value, toUnit, fromUnit);
      // Update from value with the reverse conversion
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        if (activeCategory === "temperature") {
          const result = convertTemperature(numValue, toUnit, fromUnit);
          setFromValue(result.toFixed(6).replace(/\.?0+$/, ""));
        } else {
          const fromUnitData = category.units.find(u => u.name === fromUnit);
          const toUnitData = category.units.find(u => u.name === toUnit);
          if (fromUnitData && toUnitData) {
            const baseValue = numValue * toUnitData.toBase;
            const result = baseValue * fromUnitData.fromBase;
            setFromValue(result.toFixed(6).replace(/\.?0+$/, ""));
          }
        }
      }
    }
  };

  const handleFromUnitChange = (unitName: string) => {
    setFromUnit(unitName);
    if (fromValue && toUnit) {
      performConversion(fromValue, unitName, toUnit);
    }
  };

  const handleToUnitChange = (unitName: string) => {
    setToUnit(unitName);
    if (fromValue && fromUnit) {
      performConversion(fromValue, fromUnit, unitName);
    }
  };

  const swapUnits = () => {
    const tempUnit = fromUnit;
    const tempValue = fromValue;
    
    setFromUnit(toUnit);
    setToUnit(tempUnit);
    setFromValue(toValue);
    setToValue(tempValue);
  };

  const clearAll = () => {
    setFromValue("");
    setToValue("");
    setFromUnit("");
    setToUnit("");
  };

  const loadCommonConversion = (category: string) => {
    switch (category) {
      case "length":
        setFromUnit("Meter");
        setToUnit("Foot");
        setFromValue("1");
        performConversion("1", "Meter", "Foot");
        break;
      case "weight":
        setFromUnit("Kilogram");
        setToUnit("Pound");
        setFromValue("1");
        performConversion("1", "Kilogram", "Pound");
        break;
      case "temperature":
        setFromUnit("Celsius");
        setToUnit("Fahrenheit");
        setFromValue("0");
        performConversion("0", "Celsius", "Fahrenheit");
        break;
      case "time":
        setFromUnit("Hour");
        setToUnit("Minute");
        setFromValue("1");
        performConversion("1", "Hour", "Minute");
        break;
      case "data":
        setFromUnit("Gigabyte");
        setToUnit("Megabyte");
        setFromValue("1");
        performConversion("1", "Gigabyte", "Megabyte");
        break;
    }
  };

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "ruler": return <Ruler className="w-4 h-4" />;
      case "weight": return <Weight className="w-4 h-4" />;
      case "thermometer": return <Thermometer className="w-4 h-4" />;
      case "clock": return <Clock className="w-4 h-4" />;
      case "hard-drive": return <HardDrive className="w-4 h-4" />;
      default: return <Ruler className="w-4 h-4" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Unit Converter</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Convert between metric and imperial units for length, weight, temperature, time, and data sizes. 
          All conversions work completely offline with high precision.
        </p>
      </div>

      <Tabs value={activeCategory} onValueChange={setActiveCategory} className="mb-6">
        <TabsList className="grid w-full grid-cols-5">
          {Object.entries(conversionCategories).map(([key, cat]) => (
            <TabsTrigger key={key} value={key} className="flex items-center gap-2 text-xs">
              {getIconComponent(cat.icon)}
              <span className="hidden sm:inline">{cat.name.split(' ')[0]}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.entries(conversionCategories).map(([key, cat]) => (
          <TabsContent key={key} value={key}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {getIconComponent(cat.icon)}
                  {cat.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex gap-2 mb-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => loadCommonConversion(key)}
                  >
                    Load Example
                  </Button>
                  <Button variant="outline" size="sm" onClick={clearAll}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Clear
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">From</label>
                      <Select value={fromUnit} onValueChange={handleFromUnitChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                        <SelectContent>
                          {cat.units.map((unit) => (
                            <SelectItem key={unit.name} value={unit.name}>
                              {unit.name} ({unit.symbol})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Input
                      type="number"
                      value={fromValue}
                      onChange={(e) => handleFromValueChange(e.target.value)}
                      placeholder="Enter value"
                      className="text-lg font-mono"
                    />
                    
                    <div className="flex gap-2">
                      <CopyButton text={fromValue} label="Copy Value" />
                      {fromUnit && (
                        <Badge variant="outline">{fromUnit}</Badge>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">To</label>
                      <Select value={toUnit} onValueChange={handleToUnitChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                        <SelectContent>
                          {cat.units.map((unit) => (
                            <SelectItem key={unit.name} value={unit.name}>
                              {unit.name} ({unit.symbol})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Input
                      type="number"
                      value={toValue}
                      onChange={(e) => handleToValueChange(e.target.value)}
                      placeholder="Converted value"
                      className="text-lg font-mono bg-gray-50"
                    />
                    
                    <div className="flex gap-2">
                      <CopyButton text={toValue} label="Copy Result" />
                      {toUnit && (
                        <Badge variant="outline">{toUnit}</Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <Button 
                    variant="outline" 
                    onClick={swapUnits}
                    disabled={!fromUnit || !toUnit}
                    className="flex items-center gap-2"
                  >
                    ⇄ Swap Units
                  </Button>
                </div>

                {fromValue && toValue && fromUnit && toUnit && (
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <div className="text-lg font-semibold text-blue-800">
                      {fromValue} {fromUnit} = {toValue} {toUnit}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Conversion Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 text-sm">
            {Object.entries(conversionCategories).map(([key, cat]) => (
              <div key={key}>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  {getIconComponent(cat.icon)}
                  {cat.name.split(' ')[0]}
                </h4>
                <ul className="text-gray-600 space-y-1">
                  {cat.units.slice(0, 4).map((unit) => (
                    <li key={unit.name}>• {unit.symbol} - {unit.name}</li>
                  ))}
                  {cat.units.length > 4 && (
                    <li className="text-xs">... and {cat.units.length - 4} more</li>
                  )}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="text-center mt-8">
        <div className="mb-4">
          <p className="text-lg font-medium text-foreground mb-1">💛 Like these tools?</p>
          <p className="text-muted-foreground">Help support future development</p>
        </div>
        <BuyMeCoffee />
        <p className="text-sm text-gray-600 mt-2">
          Thanks for using this free tool! Your support keeps it ad-free and private.
        </p>
      </div>
    </div>
  );
}