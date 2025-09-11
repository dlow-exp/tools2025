import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

export default function AlternativesPage() {
  const alternatives = [
    {
      name: "Tools.fun",
      description: "Variety of tools for different tasks",
      url: "https://tools.fun",
      pros: [],
      cons: [],
      category: "Online Tools",
    },
    {
      name: "IT Tools",
      description: "Collection of online tools (2025)",
      url: "https://it-tools.tech",
      pros: [],
      cons: [],
      category: "Online Tools",
    },
  ];

  const categories = [...new Set(alternatives.map((alt) => alt.category))];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Alternatives</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Other similar websites
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
              There are already many existing tools out there. My goal is not to
              replace them, but to provide a curated and/or modified version
              that is useful to me.
            </p>

            <p className="text-muted-foreground">
              If you want to contribute to the list, just fill in the form at
              the bottom of the page.
            </p>
          </CardContent>
        </Card>

        {/* Alternatives by Category */}
        {categories.map((category) => (
          <div key={category} className="space-y-4">
            <h2 className="text-2xl font-semibold">{category}</h2>
            <div className="grid gap-6">
              {alternatives
                .filter((alt) => alt.category === category)
                .map((alt) => (
                  <Card
                    key={alt.name}
                    className="hover:shadow-lg transition-shadow"
                  >
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
                        {alt.pros.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="font-medium text-green-700 flex items-center gap-1">
                              <span className="text-green-500">✓</span>
                              Strengths
                            </h4>
                            <ul className="text-sm space-y-1">
                              {alt.pros.map((pro, index) => (
                                <li
                                  key={index}
                                  className="text-muted-foreground"
                                >
                                  • {pro}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {alt.cons.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="font-medium text-orange-700 flex items-center gap-1">
                              <span className="text-orange-500">⚠</span>
                              Limitations
                            </h4>
                            <ul className="text-sm space-y-1">
                              {alt.cons.map((con, index) => (
                                <li
                                  key={index}
                                  className="text-muted-foreground"
                                >
                                  • {con}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
