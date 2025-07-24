import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock } from "lucide-react";
import BuyMeCoffee from "@/components/buy-me-coffee";
import { BookmarkButton } from "@/components/bookmark-button";

export default function TimestampConverter() {
  const [unixInput, setUnixInput] = useState("");
  const [humanInput, setHumanInput] = useState("");
  const [timezone, setTimezone] = useState("UTC");
  const [results, setResults] = useState<string[]>([]);
  const [currentTime, setCurrentTime] = useState("");

  const updateCurrentTime = () => {
    const now = new Date();
    const timestamp = Math.floor(now.getTime() / 1000);
    setCurrentTime(`${timestamp} (${now.toLocaleString()})`);
  };

  useEffect(() => {
    updateCurrentTime();
    const interval = setInterval(updateCurrentTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const useCurrentTimestamp = () => {
    const timestamp = Math.floor(Date.now() / 1000);
    setUnixInput(timestamp.toString());
    convertFromUnix(timestamp.toString());
  };

  const convertFromUnix = (timestampStr?: string) => {
    const timestamp = timestampStr || unixInput;
    if (!timestamp) {
      setResults(["Enter a UNIX timestamp"]);
      return;
    }

    try {
      const date = new Date(parseInt(timestamp) * 1000);
      const options: Intl.DateTimeFormatOptions = { 
        timeZone: timezone,
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit',
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit'
      };

      const utcString = date.toUTCString();
      const localString = date.toLocaleString('en-US', options);
      const isoString = date.toISOString();
      const relativeTime = getRelativeTime(date);

      setResults([
        `UTC: ${utcString}`,
        `Local (${timezone}): ${localString}`,
        `ISO 8601: ${isoString}`,
        `Relative: ${relativeTime}`
      ]);
    } catch (error) {
      setResults(["Invalid timestamp"]);
    }
  };

  const convertToUnix = () => {
    if (!humanInput) {
      setResults(["Select a date and time"]);
      return;
    }

    try {
      const date = new Date(humanInput);
      const timestamp = Math.floor(date.getTime() / 1000);
      setUnixInput(timestamp.toString());

      setResults([
        `UNIX Timestamp: ${timestamp}`,
        `Milliseconds: ${date.getTime()}`,
        `UTC: ${date.toUTCString()}`,
        `ISO 8601: ${date.toISOString()}`
      ]);
    } catch (error) {
      setResults(["Invalid date"]);
    }
  };

  const getRelativeTime = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) return `${diffSec} seconds ago`;
    if (diffMin < 60) return `${diffMin} minutes ago`;
    if (diffHour < 24) return `${diffHour} hours ago`;
    return `${diffDay} days ago`;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle className="flex items-center gap-3">
              <span className="material-icons tool-purple text-3xl">schedule</span>
              Timestamp Converter
            </CardTitle>
            <BookmarkButton 
              href="/timestamp-converter"
              title="Timestamp Converter"
              icon="schedule"
              iconColor="text-purple-600"
              description="Convert Unix timestamps to human-readable dates with timezone support and relative time calculations"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Unix Timestamp Input */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  UNIX Timestamp
                </label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={unixInput}
                    onChange={(e) => setUnixInput(e.target.value)}
                    placeholder="1640995200"
                    className="font-mono"
                  />
                  <Button 
                    onClick={() => convertFromUnix()}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    Convert
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Enter timestamp in seconds</p>
              </div>

              <Button
                variant="outline"
                onClick={useCurrentTimestamp}
                className="w-full p-4 h-auto"
              >
                <div className="flex justify-between items-center w-full">
                  <span className="font-medium">Use Current Timestamp</span>
                  <Clock className="w-5 h-5" />
                </div>
                <div className="text-sm text-gray-600 mt-1 w-full text-left">
                  {currentTime}
                </div>
              </Button>
            </div>

            {/* Human Readable Input */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Human Readable Date
                </label>
                <Input
                  type="datetime-local"
                  value={humanInput}
                  onChange={(e) => setHumanInput(e.target.value)}
                  className="w-full"
                />
                <Button
                  onClick={convertToUnix}
                  className="w-full mt-2 bg-purple-600 hover:bg-purple-700"
                >
                  Convert to UNIX
                </Button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Timezone
                </label>
                <Select value={timezone} onValueChange={setTimezone}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UTC">UTC</SelectItem>
                    <SelectItem value="America/New_York">Eastern Time</SelectItem>
                    <SelectItem value="America/Chicago">Central Time</SelectItem>
                    <SelectItem value="America/Denver">Mountain Time</SelectItem>
                    <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                    <SelectItem value="Europe/London">London</SelectItem>
                    <SelectItem value="Europe/Paris">Paris</SelectItem>
                    <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-2">Conversion Results</h3>
            <div className="space-y-2">
              {results.map((result, index) => (
                <div key={index} className="text-sm font-mono text-gray-700">
                  {result}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="text-center mt-8">
        <BuyMeCoffee />
      </div>
    </div>
  );
}
