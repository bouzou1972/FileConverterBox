import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Workflow, Zap, Globe, Rocket } from "lucide-react";

interface WorkflowTemplate {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  tools: string[];
  steps: string[];
  estimatedTime: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

const workflowTemplates: WorkflowTemplate[] = [
  {
    id: 'new-website-seo-setup',
    title: 'New Website SEO Setup',
    description: 'Complete SEO setup for a brand new website launch',
    icon: Rocket,
    tools: ['Meta Tag Generator', 'Robots.txt Generator', 'XML Sitemap Generator', 'Title Tag Checker'],
    steps: [
      'Generate meta tags for all main pages',
      'Create robots.txt with proper directives',
      'Build comprehensive XML sitemap',
      'Validate all title tags for optimal length'
    ],
    estimatedTime: '45 mins',
    difficulty: 'Beginner'
  },
  {
    id: 'content-optimization-audit',
    title: 'Content Optimization Audit',
    description: 'Comprehensive analysis and optimization of existing content',
    icon: Zap,
    tools: ['Keyword Density Tool', 'Title Tag Checker', 'Meta Description Checker', 'SERP Preview', 'Word Count Tool'],
    steps: [
      'Analyze keyword density in content',
      'Check and optimize title tags',
      'Review meta descriptions for CTR',
      'Preview SERP appearance',
      'Analyze content metrics and readability'
    ],
    estimatedTime: '30 mins',
    difficulty: 'Intermediate'
  },
  {
    id: 'performance-optimization',
    title: 'Performance Optimization',
    description: 'Optimize website for speed and search engine performance',
    icon: Globe,
    tools: ['HTML Minifier', 'Meta Tag Generator', 'XML Sitemap Generator'],
    steps: [
      'Minify HTML for faster loading',
      'Optimize meta tags for performance',
      'Update XML sitemap with frequency settings',
      'Test page speed improvements'
    ],
    estimatedTime: '20 mins',
    difficulty: 'Advanced'
  }
];

interface WorkflowTemplatesProps {
  onSelectTool: (toolId: string) => void;
}

export function WorkflowTemplates({ onSelectTool }: WorkflowTemplatesProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-700';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-700';
      case 'Advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getToolId = (toolName: string): string => {
    const toolMap: Record<string, string> = {
      'Meta Tag Generator': 'meta-generator',
      'Robots.txt Generator': 'robots-txt',
      'XML Sitemap Generator': 'xml-sitemap',
      'HTML Minifier': 'html-minifier',
      'Title Tag Checker': 'title-checker',
      'Meta Description Checker': 'meta-description-checker',
      'SERP Preview': 'serp-preview',
      'Keyword Density Tool': 'keyword-density',
      'Word Count Tool': 'word-count'
    };
    return toolMap[toolName] || toolName.toLowerCase().replace(/\s+/g, '-');
  };

  return (
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-800">
          <Workflow className="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            SEO Workflow Templates
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Guided workflows for common SEO tasks and optimization scenarios
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workflowTemplates.map(template => (
          <Card key={template.id} className="hover:shadow-lg transition-all duration-200">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <template.icon className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                      {template.title}
                    </CardTitle>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <Badge className={getDifficultyColor(template.difficulty)}>
                    {template.difficulty}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {template.estimatedTime}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                {template.description}
              </p>

              {/* Required Tools */}
              <div>
                <h4 className="text-sm font-medium mb-2 text-gray-900 dark:text-white">Required Tools:</h4>
                <div className="flex flex-wrap gap-1">
                  {template.tools.map(tool => (
                    <Button
                      key={tool}
                      onClick={() => onSelectTool(getToolId(tool))}
                      size="sm"
                      variant="outline"
                      className="text-xs h-6 px-2"
                    >
                      {tool}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Workflow Steps */}
              <div>
                <h4 className="text-sm font-medium mb-2 text-gray-900 dark:text-white">Workflow Steps:</h4>
                <div className="space-y-1">
                  {template.steps.map((step, index) => (
                    <div key={index} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
                      <span className="w-4 h-4 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-medium mt-0.5">
                        {index + 1}
                      </span>
                      <span className="flex-1">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Button 
                variant="default" 
                size="sm" 
                className="w-full mt-4 bg-purple-600 hover:bg-purple-700"
                onClick={() => onSelectTool(getToolId(template.tools[0]))}
              >
                Start Workflow →
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}