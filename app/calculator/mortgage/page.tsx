"use client";

import { useState } from "react";

export default function MortgageCalculator() {
  const [balance, setBalance] = useState("");
  const [rate, setRate] = useState("");
  const [overpayment, setOverpayment] = useState("");

  const calculate = () => {
    const principal = parseFloat(balance);
    const annualRate = parseFloat(rate) / 100;
    const extra = parseFloat(overpayment) || 0;

    if (isNaN(principal) || isNaN(annualRate) || principal <= 0 || annualRate < 0) {
      return null;
    }

    // Daily interest formula: (Principal * Rate) / 365
    const dailyInterestCurrent = (principal * annualRate) / 365;
    
    // New balance after hypothetical immediate overpayment
    const newBalance = Math.max(0, principal - extra);
    const dailyInterestNew = (newBalance * annualRate) / 365;
    
    const dailySaving = dailyInterestCurrent - dailyInterestNew;

    return {
      current: {
        daily: dailyInterestCurrent,
        monthly: dailyInterestCurrent * 30.44, // Average days in month
        annual: dailyInterestCurrent * 365
      },
      afterOverpayment: {
        balance: newBalance,
        daily: dailyInterestNew,
        monthly: dailyInterestNew * 30.44,
        annual: dailyInterestNew * 365
      },
      saving: {
        daily: dailySaving,
        monthly: dailySaving * 30.44,
        annual: dailySaving * 365
      }
    };
  };

  const results = calculate();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Mortgage Interest Calculator
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            Compare daily interest before and after an overpayment.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Inputs Grid */}
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div className="col-span-2 sm:col-span-1">
                <label htmlFor="balance" className="block text-sm font-medium text-gray-700">
                  Current Mortgage Balance
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">£</span>
                  </div>
                  <input
                    type="number"
                    name="balance"
                    id="balance"
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md py-3"
                    placeholder="200000"
                    value={balance}
                    onChange={(e) => setBalance(e.target.value)}
                  />
                </div>
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label htmlFor="rate" className="block text-sm font-medium text-gray-700">
                  Interest Rate
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type="number"
                    name="rate"
                    id="rate"
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-12 sm:text-sm border-gray-300 rounded-md py-3 pl-3"
                    placeholder="5.5"
                    step="0.01"
                    value={rate}
                    onChange={(e) => setRate(e.target.value)}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">%</span>
                  </div>
                </div>
              </div>

              <div className="col-span-2">
                <label htmlFor="overpayment" className="block text-sm font-medium text-gray-700">
                  Proposed Lump Sum Overpayment
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">£</span>
                  </div>
                  <input
                    type="number"
                    name="overpayment"
                    id="overpayment"
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md py-3"
                    placeholder="10000"
                    value={overpayment}
                    onChange={(e) => setOverpayment(e.target.value)}
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  See how much interest you save per day by paying this amount off immediately.
                </p>
              </div>
            </div>

            {/* Results Section */}
            {results ? (
              <div className="mt-8 bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200 bg-gray-100">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Interest Savings
                  </h3>
                </div>
                <div className="px-6 py-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
                  <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
                    <dt className="text-sm font-medium text-gray-500 truncate">Daily Interest Saved</dt>
                    <dd className="mt-2 text-3xl font-semibold text-green-600">
                      £{results.saving.daily.toFixed(2)}
                    </dd>
                    <p className="mt-1 text-xs text-gray-400">per day</p>
                  </div>
                  
                  <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
                    <dt className="text-sm font-medium text-gray-500 truncate">Monthly Interest Saved</dt>
                    <dd className="mt-2 text-3xl font-semibold text-green-600">
                      £{results.saving.monthly.toFixed(2)}
                    </dd>
                    <p className="mt-1 text-xs text-gray-400">approx. per month</p>
                  </div>

                  <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
                    <dt className="text-sm font-medium text-gray-500 truncate">Annual Interest Saved</dt>
                    <dd className="mt-2 text-3xl font-semibold text-green-600">
                      £{results.saving.annual.toFixed(2)}
                    </dd>
                    <p className="mt-1 text-xs text-gray-400">per year</p>
                  </div>
                </div>

                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Detailed Breakdown</h4>
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Current Daily Interest</dt>
                      <dd className="mt-1 text-sm text-gray-900">£{results.current.daily.toFixed(2)}</dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">New Daily Interest</dt>
                      <dd className="mt-1 text-sm text-gray-900">£{results.afterOverpayment.daily.toFixed(2)}</dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Current Balance</dt>
                      <dd className="mt-1 text-sm text-gray-900">£{parseFloat(balance).toLocaleString()}</dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">New Balance</dt>
                      <dd className="mt-1 text-sm text-gray-900">£{results.afterOverpayment.balance.toLocaleString()}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            ) : (
              <div className="mt-8 text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300 text-gray-500">
                Enter your mortgage details above to see the breakdown.
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 text-center">
          <a href="/" className="text-indigo-600 hover:text-indigo-500 font-medium">
            &larr; Back to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
