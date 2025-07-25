import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Copy, Download, Shield, Plus, Trash2 } from "lucide-react";

interface RobotRule {
  userAgent: string;
  allow: string[];
  disallow: string[];
}

export function RobotsTxtGenerator() {
  const [rules, setRules] = useState<RobotRule[]>([
    { userAgent: '*', allow: [], disallow: [] }
  ]);
  const [sitemap, setSitemap] = useState('');
  const [crawlDelay, setCrawlDelay] = useState('');
  const [host, setHost] = useState('');

  const addRule = () => {
    setRules([...rules, { userAgent: '', allow: [], disallow: [] }]);
  };

  const removeRule = (index: number) => {
    setRules(rules.filter((_, i) => i !== index));
  };

  const updateUserAgent = (index: number, userAgent: string) => {
    const newRules = [...rules];
    newRules[index].userAgent = userAgent;
    setRules(newRules);
  };

  const addPath = (ruleIndex: number, type: 'allow' | 'disallow', path: string) => {
    if (!path.trim()) return;
    
    const newRules = [...rules];
    newRules[ruleIndex][type].push(path);
    setRules(newRules);
  };

  const removePath = (ruleIndex: number, type: 'allow' | 'disallow', pathIndex: number) => {
    const newRules = [...rules];
    newRules[ruleIndex][type].splice(pathIndex, 1);
    setRules(newRules);
  };

  const generateRobotsTxt = () => {
    let robotsTxt = '';

    rules.forEach(rule => {
      if (rule.userAgent) {
        robotsTxt += `User-agent: ${rule.userAgent}\n`;
        
        rule.disallow.forEach(path => {
          robotsTxt += `Disallow: ${path}\n`;
        });
        
        rule.allow.forEach(path => {
          robotsTxt += `Allow: ${path}\n`;
        });

        if (crawlDelay && rule.userAgent !== '*') {
          robotsTxt += `Crawl-delay: ${crawlDelay}\n`;
        }
        
        robotsTxt += '\n';
      }
    });

    if (host) {
      robotsTxt += `Host: ${host}\n\n`;
    }

    if (sitemap) {
      robotsTxt += `Sitemap: ${sitemap}\n`;
    }

    return robotsTxt.trim();
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateRobotsTxt());
  };

  const downloadFile = () => {
    const content = generateRobotsTxt();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'robots.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const presetTemplates = {
    allowAll: () => setRules([{ userAgent: '*', allow: ['/'], disallow: [] }]),
    blockAll: () => setRules([{ userAgent: '*', allow: [], disallow: ['/'] }]),
    standard: () => setRules([
      { userAgent: '*', allow: [], disallow: ['/admin/', '/private/', '/wp-admin/'] }
    ])
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Robots.txt Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Quick Templates */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Quick Templates</h3>
          <div className="flex gap-2 flex-wrap">
            <Button onClick={presetTemplates.allowAll} size="sm" variant="outline">
              Allow All
            </Button>
            <Button onClick={presetTemplates.blockAll} size="sm" variant="outline">
              Block All
            </Button>
            <Button onClick={presetTemplates.standard} size="sm" variant="outline">
              Standard Setup
            </Button>
          </div>
        </div>

        {/* User-Agent Rules */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">User-Agent Rules</h3>
            <Button onClick={addRule} size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add Rule
            </Button>
          </div>

          {rules.map((rule, ruleIndex) => (
            <div key={ruleIndex} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-4">
              <div className="flex items-center gap-2">
                <Input
                  value={rule.userAgent}
                  onChange={(e) => updateUserAgent(ruleIndex, e.target.value)}
                  placeholder="User-agent (e.g., *, Googlebot, Bingbot)"
                  className="flex-1"
                />
                {rules.length > 1 && (
                  <Button
                    onClick={() => removeRule(ruleIndex)}
                    size="sm"
                    variant="outline"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Disallow Paths */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-red-600">Disallow Paths</label>
                  {rule.disallow.map((path, pathIndex) => (
                    <div key={pathIndex} className="flex items-center gap-2">
                      <Input value={path} readOnly className="flex-1" />
                      <Button
                        onClick={() => removePath(ruleIndex, 'disallow', pathIndex)}
                        size="sm"
                        variant="outline"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <Input
                      placeholder="/private/, /admin/"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          addPath(ruleIndex, 'disallow', e.currentTarget.value);
                          e.currentTarget.value = '';
                        }
                      }}
                      className="flex-1"
                    />
                    <Button
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                        addPath(ruleIndex, 'disallow', input.value);
                        input.value = '';
                      }}
                      size="sm"
                      variant="outline"
                    >
                      Add
                    </Button>
                  </div>
                </div>

                {/* Allow Paths */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-green-600">Allow Paths</label>
                  {rule.allow.map((path, pathIndex) => (
                    <div key={pathIndex} className="flex items-center gap-2">
                      <Input value={path} readOnly className="flex-1" />
                      <Button
                        onClick={() => removePath(ruleIndex, 'allow', pathIndex)}
                        size="sm"
                        variant="outline"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <Input
                      placeholder="/public/, /images/"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          addPath(ruleIndex, 'allow', e.currentTarget.value);
                          e.currentTarget.value = '';
                        }
                      }}
                      className="flex-1"
                    />
                    <Button
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                        addPath(ruleIndex, 'allow', input.value);
                        input.value = '';
                      }}
                      size="sm"
                      variant="outline"
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Settings */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Additional Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Sitemap URL</label>
              <Input
                value={sitemap}
                onChange={(e) => setSitemap(e.target.value)}
                placeholder="https://example.com/sitemap.xml"
                type="url"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Crawl Delay (seconds)</label>
              <Input
                value={crawlDelay}
                onChange={(e) => setCrawlDelay(e.target.value)}
                placeholder="10"
                type="number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Host (Preferred Domain)</label>
              <Input
                value={host}
                onChange={(e) => setHost(e.target.value)}
                placeholder="https://example.com"
                type="url"
              />
            </div>
          </div>
        </div>

        {/* Generated Output */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Generated robots.txt</h3>
            <div className="flex gap-2">
              <Button onClick={copyToClipboard} size="sm" variant="outline">
                <Copy className="w-4 h-4 mr-2" />
                Copy Text
              </Button>
              <Button onClick={downloadFile} size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <pre className="text-sm overflow-x-auto whitespace-pre-wrap">
              {generateRobotsTxt()}
            </pre>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}