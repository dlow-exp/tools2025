"use client";

import { useState, useEffect } from "react";

const countries = [
  {
    code: "US",
    name: "United States",
    currency: "USD",
    symbol: "$",
    defaultRate: 0.15,
    locales: ["en-US"],
  },
  {
    code: "UK",
    name: "United Kingdom",
    currency: "GBP",
    symbol: "£",
    defaultRate: 0.28,
    locales: ["en-GB"],
  },
  {
    code: "EU",
    name: "European Union",
    currency: "EUR",
    symbol: "€",
    defaultRate: 0.22,
    locales: [],
  },
  {
    code: "CA",
    name: "Canada",
    currency: "CAD",
    symbol: "C$",
    defaultRate: 0.13,
    locales: ["en-CA", "fr-CA"],
  },
  {
    code: "AU",
    name: "Australia",
    currency: "AUD",
    symbol: "A$",
    defaultRate: 0.25,
    locales: ["en-AU"],
  },
  {
    code: "JP",
    name: "Japan",
    currency: "JPY",
    symbol: "¥",
    defaultRate: 25,
    locales: ["ja-JP", "ja"],
  },
  {
    code: "DE",
    name: "Germany",
    currency: "EUR",
    symbol: "€",
    defaultRate: 0.32,
    locales: ["de-DE", "de"],
  },
  {
    code: "FR",
    name: "France",
    currency: "EUR",
    symbol: "€",
    defaultRate: 0.19,
    locales: ["fr-FR", "fr"],
  },
  {
    code: "NL",
    name: "Netherlands",
    currency: "EUR",
    symbol: "€",
    defaultRate: 0.23,
    locales: ["nl-NL", "nl"],
  },
  {
    code: "SE",
    name: "Sweden",
    currency: "SEK",
    symbol: "kr",
    defaultRate: 1.2,
    locales: ["sv-SE", "sv"],
  },
  {
    code: "SG",
    name: "Singapore",
    currency: "SGD",
    symbol: "S$",
    defaultRate: 0.28,
    locales: ["en-SG"],
  },
];

// Function to detect user's country from resolved locale (best of both worlds)
const detectCountryFromResolvedLocale = () => {
  if (typeof window === "undefined") return null; // SSR fallback

  try {
    // Get the resolved locale which considers both user preference and geographic location
    const resolvedLocale = Intl.DateTimeFormat().resolvedOptions().locale;

    // First try exact match
    let matchedCountry = countries.find((country) =>
      country.locales.includes(resolvedLocale),
    );

    // If no exact match, try language code only (e.g., 'en' from 'en-GB')
    if (!matchedCountry) {
      const languageCode = resolvedLocale.split("-")[0];
      matchedCountry = countries.find((country) =>
        country.locales.some(
          (locale) =>
            locale.startsWith(languageCode + "-") || locale === languageCode,
        ),
      );
    }

    return matchedCountry || null;
  } catch {
    return null;
  }
};

// Function to detect user's country from navigator locale (fallback)
const detectCountryFromNavigatorLocale = () => {
  if (typeof window === "undefined") return null; // SSR fallback

  const userLocale = navigator.language || navigator.languages?.[0] || "en-US";

  // First try exact match
  let matchedCountry = countries.find((country) =>
    country.locales.includes(userLocale),
  );

  // If no exact match, try language code only (e.g., 'en' from 'en-US')
  if (!matchedCountry) {
    const languageCode = userLocale.split("-")[0];
    matchedCountry = countries.find((country) =>
      country.locales.some(
        (locale) =>
          locale.startsWith(languageCode + "-") || locale === languageCode,
      ),
    );
  }

  return matchedCountry || null;
};

// Main detection function with fallback chain: resolved locale → navigator locale → default
const detectUserCountry = () => {
  if (typeof window === "undefined") return countries[0]; // SSR fallback

  // Priority 1: Resolved locale (considers location + language preference)
  const resolvedCountry = detectCountryFromResolvedLocale();
  if (resolvedCountry) return resolvedCountry;

  // Priority 2: Navigator locale (pure language preference)
  const navigatorCountry = detectCountryFromNavigatorLocale();
  if (navigatorCountry) return navigatorCountry;

  // Priority 3: Default fallback
  return countries[0]; // US
};

