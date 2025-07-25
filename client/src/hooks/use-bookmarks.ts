import { useState, useEffect } from "react";

interface Tool {
  href: string;
  icon: string;
  iconColor: string;
  title: string;
  description: string;
}

interface BookmarkedTool extends Tool {
  usageCount: number;
  lastUsed: string;
}

const BOOKMARKS_KEY = "file-converter-bookmarks";
const USAGE_COUNT_KEY = "file-converter-usage-count";

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<BookmarkedTool[]>([]);
  const [usageCount, setUsageCount] = useState<Record<string, number>>({});

  useEffect(() => {
    const saved = localStorage.getItem(BOOKMARKS_KEY);
    const savedUsage = localStorage.getItem(USAGE_COUNT_KEY);
    
    if (saved) {
      try {
        const parsedBookmarks = JSON.parse(saved);
        setBookmarks(parsedBookmarks);
      } catch (error) {
        console.error("Failed to parse bookmarks:", error);
      }
    }

    if (savedUsage) {
      try {
        setUsageCount(JSON.parse(savedUsage));
      } catch (error) {
        console.error("Failed to parse usage count:", error);
      }
    }
  }, []);

  const isBookmarked = (href: string) => {
    return bookmarks.some(tool => tool.href === href);
  };

  const incrementUsage = (href: string) => {
    const newUsageCount = { ...usageCount, [href]: (usageCount[href] || 0) + 1 };
    setUsageCount(newUsageCount);
    localStorage.setItem(USAGE_COUNT_KEY, JSON.stringify(newUsageCount));

    // Update usage count in bookmarks if tool is bookmarked
    setBookmarks(prev => {
      const updated = prev.map(tool => 
        tool.href === href 
          ? { ...tool, usageCount: newUsageCount[href], lastUsed: new Date().toISOString() }
          : tool
      );
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const toggleBookmark = (tool: Tool) => {
    setBookmarks(prev => {
      let updated;
      if (prev.some(t => t.href === tool.href)) {
        // Remove bookmark
        updated = prev.filter(t => t.href !== tool.href);
      } else {
        // Add bookmark with initial usage count
        const newBookmark: BookmarkedTool = {
          ...tool,
          usageCount: usageCount[tool.href] || 0,
          lastUsed: new Date().toISOString()
        };
        updated = [...prev, newBookmark];
      }
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const getBookmarksSortedByUsage = () => {
    return [...bookmarks].sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0));
  };

  const clearBookmarks = () => {
    setBookmarks([]);
    localStorage.removeItem(BOOKMARKS_KEY);
  };

  return {
    bookmarks,
    bookmarksSortedByUsage: getBookmarksSortedByUsage(),
    isBookmarked,
    toggleBookmark,
    incrementUsage,
    clearBookmarks,
    usageCount
  };
}