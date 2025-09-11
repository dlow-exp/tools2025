export default function Home() {
  const calculators = [
    {
      name: 'Electricity Cost Calculator',
      description: 'Calculate annual electricity costs with support for single and dual-rate tariffs across multiple countries',
      icon: '⚡',
      href: '/calculator/electricity',
      features: ['Multi-country support', 'Peak/off-peak rates', 'Auto locale detection']
    }
  ];

  const otherTools = [
    // Placeholder for future tools
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Tools 2025
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            A collection of useful calculators and utilities to help with everyday tasks
          </p>
        </div>

        {/* Calculators Section */}
        <section className="mb-16">
          <div className="flex items-center mb-8">
            <div className="bg-blue-500 text-white p-3 rounded-lg mr-4">
              🧮
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Calculators</h2>
              <p className="text-gray-600">Financial and utility calculators</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {calculators.map((calc) => (
              <div
                key={calc.name}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group"
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="text-3xl mr-3 group-hover:scale-110 transition-transform duration-200">
                      {calc.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {calc.name}
                    </h3>
                  </div>
                  
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                    {calc.description}
                  </p>

                  <div className="mb-6">
                    <div className="flex flex-wrap gap-2">
                      {calc.features.map((feature) => (
                        <span
                          key={feature}
                          className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs font-medium"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  <a
                    href={calc.href}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center group"
                  >
                    Open Calculator
                    <svg 
                      className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            ))}

            {/* Coming Soon Card */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-dashed border-gray-200">
              <div className="p-6 text-center">
                <div className="text-3xl mb-4 opacity-50">💭</div>
                <h3 className="text-xl font-semibold text-gray-500 mb-2">More Calculators</h3>
                <p className="text-gray-400 text-sm">Coming soon...</p>
              </div>
            </div>
          </div>
        </section>

        {/* Future Tools Section */}
        {otherTools.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center mb-8">
              <div className="bg-green-500 text-white p-3 rounded-lg mr-4">
                🛠️
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Other Tools</h2>
                <p className="text-gray-600">Additional utilities and helpers</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Future tools will go here */}
            </div>
          </section>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center text-gray-500">
            <p className="text-sm">Tools 2025 • Making everyday tasks easier</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
