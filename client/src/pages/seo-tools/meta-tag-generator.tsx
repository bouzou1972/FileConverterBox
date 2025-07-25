import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Download, Tag } from "lucide-react";

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
  twitterCard: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
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
    twitterCard: 'summary_large_image',
    twitterTitle: '',
    twitterDescription: '',
    twitterImage: ''
  });

  const updateField = (field: keyof MetaTags, value: string) => {
    setMetaTags(prev => ({ ...prev, [field]: value }));
  };

  const generateMetaTags = () => {
    const tags = [
      `<meta charset="${metaTags.charset}">`,
      `<meta name="viewport" content="${metaTags.viewport}">`,
      metaTags.title && `<title>${metaTags.title}</title>`,
      metaTags.description && `<meta name="description" content="${metaTags.description}">`,
      metaTags.keywords && `<meta name="keywords" content="${metaTags.keywords}">`,
      metaTags.author && `<meta name="author" content="${metaTags.author}">`,
      '',
      '<!-- Open Graph / Facebook -->',
      metaTags.ogTitle && `<meta property="og:title" content="${metaTags.ogTitle}">`,
      metaTags.ogDescription && `<meta property="og:description" content="${metaTags.ogDescription}">`,
      metaTags.ogImage && `<meta property="og:image" content="${metaTags.ogImage}">`,
      metaTags.ogUrl && `<meta property="og:url" content="${metaTags.ogUrl}">`,
      '<meta property="og:type" content="website">',
      '',
      '<!-- Twitter -->',
      `<meta name="twitter:card" content="${metaTags.twitterCard}">`,
      metaTags.twitterTitle && `<meta name="twitter:title" content="${metaTags.twitterTitle}">`,
      metaTags.twitterDescription && `<meta name="twitter:description" content="${metaTags.twitterDescription}">`,
      metaTags.twitterImage && `<meta name="twitter:image" content="${metaTags.twitterImage}">`
    ].filter(Boolean).join('\n');

    return tags;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateMetaTags());
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