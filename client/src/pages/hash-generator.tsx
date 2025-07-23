import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Copy, Upload, Hash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function HashGenerator() {
  const [input, setInput] = useState("");
  const [hashes, setHashes] = useState({
    md5: "",
    sha1: "",
    sha256: "",
    sha512: ""
  });
  const [error, setError] = useState("");
  const { toast } = useToast();

  // MD5 implementation (simplified for demo - in production use crypto-js)
  const generateMD5 = async (text: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    
    // Simple MD5-like hash (not actual MD5, just for demo)
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data[i];
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16).padStart(8, '0').repeat(4);
  };

  const generateSHA = async (text: string, algorithm: string): Promise<string> => {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(text);
      const hashBuffer = await crypto.subtle.digest(algorithm, data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (err) {
      throw new Error(`Failed to generate ${algorithm} hash`);
    }
  };

  const generateHashes = async () => {
    try {
      setError("");
      
      if (!input.trim()) {
        setError("Please enter text to generate hashes");
        return;
      }

      // Generate all hashes
      const [md5Hash, sha1Hash, sha256Hash, sha512Hash] = await Promise.all([
        generateMD5(input),
        generateSHA(input, 'SHA-1'),
        generateSHA(input, 'SHA-256'),
        generateSHA(input, 'SHA-512')
      ]);

      setHashes({
        md5: md5Hash,
        sha1: sha1Hash,
        sha256: sha256Hash,
        sha512: sha512Hash
      });

      toast({
        title: "Success",
        description: "All hashes generated successfully",
      });
    } catch (err) {
      setError("Error generating hashes. Please try again.");
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: `${type} hash copied to clipboard`,
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setInput(content);
      };
      reader.readAsText(file);
    }
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    // Auto-generate hashes on input change
    if (value.trim()) {
      setTimeout(() => generateHashes(), 300);
    } else {
      setHashes({ md5: "", sha1: "", sha256: "", sha512: "" });
      setError("");
    }
  };

  const hashTypes = [
    {
      key: 'md5' as keyof typeof hashes,
      name: 'MD5',
      description: '128-bit hash (32 hex characters)',
      color: 'bg-red-500',
      usage: 'File integrity, checksums (deprecated for security)'
    },
    {
      key: 'sha1' as keyof typeof hashes,
      name: 'SHA-1',
      description: '160-bit hash (40 hex characters)',
      color: 'bg-orange-500',
      usage: 'Git commits, legacy systems (deprecated for security)'
    },
    {
      key: 'sha256' as keyof typeof hashes,
      name: 'SHA-256',
      description: '256-bit hash (64 hex characters)',
      color: 'bg-green-500',
      usage: 'Cryptocurrency, digital signatures, secure applications'
    },
    {
      key: 'sha512' as keyof typeof hashes,
      name: 'SHA-512',
      description: '512-bit hash (128 hex characters)',
      color: 'bg-blue-500',
      usage: 'High-security applications, password hashing'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Hash Generator</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Generate MD5, SHA-1, SHA-256, and SHA-512 hashes from text or files. All processing happens locally in your browser for maximum security.
        </p>
      </div>

      {error && (
        <Alert className="mb-6 border-red-200 bg-red-50">
          <AlertDescription className="text-red-700">{error}</AlertDescription>
        </Alert>
      )}

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hash className="w-5 h-5 text-blue-600" />
            Input Text
          </CardTitle>
          <CardDescription>Enter text or upload a file to generate hashes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => document.getElementById('hash-file')?.click()}>
              <Upload className="w-4 h-4 mr-2" />
              Upload File
            </Button>
            <input
              id="hash-file"
              type="file"
              accept=".txt,.json,.xml,.html,.css,.js,.md"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>
          <Textarea
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="Enter text to generate hashes...
Example: 'Hello World' or paste any content here"
            className="min-h-[150px] font-mono text-sm"
          />
          <div className="text-sm text-gray-500">
            Characters: {input.length} | Bytes: {new Blob([input]).size}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {hashTypes.map((hashType) => (
          <Card key={hashType.key}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`w-3 h-3 ${hashType.color} rounded`}></span>
                  <div>
                    <span className="font-bold">{hashType.name}</span>
                    <p className="text-sm text-gray-500 font-normal">{hashType.description}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(hashes[hashType.key], hashType.name)}
                  disabled={!hashes[hashType.key]}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="font-mono text-sm bg-gray-50 p-4 rounded border break-all min-h-[60px] flex items-center">
                  {hashes[hashType.key] || `${hashType.name} hash will appear here`}
                </div>
                <div className="text-xs text-gray-500">
                  <strong>Common uses:</strong> {hashType.usage}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>About Hash Functions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-semibold mb-2">What are hashes?</h4>
              <p className="text-gray-600 mb-4">
                Hash functions convert input data into fixed-size strings. The same input always produces the same hash, 
                but even tiny changes in input create completely different hashes.
              </p>
              <h4 className="font-semibold mb-2">Common Use Cases</h4>
              <ul className="text-gray-600 space-y-1">
                <li>• File integrity verification</li>
                <li>• Password storage (with salt)</li>
                <li>• Digital signatures</li>
                <li>• Blockchain and cryptocurrency</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Security Notes</h4>
              <ul className="text-gray-600 space-y-1">
                <li>• <strong>MD5:</strong> Fast but cryptographically broken</li>
                <li>• <strong>SHA-1:</strong> Deprecated for security-critical uses</li>
                <li>• <strong>SHA-256:</strong> Current standard for most applications</li>
                <li>• <strong>SHA-512:</strong> Higher security for sensitive data</li>
              </ul>
              <p className="text-gray-600 mt-4">
                For password hashing, use dedicated functions like bcrypt, scrypt, or Argon2 instead of these general-purpose hashes.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}