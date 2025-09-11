import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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
                <span className="text-2xl">🎯</span>
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p className="text-lg leading-relaxed">
                Tools 2025 was created to provide simple, effective calculators and utilities 
                that help with everyday tasks. In a world full of complex applications, 
                sometimes you just need a straightforward tool that does one thing really well.
              </p>
            </CardContent>
          </Card>

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
                  I found myself constantly searching for simple calculators and conversion tools 
                  online, often ending up on ad-heavy websites or overly complicated applications. 
                  This inspired me to create a clean, fast, and reliable collection of tools.
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>No ads or tracking</li>
                  <li>Fast, responsive design</li>
                  <li>Mobile-friendly interface</li>
                  <li>Open source and transparent</li>
                  <li>Privacy-focused - all calculations happen locally</li>
                </ul>
              </div>
            </CardContent>
          </Card>


          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">📬</span>
                Get In Touch
              </CardTitle>
              <CardDescription>
                Have suggestions or feedback? I'd love to hear from you!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                You can reach out through GitHub issues or contribute to the project directly. 
                All suggestions and contributions are welcome!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}