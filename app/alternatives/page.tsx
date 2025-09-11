import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

export default function AlternativesPage() {
  const alternatives = [
    {
      name: 'Calculator.net',
      description: 'Comprehensive collection of online calculators for various purposes including financial, health, math, and conversion tools.',
      url: 'https://www.calculator.net',
      pros: ['Large variety of calculators', 'Well-established', 'Detailed explanations'],
      cons: ['Heavy with ads', 'Cluttered interface', 'Slow loading times'],
      category: 'General Calculators'
    },
    {
      name: 'Wolfram Alpha',
      description: 'Computational intelligence platform that can solve complex mathematical problems and provide detailed step-by-step solutions.',
      url: 'https://www.wolframalpha.com',
      pros: ['Extremely powerful', 'Scientific accuracy', 'Step-by-step solutions'],
      cons: ['Overkill for simple tasks', 'Paid features', 'Complex interface'],
      category: 'Mathematical Computing'
    },
    {
      name: 'Google Calculator',
      description: 'Built-in calculator that appears in Google search results for basic calculations and conversions.',
      url: 'https://www.google.com/search?q=calculator',
      pros: ['Always accessible', 'Fast', 'No ads in results'],
      cons: ['Basic functionality only', 'Requires internet', 'Limited customization'],
      category: 'Basic Calculator'
    },
    {
      name: 'SpeedTest.net',
      description: 'Popular internet speed testing service that measures download/upload speeds and network performance.',
      url: 'https://www.speedtest.net',
      pros: ['Industry standard', 'Accurate results', 'Global server network'],
      cons: ['Only tests internet speed', 'Ads present', 'Privacy concerns'],
      category: 'Speed Testing'
    },
    {
      name: 'ConvertUnits.com',
      description: 'Specialized in unit conversions across various measurement systems including length, weight, temperature, and more.',
      url: 'https://www.convertunits.com',
      pros: ['Comprehensive conversions', 'Historical data', 'Mobile responsive'],
      cons: ['Ad-heavy', 'Outdated design', 'Slow navigation'],
      category: 'Unit Conversion'
    },
    {
      name: 'RapidTables',
      description: 'Collection of online tools including calculators, converters, and reference tables for various disciplines.',
      url: 'https://www.rapidtables.com',
      pros: ['Wide tool selection', 'Clean design', 'Quick calculations'],
      cons: ['Inconsistent quality', 'Some tools are basic', 'Ad interruptions'],
      category: 'Online Tools'
    }
  ];

  const categories = [...new Set(alternatives.map(alt => alt.category))];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Alternatives</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Other tools and websites that provide similar functionality. 
            We believe in transparency and want you to choose what works best for you.
          </p>
        </div>

        {/* Why This Section Exists */}
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">🤝</span>
              Why Show Alternatives?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              We believe in honest comparison and giving users choice. While we're confident 
              in our approach of providing clean, ad-free tools, different users have different 
              needs. Here are some alternatives you might consider, along with their strengths 
              and limitations.
            </p>
          </CardContent>
        </Card>

        {/* Alternatives by Category */}
        {categories.map((category) => (
          <div key={category} className="space-y-4">
            <h2 className="text-2xl font-semibold">{category}</h2>
            <div className="grid gap-6">
              {alternatives
                .filter(alt => alt.category === category)
                .map((alt) => (
                  <Card key={alt.name} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <CardTitle className="text-xl">{alt.name}</CardTitle>
                          <CardDescription className="text-sm">
                            {alt.description}
                          </CardDescription>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <a 
                            href={alt.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-1"
                          >
                            Visit
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <h4 className="font-medium text-green-700 flex items-center gap-1">
                            <span className="text-green-500">✓</span>
                            Strengths
                          </h4>
                          <ul className="text-sm space-y-1">
                            {alt.pros.map((pro, index) => (
                              <li key={index} className="text-muted-foreground">• {pro}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-medium text-orange-700 flex items-center gap-1">
                            <span className="text-orange-500">⚠</span>
                            Limitations
                          </h4>
                          <ul className="text-sm space-y-1">
                            {alt.cons.map((con, index) => (
                              <li key={index} className="text-muted-foreground">• {con}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        ))}

        {/* How We Compare */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">⭐</span>
              How Tools 2025 Compares
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium text-green-700">Our Advantages</h4>
                <ul className="text-sm space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>No advertisements or tracking</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Fast loading and clean interface</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Privacy-focused (local calculations)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Mobile-optimized design</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Open source and transparent</span>
                  </li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium text-orange-700">Areas for Growth</h4>
                <ul className="text-sm space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1">⚠</span>
                    <span>Newer project with fewer tools</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1">⚠</span>
                    <span>Limited advanced mathematical functions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1">⚠</span>
                    <span>Smaller community and user base</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground mb-4">
              Found something we're missing or have suggestions for improvement?
            </p>
            <Button variant="outline">
              Let us know on GitHub
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}