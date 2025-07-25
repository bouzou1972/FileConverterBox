import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Search, Tag, Shield, Map, Code, FileText, Eye, BarChart3, 
  Wrench, CheckCircle, Zap, Clock, Heart
} from "lucide-react";
import { KeywordDensityTool } from "./keyword-density-tool";
import { MetaTagGenerator } from "./meta-tag-generator";
import { RobotsTxtGenerator } from "./robots-txt-generator";
import { XmlSitemapGenerator } from "./xml-sitemap-generator";
import { HtmlMinifier } from "./html-minifier";
import { TitleTagChecker } from "./title-tag-checker";
import { MetaDescriptionChecker } from "./meta-description-checker";
import { SerpSnippetPreview } from "./serp-snippet-preview";
import { WebsiteWordCount } from "./website-word-count";
import { SearchFunctionality } from "./search-functionality";
import { WorkflowTemplates } from "./workflow-templates";
import React, { useState } from "react";

type ToolId = 'keyword-density' | 'meta-generator' | 'robots-txt' | 'xml-sitemap' | 
             'html-minifier' | 'title-checker' | 'meta-description-checker' | 
             'serp-preview' | 'word-count';

interface SEOTool {
  id: ToolId;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  category: string;
  badge?: string;
  keywords: string[];
}

const seoTools: SEOTool[] = [
  {
    id: 'keyword-density',
    title: 'Keyword Density & Consistency Tool',
    description: 'Analyze keyword frequency and distribution in your content for optimal SEO.',
    icon: Search,
    category: 'Validators',
    keywords: ['keyword', 'density', 'frequency', 'content', 'analysis', 'seo', 'optimization']
  },
  {
    id: 'meta-generator',
    title: 'Meta Tag Generator',
    description: 'Generate complete meta tags for SEO, Open Graph, and Twitter Cards.',
    icon: Tag,
    category: 'Generators',
    keywords: ['meta', 'tags', 'seo', 'open graph', 'twitter', 'facebook', 'social', 'generator']
  },
  {
    id: 'robots-txt',
    title: 'Robots.txt Generator',
    description: 'Create custom robots.txt files to control search engine crawling.',
    icon: Shield,
    category: 'Generators',
    keywords: ['robots', 'txt', 'crawling', 'search engine', 'spider', 'bot', 'disallow', 'allow']
  },
  {
    id: 'xml-sitemap',
    title: 'XML Sitemap Generator',
    description: 'Generate XML sitemaps to help search engines index your website.',
    icon: Map,
    category: 'Generators',
    keywords: ['xml', 'sitemap', 'index', 'search engine', 'pages', 'urls', 'website']
  },
  {
    id: 'html-minifier',
    title: 'HTML Minifier',
    description: 'Compress HTML code to improve page load speed and performance.',
    icon: Code,
    category: 'Optimization',
    keywords: ['html', 'minify', 'compress', 'optimize', 'performance', 'speed', 'code']
  },
  {
    id: 'title-checker',
    title: 'Title Tag Checker',
    description: 'Analyze and optimize your page titles for search engines and users.',
    icon: FileText,
    category: 'Validators',
    keywords: ['title', 'tag', 'checker', 'optimize', 'page title', 'seo', 'serp']
  },
  {
    id: 'meta-description-checker',
    title: 'Meta Description Checker',
    description: 'Optimize your meta descriptions for better click-through rates.',
    icon: FileText,
    category: 'Validators',
    keywords: ['meta', 'description', 'checker', 'optimize', 'ctr', 'click through', 'serp']
  },
  {
    id: 'serp-preview',
    title: 'SERP Snippet Preview Tool',
    description: 'Preview how your pages will appear in search engine results.',
    icon: Eye,
    category: 'Validators',
    keywords: ['serp', 'preview', 'snippet', 'search results', 'google', 'appearance']
  },
  {
    id: 'word-count',
    title: 'Website Word Count Tool',
    description: 'Analyze content length, readability, and SEO metrics.',
    icon: BarChart3,
    category: 'Validators',
    keywords: ['word count', 'content', 'analysis', 'readability', 'metrics', 'text', 'statistics']
  }
];

const categories = [
  {
    id: 'generators',
    title: 'Generators',
    description: 'Create essential SEO files and tags',
    icon: Wrench,
    color: 'text-blue-600'
  },
  {
    id: 'validators',
    title: 'Validators',
    description: 'Analyze and optimize your content',
    icon: CheckCircle,
    color: 'text-green-600'
  },
  {
    id: 'optimization',
    title: 'Optimization',
    description: 'Improve performance and efficiency',
    icon: Zap,
    color: 'text-purple-600'
  }
];

