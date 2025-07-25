import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, Download, Map, Plus, Trash2 } from "lucide-react";

interface SitemapUrl {
  loc: string;
  priority: string;
  changefreq: string;
  lastmod: string;
}

export function XmlSitemapGenerator() {
  const [urls, setUrls] = useState<SitemapUrl[]>([
    { loc: '', priority: '0.8', changefreq: 'weekly', lastmod: new Date().toISOString().split('T')[0] }
  ]);

  const addUrl = () => {
    setUrls([...urls, { 
      loc: '', 
      priority: '0.8', 
      changefreq: 'weekly', 
      lastmod: new Date().toISOString().split('T')[0] 
    }]);
  };

  const removeUrl = (index: number) => {
    setUrls(urls.filter((_, i) => i !== index));
  };

  const updateUrl = (index: number, field: keyof SitemapUrl, value: string) => {
    const newUrls = [...urls];
    newUrls[index][field] = value;
    setUrls(newUrls);
  };

  const generateSitemap = () => {
    const validUrls = urls.filter(url => url.loc.trim());
    
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    validUrls.forEach(url => {
      sitemap += `
  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`;
    });

    sitemap += `
</urlset>`;

    return sitemap;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateSitemap());
  };

  const downloadFile = () => {
    const content = generateSitemap();
    const blob = new Blob([content], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitemap.xml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const bulkAddUrls = (urlList: string) => {
    const urlArray = urlList.split('\n').filter(url => url.trim());
    const newUrls = urlArray.map(url => ({
      loc: url.trim(),
      priority: '0.8',
      changefreq: 'weekly',
      lastmod: new Date().toISOString().split('T')[0]
    }));
    setUrls([...urls, ...newUrls]);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Map className="w-5 h-5" />
          XML Sitemap Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Bulk Add URLs */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Bulk Add URLs</h3>
          <div className="flex gap-2">
            <textarea
              placeholder="Paste URLs here (one per line)&#10;https://example.com/&#10;https://example.com/about&#10;https://example.com/contact"
              className="flex-1 min-h-20 p-2 border border-gray-300 rounded-md resize-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.ctrlKey) {
                  bulkAddUrls(e.currentTarget.value);
                  e.currentTarget.value = '';
                }
              }}
            />
            <Button
              onClick={(e) => {
                const textarea = e.currentTarget.previousElementSibling as HTMLTextAreaElement;
                bulkAddUrls(textarea.value);
                textarea.value = '';
              }}
              variant="outline"
            >
              Add URLs
            </Button>
          </div>
          <p className="text-xs text-gray-500">Press Ctrl+Enter or click "Add URLs" to add multiple URLs at once</p>
        </div>

        {/* Individual URL Configuration */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">URL Configuration</h3>
            <Button onClick={addUrl} size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add URL
            </Button>
          </div>

          {urls.map((url, index) => (
            <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-4">
              <div className="flex items-center gap-2">
                <Input
                  value={url.loc}
                  onChange={(e) => updateUrl(index, 'loc', e.target.value)}
                  placeholder="https://example.com/page"
                  className="flex-1"
                  type="url"
                />
                {urls.length > 1 && (
                  <Button
                    onClick={() => removeUrl(index)}
                    size="sm"
                    variant="outline"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Priority</label>
                  <Select value={url.priority} onValueChange={(value) => updateUrl(index, 'priority', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1.0">1.0 (Highest)</SelectItem>
                      <SelectItem value="0.9">0.9</SelectItem>
                      <SelectItem value="0.8">0.8</SelectItem>
                      <SelectItem value="0.7">0.7</SelectItem>
                      <SelectItem value="0.6">0.6</SelectItem>
                      <SelectItem value="0.5">0.5 (Medium)</SelectItem>
                      <SelectItem value="0.4">0.4</SelectItem>
                      <SelectItem value="0.3">0.3</SelectItem>
                      <SelectItem value="0.2">0.2</SelectItem>
                      <SelectItem value="0.1">0.1 (Lowest)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Change Frequency</label>
                  <Select value={url.changefreq} onValueChange={(value) => updateUrl(index, 'changefreq', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="always">Always</SelectItem>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                      <SelectItem value="never">Never</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Last Modified</label>
                  <Input
                    value={url.lastmod}
                    onChange={(e) => updateUrl(index, 'lastmod', e.target.value)}
                    type="date"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Generated Output */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Generated XML Sitemap</h3>
            <div className="flex gap-2">
              <Button onClick={copyToClipboard} size="sm" variant="outline">
                <Copy className="w-4 h-4 mr-2" />
                Copy XML
              </Button>
              <Button onClick={downloadFile} size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 max-h-64 overflow-y-auto">
            <pre className="text-sm whitespace-pre-wrap">
              {generateSitemap()}
            </pre>
          </div>

          <div className="text-sm text-gray-600 dark:text-gray-400">
            <strong>Valid URLs:</strong> {urls.filter(url => url.loc.trim()).length} | 
            <strong> File Size:</strong> ~{Math.round(generateSitemap().length / 1024 * 100) / 100} KB
          </div>
        </div>
      </CardContent>
    </Card>
  );
}