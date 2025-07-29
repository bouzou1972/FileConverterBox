import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Copy, Key, Lock, Unlock, Shield, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import BuyMeCoffee from "@/components/buy-me-coffee";
import { ToolSEO } from "@/components/tool-seo";
import { ShareButtons } from "@/components/share-buttons";
import { UsageGuide } from "@/components/usage-guide";
import { BookmarkButton } from "@/components/bookmark-button";

export default function TextEncryptorPage() {
  const [input, setInput] = useState("");
  const [encryptPassword, setEncryptPassword] = useState("");
  const [encryptedResult, setEncryptedResult] = useState("");
  
  const [decryptText, setDecryptText] = useState("");
  const [decryptPassword, setDecryptPassword] = useState("");
  const [decryptedResult, setDecryptedResult] = useState("");
  
  const [error, setError] = useState("");
  const { toast } = useToast();

  // Convert string to ArrayBuffer
  const stringToArrayBuffer = (str: string): ArrayBuffer => {
    const encoder = new TextEncoder();
    return encoder.encode(str);
  };

  // Convert ArrayBuffer to string
  const arrayBufferToString = (buffer: ArrayBuffer): string => {
    const decoder = new TextDecoder();
    return decoder.decode(buffer);
  };

  // Convert ArrayBuffer to base64
  const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  // Convert base64 to ArrayBuffer
  const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  };

  // Derive key from password using PBKDF2
  const deriveKey = async (password: string, salt: Uint8Array): Promise<CryptoKey> => {
    const passwordBuffer = stringToArrayBuffer(password);
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      passwordBuffer,
      'PBKDF2',
      false,
      ['deriveKey']
    );

    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      {
        name: 'AES-GCM',
        length: 256
      },
      false,
      ['encrypt', 'decrypt']
    );
  };

  const handleEncryptText = async () => {
    if (!input.trim()) {
      setError("Please enter text to encrypt");
      return;
    }

    if (!encryptPassword.trim()) {
      setError("Please enter a password");
      return;
    }

    try {
      setError("");
      
      // Generate random salt and IV
      const salt = crypto.getRandomValues(new Uint8Array(16));
      const iv = crypto.getRandomValues(new Uint8Array(12));
      
      // Derive key from password
      const key = await deriveKey(encryptPassword, salt);
      
      // Encrypt the text
      const textBuffer = stringToArrayBuffer(input);
      const encryptedBuffer = await crypto.subtle.encrypt(
        {
          name: 'AES-GCM',
          iv: iv
        },
        key,
        textBuffer
      );

      // Combine salt, iv, and encrypted data
      const combined = new Uint8Array(salt.length + iv.length + encryptedBuffer.byteLength);
      combined.set(salt, 0);
      combined.set(iv, salt.length);
      combined.set(new Uint8Array(encryptedBuffer), salt.length + iv.length);

      // Convert to base64 for easy storage/transport
      const result = arrayBufferToBase64(combined.buffer);
      setEncryptedResult(result);

      toast({
        title: "Success",
        description: "Text encrypted successfully",
      });
    } catch (err) {
      setError("Encryption failed. Please try again.");
    }
  };

  const handleDecryptText = async () => {
    if (!decryptText.trim()) {
      setError("Please enter encrypted text to decrypt");
      return;
    }

    if (!decryptPassword.trim()) {
      setError("Please enter the password");
      return;
    }

    try {
      setError("");
      
      // Decode from base64
      const combined = base64ToArrayBuffer(decryptText);
      const combinedArray = new Uint8Array(combined);
      
      // Extract salt, iv, and encrypted data
      const salt = combinedArray.slice(0, 16);
      const iv = combinedArray.slice(16, 28);
      const encryptedData = combinedArray.slice(28);
      
      // Derive key from password
      const key = await deriveKey(decryptPassword, salt);
      
      // Decrypt the data
      const decryptedBuffer = await crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: iv
        },
        key,
        encryptedData
      );

      // Convert back to string
      const result = arrayBufferToString(decryptedBuffer);
      setDecryptedResult(result);

      toast({
        title: "Success",
        description: "Text decrypted successfully",
      });
    } catch (err) {
      setError("Decryption failed. Please check your password and encrypted text.");
    }
  };

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 16; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Text copied to clipboard",
    });
  };

  const usageExamples = [
    {
      title: "Secure Text Storage",
      description: "Encrypt sensitive text for secure storage or transmission",
      steps: [
        "Enter your sensitive text in the encryption input field",
        "Create a strong password or use the random generator",
        "Click 'Encrypt Text' to generate encrypted output",
        "Save both the encrypted text and password securely",
        "Use the decrypt tab to recover your original text later"
      ],
      tip: "Use the random password generator for maximum security"
    },
    {
      title: "Decrypt Received Messages",
      description: "Decrypt encrypted text messages you've received",
      steps: [
        "Switch to the 'Decrypt Text' tab",
        "Paste the encrypted text you received",
        "Enter the password provided by the sender",
        "Click 'Decrypt Text' to reveal the original message",
        "Copy the decrypted text for further use"
      ],
      tip: "Make sure you have the exact password - decryption will fail with incorrect passwords"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <ToolSEO
        title="Text Encryptor - Secure AES-256 Text Encryption Online"
        description="Encrypt and decrypt text using AES-256 encryption with PBKDF2 key derivation. Secure client-side processing with no data transmission."
        keywords={["text encryptor", "aes encryption", "text security", "password encryption", "secure text"]}
        canonicalUrl="/text-encryptor"
      />
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Text Encryptor/Decryptor</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Securely encrypt and decrypt text using AES-256 encryption. All processing happens in your browser - no data leaves your device.
        </p>
      </div>

      {error && (
        <Alert className="mb-6 border-red-200 bg-red-50">
          <AlertTriangle className="w-4 h-4" />
          <AlertDescription className="text-red-700">{error}</AlertDescription>
        </Alert>
      )}

      <Alert className="mb-6 border-blue-200 bg-blue-50">
        <Shield className="w-4 h-4" />
        <AlertDescription className="text-blue-700">
          <strong>Security Note:</strong> This tool uses AES-256-GCM encryption with PBKDF2 key derivation (100,000 iterations). 
          Your password and data never leave your browser. Use a strong, unique password for best security.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="encrypt" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="encrypt">Encrypt Text</TabsTrigger>
          <TabsTrigger value="decrypt">Decrypt Text</TabsTrigger>
        </TabsList>

        <TabsContent value="encrypt" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Encrypt Text
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="encrypt-password">Password</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="encrypt-password"
                    type="password"
                    value={encryptPassword}
                    onChange={(e) => setEncryptPassword(e.target.value)}
                    placeholder="Enter a strong password"
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    onClick={() => setEncryptPassword(generateRandomPassword())}
                  >
                    <Key className="w-4 h-4 mr-2" />
                    Generate
                  </Button>
                </div>
                {encryptPassword && (
                  <div className="mt-2 text-sm">
                    <Badge variant={encryptPassword.length >= 12 ? "default" : "destructive"}>
                      {encryptPassword.length >= 12 ? "Strong" : "Weak"} password ({encryptPassword.length} chars)
                    </Badge>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="plain-text">Text to Encrypt</Label>
                <Textarea
                  id="plain-text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Enter the text you want to encrypt..."
                  className="min-h-[120px] mt-1"
                />
              </div>

              <Button onClick={handleEncryptText} className="w-full">
                <Lock className="w-4 h-4 mr-2" />
                Encrypt Text
              </Button>

              {encryptedResult && (
                <div>
                  <Label>Encrypted Result</Label>
                  <div className="flex gap-2 mt-1">
                    <Textarea
                      value={encryptedResult}
                      readOnly
                      className="min-h-[120px] font-mono text-sm bg-gray-50"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(encryptedResult)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Save this encrypted text and your password securely. You'll need both to decrypt the message.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="decrypt" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Unlock className="w-5 h-5" />
                Decrypt Text
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="decrypt-password">Password</Label>
                <Input
                  id="decrypt-password"
                  type="password"
                  value={decryptPassword}
                  onChange={(e) => setDecryptPassword(e.target.value)}
                  placeholder="Enter the password used for encryption"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="encrypted-text">Encrypted Text</Label>
                <Textarea
                  id="encrypted-text"
                  value={decryptText}
                  onChange={(e) => setDecryptText(e.target.value)}
                  placeholder="Paste the encrypted text here..."
                  className="min-h-[120px] mt-1 font-mono text-sm"
                />
              </div>

              <Button onClick={handleDecryptText} className="w-full">
                <Unlock className="w-4 h-4 mr-2" />
                Decrypt Text
              </Button>

              {decryptedResult && (
                <div>
                  <Label>Decrypted Result</Label>
                  <div className="flex gap-2 mt-1">
                    <Textarea
                      value={decryptedResult}
                      readOnly
                      className="min-h-[120px] bg-green-50"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(decryptedResult)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Security Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Encryption Details</h4>
              <ul className="text-gray-600 space-y-1">
                <li>• Algorithm: AES-256-GCM</li>
                <li>• Key derivation: PBKDF2 (100,000 iterations)</li>
                <li>• Random salt and IV for each encryption</li>
                <li>• Authenticated encryption (tamper-proof)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Privacy & Security</h4>
              <ul className="text-gray-600 space-y-1">
                <li>• 100% client-side processing</li>
                <li>• No data sent to servers</li>
                <li>• Uses Web Crypto API standards</li>
                <li>• Strong password recommended (12+ chars)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Best Practices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-600 space-y-2">
            <p>• <strong>Use strong passwords:</strong> At least 12 characters with mixed case, numbers, and symbols</p>
            <p>• <strong>Store safely:</strong> Keep your password and encrypted text in separate, secure locations</p>
            <p>• <strong>Test decryption:</strong> Always verify you can decrypt your data before relying on it</p>
            <p>• <strong>Backup:</strong> Make multiple copies of important encrypted data</p>
          </div>
        </CardContent>
      </Card>
      
      <div className="text-center mt-8">
        <ShareButtons 
          title="Text Encryptor - Secure AES-256 Text Encryption Online"
          description="Encrypt and decrypt text using military-grade AES-256 encryption"
        />
        
        <UsageGuide 
          title="Text Encryptor/Decryptor"
          description="Learn how to securely encrypt and decrypt text using AES-256 encryption"
          examples={usageExamples}
          tips={[
            "Use the random password generator for maximum security",
            "Make sure you have the exact password - decryption will fail with incorrect passwords",
            "Store passwords separately from encrypted text",
            "AES-256 with PBKDF2 provides military-grade security",
            "All encryption happens in your browser - no data transmission"
          ]}
          commonUses={[
            "Secure messaging",
            "Password protection",
            "Sensitive data storage",
            "Confidential notes",
            "Private communication"
          ]}
        />

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