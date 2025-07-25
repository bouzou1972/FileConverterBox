import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getPageViews } from "@/utils/track-page-view";

export function DebugPageViews() {
  const [pageViews, setPageViews] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);

  const fetchPageViews = async () => {
    setLoading(true);
    try {
      const views = await getPageViews();
      setPageViews(views);
    } catch (error) {
      console.error("Failed to fetch page views:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPageViews();
  }, []);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Page View Counts
          <Button 
            onClick={fetchPageViews} 
            disabled={loading}
            size="sm"
            variant="outline"
          >
            {loading ? "Loading..." : "Refresh"}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {Object.keys(pageViews).length === 0 ? (
          <p className="text-gray-500 text-sm">No page views tracked yet</p>
        ) : (
          <div className="space-y-2">
            {Object.entries(pageViews)
              .sort(([, a], [, b]) => b - a)
              .map(([tool, count]) => (
                <div key={tool} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                  <span className="text-sm font-medium">{tool}</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{count} views</span>
                </div>
              ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}