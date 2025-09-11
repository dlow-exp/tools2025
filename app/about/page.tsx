import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">About Tools</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Learn more about this project and why it exists
          </p>
        </div>

        {/* Main Content */}
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">💡</span>
                Why This Project?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>
                  This app aims to curate a set of tools that I wish existed. I
                  rely heavily on LLM to do most of the heavy lifting.
                </p>

                <ul className="list-disc pl-6 space-y-2">
                  <li>No ads or tracking</li>
                  <li>Fast, responsive design</li>
                  <li>Mobile-friendly interface</li>
                  <li>Open source and transparent</li>
                  <li>
                    Privacy-focused - all calculations happen on the browser
                    where possible
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
