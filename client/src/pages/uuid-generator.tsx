import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import CopyButton from "@/components/copy-button";
import BuyMeCoffee from "@/components/buy-me-coffee";
import { BookmarkButton } from "@/components/bookmark-button";
import { generateUUID, generateBulkUUIDs } from "@/lib/utils/uuid";
import { ToolSEO } from "@/components/tool-seo";
import { ShareButtons } from "@/components/share-buttons";
import { UsageGuide } from "@/components/usage-guide";

export default function UuidGenerator() {
  const [currentUUID, setCurrentUUID] = useState("");
  const [bulkCount, setBulkCount] = useState(10);
  const [bulkUUIDs, setBulkUUIDs] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    generateNewUUID();
  }, []);

  const generateNewUUID = () => {
    const uuid = generateUUID();
    setCurrentUUID(uuid);
  };

  const generateBulkUUID = () => {
    const uuids = generateBulkUUIDs(bulkCount);
    setBulkUUIDs(uuids.join('\n'));
  };



  const usageExamples = [
    {
      title: "Database Primary Keys",
      description: "Generate unique identifiers for database records",
      steps: [
        "Click 'Generate UUID' to create a new unique identifier",
        "Copy the UUID to use as a primary key",
        "Use bulk generation for importing multiple records",
        "Ensure each record has a unique UUID identifier"
      ],
      tip: "UUIDs are globally unique and perfect for distributed databases"
    },
    {
      title: "API Development",
      description: "Create unique identifiers for REST API resources",
      steps: [
        "Generate UUIDs for new resource creation endpoints",
        "Use UUIDs as resource identifiers in API URLs",
        "Generate bulk UUIDs for testing and mock data",
        "Replace sequential IDs with UUIDs for better security"
      ]
    },
    {
      title: "Session Management",
      description: "Generate unique session tokens and tracking IDs",
      steps: [
        "Create unique session identifiers for user authentication",
        "Generate tracking IDs for analytics and logging",
        "Use UUIDs for temporary file names and cache keys",
        "Create unique identifiers for background jobs"
      ]
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <ToolSEO
        title="UUID v4 Generator"
        description="Generate UUID v4 identifiers with bulk generation options. Free online UUID generator for unique identification needs in databases and applications."
        keywords={["uuid generator", "uuid v4", "unique identifier", "guid generator", "uuid bulk", "uuid tool"]}
        canonicalUrl={typeof window !== 'undefined' ? window.location.href : undefined}
      />
      
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle className="flex items-center gap-3">
              <span className="material-icons tool-yellow text-3xl">vpn_key</span>
              UUID v4 Generator
            </CardTitle>
            <BookmarkButton 
              href="/uuid-generator"
              title="UUID Generator"
              icon="vpn_key"
              iconColor="text-yellow-600"
              description="Generate UUID v4 identifiers with bulk generation options for unique identification needs"
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Single UUID Generation */}
          <div className="text-center">
            <Button
              onClick={generateNewUUID}
              size="lg"
              className="bg-amber-500 hover:bg-amber-600 transform hover:scale-105 transition-all duration-200"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Generate New UUID
            </Button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Generated UUID
            </label>
            <div className="flex gap-2">
              <Input
                type="text"
                value={currentUUID}
                readOnly
                className="font-mono text-lg bg-gray-50"
              />
              <CopyButton 
                text={currentUUID} 
                label="Copy"
              />
            </div>
          </div>

          {/* Bulk Generation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bulk Generation
            </label>
            <div className="flex gap-2 mb-4">
              <Input
                type="number"
                min="1"
                max="1000"
                value={bulkCount}
                onChange={(e) => setBulkCount(parseInt(e.target.value) || 1)}
                className="w-24"
              />
              <Button
                onClick={generateBulkUUID}
                className="bg-amber-500 hover:bg-amber-600"
              >
                Generate Multiple
              </Button>
              <CopyButton 
                text={bulkUUIDs} 
                label="Copy All"
                variant="outline"
              />
            </div>
            <Textarea
              value={bulkUUIDs}
              readOnly
              placeholder="Generated UUIDs will appear here..."
              className="h-48 font-mono bg-gray-50 resize-none"
            />
          </div>
        </CardContent>
      </Card>
      
      <ShareButtons 
        url={typeof window !== 'undefined' ? window.location.href : ''}
        title="UUID v4 Generator - Free Online Unique Identifier Tool"
        description="Generate UUID v4 identifiers with bulk generation options for databases, APIs, and applications."
      />
      
      <UsageGuide 
        title="UUID v4 Generator Usage Guide"
        description="Learn how to effectively generate and use UUID v4 identifiers for databases, APIs, and applications"
        examples={usageExamples}
      />

      <div className="text-center mt-8">
        <BuyMeCoffee />
        <p className="text-sm text-gray-600 mt-2">
          Thanks for using this free tool! Your support keeps it ad-free and private.
        </p>
      </div>
    </div>
  );
}
