import { useState, useEffect } from "react";

interface Tool {
  href: string;
  icon: string;
  iconColor: string;
  title: string;
  description: string;
}

const BOOKMARKS_KEY = "file-converter-bookmarks";

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Tool[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(BOOKMARKS_KEY);
    if (saved) {
      try {
        setBookmarks(JSON.parse(saved));
      } catch (error) {
        console.error("Failed to parse bookmarks:", error);
      }
    }
  }, []);

  const isBookmarked = (href: string) => {
    return bookmarks.some(tool => tool.href === href);
  };

  const toggleBookmark = (tool: Tool) => {
    setBookmarks(prev => {
      let updated;
      if (prev.some(t => t.href === tool.href)) {
        // Remove bookmark
        updated = prev.filter(t => t.href !== tool.href);
      } else {
        // Add bookmark
        updated = [...prev, tool];
      }
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const clearBookmarks = () => {
    setBookmarks([]);
    localStorage.removeItem(BOOKMARKS_KEY);
  };

  return {
    bookmarks,
    isBookmarked,
    toggleBookmark,
    clearBookmarks
  };
}