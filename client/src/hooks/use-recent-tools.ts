import { useState, useEffect } from "react";

interface Tool {
  href: string;
  icon: string;
  iconColor: string;
  title: string;
  description: string;
}

const RECENT_TOOLS_KEY = "file-converter-recent-tools";
const MAX_RECENT_TOOLS = 5;

export function useRecentTools() {
  const [recentTools, setRecentTools] = useState<Tool[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(RECENT_TOOLS_KEY);
    if (saved) {
      try {
        setRecentTools(JSON.parse(saved));
      } catch (error) {
        console.error("Failed to parse recent tools:", error);
      }
    }
  }, []);

  const addRecentTool = (tool: Tool) => {
    setRecentTools(prev => {
      // Remove if already exists
      const filtered = prev.filter(t => t.href !== tool.href);
      // Add to beginning
      const updated = [tool, ...filtered].slice(0, MAX_RECENT_TOOLS);
      localStorage.setItem(RECENT_TOOLS_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const clearRecentTools = () => {
    setRecentTools([]);
    localStorage.removeItem(RECENT_TOOLS_KEY);
  };

  return {
    recentTools,
    addRecentTool,
    clearRecentTools
  };
}