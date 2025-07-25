import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Heart, Star, TrendingUp } from "lucide-react";

interface Tool {
  href: string;
  icon: string;
  iconColor: string;
  title: string;
  description: string;
  usageCount: number;
  lastUsed: string;
}

interface FavoritesModalProps {
  favorites: Tool[];
  trigger: React.ReactNode;
}

export function FavoritesModal({ favorites, trigger }: FavoritesModalProps) {
  const [open, setOpen] = useState(false);

  const formatLastUsed = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const FavoriteToolCard = ({ tool }: { tool: Tool }) => (
    <Link href={tool.href}>
      <Card className="hover:shadow-md transition-all duration-200 cursor-pointer group bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-red-200 dark:hover:border-red-600">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-lg bg-gray-50 dark:bg-gray-700 group-hover:bg-red-50 dark:group-hover:bg-red-900/20 transition-colors`}>
              <span className={`material-icons text-xl ${tool.iconColor}`}>{tool.icon}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-semibold text-sm text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors line-clamp-2">
                  {tool.title}
                </h3>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                </div>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors mb-3">
                {tool.description}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs bg-red-50 text-red-700 border-red-200">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Used {tool.usageCount} times
                  </Badge>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {formatLastUsed(tool.lastUsed)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Heart className="w-6 h-6 text-red-500" />
            Your Favorite Tools
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {favorites.length} tools • Sorted by usage count
            </p>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="text-xs text-gray-500">Most used tools appear first</span>
            </div>
          </div>
          
          <div className="max-h-[50vh] overflow-y-auto pr-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {favorites.map((tool, index) => (
                <div key={tool.href} className="relative">
                  {index === 0 && (
                    <div className="absolute -top-2 -right-2 z-10">
                      <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-yellow-900 border-yellow-300 text-xs font-bold">
                        #1 Most Used
                      </Badge>
                    </div>
                  )}
                  <FavoriteToolCard tool={tool} />
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                💡 <strong>Tip:</strong> Tools are automatically sorted by how often you use them
              </p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setOpen(false)}
                className="bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
              >
                <Heart className="w-4 h-4 mr-2" />
                Close Favorites
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}