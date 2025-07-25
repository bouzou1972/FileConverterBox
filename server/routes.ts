import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import fs from "fs/promises";
import path from "path";

const PAGE_VIEWS_FILE = path.join(process.cwd(), "page-views.json");

// Initialize page views file if it doesn't exist
async function initPageViewsFile() {
  try {
    await fs.access(PAGE_VIEWS_FILE);
  } catch {
    await fs.writeFile(PAGE_VIEWS_FILE, JSON.stringify({}));
  }
}

// Read page views from file
async function getPageViews(): Promise<Record<string, number>> {
  try {
    const data = await fs.readFile(PAGE_VIEWS_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return {};
  }
}

// Write page views to file
async function savePageViews(views: Record<string, number>) {
  await fs.writeFile(PAGE_VIEWS_FILE, JSON.stringify(views, null, 2));
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize page views file
  await initPageViewsFile();

  // Track page view endpoint
  app.post("/api/page-view", async (req, res) => {
    try {
      const { tool } = req.body;
      
      if (!tool || typeof tool !== "string") {
        return res.status(400).json({ error: "Tool name is required" });
      }

      const views = await getPageViews();
      views[tool] = (views[tool] || 0) + 1;
      await savePageViews(views);

      res.json({ success: true, tool, count: views[tool] });
    } catch (error) {
      console.error("Error tracking page view:", error);
      res.status(500).json({ error: "Failed to track page view" });
    }
  });

  // Get page views endpoint
  app.get("/api/page-views", async (req, res) => {
    try {
      const views = await getPageViews();
      res.json(views);
    } catch (error) {
      console.error("Error getting page views:", error);
      res.status(500).json({ error: "Failed to get page views" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
