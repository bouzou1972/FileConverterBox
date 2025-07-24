import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Copy, RefreshCw, Shield, Eye, EyeOff, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ToolSEO } from "@/components/tool-seo";
import { ShareButtons } from "@/components/share-buttons";
import { UsageGuide } from "@/components/usage-guide";

export default function PasswordGenerator() {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState([16]);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [excludeSimilar, setExcludeSimilar] = useState(false);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);
  const [customSymbols, setCustomSymbols] = useState("!@#$%^&*()_+-=[]{}|;:,.<>?");
  const [showPassword, setShowPassword] = useState(true);
  const [generatedPasswords, setGeneratedPasswords] = useState<string[]>([]);
  const { toast } = useToast();

  const generatePassword = () => {
    let charset = "";
    
    if (includeLowercase) {
      charset += excludeSimilar ? "abcdefghjkmnpqrstuvwxyz" : "abcdefghijklmnopqrstuvwxyz";
    }
    if (includeUppercase) {
      charset += excludeSimilar ? "ABCDEFGHJKMNPQRSTUVWXYZ" : "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    }
    if (includeNumbers) {
      charset += excludeSimilar ? "23456789" : "0123456789";
    }
    if (includeSymbols) {
      charset += excludeAmbiguous ? customSymbols.replace(/['"\\`]/g, "") : customSymbols;
    }

    if (!charset) {
      toast({
        title: "Error",
        description: "Please select at least one character type",
        variant: "destructive",
      });
      return;
    }

    let newPassword = "";
    const array = new Uint8Array(length[0]);
    crypto.getRandomValues(array);
    
    for (let i = 0; i < length[0]; i++) {
      newPassword += charset[array[i] % charset.length];
    }

    setPassword(newPassword);
    
    // Add to history (keep last 5)
    setGeneratedPasswords(prev => [newPassword, ...prev.slice(0, 4)]);

    toast({
      title: "Password Generated",
      description: "New secure password created successfully!",
    });
  };

  const calculateStrength = (pwd: string): { score: number; label: string; color: string } => {
    if (!pwd) return { score: 0, label: "No password", color: "bg-gray-300" };
    
    let score = 0;
    
    // Length scoring
    if (pwd.length >= 8) score += 1;
    if (pwd.length >= 12) score += 1;
    if (pwd.length >= 16) score += 1;
    
    // Character variety
    if (/[a-z]/.test(pwd)) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;
    
    // Bonus for very long passwords
    if (pwd.length >= 20) score += 1;
    
    if (score <= 2) return { score: (score / 8) * 100, label: "Weak", color: "bg-red-500" };
    if (score <= 4) return { score: (score / 8) * 100, label: "Fair", color: "bg-yellow-500" };
    if (score <= 6) return { score: (score / 8) * 100, label: "Good", color: "bg-blue-500" };
    return { score: (score / 8) * 100, label: "Strong", color: "bg-green-500" };
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied",
        description: "Password copied to clipboard!",
      });
    }).catch(() => {
      toast({
        title: "Error",
        description: "Failed to copy password",
        variant: "destructive",
      });
    });
  };

  const strength = calculateStrength(password);

  const usageExamples = [
    {
      title: "High-Security Account Password",
      description: "Create a strong password for banking or important accounts",
      steps: [
        "Set length to 16+ characters",
        "Enable all character types (uppercase, lowercase, numbers, symbols)",
        "Enable 'Exclude similar characters' to avoid confusion",
        "Generate and copy to password manager",
        "Never reuse this password for other accounts"
      ],
      tip: "Use a unique strong password for each important account"
    },
    {
      title: "WiFi Network Password",
      description: "Generate a secure but memorable WiFi password",
      steps: [
        "Set length to 12-16 characters",
        "Enable uppercase, lowercase, and numbers",
        "Disable symbols if devices have trouble connecting",
        "Exclude ambiguous symbols for easier manual entry"
      ],
      tip: "Write down WiFi passwords in a secure location for guests"
    },
    {
      title: "Temporary Access Password",
      description: "Create passwords for temporary accounts or testing",
      steps: [
        "Use shorter length (8-12 characters) if required",
        "Include numbers and letters",
        "Consider excluding symbols for compatibility",
        "Set expiration reminders for temporary passwords"
      ]
    }
  ];

  const proTips = [
    "Use a password manager to store all your generated passwords securely",
    "Enable two-factor authentication wherever possible for extra security", 
    "Longer passwords are generally more secure than complex short ones",
    "Avoid using the same password across multiple important accounts",
    "Generate new passwords periodically for critical accounts",
    "The 'exclude similar characters' option helps prevent typos when typing passwords"
  ];

  const bestPractices = [
    "Store passwords in a reputable password manager",
    "Use unique passwords for each account, especially important ones",
    "Generate passwords with at least 12 characters for good security",
    "Enable two-factor authentication when available",
    "Never share passwords via email, text, or unsecured methods",
    "Change passwords immediately if you suspect they've been compromised",
    "Use the highest security settings your account/system allows"
  ];

  const commonUses = [
    "Online accounts",
    "WiFi networks", 
    "Database access",
    "Application passwords",
    "Temporary accounts",
    "System administration",
    "API keys",
    "Device unlock codes"
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <ToolSEO
        title="Password Generator"
        description="Generate secure, cryptographically random passwords with customizable length and character types. Free online password creator with strength analysis."
        keywords={["password generator", "secure password", "random password", "strong password maker", "password creator"]}
        canonicalUrl={window.location.href}
      />
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
            <Shield className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Password Generator</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">Create secure passwords with customizable rules</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 justify-center">
          <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
            Cryptographically Secure
          </Badge>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
            Fully Customizable
          </Badge>
          <Badge variant="secondary" className="bg-purple-100 text-purple-800 border-purple-200">
            100% Local
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Password Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Length */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label>Password Length</Label>
                <span className="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                  {length[0]} characters
                </span>
              </div>
              <Slider
                value={length}
                onValueChange={setLength}
                min={4}
                max={64}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>4</span>
                <span>64</span>
              </div>
            </div>

            {/* Character Types */}
            <div>
              <Label className="text-base">Character Types</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="uppercase"
                    checked={includeUppercase}
                    onCheckedChange={(checked) => setIncludeUppercase(checked === true)}
                  />
                  <Label htmlFor="uppercase">Uppercase (A-Z)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="lowercase"
                    checked={includeLowercase}
                    onCheckedChange={(checked) => setIncludeLowercase(checked === true)}
                  />
                  <Label htmlFor="lowercase">Lowercase (a-z)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="numbers"
                    checked={includeNumbers}
                    onCheckedChange={(checked) => setIncludeNumbers(checked === true)}
                  />
                  <Label htmlFor="numbers">Numbers (0-9)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="symbols"
                    checked={includeSymbols}
                    onCheckedChange={(checked) => setIncludeSymbols(checked === true)}
                  />
                  <Label htmlFor="symbols">Symbols</Label>
                </div>
              </div>
            </div>

            {/* Custom Symbols */}
            {includeSymbols && (
              <div>
                <Label htmlFor="custom-symbols">Custom Symbols</Label>
                <Input
                  id="custom-symbols"
                  value={customSymbols}
                  onChange={(e) => setCustomSymbols(e.target.value)}
                  placeholder="Enter custom symbols..."
                  className="font-mono"
                />
              </div>
            )}

            {/* Advanced Options */}
            <div>
              <Label className="text-base">Advanced Options</Label>
              <div className="space-y-3 mt-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="exclude-similar"
                    checked={excludeSimilar}
                    onCheckedChange={(checked) => setExcludeSimilar(checked === true)}
                  />
                  <Label htmlFor="exclude-similar">Exclude similar characters (i, l, 1, L, o, 0, O)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="exclude-ambiguous"
                    checked={excludeAmbiguous}
                    onCheckedChange={(checked) => setExcludeAmbiguous(checked === true)}
                  />
                  <Label htmlFor="exclude-ambiguous">Exclude ambiguous symbols ({`'"`}\\`)</Label>
                </div>
              </div>
            </div>

            <Button 
              onClick={generatePassword}
              className="w-full bg-purple-600 hover:bg-purple-700"
              size="lg"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Generate Password
            </Button>
          </CardContent>
        </Card>

        {/* Generated Password */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Generated Password
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {password ? (
                <>
                  <div className="relative">
                    <Input
                      value={password}
                      readOnly
                      type={showPassword ? "text" : "password"}
                      className="font-mono text-sm pr-10"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 -translate-y-1/2"
                      onClick={() => copyToClipboard(password)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {/* Strength Meter */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <Label>Password Strength</Label>
                      <Badge variant={strength.score > 75 ? "default" : strength.score > 50 ? "secondary" : "destructive"}>
                        {strength.label}
                      </Badge>
                    </div>
                    <Progress value={strength.score} className="h-2" />
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Shield className="w-12 h-12 mx-auto mb-2 opacity-30" />
                  <p>No password generated yet</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Passwords */}
          {generatedPasswords.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recent Passwords</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {generatedPasswords.map((pwd, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                      <Input
                        value={pwd}
                        readOnly
                        type="password"
                        className="flex-1 text-xs font-mono"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(pwd)}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Usage Guide */}
      <UsageGuide
        title="Password Generator"
        description="Generate cryptographically secure passwords with full control over length, character types, and complexity rules."
        examples={usageExamples}
        tips={proTips}
        bestPractices={bestPractices}
        commonUses={commonUses}
      />

      {/* Share Buttons */}
      <ShareButtons
        title="Secure Password Generator"
        description="Create strong, cryptographically random passwords with customizable rules. Free password generator with strength analysis."
      />
    </div>
  );
}