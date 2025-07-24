import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Archive, Download, RefreshCw, TrendingDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import CopyButton from "@/components/copy-button";
import BuyMeCoffee from "@/components/buy-me-coffee";

type CompressionMethod = "rle" | "frequency" | "dictionary" | "simple";

export default function TextCompressor() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [method, setMethod] = useState<CompressionMethod>("rle");
  const [compressionRatio, setCompressionRatio] = useState(0);
  const [stats, setStats] = useState({ originalSize: 0, compressedSize: 0, savings: 0 });
  const { toast } = useToast();

  // Run-Length Encoding
  const runLengthEncode = (text: string): string => {
    if (!text) return "";
    
    let result = "";
    let count = 1;
    let current = text[0];
    
    for (let i = 1; i < text.length; i++) {
      if (text[i] === current && count < 99) {
        count++;
      } else {
        result += count > 1 ? `${count}${current}` : current;
        current = text[i];
        count = 1;
      }
    }
    result += count > 1 ? `${count}${current}` : current;
    
    return result;
  };

  // Run-Length Decoding
  const runLengthDecode = (text: string): string => {
    if (!text) return "";
    
    let result = "";
    let i = 0;
    
    while (i < text.length) {
      let countStr = "";
      while (i < text.length && /\d/.test(text[i])) {
        countStr += text[i];
        i++;
      }
      
      if (countStr && i < text.length) {
        const count = parseInt(countStr);
        const char = text[i];
        result += char.repeat(count);
        i++;
      } else if (i < text.length) {
        result += text[i];
        i++;
      }
    }
    
    return result;
  };

  // Simple frequency-based compression
  const frequencyCompress = (text: string): string => {
    if (!text) return "";
    
    // Count character frequencies
    const freq: { [key: string]: number } = {};
    for (const char of text) {
      freq[char] = (freq[char] || 0) + 1;
    }
    
    // Create mapping for most frequent characters
    const sorted = Object.entries(freq).sort(([,a], [,b]) => b - a);
    const mapping: { [key: string]: string } = {};
    const reverseMapping: { [key: string]: string } = {};
    
    // Use single characters for most frequent
    const replacements = ['§', '†', '‡', '¶', '◊', '∆', '∇', '∞', '∑', '∏'];
    let replacementIndex = 0;
    
    sorted.slice(0, replacements.length).forEach(([char, count]) => {
      if (count > 3 && replacementIndex < replacements.length) {
        const replacement = replacements[replacementIndex];
        mapping[char] = replacement;
        reverseMapping[replacement] = char;
        replacementIndex++;
      }
    });
    
    // Apply compression
    let compressed = text;
    Object.entries(mapping).forEach(([original, replacement]) => {
      compressed = compressed.replace(new RegExp(escapeRegExp(original), 'g'), replacement);
    });
    
    // Add mapping dictionary at the end
    const mappingStr = Object.entries(reverseMapping)
      .map(([replacement, original]) => `${replacement}=${original}`)
      .join(',');
    
    return `${compressed}|MAP|${mappingStr}`;
  };

  // Frequency decompression
  const frequencyDecompress = (text: string): string => {
    if (!text.includes('|MAP|')) return text;
    
    const [compressed, mappingStr] = text.split('|MAP|');
    const mapping: { [key: string]: string } = {};
    
    mappingStr.split(',').forEach(pair => {
      const [replacement, original] = pair.split('=');
      if (replacement && original) {
        mapping[replacement] = original;
      }
    });
    
    let result = compressed;
    Object.entries(mapping).forEach(([replacement, original]) => {
      result = result.replace(new RegExp(escapeRegExp(replacement), 'g'), original);
    });
    
    return result;
  };

  // Simple dictionary compression (repeated phrases)
  const dictionaryCompress = (text: string): string => {
    if (!text) return "";
    
    const phrases: { [key: string]: number } = {};
    const minLength = 4;
    const maxLength = 20;
    
    // Find repeated phrases
    for (let len = minLength; len <= maxLength; len++) {
      for (let i = 0; i <= text.length - len; i++) {
        const phrase = text.substring(i, i + len);
        if (!/^\s+$/.test(phrase)) { // Skip whitespace-only phrases
          phrases[phrase] = (phrases[phrase] || 0) + 1;
        }
      }
    }
    
    // Sort by potential savings (frequency * length)
    const worthwhilePhrases = Object.entries(phrases)
      .filter(([phrase, count]) => count >= 2 && phrase.length >= minLength)
      .sort(([a, countA], [b, countB]) => (countB * b.length) - (countA * a.length))
      .slice(0, 10); // Limit to top 10 phrases
    
    let compressed = text;
    const dictionary: { [key: string]: string } = {};
    
    worthwhilePhrases.forEach(([phrase], index) => {
      const token = `~${index}~`;
      dictionary[token] = phrase;
      compressed = compressed.replace(new RegExp(escapeRegExp(phrase), 'g'), token);
    });
    
    // Add dictionary
    const dictStr = Object.entries(dictionary)
      .map(([token, phrase]) => `${token}=${phrase}`)
      .join('|');
    
    return dictStr ? `${compressed}|DICT|${dictStr}` : compressed;
  };

  // Dictionary decompression
  const dictionaryDecompress = (text: string): string => {
    if (!text.includes('|DICT|')) return text;
    
    const [compressed, dictStr] = text.split('|DICT|');
    const dictionary: { [key: string]: string } = {};
    
    dictStr.split('|').forEach(pair => {
      const [token, phrase] = pair.split('=');
      if (token && phrase) {
        dictionary[token] = phrase;
      }
    });
    
    let result = compressed;
    Object.entries(dictionary).forEach(([token, phrase]) => {
      result = result.replace(new RegExp(escapeRegExp(token), 'g'), phrase);
    });
    
    return result;
  };

  const escapeRegExp = (string: string): string => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  const compress = () => {
    if (!input.trim()) {
      toast({
        title: "Error",
        description: "Please enter text to compress",
        variant: "destructive",
      });
      return;
    }

    let compressed = "";
    
    try {
      switch (method) {
        case "rle":
          compressed = runLengthEncode(input);
          break;
        case "frequency":
          compressed = frequencyCompress(input);
          break;
        case "dictionary":
          compressed = dictionaryCompress(input);
          break;
        case "simple":
          // Simple whitespace compression
          compressed = input.replace(/\s+/g, ' ').trim();
          break;
      }
      
      setOutput(compressed);
      
      const originalSize = new Blob([input]).size;
      const compressedSize = new Blob([compressed]).size;
      const savings = originalSize > 0 ? ((originalSize - compressedSize) / originalSize) * 100 : 0;
      const ratio = originalSize > 0 ? (compressedSize / originalSize) * 100 : 100;
      
      setStats({ originalSize, compressedSize, savings });
      setCompressionRatio(ratio);
      
      toast({
        title: "Compressed!",
        description: `${savings.toFixed(1)}% size reduction`,
      });
    } catch (err: any) {
      toast({
        title: "Compression failed",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const decompress = () => {
    if (!output.trim()) {
      toast({
        title: "Error",
        description: "No compressed data to decompress",
        variant: "destructive",
      });
      return;
    }

    try {
      let decompressed = "";
      
      switch (method) {
        case "rle":
          decompressed = runLengthDecode(output);
          break;
        case "frequency":
          decompressed = frequencyDecompress(output);
          break;
        case "dictionary":
          decompressed = dictionaryDecompress(output);
          break;
        case "simple":
          decompressed = output; // Simple compression is not reversible
          break;
      }
      
      setInput(decompressed);
      
      toast({
        title: "Decompressed!",
        description: "Text has been restored",
      });
    } catch (err: any) {
      toast({
        title: "Decompression failed",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
    setCompressionRatio(0);
    setStats({ originalSize: 0, compressedSize: 0, savings: 0 });
  };

  const loadSample = () => {
    const sample = "This is a test string with repeated words. This is a test string with repeated words. The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog. Hello world! Hello world! Hello world!";
    setInput(sample);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Text Compressor</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Compress text using various algorithms like run-length encoding, frequency mapping, and dictionary compression. 
          Reduce file sizes and analyze compression efficiency.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Archive className="w-5 h-5" />
              Text Compression
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4 mb-4">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">Compression Method</label>
                <Select value={method} onValueChange={(value: CompressionMethod) => setMethod(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rle">Run-Length Encoding</SelectItem>
                    <SelectItem value="frequency">Frequency Mapping</SelectItem>
                    <SelectItem value="dictionary">Dictionary Compression</SelectItem>
                    <SelectItem value="simple">Simple Whitespace</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-end gap-2">
                <Button variant="outline" onClick={loadSample}>
                  Load Sample
                </Button>
                <Button variant="outline" onClick={clearAll}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Clear
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Original Text</label>
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Enter text to compress..."
                  className="min-h-[200px] font-mono text-sm"
                />
                <div className="text-xs text-gray-500 mt-1">
                  Size: {stats.originalSize} bytes
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Compressed Text</label>
                <Textarea
                  value={output}
                  readOnly
                  placeholder="Compressed text will appear here..."
                  className="min-h-[200px] font-mono text-sm bg-gray-50"
                />
                <div className="text-xs text-gray-500 mt-1">
                  Size: {stats.compressedSize} bytes
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={compress} className="bg-blue-600 hover:bg-blue-700">
                <Archive className="w-4 h-4 mr-2" />
                Compress
              </Button>
              <Button variant="outline" onClick={decompress} disabled={!output || method === "simple"}>
                <Download className="w-4 h-4 mr-2" />
                Decompress
              </Button>
              <CopyButton text={output} label="Copy Compressed" />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Compression Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Compression Ratio:</span>
                  <Badge variant="outline">{compressionRatio.toFixed(1)}%</Badge>
                </div>
                <Progress value={compressionRatio} className="w-full" />
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Original Size:</span>
                  <span className="font-mono">{stats.originalSize} bytes</span>
                </div>
                <div className="flex justify-between">
                  <span>Compressed Size:</span>
                  <span className="font-mono">{stats.compressedSize} bytes</span>
                </div>
                <div className="flex justify-between">
                  <span>Space Saved:</span>
                  <span className={`font-mono ${stats.savings > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {stats.savings > 0 ? '-' : '+'}{Math.abs(stats.savings).toFixed(1)}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Algorithm Info</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              {method === "rle" && (
                <div>
                  <h4 className="font-semibold mb-2">Run-Length Encoding</h4>
                  <p className="text-gray-600">
                    Replaces repeated characters with count + character. 
                    Best for text with many consecutive identical characters.
                  </p>
                </div>
              )}
              {method === "frequency" && (
                <div>
                  <h4 className="font-semibold mb-2">Frequency Mapping</h4>
                  <p className="text-gray-600">
                    Replaces most frequent characters with shorter symbols. 
                    Best for text with uneven character distribution.
                  </p>
                </div>
              )}
              {method === "dictionary" && (
                <div>
                  <h4 className="font-semibold mb-2">Dictionary Compression</h4>
                  <p className="text-gray-600">
                    Replaces repeated phrases with short tokens. 
                    Best for text with repeated words or phrases.
                  </p>
                </div>
              )}
              {method === "simple" && (
                <div>
                  <h4 className="font-semibold mb-2">Simple Whitespace</h4>
                  <p className="text-gray-600">
                    Collapses multiple spaces into single spaces. 
                    Quick and simple, not reversible.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Compression Methods Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <TrendingDown className="w-4 h-4" />
                Run-Length
              </h4>
              <ul className="text-gray-600 space-y-1">
                <li>• Best for: Repeated characters</li>
                <li>• Example: "aaaaa" → "5a"</li>
                <li>• Reversible: Yes</li>
                <li>• Speed: Very fast</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Frequency Mapping</h4>
              <ul className="text-gray-600 space-y-1">
                <li>• Best for: Uneven char distribution</li>
                <li>• Example: Common chars → symbols</li>
                <li>• Reversible: Yes</li>
                <li>• Speed: Fast</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Dictionary</h4>
              <ul className="text-gray-600 space-y-1">
                <li>• Best for: Repeated phrases</li>
                <li>• Example: "hello world" → "~0~"</li>
                <li>• Reversible: Yes</li>
                <li>• Speed: Medium</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Simple</h4>
              <ul className="text-gray-600 space-y-1">
                <li>• Best for: Quick cleanup</li>
                <li>• Example: Multiple spaces → single</li>
                <li>• Reversible: No</li>
                <li>• Speed: Very fast</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-center mt-8">
        <div className="mb-4">
          <p className="text-lg font-medium text-foreground mb-1">💛 Like these tools?</p>
          <p className="text-muted-foreground">Help support future development</p>
        </div>
        <BuyMeCoffee />
        <p className="text-sm text-gray-600 mt-2">
          Thanks for using this free tool! Your support keeps it ad-free and private.
        </p>
      </div>
    </div>
  );
}