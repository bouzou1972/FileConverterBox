import { Link } from "wouter";
import { Heart } from "lucide-react";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { useToast } from "@/hooks/use-toast";

interface ToolCardProps {
  href: string;
  icon: string;
  iconColor: string;
  title: string;
  description: string;
  badge?: string;
}

export default function ToolCard({ href, icon, iconColor, title, description, badge }: ToolCardProps) {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const { toast } = useToast();
  
  const tool = { href, title, icon, iconColor, description };
  const bookmarked = isBookmarked(href);

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    toggleBookmark(tool);
    toast({
      title: bookmarked ? "Removed from bookmarks" : "Added to bookmarks",
      description: bookmarked 
        ? `${title} removed from your favorites` 
        : `${title} added to your favorites`,
    });
  };

  return (
    <div className="relative">
      <Link href={href}>
        <button 
          className="bg-card border border-border shadow-md rounded-xl p-4 sm:p-6 flex items-start gap-3 sm:gap-4 hover:shadow-lg hover:border-primary/20 transition-all duration-200 text-left w-full relative dark:hover:bg-accent/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label={`${title} - ${description}`}
        >
          {badge && (
            <span className="absolute top-3 right-3 text-xs bg-gradient-to-r from-blue-500 to-purple-600 text-white px-2 py-1 rounded-xl font-medium shadow-md">
              {badge}
            </span>
          )}
          <span className={`material-icons ${iconColor} text-3xl sm:text-4xl flex-shrink-0`} aria-hidden="true">
            {icon}
          </span>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2 text-foreground pr-8">{title}</h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{description}</p>
          </div>
        </button>
      </Link>
      
      {/* Permanent Bookmark Button */}
      <button
        onClick={handleBookmark}
        className="absolute bottom-3 right-3 p-2 rounded-full bg-white/90 border border-purple-200 shadow-md hover:bg-purple-50 hover:border-purple-300 transition-all duration-200 backdrop-blur-sm"
        aria-label={bookmarked ? "Remove bookmark" : "Add bookmark"}
      >
        <Heart 
          className={`w-4 h-4 transition-all duration-200 ${
            bookmarked 
              ? 'text-red-500 fill-red-500' 
              : 'text-purple-500'
          }`} 
        />
      </button>
    </div>
  );
}
