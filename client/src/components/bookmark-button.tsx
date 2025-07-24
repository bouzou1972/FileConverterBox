import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { useToast } from "@/hooks/use-toast";

interface BookmarkButtonProps {
  href: string;
  title: string;
  icon: string;
  iconColor: string;
  description?: string;
}

export function BookmarkButton({ href, title, icon, iconColor, description = "" }: BookmarkButtonProps) {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const { toast } = useToast();
  
  const tool = { href, title, icon, iconColor, description };
  const bookmarked = isBookmarked(href);
  


  const handleBookmark = () => {
    toggleBookmark(tool);
    toast({
      title: bookmarked ? "Removed from bookmarks" : "Added to bookmarks",
      description: bookmarked 
        ? `${title} removed from your favorites` 
        : `${title} added to your favorites`,
    });
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleBookmark}
      className="flex items-center gap-2 rounded-xl shadow-md bg-white border-purple-200 hover:bg-purple-50 hover:border-purple-300 transition-all duration-200"
    >
      <Heart 
        className={`w-4 h-4 transition-all duration-200 ${
          bookmarked 
            ? 'text-red-500 fill-red-500' 
            : 'text-purple-500 hover:text-purple-600'
        }`} 
      />
      <span className="text-sm font-medium text-gray-700 hover:text-purple-700 transition-colors duration-200">
        {bookmarked ? 'Bookmarked' : 'Bookmark'}
      </span>
    </Button>
  );
}