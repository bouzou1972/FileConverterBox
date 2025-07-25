/**
 * Utility to track page views for tools
 */
export async function trackPageView(toolName: string): Promise<void> {
  try {
    await fetch("/api/page-view", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tool: toolName }),
    });
  } catch (error) {
    // Silently handle errors - we don't want to break the UI if tracking fails
    console.debug("Page view tracking failed:", error);
  }
}

/**
 * Hook to track page view on component mount
 */
export function usePageViewTracking(toolName: string): void {
  if (typeof window !== "undefined") {
    trackPageView(toolName);
  }
}

/**
 * Get all page view counts
 */
export async function getPageViews(): Promise<Record<string, number>> {
  try {
    const response = await fetch("/api/page-views");
    if (!response.ok) {
      throw new Error("Failed to fetch page views");
    }
    return await response.json();
  } catch (error) {
    console.debug("Failed to get page views:", error);
    return {};
  }
}