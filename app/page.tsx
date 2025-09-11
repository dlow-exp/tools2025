import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Calculator, Download } from "lucide-react";

export default function Home() {
  const calculators = [
    {
      name: "Electricity Cost Calculator",
      description:
        "Calculate annual electricity costs with support for single and dual-rate tariffs across multiple countries",
      icon: <Calculator className="w-8 h-8" />,
      href: "/calculator/electricity",
      features: [
        "Multi-country support",
        "Peak/off-peak rates",
        "Auto locale detection",
      ],
    },
    {
      name: "Download Speed Calculator",
      description:
        "Calculate download speeds from file size and download time with support for various units",
      icon: <Download className="w-8 h-8" />,
      href: "/calculator/download-speed",
      features: [
        "Multiple size units",
        "Time conversions",
        "Real-time calculations",
      ],
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6 max-w-6xl">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  Tools 2025
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  A curated collection of tools that I find useful
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Calculators Section */}
        <section className="w-full py-12 md:py-24 bg-muted/50">
          <div className="container mx-auto px-4 md:px-6 max-w-6xl">
            <div className="flex flex-col items-center space-y-4 text-center mb-12">
              <div className="flex items-center space-x-2">
                <Calculator className="w-8 h-8 text-primary" />
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                  Calculators
                </h2>
              </div>
              <p className="text-muted-foreground md:text-lg">
                Utility calculators for everyday use
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {calculators.map((calc) => (
                <Card
                  key={calc.name}
                  className="group hover:shadow-lg transition-all duration-200"
                >
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                        {calc.icon}
                      </div>
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{calc.name}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <CardDescription className="text-sm leading-relaxed">
                      {calc.description}
                    </CardDescription>

                    <div className="flex flex-wrap gap-2">
                      {calc.features.map((feature) => (
                        <Badge
                          key={feature}
                          variant="secondary"
                          className="text-xs"
                        >
                          {feature}
                        </Badge>
                      ))}
                    </div>

                    <Button asChild className="w-full group">
                      <Link
                        href={calc.href}
                        className="flex items-center justify-center"
                      >
                        Open Calculator
                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}

              {/* Coming Soon Card */}
              <Card className="border-dashed border-2 group">
                <CardContent className="flex flex-col items-center justify-center space-y-4 p-8 text-center h-full">
                  <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-2xl opacity-50">
                    💭
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-muted-foreground">
                      More Calculators
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Coming soon...
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
