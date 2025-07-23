import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import CopyButton from "@/components/copy-button";
import BuyMeCoffee from "@/components/buy-me-coffee";
import { generateUUID, generateBulkUUIDs } from "@/lib/utils/uuid";

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



  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <span className="material-icons tool-yellow text-3xl">vpn_key</span>
            UUID v4 Generator
          </CardTitle>
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
      
      <div className="text-center mt-8">
        <BuyMeCoffee />
        <p className="text-sm text-gray-600 mt-2">
          Thanks for using this free tool! Your support keeps it ad-free and private.
        </p>
      </div>
    </div>
  );
}
