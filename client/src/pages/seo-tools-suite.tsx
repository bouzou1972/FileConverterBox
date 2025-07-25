import { SEOToolsHome } from "./seo-tools/seo-tools-home";
import { ToolSEO } from "@/components/tool-seo";
import { ShareButtons } from "@/components/share-buttons";
import { UsageGuide } from "@/components/usage-guide";

export default function SEOToolsSuite() {
  return (
    <div>
      <ToolSEO 
        title="Professional SEO Tools Suite - Free Privacy-First Utilities"
        description="Complete collection of SEO tools including keyword density checker, meta tag generator, robots.txt creator, XML sitemap builder, and more. All tools work offline for maximum privacy."
      />
      
      <SEOToolsHome />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <ShareButtons 
          title="Professional SEO Tools Suite - Free Privacy-First Utilities"
          description="Complete collection of 9 privacy-first SEO tools including keyword density checker, meta tag generator, robots.txt creator, and XML sitemap builder."
        />

        <UsageGuide 
          title="SEO Tools Suite"
          description="Professional-grade SEO utilities designed for marketers, developers, and content creators who need reliable, privacy-focused optimization tools."
          examples={[
            {
              title: "Complete Website SEO Audit",
              description: "Use multiple tools together for comprehensive SEO analysis",
              steps: [
                "Start with Keyword Density Tool to analyze content",
                "Check title tags and meta descriptions for optimization",
                "Preview SERP snippets for different devices",
                "Generate robots.txt and XML sitemap for crawling"
              ]
            },
            {
              title: "New Website Launch Prep", 
              description: "Set up all essential SEO elements for a new site",
              steps: [
                "Generate meta tags for all pages",
                "Create robots.txt with proper directives",
                "Build XML sitemap with all URLs",
                "Optimize HTML with minifier for performance"
              ]
            }
          ]}
          tips={[
            "All tools work completely offline - no data leaves your browser",
            "Use SERP preview to test both mobile and desktop appearances",
            "Combine keyword density analysis with title tag optimization",
            "Export generated files directly to use on your website",
            "Regular content analysis helps maintain SEO performance"
          ]}
          commonUses={[
            "Website SEO Audits",
            "Content Optimization",
            "Technical SEO Setup",
            "Performance Optimization",
            "Search Engine Compliance"
          ]}
        />
      </div>
    </div>
  );
}