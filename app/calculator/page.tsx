export default function CalculatorIndex() {
  const calculatorEntries = [
    {
      type: 'file',
      name: 'electricity/',
      description: 'Calculate annual electricity costs with single/dual tariff support',
      lastModified: '2025-01-09',
    },
    {
      type: 'file',
      name: 'download-speed/',
      description: 'Calculate download speeds from file size and time',
      lastModified: '2025-01-11',
    },
  ];

  return (
    <div className="min-h-screen bg-white font-mono">
      {/* Header */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-2">
          <a href="/" className="text-blue-600 hover:text-blue-800 hover:underline">
            /
          </a>
          <span className="text-gray-400">/</span>
          <h1 className="text-2xl font-bold">calculator/</h1>
        </div>
        <p className="text-gray-600 text-sm">Utility calculators and tools</p>
      </div>

      {/* Directory listing */}
      <div className="p-4">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-2 px-4 font-semibold">Name</th>
              <th className="text-left py-2 px-4 font-semibold hidden sm:table-cell">Description</th>
              <th className="text-left py-2 px-4 font-semibold hidden md:table-cell">Last modified</th>
            </tr>
          </thead>
          <tbody>
            {/* Parent directory */}
            <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
              <td className="py-3 px-4">
                <a
                  href="/"
                  className="flex items-center text-blue-600 hover:text-blue-800 hover:underline"
                >
                  <span className="mr-2">📁</span>
                  ../
                </a>
              </td>
              <td className="py-3 px-4 text-gray-600 text-sm hidden sm:table-cell">
                Parent Directory
              </td>
              <td className="py-3 px-4 text-gray-500 text-sm hidden md:table-cell">
                -
              </td>
            </tr>

            {/* Calculator entries */}
            {calculatorEntries.map((entry) => (
              <tr
                key={entry.name}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td className="py-3 px-4">
                  <a
                    href={`/calculator/${entry.name}`}
                    className="flex items-center text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    <span className="mr-2">
                      {entry.type === 'directory' ? '📁' : entry.name === 'download-speed/' ? '📊' : '⚡'}
                    </span>
                    {entry.name}
                  </a>
                </td>
                <td className="py-3 px-4 text-gray-600 text-sm hidden sm:table-cell">
                  {entry.description}
                </td>
                <td className="py-3 px-4 text-gray-500 text-sm hidden md:table-cell">
                  {entry.lastModified}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="mt-8 p-4 border-t border-gray-200 text-center text-gray-500 text-sm">
        <p>Built with Next.js • tools2025</p>
      </div>
    </div>
  );
}