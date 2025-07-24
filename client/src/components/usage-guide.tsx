import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Target, Zap, CheckCircle } from "lucide-react";

interface UsageExample {
  title: string;
  description: string;
  steps?: string[];
  tip?: string;
}

interface UsageGuideProps {
  title: string;
  description: string;
  examples: UsageExample[];
  tips?: string[];
  bestPractices?: string[];
  commonUses?: string[];
}

export function UsageGuide({ 
  title, 
  description, 
  examples, 
  tips = [], 
  bestPractices = [], 
  commonUses = [] 
}: UsageGuideProps) {
  return (
    <div className="space-y-6">
      {/* Tool Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl font-bold">
            <Target className="w-5 h-5 text-purple-600" />
            How to Use {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{description}</p>
          
          {commonUses.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">Common Use Cases:</h4>
              <div className="flex flex-wrap gap-2">
                {commonUses.map((use, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {use}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Usage Examples */}
      {examples.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-bold">
              <Zap className="w-5 h-5 text-blue-600" />
              Usage Examples
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {examples.map((example, index) => (
                <div key={index} className="border-l-4 border-blue-200 pl-4 py-2">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                    {example.title}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                    {example.description}
                  </p>
                  
                  {example.steps && (
                    <ol className="list-decimal list-inside text-sm text-gray-600 dark:text-gray-300 space-y-1">
                      {example.steps.map((step, stepIndex) => (
                        <li key={stepIndex}>{step}</li>
                      ))}
                    </ol>
                  )}
                  
                  {example.tip && (
                    <div className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded text-sm">
                      <span className="font-semibold text-yellow-800 dark:text-yellow-200">💡 Tip:</span>
                      <span className="text-yellow-700 dark:text-yellow-300 ml-1">{example.tip}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pro Tips and Best Practices */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tips.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl font-bold">
                <Lightbulb className="w-5 h-5 text-yellow-600" />
                Pro Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                {tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-yellow-600 mt-0.5">💡</span>
                    <span className="text-gray-600 dark:text-gray-300">{tip}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {bestPractices.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl font-bold">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Best Practices
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                {bestPractices.map((practice, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600 dark:text-gray-300">{practice}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}