export default function ElectricityCalculator() {
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [tariffType, setTariffType] = useState<"single" | "dual">("single");
  const [costPerKwh, setCostPerKwh] = useState("");
  const [deviceWattage, setDeviceWattage] = useState("");

  // Dual tariff settings
  const [peakCost, setPeakCost] = useState("");
  const [offPeakCost, setOffPeakCost] = useState("");
  const [peakHours, setPeakHours] = useState("8");
  const [offPeakHours, setOffPeakHours] = useState("16");

  // Auto-detect user's country (timezone first, then locale) and set defaults
  useEffect(() => {
    const detectedCountry = detectUserCountry();
    setSelectedCountry(detectedCountry);

    // Set default rates based on detected country
    if (!costPerKwh) {
      setCostPerKwh(detectedCountry.defaultRate.toString());
    }
    if (!peakCost) {
      setPeakCost((detectedCountry.defaultRate * 1.5).toFixed(3));
    }
    if (!offPeakCost) {
      setOffPeakCost((detectedCountry.defaultRate * 0.7).toFixed(3));
    }
  }, []); // Empty dependency array means this runs once on mount

  // Handle country change and set default rates
  const handleCountryChange = (countryCode: string) => {
    const country = countries.find((c) => c.code === countryCode);
    if (country) {
      setSelectedCountry(country);
      if (!costPerKwh) {
        setCostPerKwh(country.defaultRate.toString());
      }
      if (!peakCost) {
        setPeakCost((country.defaultRate * 1.5).toFixed(3));
      }
      if (!offPeakCost) {
        setOffPeakCost((country.defaultRate * 0.7).toFixed(3));
      }
    }
  };

  const calculateAnnualCost = () => {
    const wattage = parseFloat(deviceWattage);

    if (isNaN(wattage) || wattage <= 0) {
      return null;
    }

    // Convert watts to kilowatts
    const kilowatts = wattage / 1000;

    if (tariffType === "single") {
      const cost = parseFloat(costPerKwh);
      if (isNaN(cost) || cost <= 0) {
        return null;
      }

      // Calculate annual consumption (kWh per year)
      const hoursPerYear = 24 * 365; // 8760 hours
      const annualKwh = kilowatts * hoursPerYear;

      // Calculate annual cost
      const annualCost = annualKwh * cost;

      return {
        annualKwh: annualKwh.toFixed(2),
        annualCost: annualCost.toFixed(2),
        dailyCost: (annualCost / 365).toFixed(2),
        monthlyCost: (annualCost / 12).toFixed(2),
        tariffBreakdown: null,
      };
    } else {
      // Dual tariff calculation
      const peakRate = parseFloat(peakCost);
      const offPeakRate = parseFloat(offPeakCost);
      const peakHrs = parseFloat(peakHours);
      const offPeakHrs = parseFloat(offPeakHours);

      if (
        isNaN(peakRate) ||
        isNaN(offPeakRate) ||
        peakRate <= 0 ||
        offPeakRate <= 0 ||
        isNaN(peakHrs) ||
        isNaN(offPeakHrs) ||
        peakHrs <= 0 ||
        offPeakHrs <= 0 ||
        peakHrs + offPeakHrs !== 24
      ) {
        return null;
      }

      // Calculate annual consumption for each tier
      const daysPerYear = 365;
      const peakAnnualKwh = kilowatts * peakHrs * daysPerYear;
      const offPeakAnnualKwh = kilowatts * offPeakHrs * daysPerYear;
      const totalAnnualKwh = peakAnnualKwh + offPeakAnnualKwh;

      // Calculate annual costs
      const peakAnnualCost = peakAnnualKwh * peakRate;
      const offPeakAnnualCost = offPeakAnnualKwh * offPeakRate;
      const totalAnnualCost = peakAnnualCost + offPeakAnnualCost;

      return {
        annualKwh: totalAnnualKwh.toFixed(2),
        annualCost: totalAnnualCost.toFixed(2),
        dailyCost: (totalAnnualCost / 365).toFixed(2),
        monthlyCost: (totalAnnualCost / 12).toFixed(2),
        tariffBreakdown: {
          peak: {
            kwh: peakAnnualKwh.toFixed(2),
            cost: peakAnnualCost.toFixed(2),
            hours: peakHrs.toFixed(0),
          },
          offPeak: {
            kwh: offPeakAnnualKwh.toFixed(2),
            cost: offPeakAnnualCost.toFixed(2),
            hours: offPeakHrs.toFixed(0),
          },
        },
      };
    }
  };

  const results = calculateAnnualCost();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Electricity Cost Calculator
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
          {/* Country Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Country
            </label>
            <select
              value={selectedCountry.code}
              onChange={(e) => handleCountryChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {countries.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>

          {/* Tariff Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tariff Type
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="tariffType"
                  value="single"
                  checked={tariffType === "single"}
                  onChange={(e) =>
                    setTariffType(e.target.value as "single" | "dual")
                  }
                  className="mr-2"
                />
                Single Rate
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="tariffType"
                  value="dual"
                  checked={tariffType === "dual"}
                  onChange={(e) =>
                    setTariffType(e.target.value as "single" | "dual")
                  }
                  className="mr-2"
                />
                Dual Rate (Peak/Off-Peak)
              </label>
            </div>
          </div>

          {/* Single Rate Input */}
          {tariffType === "single" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Electricity Cost per kWh ({selectedCountry.symbol})
              </label>
              <input
                type="number"
                step="0.001"
                min="0"
                value={costPerKwh || selectedCountry.defaultRate}
                onChange={(e) => setCostPerKwh(e.target.value)}
                placeholder={`Default: ${selectedCountry.defaultRate}`}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}

          {/* Dual Rate Inputs */}
          {tariffType === "dual" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Peak Rate ({selectedCountry.symbol}/kWh)
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    min="0"
                    value={
                      peakCost || (selectedCountry.defaultRate * 1.5).toFixed(3)
                    }
                    onChange={(e) => setPeakCost(e.target.value)}
                    placeholder={`Default: ${(selectedCountry.defaultRate * 1.5).toFixed(3)}`}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Off-Peak Rate ({selectedCountry.symbol}/kWh)
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    min="0"
                    value={
                      offPeakCost ||
                      (selectedCountry.defaultRate * 0.7).toFixed(3)
                    }
                    onChange={(e) => setOffPeakCost(e.target.value)}
                    placeholder={`Default: ${(selectedCountry.defaultRate * 0.7).toFixed(3)}`}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Peak Hours per Day
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="1"
                    max="23"
                    value={peakHours}
                    onChange={(e) => {
                      const peak = parseInt(e.target.value) || 0;
                      setPeakHours(e.target.value);
                      setOffPeakHours((24 - peak).toString());
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Off-Peak Hours per Day
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="1"
                    max="23"
                    value={offPeakHours}
                    onChange={(e) => {
                      const offPeak = parseInt(e.target.value) || 0;
                      setOffPeakHours(e.target.value);
                      setPeakHours((24 - offPeak).toString());
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {parseInt(peakHours) + parseInt(offPeakHours) !== 24 && (
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <p className="text-yellow-700 text-sm">
                    ⚠️ Peak and off-peak hours must add up to 24 hours total.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Device Wattage */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Device Wattage (W)
            </label>
            <input
              type="number"
              step="1"
              min="1"
              value={deviceWattage}
              onChange={(e) => setDeviceWattage(e.target.value)}
              placeholder="e.g., 100"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Results */}
          {results && (
            <div className="bg-blue-50 p-6 rounded-lg space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Annual Cost Calculation
              </h3>

              {/* Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-md">
                  <p className="text-sm text-gray-600">Annual Consumption</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {results.annualKwh} kWh
                  </p>
                </div>

                <div className="bg-white p-4 rounded-md">
                  <p className="text-sm text-gray-600">Annual Cost</p>
                  <p className="text-2xl font-bold text-green-600">
                    {selectedCountry.symbol}
                    {results.annualCost}
                  </p>
                </div>

                <div className="bg-white p-4 rounded-md">
                  <p className="text-sm text-gray-600">Monthly Cost</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {selectedCountry.symbol}
                    {results.monthlyCost}
                  </p>
                </div>

                <div className="bg-white p-4 rounded-md">
                  <p className="text-sm text-gray-600">Daily Cost</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {selectedCountry.symbol}
                    {results.dailyCost}
                  </p>
                </div>
              </div>

              {/* Dual Tariff Breakdown */}
              {results.tariffBreakdown && (
                <div>
                  <h4 className="text-md font-semibold text-gray-800 mb-3">
                    Tariff Breakdown
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-orange-50 p-4 rounded-md border border-orange-200">
                      <p className="text-sm font-medium text-orange-800 mb-2">
                        Peak Rate ({results.tariffBreakdown.peak.hours}h/day)
                      </p>
                      <div className="space-y-1">
                        <p className="text-sm text-orange-700">
                          Annual: {results.tariffBreakdown.peak.kwh} kWh
                        </p>
                        <p className="text-lg font-bold text-orange-900">
                          {selectedCountry.symbol}
                          {results.tariffBreakdown.peak.cost}
                        </p>
                      </div>
                    </div>

                    <div className="bg-green-50 p-4 rounded-md border border-green-200">
                      <p className="text-sm font-medium text-green-800 mb-2">
                        Off-Peak Rate ({results.tariffBreakdown.offPeak.hours}
                        h/day)
                      </p>
                      <div className="space-y-1">
                        <p className="text-sm text-green-700">
                          Annual: {results.tariffBreakdown.offPeak.kwh} kWh
                        </p>
                        <p className="text-lg font-bold text-green-900">
                          {selectedCountry.symbol}
                          {results.tariffBreakdown.offPeak.cost}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {!results && deviceWattage && (
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-red-700">
                Please enter valid positive numbers for all required fields.
                {tariffType === "dual" &&
                  parseInt(peakHours) + parseInt(offPeakHours) !== 24 &&
                  " Peak and off-peak hours must add up to 24."}
              </p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-center gap-4 mt-8">
          <a
            href="/calculator"
            className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            ← Back to Calculator
          </a>
          <a
            href="/"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            🏠 Home
          </a>
        </div>
      </div>
    </div>
  );
}
