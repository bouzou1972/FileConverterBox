import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, X } from "lucide-react";

interface SEOTool {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  category: string;
  keywords: string[];
}

interface SearchFunctionalityProps {
  tools: SEOTool[];
  onSelectTool: (toolId: string) => void;
}

export function SearchFunctionality({ tools, onSelectTool }: SearchFunctionalityProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SEOTool[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    const filtered = tools.filter(tool => {
      const searchTerms = query.toLowerCase().split(' ');
      const searchableText = `${tool.title} ${tool.description} ${tool.category} ${tool.keywords?.join(' ')}`.toLowerCase();
      
      return searchTerms.every(term => searchableText.includes(term));
    });

    setSearchResults(filtered);
    setShowResults(true);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
  };

  return (
    <div className="relative mb-8">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search SEO tools... (e.g., 'meta tags', 'keyword analysis', 'sitemap')"
            className="pl-10 pr-10"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Search Results */}
      {showResults && (
        <div className="absolute top-full left-0 right-0 z-50 mt-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-80 overflow-y-auto">
          {searchResults.length > 0 ? (
            <div className="p-2">
              <div className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1 mb-2">
                {searchResults.length} tool{searchResults.length !== 1 ? 's' : ''} found
              </div>
              {searchResults.map(tool => (
                <button
                  key={tool.id}
                  onClick={() => {
                    onSelectTool(tool.id);
                    clearSearch();
                  }}
                  className="w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <tool.icon className="w-5 h-5 text-blue-600" />
                    <div className="flex-1">
                      <div className="font-medium text-sm">{tool.title}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 truncate">
                        {tool.description}
                      </div>
                      <div className="text-xs text-blue-600 mt-1">{tool.category}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">
              No tools found for "{searchQuery}"
              <div className="mt-2 text-xs">
                Try searching for: meta tags, robots, sitemap, keyword, minify, title, description
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}