export function SEOToolsHome() {
  const [selectedTool, setSelectedTool] = useState<ToolId | null>(null);
  const [recentlyUsed, setRecentlyUsed] = useState<ToolId[]>([]);
  const [favorites, setFavorites] = useState<ToolId[]>([]);

  // Load preferences from localStorage
  React.useEffect(() => {
    const saved = localStorage.getItem('seo-tools-recent');
    if (saved) setRecentlyUsed(JSON.parse(saved));
    
    const savedFavorites = localStorage.getItem('seo-tools-favorites');
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
  }, []);

  const selectTool = (toolId: ToolId) => {
    setSelectedTool(toolId);
    
    // Update recently used
    const updated = [toolId, ...recentlyUsed.filter(id => id !== toolId)].slice(0, 5);
    setRecentlyUsed(updated);
    localStorage.setItem('seo-tools-recent', JSON.stringify(updated));
  };

  const toggleFavorite = (toolId: ToolId) => {
    const updated = favorites.includes(toolId) 
      ? favorites.filter(id => id !== toolId)
      : [...favorites, toolId];
    setFavorites(updated);
    localStorage.setItem('seo-tools-favorites', JSON.stringify(updated));
  };

  const renderSelectedTool = () => {
    const tool = seoTools.find(t => t.id === selectedTool);
    if (!tool) return null;

    return (
      <div>
        <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <tool.icon className="w-6 h-6 text-blue-600" />
              <div>
                <h2 className="text-xl font-semibold">{tool.title}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">{tool.description}</p>
              </div>
            </div>
            <Button
              onClick={() => selectedTool && toggleFavorite(selectedTool)}
              variant="ghost"
              size="sm"
              className={selectedTool && favorites.includes(selectedTool) ? 'text-red-600' : 'text-gray-400'}
            >
              {selectedTool && favorites.includes(selectedTool) ? '❤️' : '🤍'}
            </Button>
          </div>
        </div>
        
        {(() => {
          switch (selectedTool) {
            case 'keyword-density': return <KeywordDensityTool />;
            case 'meta-generator': return <MetaTagGenerator />;
            case 'robots-txt': return <RobotsTxtGenerator />;
            case 'xml-sitemap': return <XmlSitemapGenerator />;
            case 'html-minifier': return <HtmlMinifier />;
            case 'title-checker': return <TitleTagChecker />;
            case 'meta-description-checker': return <MetaDescriptionChecker />;
            case 'serp-preview': return <SerpSnippetPreview />;
            case 'word-count': return <WebsiteWordCount />;
            default: return null;
          }
        })()}
      </div>
    );
  };

  if (selectedTool) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Button 
            onClick={() => setSelectedTool(null)} 
            variant="outline"
            size="sm"
          >
            ← Back to SEO Tools
          </Button>
        </div>
        {renderSelectedTool()}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Privacy-First SEO Tools
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Professional SEO utilities that work entirely in your browser. No data sent to servers, 
          complete privacy protection, and instant results for all your optimization needs.
        </p>
      </div>

      {/* Search Functionality */}
      <SearchFunctionality 
        tools={seoTools} 
        onSelectTool={selectTool}
      />

      {/* Workflow Templates */}
      <WorkflowTemplates onSelectTool={selectTool} />

      {/* Quick Access */}
      {(recentlyUsed.length > 0 || favorites.length > 0) && (
        <div className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Recently Used */}
            {recentlyUsed.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                  Recently Used
                </h3>
                <div className="space-y-2">
                  {recentlyUsed.slice(0, 3).map(toolId => {
                    const tool = seoTools.find(t => t.id === toolId);
                    if (!tool) return null;
                    return (
                      <Button
                        key={toolId}
                        onClick={() => selectTool(toolId)}
                        variant="ghost"
                        className="w-full justify-start h-auto p-3"
                      >
                        <tool.icon className="w-4 h-4 mr-3" />
                        <span className="text-sm">{tool.title}</span>
                      </Button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Favorites */}
            {favorites.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                  Favorites
                </h3>
                <div className="space-y-2">
                  {favorites.slice(0, 3).map(toolId => {
                    const tool = seoTools.find(t => t.id === toolId);
                    if (!tool) return null;
                    return (
                      <Button
                        key={toolId}
                        onClick={() => selectTool(toolId)}
                        variant="ghost"
                        className="w-full justify-start h-auto p-3"
                      >
                        <tool.icon className="w-4 h-4 mr-3" />
                        <span className="text-sm">{tool.title}</span>
                        <span className="ml-auto text-red-600">❤️</span>
                      </Button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Categories */}
      {categories.map(category => {
        const categoryTools = seoTools.filter(tool => 
          tool.category.toLowerCase() === category.id
        );

        return (
          <div key={category.id} className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-800`}>
                <category.icon className={`w-6 h-6 ${category.color}`} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {category.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {category.description}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryTools.map(tool => (
                <Card 
                  key={tool.id} 
                  className="hover:shadow-lg transition-all duration-200 cursor-pointer group relative"
                  onClick={() => selectTool(tool.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg group-hover:bg-blue-100 dark:group-hover:bg-blue-900/20 transition-colors">
                          <tool.icon className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 transition-colors" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                            {tool.title}
                          </CardTitle>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(tool.id);
                          }}
                          variant="ghost"
                          size="sm"
                          className={`p-1 ${favorites.includes(tool.id) ? 'text-red-600' : 'text-gray-400 hover:text-red-400'}`}
                        >
                          {favorites.includes(tool.id) ? '❤️' : '🤍'}
                        </Button>
                        {tool.badge && (
                          <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                            {tool.badge}
                          </span>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                      {tool.description}
                    </p>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="mt-3 w-full group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 group-hover:text-blue-600 transition-colors"
                    >
                      Open Tool →
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      })}

      {/* Features Section */}
      <div className="mt-16 p-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl">
        <h3 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
          Why Choose Our SEO Tools?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
            <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">100% Private</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              All processing happens in your browser. No data is ever sent to our servers.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Zap className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">Instant Results</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Get immediate analysis and optimization suggestions without delays.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-6 h-6 text-purple-600" />
            </div>
            <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">Professional Grade</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Enterprise-quality tools used by SEO professionals worldwide.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Export individual tools for routing
export {
  KeywordDensityTool,
  MetaTagGenerator,
  RobotsTxtGenerator,
  XmlSitemapGenerator,
  HtmlMinifier,
  TitleTagChecker,
  MetaDescriptionChecker,
  SerpSnippetPreview,
  WebsiteWordCount
};