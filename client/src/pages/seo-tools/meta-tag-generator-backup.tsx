import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Copy, Download, Tag, Upload, CheckCircle, AlertCircle, Globe, Twitter } from "lucide-react";

interface MetaTags {
  title: string;
  description: string;
  keywords: string;
  author: string;
  viewport: string;
  charset: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogUrl: string;
  ogType: string;
  ogSiteName: string;
  twitterCard: string;
  twitterSite: string;
  twitterCreator: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  canonical: string;
  robots: string;
  language: string;
  themeColor: string;
}

export function MetaTagGenerator() {
  const [metaTags, setMetaTags] = useState<MetaTags>({
    title: '',
    description: '',
    keywords: '',
    author: '',
    viewport: 'width=device-width, initial-scale=1.0',
    charset: 'UTF-8',
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    ogUrl: '',
    ogType: 'website',
    ogSiteName: '',
    twitterCard: 'summary_large_image',
    twitterSite: '',
    twitterCreator: '',
    twitterTitle: '',
    twitterDescription: '',
    twitterImage: '',
    canonical: '',
    robots: 'index, follow',
    language: 'en',
    themeColor: '#ffffff'
  });

  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [presets, setPresets] = useState<string>('');

  const updateField = (field: keyof MetaTags, value: string) => {
    setMetaTags(prev => ({ ...prev, [field]: value }));
  };

  const validateTags = () => {
    const errors = [];
    
    if (!metaTags.title) errors.push('Title is required');
    if (metaTags.title.length > 60) errors.push('Title should be under 60 characters');
    if (!metaTags.description) errors.push('Description is required');
    if (metaTags.description.length > 160) errors.push('Description should be under 160 characters');
    if (metaTags.ogImage && !metaTags.ogImage.startsWith('http')) errors.push('Open Graph image must be a full URL');
    if (metaTags.twitterImage && !metaTags.twitterImage.startsWith('http')) errors.push('Twitter image must be a full URL');
    
    setValidationErrors(errors);
    return errors.length === 0;
  };

  const generateMetaTags = () => {
    const tags = [
      `<meta charset="${metaTags.charset}">`,
      `<meta name="viewport" content="${metaTags.viewport}">`,
      metaTags.language && `<meta http-equiv="content-language" content="${metaTags.language}">`,
      metaTags.title && `<title>${metaTags.title}</title>`,
      metaTags.description && `<meta name="description" content="${metaTags.description}">`,
      metaTags.keywords && `<meta name="keywords" content="${metaTags.keywords}">`,
      metaTags.author && `<meta name="author" content="${metaTags.author}">`,
      metaTags.robots && `<meta name="robots" content="${metaTags.robots}">`,
      metaTags.canonical && `<link rel="canonical" href="${metaTags.canonical}">`,
      metaTags.themeColor && `<meta name="theme-color" content="${metaTags.themeColor}">`,
      '',
      '<!-- Open Graph / Facebook -->',
      `<meta property="og:type" content="${metaTags.ogType}">`,
      metaTags.ogTitle && `<meta property="og:title" content="${metaTags.ogTitle}">`,
      metaTags.ogDescription && `<meta property="og:description" content="${metaTags.ogDescription}">`,
      metaTags.ogImage && `<meta property="og:image" content="${metaTags.ogImage}">`,
      metaTags.ogUrl && `<meta property="og:url" content="${metaTags.ogUrl}">`,
      metaTags.ogSiteName && `<meta property="og:site_name" content="${metaTags.ogSiteName}">`,
      '',
      '<!-- Twitter -->',
      `<meta name="twitter:card" content="${metaTags.twitterCard}">`,
      metaTags.twitterSite && `<meta name="twitter:site" content="${metaTags.twitterSite}">`,
      metaTags.twitterCreator && `<meta name="twitter:creator" content="${metaTags.twitterCreator}">`,
      metaTags.twitterTitle && `<meta name="twitter:title" content="${metaTags.twitterTitle}">`,
      metaTags.twitterDescription && `<meta name="twitter:description" content="${metaTags.twitterDescription}">`,
      metaTags.twitterImage && `<meta name="twitter:image" content="${metaTags.twitterImage}">`
    ].filter(Boolean).join('\n');

    return tags;
  };

  const loadPreset = (presetType: string) => {
    switch (presetType) {
      case 'blog':
        setMetaTags(prev => ({
          ...prev,
          ogType: 'article',
          twitterCard: 'summary_large_image',
          robots: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1'
        }));
        break;
      case 'ecommerce':
        setMetaTags(prev => ({
          ...prev,
          ogType: 'product',
          twitterCard: 'summary_large_image',
          robots: 'index, follow, max-snippet:-1, max-image-preview:large'
        }));
        break;
      case 'homepage':
        setMetaTags(prev => ({
          ...prev,
          ogType: 'website',
          twitterCard: 'summary',
          robots: 'index, follow'
        }));
        break;
    }
  };

  const autoFillFromBasic = () => {
    setMetaTags(prev => ({
      ...prev,
      ogTitle: prev.ogTitle || prev.title,
      ogDescription: prev.ogDescription || prev.description,
      twitterTitle: prev.twitterTitle || prev.title,
      twitterDescription: prev.twitterDescription || prev.description
    }));
  };

  const copyToClipboard = () => {
    validateTags();
    navigator.clipboard.writeText(generateMetaTags());
  };

  const downloadHtml = () => {
    validateTags();
    const content = generateMetaTags();
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'meta-tags.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const loadFromJson = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/json') {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          setMetaTags({ ...metaTags, ...data });
        } catch (error) {
          console.error('Invalid JSON file');
        }
      };
      reader.readAsText(file);
    }
  };

  const downloadFile = () => {
    const content = generateMetaTags();
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'meta-tags.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Tag className="w-5 h-5" />
          Meta Tag Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Meta Tags */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Basic Meta Tags</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Page Title</label>
              <Input
                value={metaTags.title}
                onChange={(e) => updateField('title', e.target.value)}
                placeholder="Your page title (50-60 characters)"
                maxLength={60}
              />
              <div className="text-xs text-gray-500 mt-1">{metaTags.title.length}/60</div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Author</label>
              <Input
                value={metaTags.author}
                onChange={(e) => updateField('author', e.target.value)}
                placeholder="Author name"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Meta Description</label>
            <Textarea
              value={metaTags.description}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="Brief description of your page (150-160 characters)"
              maxLength={160}
              rows={3}
            />
            <div className="text-xs text-gray-500 mt-1">{metaTags.description.length}/160</div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Keywords (comma-separated)</label>
            <Input
              value={metaTags.keywords}
              onChange={(e) => updateField('keywords', e.target.value)}
              placeholder="keyword1, keyword2, keyword3"
            />
          </div>
        </div>

        {/* Open Graph Tags */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Open Graph (Facebook)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">OG Title</label>
              <Input
                value={metaTags.ogTitle}
                onChange={(e) => updateField('ogTitle', e.target.value)}
                placeholder="Facebook share title"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">OG Image URL</label>
              <Input
                value={metaTags.ogImage}
                onChange={(e) => updateField('ogImage', e.target.value)}
                placeholder="https://example.com/image.jpg"
                type="url"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">OG URL</label>
              <Input
                value={metaTags.ogUrl}
                onChange={(e) => updateField('ogUrl', e.target.value)}
                placeholder="https://example.com/page"
                type="url"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">OG Description</label>
            <Textarea
              value={metaTags.ogDescription}
              onChange={(e) => updateField('ogDescription', e.target.value)}
              placeholder="Facebook share description"
              rows={2}
            />
          </div>
        </div>

        {/* Twitter Tags */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Twitter Cards</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Card Type</label>
              <Select value={metaTags.twitterCard} onValueChange={(value) => updateField('twitterCard', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="summary">Summary</SelectItem>
                  <SelectItem value="summary_large_image">Summary Large Image</SelectItem>
                  <SelectItem value="app">App</SelectItem>
                  <SelectItem value="player">Player</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Twitter Image</label>
              <Input
                value={metaTags.twitterImage}
                onChange={(e) => updateField('twitterImage', e.target.value)}
                placeholder="https://example.com/image.jpg"
                type="url"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Twitter Title</label>
              <Input
                value={metaTags.twitterTitle}
                onChange={(e) => updateField('twitterTitle', e.target.value)}
                placeholder="Twitter share title"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Twitter Description</label>
            <Textarea
              value={metaTags.twitterDescription}
              onChange={(e) => updateField('twitterDescription', e.target.value)}
              placeholder="Twitter share description"
              rows={2}
            />
          </div>
        </div>

        {/* Generated Tags Preview */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Generated Meta Tags</h3>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <pre className="text-sm overflow-x-auto whitespace-pre-wrap">{generateMetaTags()}</pre>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button onClick={copyToClipboard} size="sm">
            <Copy className="w-4 h-4 mr-2" />
            Copy Tags
          </Button>
          <Button onClick={downloadHtml} size="sm" variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Download HTML
          </Button>
        </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Twitter Title</label>
              <Input
                value={metaTags.twitterTitle}
                onChange={(e) => updateField('twitterTitle', e.target.value)}
                placeholder="Twitter share title"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Twitter Image URL</label>
              <Input
                value={metaTags.twitterImage}
                onChange={(e) => updateField('twitterImage', e.target.value)}
                placeholder="https://example.com/twitter-image.jpg"
                type="url"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Twitter Description</label>
            <Textarea
              value={metaTags.twitterDescription}
              onChange={(e) => updateField('twitterDescription', e.target.value)}
              placeholder="Twitter share description"
              rows={2}
            />
          </div>
        </div>

        {/* Generated Output */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Generated Meta Tags</h3>
            <div className="flex gap-2">
              <Button onClick={copyToClipboard} size="sm" variant="outline">
                <Copy className="w-4 h-4 mr-2" />
                Copy HTML
              </Button>
              <Button onClick={downloadFile} size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <pre className="text-sm overflow-x-auto whitespace-pre-wrap">
              {generateMetaTags()}
            </pre>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}