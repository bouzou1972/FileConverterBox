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

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Tag className="w-5 h-5" />
          Enhanced Meta Tag Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Validation Status */}
        {validationErrors.length > 0 && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <span className="text-sm font-medium text-red-800 dark:text-red-200">Validation Issues</span>
            </div>
            <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index}>• {error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Presets */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Quick Presets</label>
          <div className="flex gap-2">
            <Button onClick={() => loadPreset('homepage')} size="sm" variant="outline">
              Homepage
            </Button>
            <Button onClick={() => loadPreset('blog')} size="sm" variant="outline">
              Blog/Article
            </Button>
            <Button onClick={() => loadPreset('ecommerce')} size="sm" variant="outline">
              E-commerce
            </Button>
            <Button onClick={autoFillFromBasic} size="sm" variant="outline">
              Auto-fill Social
            </Button>
          </div>
        </div>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic SEO</TabsTrigger>
            <TabsTrigger value="social">Social Media</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Page Title *</label>
                <Input
                  value={metaTags.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  placeholder="Your page title..."
                  className="w-full"
                />
                <div className={`text-xs mt-1 ${metaTags.title.length > 60 ? 'text-red-500' : 'text-gray-500'}`}>
                  {metaTags.title.length}/60 characters
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Canonical URL</label>
                <Input
                  value={metaTags.canonical}
                  onChange={(e) => updateField('canonical', e.target.value)}
                  placeholder="https://example.com/page"
                  type="url"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Meta Description *</label>
              <Textarea
                value={metaTags.description}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder="Compelling description of your page..."
                className="min-h-20"
              />
              <div className={`text-xs mt-1 ${metaTags.description.length > 160 ? 'text-red-500' : 'text-gray-500'}`}>
                {metaTags.description.length}/160 characters
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Keywords</label>
                <Input
                  value={metaTags.keywords}
                  onChange={(e) => updateField('keywords', e.target.value)}
                  placeholder="keyword1, keyword2, keyword3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Author</label>
                <Input
                  value={metaTags.author}
                  onChange={(e) => updateField('author', e.target.value)}
                  placeholder="John Doe"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="social" className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4 mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Open Graph (Facebook)
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">OG Title</label>
                <Input
                  value={metaTags.ogTitle}
                  onChange={(e) => updateField('ogTitle', e.target.value)}
                  placeholder="Open Graph title..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">OG URL</label>
                <Input
                  value={metaTags.ogUrl}
                  onChange={(e) => updateField('ogUrl', e.target.value)}
                  placeholder="https://example.com/page"
                  type="url"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">OG Description</label>
              <Textarea
                value={metaTags.ogDescription}
                onChange={(e) => updateField('ogDescription', e.target.value)}
                placeholder="Open Graph description..."
                className="min-h-16"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">OG Image URL</label>
                <Input
                  value={metaTags.ogImage}
                  onChange={(e) => updateField('ogImage', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  type="url"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Site Name</label>
                <Input
                  value={metaTags.ogSiteName}
                  onChange={(e) => updateField('ogSiteName', e.target.value)}
                  placeholder="Your Site Name"
                />
              </div>
            </div>

            <div className="border-l-4 border-blue-400 pl-4 mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Twitter className="w-4 h-4" />
                Twitter Cards
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Card Type</label>
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
                <label className="block text-sm font-medium mb-2">Twitter Site</label>
                <Input
                  value={metaTags.twitterSite}
                  onChange={(e) => updateField('twitterSite', e.target.value)}
                  placeholder="@yourusername"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Twitter Creator</label>
                <Input
                  value={metaTags.twitterCreator}
                  onChange={(e) => updateField('twitterCreator', e.target.value)}
                  placeholder="@creator"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Robots</label>
                <Select value={metaTags.robots} onValueChange={(value) => updateField('robots', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="index, follow">Index, Follow</SelectItem>
                    <SelectItem value="noindex, nofollow">NoIndex, NoFollow</SelectItem>
                    <SelectItem value="index, nofollow">Index, NoFollow</SelectItem>
                    <SelectItem value="noindex, follow">NoIndex, Follow</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Language</label>
                <Select value={metaTags.language} onValueChange={(value) => updateField('language', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                    <SelectItem value="it">Italian</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Theme Color</label>
                <Input
                  value={metaTags.themeColor}
                  onChange={(e) => updateField('themeColor', e.target.value)}
                  placeholder="#ffffff"
                  type="color"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Viewport</label>
                <Input
                  value={metaTags.viewport}
                  onChange={(e) => updateField('viewport', e.target.value)}
                  placeholder="width=device-width, initial-scale=1.0"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="space-y-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h3 className="font-semibold mb-2">Generated Meta Tags</h3>
              <pre className="text-sm bg-white dark:bg-gray-900 p-3 rounded border overflow-x-auto">
                {generateMetaTags()}
              </pre>
            </div>
          </TabsContent>
        </Tabs>

        {/* Actions */}
        <div className="flex gap-2 mt-6">
          <Button onClick={copyToClipboard} size="sm">
            <Copy className="w-4 h-4 mr-2" />
            Copy Tags
          </Button>
          <Button onClick={downloadHtml} size="sm" variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Download HTML
          </Button>
          <input
            type="file"
            accept=".json"
            onChange={loadFromJson}
            className="hidden"
            id="json-upload"
          />
          <label htmlFor="json-upload">
            <Button variant="outline" size="sm" asChild>
              <span className="cursor-pointer">
                <Upload className="w-4 h-4 mr-2" />
                Load JSON
              </span>
            </Button>
          </label>
        </div>
      </CardContent>
    </Card>
  );
}