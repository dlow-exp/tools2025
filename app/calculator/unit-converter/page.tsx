"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeftRight } from "lucide-react";

export default function UnitConverter() {
  // Weight conversion state
  const [pounds, setPounds] = useState<string>("");
  const [kilograms, setKilograms] = useState<string>("");

  // Distance conversion state
  const [miles, setMiles] = useState<string>("");
  const [kilometers, setKilometers] = useState<string>("");
  const [feet, setFeet] = useState<string>("");
  const [meters, setMeters] = useState<string>("");
  const [inches, setInches] = useState<string>("");
  const [centimeters, setCentimeters] = useState<string>("");

  // Temperature conversion state
  const [celsius, setCelsius] = useState<string>("");
  const [fahrenheit, setFahrenheit] = useState<string>("");

  // Weight conversion handlers
  const handlePoundsChange = (value: string) => {
    setPounds(value);
    const num = parseFloat(value);
    if (!isNaN(num)) {
      setKilograms((num * 0.45359237).toFixed(4));
    } else {
      setKilograms("");
    }
  };

  const handleKilogramsChange = (value: string) => {
    setKilograms(value);
    const num = parseFloat(value);
    if (!isNaN(num)) {
      setPounds((num / 0.45359237).toFixed(4));
    } else {
      setPounds("");
    }
  };

  // Distance conversion handlers
  const handleMilesChange = (value: string) => {
    setMiles(value);
    const num = parseFloat(value);
    if (!isNaN(num)) {
      setKilometers((num * 1.609344).toFixed(4));
    } else {
      setKilometers("");
    }
  };

  const handleKilometersChange = (value: string) => {
    setKilometers(value);
    const num = parseFloat(value);
    if (!isNaN(num)) {
      setMiles((num / 1.609344).toFixed(4));
    } else {
      setMiles("");
    }
  };

  const handleFeetChange = (value: string) => {
    setFeet(value);
    const num = parseFloat(value);
    if (!isNaN(num)) {
      setMeters((num * 0.3048).toFixed(4));
    } else {
      setMeters("");
    }
  };

  const handleMetersChange = (value: string) => {
    setMeters(value);
    const num = parseFloat(value);
    if (!isNaN(num)) {
      setFeet((num / 0.3048).toFixed(4));
    } else {
      setFeet("");
    }
  };

  const handleInchesChange = (value: string) => {
    setInches(value);
    const num = parseFloat(value);
    if (!isNaN(num)) {
      setCentimeters((num * 2.54).toFixed(4));
    } else {
      setCentimeters("");
    }
  };

  const handleCentimetersChange = (value: string) => {
    setCentimeters(value);
    const num = parseFloat(value);
    if (!isNaN(num)) {
      setInches((num / 2.54).toFixed(4));
    } else {
      setInches("");
    }
  };

  // Temperature conversion handlers
  const handleCelsiusChange = (value: string) => {
    setCelsius(value);
    const num = parseFloat(value);
    if (!isNaN(num)) {
      setFahrenheit(((num * 9) / 5 + 32).toFixed(4));
    } else {
      setFahrenheit("");
    }
  };

  const handleFahrenheitChange = (value: string) => {
    setFahrenheit(value);
    const num = parseFloat(value);
    if (!isNaN(num)) {
      setCelsius((((num - 32) * 5) / 9).toFixed(4));
    } else {
      setCelsius("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent mb-4">
            Unit Converter
          </h1>
          <p className="text-gray-600 text-lg">
            Convert between common units of measurement
          </p>
        </div>

        {/* Tabs for different conversion types */}
        <Tabs defaultValue="weight" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="weight">Weight</TabsTrigger>
            <TabsTrigger value="distance">Length</TabsTrigger>
            <TabsTrigger value="temperature">Temperature</TabsTrigger>
          </TabsList>

          {/* Weight Conversion */}
          <TabsContent value="weight">
            <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-white/20">
              <CardHeader>
                <CardTitle className="text-2xl text-center">
                  Weight Conversion
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-6">
                  {/* Pounds Input */}
                  <div>
                    <label
                      htmlFor="pounds"
                      className="block text-lg font-semibold text-gray-700 mb-3"
                    >
                      Pounds (lb)
                    </label>
                    <Input
                      type="number"
                      id="pounds"
                      value={pounds}
                      onChange={(e) => handlePoundsChange(e.target.value)}
                      placeholder="Enter weight in pounds"
                      className="text-lg h-12"
                      step="any"
                    />
                  </div>

                  {/* Swap Icon */}
                  <div className="flex justify-center">
                    <ArrowLeftRight className="w-6 h-6 text-gray-400" />
                  </div>

                  {/* Kilograms Input */}
                  <div>
                    <label
                      htmlFor="kilograms"
                      className="block text-lg font-semibold text-gray-700 mb-3"
                    >
                      Kilograms (kg)
                    </label>
                    <Input
                      type="number"
                      id="kilograms"
                      value={kilograms}
                      onChange={(e) => handleKilogramsChange(e.target.value)}
                      placeholder="Enter weight in kilograms"
                      className="text-lg h-12"
                      step="any"
                    />
                  </div>

                  {/* Conversion Formula */}
                  <div className="bg-green-50 rounded-xl p-4 text-center text-sm text-gray-600">
                    <p>1 lb = 0.45359237 kg</p>
                    <p>1 kg = 2.20462262 lb</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Distance Conversion */}
          <TabsContent value="distance">
            <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-white/20">
              <CardHeader>
                <CardTitle className="text-2xl text-center">
                  Distance & Length Conversion
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-8">
                  {/* Miles to Kilometers */}
                  <div className="space-y-6 pb-8 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 text-center">
                      Miles ↔ Kilometers
                    </h3>
                    <div>
                      <label
                        htmlFor="miles"
                        className="block text-lg font-semibold text-gray-700 mb-3"
                      >
                        Miles (mi)
                      </label>
                      <Input
                        type="number"
                        id="miles"
                        value={miles}
                        onChange={(e) => handleMilesChange(e.target.value)}
                        placeholder="Enter distance in miles"
                        className="text-lg h-12"
                        step="any"
                      />
                    </div>

                    <div className="flex justify-center">
                      <ArrowLeftRight className="w-6 h-6 text-gray-400" />
                    </div>

                    <div>
                      <label
                        htmlFor="kilometers"
                        className="block text-lg font-semibold text-gray-700 mb-3"
                      >
                        Kilometers (km)
                      </label>
                      <Input
                        type="number"
                        id="kilometers"
                        value={kilometers}
                        onChange={(e) => handleKilometersChange(e.target.value)}
                        placeholder="Enter distance in kilometers"
                        className="text-lg h-12"
                        step="any"
                      />
                    </div>

                    <div className="bg-green-50 rounded-xl p-4 text-center text-sm text-gray-600">
                      <p>1 mi = 1.609344 km • 1 km = 0.621371 mi</p>
                    </div>
                  </div>

                  {/* Feet to Meters */}
                  <div className="space-y-6 pb-8 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 text-center">
                      Feet ↔ Meters
                    </h3>
                    <div>
                      <label
                        htmlFor="feet"
                        className="block text-lg font-semibold text-gray-700 mb-3"
                      >
                        Feet (ft)
                      </label>
                      <Input
                        type="number"
                        id="feet"
                        value={feet}
                        onChange={(e) => handleFeetChange(e.target.value)}
                        placeholder="Enter length in feet"
                        className="text-lg h-12"
                        step="any"
                      />
                    </div>

                    <div className="flex justify-center">
                      <ArrowLeftRight className="w-6 h-6 text-gray-400" />
                    </div>

                    <div>
                      <label
                        htmlFor="meters"
                        className="block text-lg font-semibold text-gray-700 mb-3"
                      >
                        Meters (m)
                      </label>
                      <Input
                        type="number"
                        id="meters"
                        value={meters}
                        onChange={(e) => handleMetersChange(e.target.value)}
                        placeholder="Enter length in meters"
                        className="text-lg h-12"
                        step="any"
                      />
                    </div>

                    <div className="bg-green-50 rounded-xl p-4 text-center text-sm text-gray-600">
                      <p>1 ft = 0.3048 m • 1 m = 3.28084 ft</p>
                    </div>
                  </div>

                  {/* Inches to Centimeters */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-800 text-center">
                      Inches ↔ Centimeters
                    </h3>
                    <div>
                      <label
                        htmlFor="inches"
                        className="block text-lg font-semibold text-gray-700 mb-3"
                      >
                        Inches (in)
                      </label>
                      <Input
                        type="number"
                        id="inches"
                        value={inches}
                        onChange={(e) => handleInchesChange(e.target.value)}
                        placeholder="Enter length in inches"
                        className="text-lg h-12"
                        step="any"
                      />
                    </div>

                    <div className="flex justify-center">
                      <ArrowLeftRight className="w-6 h-6 text-gray-400" />
                    </div>

                    <div>
                      <label
                        htmlFor="centimeters"
                        className="block text-lg font-semibold text-gray-700 mb-3"
                      >
                        Centimeters (cm)
                      </label>
                      <Input
                        type="number"
                        id="centimeters"
                        value={centimeters}
                        onChange={(e) =>
                          handleCentimetersChange(e.target.value)
                        }
                        placeholder="Enter length in centimeters"
                        className="text-lg h-12"
                        step="any"
                      />
                    </div>

                    <div className="bg-green-50 rounded-xl p-4 text-center text-sm text-gray-600">
                      <p>1 in = 2.54 cm • 1 cm = 0.393701 in</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Temperature Conversion */}
          <TabsContent value="temperature">
            <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-white/20">
              <CardHeader>
                <CardTitle className="text-2xl text-center">
                  Temperature Conversion
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-6">
                  {/* Celsius Input */}
                  <div>
                    <label
                      htmlFor="celsius"
                      className="block text-lg font-semibold text-gray-700 mb-3"
                    >
                      Celsius (°C)
                    </label>
                    <Input
                      type="number"
                      id="celsius"
                      value={celsius}
                      onChange={(e) => handleCelsiusChange(e.target.value)}
                      placeholder="Enter temperature in Celsius"
                      className="text-lg h-12"
                      step="any"
                    />
                  </div>

                  {/* Swap Icon */}
                  <div className="flex justify-center">
                    <ArrowLeftRight className="w-6 h-6 text-gray-400" />
                  </div>

                  {/* Fahrenheit Input */}
                  <div>
                    <label
                      htmlFor="fahrenheit"
                      className="block text-lg font-semibold text-gray-700 mb-3"
                    >
                      Fahrenheit (°F)
                    </label>
                    <Input
                      type="number"
                      id="fahrenheit"
                      value={fahrenheit}
                      onChange={(e) => handleFahrenheitChange(e.target.value)}
                      placeholder="Enter temperature in Fahrenheit"
                      className="text-lg h-12"
                      step="any"
                    />
                  </div>

                  {/* Conversion Formula */}
                  <div className="bg-green-50 rounded-xl p-4 text-center text-sm text-gray-600">
                    <p>°F = (°C × 9/5) + 32</p>
                    <p>°C = (°F - 32) × 5/9</p>
                  </div>

                  {/* Common Reference Points */}
                  <div className="bg-blue-50 rounded-xl p-4 text-sm text-gray-600">
                    <p className="font-semibold mb-2 text-center">
                      Common Reference Points:
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <div>Water freezes: 0°C / 32°F</div>
                      <div>Water boils: 100°C / 212°F</div>
                      <div>Room temp: ~20°C / ~68°F</div>
                      <div>Body temp: 37°C / 98.6°F</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Navigation */}
        <div className="flex justify-center gap-4 mt-8">
          <Button asChild variant="outline">
            <a href="/">← Back to Home</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
