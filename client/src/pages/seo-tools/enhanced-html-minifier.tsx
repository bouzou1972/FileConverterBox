import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Download, Code, FileText, Zap, BarChart3 } from "lucide-react";

interface MinifyOptions {
  removeComments: boolean;
  collapseWhitespace: boolean;
  removeEmptyAttributes: boolean;
  removeOptionalTags: boolean;
  removeRedundantAttributes: boolean;
  removeScriptTypeAttributes: boolean;
  removeStyleLinkTypeAttributes: boolean;
  minifyCSS: boolean;
  minifyJS: boolean;
  removeEmptyElements: boolean;
}

interface MinifyStats {
  originalSize: number;
  minifiedSize: number;
  savings: number;
  compressionRatio: number;
  lines: {
    original: number;
    minified: number;
  };
}

export function EnhancedHtmlMinifier() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [stats, setStats] = useState<MinifyStats | null>(null);
  const [mode, setMode] = useState<'minify' | 'beautify'>('minify');
  
  const [options, setOptions] = useState<MinifyOptions>({
    removeComments: true,
    collapseWhitespace: true,
    removeEmptyAttributes: true,
    removeOptionalTags: false,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    minifyCSS: true,
    minifyJS: false,
    removeEmptyElements: false
  });

  const updateOption = (key: keyof MinifyOptions, value: boolean) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  const minifyHtml = () => {
    if (!input.trim()) return;

    let result = input;

    if (mode === 'minify') {
      // Remove comments
      if (options.removeComments) {
        result = result.replace(/<!--[\s\S]*?-->/g, '');
      }

      // Collapse whitespace
      if (options.collapseWhitespace) {
        result = result.replace(/\s+/g, ' ');
        result = result.replace(/>\s+</g, '><');
        result = result.trim();
      }

      // Remove empty attributes
      if (options.removeEmptyAttributes) {
        result = result.replace(/\s+(\w+)=""/g, '');
        result = result.replace(/\s+(\w+)=''/g, '');
      }

      // Remove optional tags
      if (options.removeOptionalTags) {
        result = result.replace(/<\/?(html|head|body)\b[^>]*>/gi, '');
      }

      // Remove redundant attributes
      if (options.removeRedundantAttributes) {
        result = result.replace(/\s+method="get"/gi, '');
        result = result.replace(/\s+type="text"/gi, '');
      }

      // Remove script type attributes
      if (options.removeScriptTypeAttributes) {
        result = result.replace(/(<script[^>]*)\s+type=["']text\/javascript["']/gi, '$1');
      }

      // Remove style/link type attributes  
      if (options.removeStyleLinkTypeAttributes) {
        result = result.replace(/(<link[^>]*)\s+type=["']text\/css["']/gi, '$1');
        result = result.replace(/(<style[^>]*)\s+type=["']text\/css["']/gi, '$1');
      }

      // Basic CSS minification
      if (options.minifyCSS) {
        result = result.replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, (match, css) => {
          const minifiedCSS = css
            .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
            .replace(/\s+/g, ' ') // Collapse whitespace
            .replace(/;\s*}/g, '}') // Remove last semicolon
            .replace(/\s*([{}:;,>+~])\s*/g, '$1') // Remove spaces around certain characters
            .trim();
          return match.replace(css, minifiedCSS);
        });
      }

      // Remove empty elements
      if (options.removeEmptyElements) {
        result = result.replace(/<(\w+)[^>]*>\s*<\/\1>/g, '');
      }

    } else {
      // Beautify HTML
      result = beautifyHtml(input);
    }

    setOutput(result);
    calculateStats(input, result);
  };

  const beautifyHtml = (html: string) => {
    let formatted = html;
    let indent = 0;
    const lines: string[] = [];
    
    // Simple HTML beautification
    formatted = formatted.replace(/></g, '>\n<');
    
    const htmlLines = formatted.split('\n');
    
    htmlLines.forEach(line => {
      const trimmed = line.trim();
      if (!trimmed) return;
      
      // Decrease indent for closing tags
      if (trimmed.startsWith('</')) {
        indent = Math.max(0, indent - 1);
      }
      
      lines.push('  '.repeat(indent) + trimmed);
      
      // Increase indent for opening tags (but not self-closing)
      if (trimmed.startsWith('<') && !trimmed.startsWith('</') && !trimmed.endsWith('/>')) {
        const tagName = trimmed.match(/<(\w+)/)?.[1];
        if (tagName && !['br', 'hr', 'img', 'input', 'meta', 'link'].includes(tagName.toLowerCase())) {
          indent++;
        }
      }
    });
    
    return lines.join('\n');
  };

  const calculateStats = (original: string, minified: string) => {
    const originalSize = new Blob([original]).size;
    const minifiedSize = new Blob([minified]).size;
    const savings = originalSize - minifiedSize;
    const compressionRatio = (savings / originalSize) * 100;
    
    setStats({
      originalSize,
      minifiedSize,
      savings,
      compressionRatio,
      lines: {
        original: original.split('\n').length,
        minified: minified.split('\n').length
      }
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
  };

  const downloadFile = () => {
    const blob = new Blob([output], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = mode === 'minify' ? 'minified.html' : 'beautified.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const loadPreset = (preset: 'aggressive' | 'safe' | 'custom') => {
    switch (preset) {
      case 'aggressive':
        setOptions({
          removeComments: true,
          collapseWhitespace: true,
          removeEmptyAttributes: true,
          removeOptionalTags: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          minifyCSS: true,
          minifyJS: true,
          removeEmptyElements: true
        });
        break;
      case 'safe':
        setOptions({
          removeComments: true,
          collapseWhitespace: true,
          removeEmptyAttributes: true,
          removeOptionalTags: false,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          minifyCSS: false,
          minifyJS: false,
          removeEmptyElements: false
        });
        break;
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code className="w-5 h-5" />
          Enhanced HTML Minifier & Beautifier
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Mode Selection */}
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">Mode:</span>
          <div className="flex gap-2">
            <Button
              variant={mode === 'minify' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMode('minify')}
            >
              <Zap className="w-4 h-4 mr-2" />
              Minify
            </Button>
            <Button
              variant={mode === 'beautify' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMode('beautify')}
            >
              <FileText className="w-4 h-4 mr-2" />
              Beautify
            </Button>
          </div>
        </div>

        <Tabs defaultValue="input" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="input">Input HTML</TabsTrigger>
            <TabsTrigger value="options">Options</TabsTrigger>
            <TabsTrigger value="output">Output</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
          </TabsList>

          <TabsContent value="input" className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">HTML Code</label>
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste your HTML code here..."
                className="min-h-64 font-mono text-sm"
              />
            </div>
            
            <Button onClick={minifyHtml} disabled={!input.trim()}>
              {mode === 'minify' ? 'Minify HTML' : 'Beautify HTML'}
            </Button>
          </TabsContent>

          <TabsContent value="options" className="space-y-6">
            {mode === 'minify' && (
              <>
                {/* Presets */}
                <div className="space-y-3">
                  <h3 className="font-semibold">Quick Presets</h3>
                  <div className="flex gap-2">
                    <Button onClick={() => loadPreset('safe')} size="sm" variant="outline">
                      Safe Minification
                    </Button>
                    <Button onClick={() => loadPreset('aggressive')} size="sm" variant="outline">
                      Aggressive Minification
                    </Button>
                  </div>
                </div>

                {/* Options Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <h4 className="font-medium">Basic Options</h4>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="removeComments"
                        checked={options.removeComments}
                        onCheckedChange={(checked) => updateOption('removeComments', !!checked)}
                      />
                      <label htmlFor="removeComments" className="text-sm">Remove HTML comments</label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="collapseWhitespace"
                        checked={options.collapseWhitespace}
                        onCheckedChange={(checked) => updateOption('collapseWhitespace', !!checked)}
                      />
                      <label htmlFor="collapseWhitespace" className="text-sm">Collapse whitespace</label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="removeEmptyAttributes"
                        checked={options.removeEmptyAttributes}
                        onCheckedChange={(checked) => updateOption('removeEmptyAttributes', !!checked)}
                      />
                      <label htmlFor="removeEmptyAttributes" className="text-sm">Remove empty attributes</label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="removeOptionalTags"
                        checked={options.removeOptionalTags}
                        onCheckedChange={(checked) => updateOption('removeOptionalTags', !!checked)}
                      />
                      <label htmlFor="removeOptionalTags" className="text-sm">Remove optional tags (html, head, body)</label>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Advanced Options</h4>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="removeRedundantAttributes"
                        checked={options.removeRedundantAttributes}
                        onCheckedChange={(checked) => updateOption('removeRedundantAttributes', !!checked)}
                      />
                      <label htmlFor="removeRedundantAttributes" className="text-sm">Remove redundant attributes</label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="removeScriptTypeAttributes"
                        checked={options.removeScriptTypeAttributes}
                        onCheckedChange={(checked) => updateOption('removeScriptTypeAttributes', !!checked)}
                      />
                      <label htmlFor="removeScriptTypeAttributes" className="text-sm">Remove script type attributes</label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="minifyCSS"
                        checked={options.minifyCSS}
                        onCheckedChange={(checked) => updateOption('minifyCSS', !!checked)}
                      />
                      <label htmlFor="minifyCSS" className="text-sm">Minify inline CSS</label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="removeEmptyElements"
                        checked={options.removeEmptyElements}
                        onCheckedChange={(checked) => updateOption('removeEmptyElements', !!checked)}
                      />
                      <label htmlFor="removeEmptyElements" className="text-sm">Remove empty elements</label>
                    </div>
                  </div>
                </div>
              </>
            )}

            {mode === 'beautify' && (
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h3 className="font-semibold mb-2">Beautify Options</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Beautify mode will format your HTML with proper indentation and line breaks for better readability.
                  No additional configuration is needed.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="output" className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                {mode === 'minify' ? 'Minified' : 'Beautified'} HTML
              </label>
              <Textarea
                value={output}
                readOnly
                placeholder={`${mode === 'minify' ? 'Minified' : 'Beautified'} HTML will appear here...`}
                className="min-h-64 font-mono text-sm"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={copyToClipboard} disabled={!output}>
                <Copy className="w-4 h-4 mr-2" />
                Copy Result
              </Button>
              <Button onClick={downloadFile} disabled={!output} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Download HTML
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="stats" className="space-y-4">
            {stats ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{formatBytes(stats.originalSize)}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Original Size</div>
                  </div>
                  
                  <div className="text-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{formatBytes(stats.minifiedSize)}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {mode === 'minify' ? 'Minified' : 'Beautified'} Size
                    </div>
                  </div>
                  
                  <div className="text-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{formatBytes(Math.abs(stats.savings))}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {stats.savings >= 0 ? 'Saved' : 'Added'}
                    </div>
                  </div>
                  
                  <div className="text-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className={`text-2xl font-bold ${stats.compressionRatio >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {Math.abs(stats.compressionRatio).toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {stats.compressionRatio >= 0 ? 'Compression' : 'Expansion'}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <BarChart3 className="w-4 h-4" />
                      Line Count
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Original:</span>
                        <Badge variant="secondary">{stats.lines.original} lines</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>{mode === 'minify' ? 'Minified' : 'Beautified'}:</span>
                        <Badge variant="secondary">{stats.lines.minified} lines</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <h4 className="font-semibold mb-2">Performance Impact</h4>
                    <div className="space-y-2 text-sm">
                      {mode === 'minify' && stats.compressionRatio > 0 && (
                        <>
                          <div>• Faster page load times</div>
                          <div>• Reduced bandwidth usage</div>
                          <div>• Better SEO performance</div>
                          <div>• Improved Core Web Vitals</div>
                        </>
                      )}
                      {mode === 'beautify' && (
                        <>
                          <div>• Improved code readability</div>
                          <div>• Better debugging experience</div>
                          <div>• Easier maintenance</div>
                          <div>• Proper code formatting</div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center p-8 text-gray-500 dark:text-gray-400">
                Process HTML to see detailed statistics
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}