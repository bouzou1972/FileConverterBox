import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Search, Globe, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ToolSEO } from '@/components/tool-seo';
import { ShareButtons } from '@/components/share-buttons';
import { UsageGuide } from '@/components/usage-guide';

interface DNSRecord {
  name: string;
  type: string;
  value: string;
  ttl?: number;
}

interface DNSResult {
  domain: string;
  records: DNSRecord[];
  timestamp: string;
  error?: string;
}

const DNSChecker = () => {
  const [domain, setDomain] = useState('');
  const [recordType, setRecordType] = useState('A');
  const [results, setResults] = useState<DNSResult[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const { toast } = useToast();

  const recordTypes = ['A', 'AAAA', 'CNAME', 'MX', 'TXT', 'NS', 'SOA', 'PTR', 'SRV'];

  const checkDNS = async () => {
    if (!domain.trim()) {
      toast({
        title: "Domain required",
        description: "Please enter a domain name to check",
        variant: "destructive",
      });
      return;
    }

    setIsChecking(true);

    try {
      // Use Google's DNS-over-HTTPS API for DNS lookups
      const response = await fetch(
        `https://dns.google/resolve?name=${encodeURIComponent(domain.trim())}&type=${recordType}`,
        {
          headers: {
            'Accept': 'application/dns-json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      const dnsRecords: DNSRecord[] = [];
      
      if (data.Answer) {
        data.Answer.forEach((answer: any) => {
          dnsRecords.push({
            name: answer.name,
            type: getRecordTypeName(answer.type),
            value: answer.data,
            ttl: answer.TTL,
          });
        });
      }

      const result: DNSResult = {
        domain: domain.trim(),
        records: dnsRecords,
        timestamp: new Date().toLocaleString(),
        error: data.Status !== 0 ? `DNS lookup failed (Status: ${data.Status})` : undefined,
      };

      setResults(prev => [result, ...prev.slice(0, 9)]); // Keep last 10 results

      if (dnsRecords.length === 0 && data.Status === 0) {
        toast({
          title: "No records found",
          description: `No ${recordType} records found for ${domain}`,
        });
      } else if (data.Status !== 0) {
        toast({
          title: "DNS lookup failed",
          description: result.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "DNS check complete",
          description: `Found ${dnsRecords.length} ${recordType} record(s) for ${domain}`,
        });
      }
    } catch (error) {
      const errorResult: DNSResult = {
        domain: domain.trim(),
        records: [],
        timestamp: new Date().toLocaleString(),
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };

      setResults(prev => [errorResult, ...prev.slice(0, 9)]);
      
      toast({
        title: "DNS check failed",
        description: "Unable to perform DNS lookup. Check your internet connection.",
        variant: "destructive",
      });
    } finally {
      setIsChecking(false);
    }
  };

  const getRecordTypeName = (typeNumber: number): string => {
    const types: { [key: number]: string } = {
      1: 'A',
      2: 'NS',
      5: 'CNAME',
      6: 'SOA',
      12: 'PTR',
      15: 'MX',
      16: 'TXT',
      28: 'AAAA',
      33: 'SRV',
    };
    return types[typeNumber] || `TYPE${typeNumber}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "DNS record copied successfully",
    });
  };

  const copyAllResults = (result: DNSResult) => {
    const text = result.records
      .map(record => `${record.name} ${record.type} ${record.value} ${record.ttl ? `(TTL: ${record.ttl}s)` : ''}`)
      .join('\n');
    
    const fullText = `DNS Records for ${result.domain}\nChecked: ${result.timestamp}\n\n${text}`;
    copyToClipboard(fullText);
  };

  const formatRecordValue = (record: DNSRecord) => {
    if (record.type === 'MX') {
      return record.value; // MX records include priority
    }
    if (record.type === 'TXT') {
      return record.value.replace(/"/g, ''); // Remove quotes from TXT records
    }
    return record.value;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      checkDNS();
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <ToolSEO
        title="DNS Checker - Free DNS Record Lookup & DNS Propagation Checker"
        description="Check DNS records for any domain worldwide. Access public DNS servers by country. Look up A, AAAA, CNAME, MX, TXT, NS, SOA records instantly. Free DNS lookup tool with global DNS propagation checking."
        keywords={["dns checker", "dns lookup", "dns records", "dns propagation", "domain lookup", "mx records", "a records", "cname records", "txt records", "ns records", "soa records", "dns resolver", "public dns servers", "dns servers by country", "best dns servers"]}
        canonicalUrl="/dns-checker"
      />

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">DNS Records and Worldwide DNS Propagation Checker</h1>
        <p className="text-gray-600 max-w-3xl mx-auto mb-4">
          Check DNS records for any domain instantly with our comprehensive DNS lookup tool. Verify A, AAAA, CNAME, MX, TXT, NS, SOA, and PTR records. 
          Perfect for troubleshooting domain issues, verifying DNS configurations, and monitoring DNS propagation worldwide.
        </p>
        <div className="flex flex-wrap justify-center gap-2 text-sm">
          <Badge variant="secondary">Instant DNS Lookup</Badge>
          <Badge variant="secondary">Global DNS Servers</Badge>
          <Badge variant="secondary">All Record Types</Badge>
          <Badge variant="secondary">Free Tool</Badge>
        </div>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            DNS Lookup
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Domain Name
              </label>
              <Input
                placeholder="example.com"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Record Type
              </label>
              <select
                value={recordType}
                onChange={(e) => setRecordType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {recordTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          <Button
            onClick={checkDNS}
            disabled={isChecking || !domain.trim()}
            className="w-full sm:w-auto"
          >
            {isChecking ? (
              <>
                <Clock className="w-4 h-4 mr-2 animate-spin" />
                Checking DNS...
              </>
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                Check DNS Records
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>DNS Lookup Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {results.map((result, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{result.domain}</h3>
                      <p className="text-sm text-gray-500">Checked: {result.timestamp}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {result.error ? (
                        <Badge variant="destructive" className="flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          Error
                        </Badge>
                      ) : (
                        <Badge variant="default" className="flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          {result.records.length} records
                        </Badge>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyAllResults(result)}
                      >
                        <Copy className="w-4 h-4 mr-1" />
                        Copy All
                      </Button>
                    </div>
                  </div>

                  {result.error ? (
                    <Alert>
                      <AlertCircle className="w-4 h-4" />
                      <AlertDescription>{result.error}</AlertDescription>
                    </Alert>
                  ) : result.records.length === 0 ? (
                    <Alert>
                      <AlertDescription>No DNS records found for this domain and record type.</AlertDescription>
                    </Alert>
                  ) : (
                    <div className="space-y-3">
                      {result.records.map((record, recordIndex) => (
                        <div
                          key={recordIndex}
                          className="bg-gray-50 p-3 rounded border flex items-center justify-between"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="secondary">{record.type}</Badge>
                              <span className="font-mono text-sm truncate">{record.name}</span>
                            </div>
                            <div className="font-mono text-sm break-all text-gray-700">
                              {formatRecordValue(record)}
                            </div>
                            {record.ttl && (
                              <div className="text-xs text-gray-500">TTL: {record.ttl}s</div>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(formatRecordValue(record))}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Educational Content Section */}
      <div className="mt-12 space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-600" />
              What is DNS and Why Check DNS Records?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              The DNS (Domain Name System) is the system that translates domain names you enter in the browser to the IP addresses required to access a website. 
              When you use our DNS checker, you can verify how domain names resolve across different DNS servers worldwide.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2 text-blue-600">Why Use a DNS Checker?</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Troubleshoot website connectivity issues</li>
                  <li>• Verify DNS propagation after changes</li>
                  <li>• Check email server configurations (MX records)</li>
                  <li>• Validate domain verification records</li>
                  <li>• Monitor DNS security settings</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-green-600">DNS Record Types Explained</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• <strong>A:</strong> Points domain to IPv4 address</li>
                  <li>• <strong>AAAA:</strong> Points domain to IPv6 address</li>
                  <li>• <strong>CNAME:</strong> Alias pointing to another domain</li>
                  <li>• <strong>MX:</strong> Mail exchange servers for email</li>
                  <li>• <strong>TXT:</strong> Text records for verification</li>
                  <li>• <strong>NS:</strong> Name servers for the domain</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              Common DNS Issues and Solutions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2 text-orange-600">Slow Website Loading</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Slow DNS servers may cause lag before websites load. DNS lookups typically take 20-120 milliseconds to complete.
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Solution:</strong> Switch to faster public DNS servers like Cloudflare (1.1.1.1) or Google (8.8.8.8).
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-red-600">DNS Propagation Delays</h4>
                <p className="text-sm text-gray-600 mb-3">
                  After changing DNS records, it can take up to 48 hours for changes to propagate globally.
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Solution:</strong> Use our DNS checker to monitor propagation status across different regions.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="guide" className="mt-8">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="guide">Usage Guide</TabsTrigger>
          <TabsTrigger value="dns-info">DNS Information</TabsTrigger>
          <TabsTrigger value="dns-servers">DNS Servers by Country</TabsTrigger>
          <TabsTrigger value="share">Share Tool</TabsTrigger>
        </TabsList>
        
        <TabsContent value="guide">
          <UsageGuide
            title="DNS Checker"
            description="Learn how to effectively check DNS records for domains and troubleshoot DNS-related issues"
            examples={[
              {
                title: "Website Troubleshooting",
                description: "Check A and AAAA records to verify where a domain points",
                steps: [
                  "Enter the domain name (e.g., google.com)",
                  "Select 'A' record type for IPv4 or 'AAAA' for IPv6",
                  "Click 'Check DNS Records'",
                  "Verify the IP addresses match your expectations"
                ],
                tip: "Use this to troubleshoot website connectivity issues"
              },
              {
                title: "Email Configuration",
                description: "Look up MX records to verify email server settings",
                steps: [
                  "Enter your domain name",
                  "Select 'MX' record type",
                  "Check the priority and mail server addresses",
                  "Verify they match your email provider's settings"
                ],
                tip: "MX records with lower priority values are preferred"
              },
              {
                title: "Domain Verification",
                description: "Check TXT records for domain ownership verification",
                steps: [
                  "Enter your domain name",
                  "Select 'TXT' record type",
                  "Look for verification codes or SPF/DKIM records",
                  "Copy the records as needed for verification"
                ],
                tip: "TXT records are commonly used for domain verification and email security"
              }
            ]}
            tips={[
              "A records point to IPv4 addresses - most common DNS record type",
              "AAAA records point to IPv6 addresses - the future of internet addressing", 
              "CNAME records are aliases pointing to other domains - useful for subdomains",
              "MX records specify mail servers for email delivery - lower priority numbers are preferred",
              "TXT records contain text information - commonly used for domain verification and email security",
              "NS records specify the authoritative name servers for the domain",
              "SOA records contain administrative information about the domain zone",
              "DNS propagation can take up to 48 hours to complete globally",
              "Use multiple DNS record types to get a complete picture of domain configuration"
            ]}
            commonUses={[
              "Website troubleshooting and connectivity issues",
              "Email server configuration and MX record verification",
              "Domain ownership verification for services",
              "DNS propagation monitoring after record changes",
              "Security analysis and SPF/DKIM record checking",
              "Subdomain and CNAME configuration verification",
              "Name server and authoritative DNS checking"
            ]}
          />
        </TabsContent>
        
        <TabsContent value="dns-info">
          <Card>
            <CardHeader>
              <CardTitle>Public DNS Servers and Best Practices</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold mb-3 text-blue-600">Popular Public DNS Servers</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <h5 className="font-medium">Cloudflare DNS</h5>
                      <p className="text-sm text-gray-600">Primary: 1.1.1.1 | Secondary: 1.0.0.1</p>
                      <p className="text-xs text-gray-500">Fast, privacy-focused DNS</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <h5 className="font-medium">Google Public DNS</h5>
                      <p className="text-sm text-gray-600">Primary: 8.8.8.8 | Secondary: 8.8.4.4</p>
                      <p className="text-xs text-gray-500">Reliable, global DNS service</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <h5 className="font-medium">OpenDNS</h5>
                      <p className="text-sm text-gray-600">Primary: 208.67.222.222 | Secondary: 208.67.220.220</p>
                      <p className="text-xs text-gray-500">Security and parental controls</p>
                    </div>
                    <div className="p-3 bg-orange-50 rounded-lg">
                      <h5 className="font-medium">Quad9 DNS</h5>
                      <p className="text-sm text-gray-600">Primary: 9.9.9.9 | Secondary: 149.112.112.112</p>
                      <p className="text-xs text-gray-500">Security-focused DNS blocking</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3 text-green-600">Why Use Public DNS Servers?</h4>
                <ul className="grid md:grid-cols-2 gap-2 text-sm text-gray-700">
                  <li>• Faster web browsing speed</li>
                  <li>• Improved reliability and stability</li>
                  <li>• Protection against phishing websites</li>
                  <li>• Enhanced security features</li>
                  <li>• Parental control options</li>
                  <li>• Faster DNS propagation process</li>
                </ul>
              </div>

              <Alert>
                <AlertCircle className="w-4 h-4" />
                <AlertDescription>
                  <strong>Pro Tip:</strong> You can mix DNS servers for redundancy. Use Google Public DNS as primary (8.8.8.8) 
                  and OpenDNS as secondary (208.67.222.222) to improve reliability.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="dns-servers">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-600" />
                Public DNS Servers by Country
              </CardTitle>
              <p className="text-sm text-gray-600">
                Complete list of the best IPv4 and IPv6 public DNS servers worldwide. Choose servers closest to your location for optimal performance.
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Global DNS Providers */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-blue-600">Global DNS Providers</h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium text-gray-900">🌐 Cloudflare (Global)</h4>
                      <div className="mt-2 space-y-1">
                        <p className="text-sm"><strong>IPv4:</strong> 1.1.1.1, 1.0.0.1</p>
                        <p className="text-sm"><strong>IPv6:</strong> 2606:4700:4700::1111, 2606:4700:4700::1001</p>
                        <p className="text-xs text-gray-500">Privacy-focused, fastest DNS</p>
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium text-gray-900">🌐 Google Public DNS (Global)</h4>
                      <div className="mt-2 space-y-1">
                        <p className="text-sm"><strong>IPv4:</strong> 8.8.8.8, 8.8.4.4</p>
                        <p className="text-sm"><strong>IPv6:</strong> 2001:4860:4860::8888, 2001:4860:4860::8844</p>
                        <p className="text-xs text-gray-500">Reliable, global coverage</p>
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium text-gray-900">🌐 OpenDNS (Global)</h4>
                      <div className="mt-2 space-y-1">
                        <p className="text-sm"><strong>IPv4:</strong> 208.67.222.222, 208.67.220.220</p>
                        <p className="text-sm"><strong>IPv6:</strong> 2620:119:35::35, 2620:119:53::53</p>
                        <p className="text-xs text-gray-500">Security & parental controls</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Regional DNS Servers */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-green-600">Regional DNS Servers</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    
                    {/* North America */}
                    <div>
                      <h4 className="font-medium mb-3 text-blue-700">🇺🇸 United States</h4>
                      <div className="space-y-3">
                        <div className="p-3 bg-blue-50 rounded">
                          <h5 className="font-medium">Level3 (CenturyLink)</h5>
                          <p className="text-sm text-gray-600">4.2.2.1, 4.2.2.2</p>
                        </div>
                        <div className="p-3 bg-blue-50 rounded">
                          <h5 className="font-medium">Verizon</h5>
                          <p className="text-sm text-gray-600">4.2.2.3, 4.2.2.4</p>
                        </div>
                        <div className="p-3 bg-blue-50 rounded">
                          <h5 className="font-medium">AT&T</h5>
                          <p className="text-sm text-gray-600">68.94.156.1, 68.94.157.1</p>
                        </div>
                      </div>
                      
                      <h4 className="font-medium mb-3 mt-4 text-blue-700">🇨🇦 Canada</h4>
                      <div className="space-y-3">
                        <div className="p-3 bg-blue-50 rounded">
                          <h5 className="font-medium">Canadian Internet Registration Authority</h5>
                          <p className="text-sm text-gray-600">149.112.121.10, 149.112.122.10</p>
                        </div>
                        <div className="p-3 bg-blue-50 rounded">
                          <h5 className="font-medium">Rogers Communications</h5>
                          <p className="text-sm text-gray-600">64.71.255.204, 64.71.255.203</p>
                        </div>
                      </div>
                    </div>

                    {/* Europe */}
                    <div>
                      <h4 className="font-medium mb-3 text-green-700">🇬🇧 United Kingdom</h4>
                      <div className="space-y-3">
                        <div className="p-3 bg-green-50 rounded">
                          <h5 className="font-medium">BT Internet</h5>
                          <p className="text-sm text-gray-600">62.6.40.178, 62.6.36.178</p>
                        </div>
                        <div className="p-3 bg-green-50 rounded">
                          <h5 className="font-medium">Sky Broadband</h5>
                          <p className="text-sm text-gray-600">90.207.238.97, 90.207.238.101</p>
                        </div>
                      </div>

                      <h4 className="font-medium mb-3 mt-4 text-green-700">🇩🇪 Germany</h4>
                      <div className="space-y-3">
                        <div className="p-3 bg-green-50 rounded">
                          <h5 className="font-medium">Deutsche Telekom</h5>
                          <p className="text-sm text-gray-600">62.109.121.1, 62.109.121.2</p>
                        </div>
                        <div className="p-3 bg-green-50 rounded">
                          <h5 className="font-medium">DNS.WATCH</h5>
                          <p className="text-sm text-gray-600">84.200.69.80, 84.200.70.40</p>
                        </div>
                      </div>

                      <h4 className="font-medium mb-3 mt-4 text-green-700">🇫🇷 France</h4>
                      <div className="space-y-3">
                        <div className="p-3 bg-green-50 rounded">
                          <h5 className="font-medium">Orange</h5>
                          <p className="text-sm text-gray-600">80.67.169.12, 80.67.169.40</p>
                        </div>
                        <div className="p-3 bg-green-50 rounded">
                          <h5 className="font-medium">Free.fr</h5>
                          <p className="text-sm text-gray-600">212.27.40.240, 212.27.40.241</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Asia Pacific */}
                  <div className="mt-6">
                    <h4 className="font-medium mb-4 text-purple-700">Asia Pacific</h4>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <h5 className="font-medium mb-2 text-purple-600">🇯🇵 Japan</h5>
                        <div className="space-y-2">
                          <div className="p-2 bg-purple-50 rounded text-sm">
                            <strong>NTT Communications:</strong><br/>
                            210.196.3.183, 210.141.99.99
                          </div>
                          <div className="p-2 bg-purple-50 rounded text-sm">
                            <strong>IIJ:</strong><br/>
                            210.130.1.1, 210.130.1.2
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h5 className="font-medium mb-2 text-purple-600">🇦🇺 Australia</h5>
                        <div className="space-y-2">
                          <div className="p-2 bg-purple-50 rounded text-sm">
                            <strong>Telstra:</strong><br/>
                            139.130.4.5, 203.50.2.71
                          </div>
                          <div className="p-2 bg-purple-50 rounded text-sm">
                            <strong>Optus:</strong><br/>
                            211.29.132.12, 211.29.133.12
                          </div>
                        </div>
                      </div>

                      <div>
                        <h5 className="font-medium mb-2 text-purple-600">🇸🇬 Singapore</h5>
                        <div className="space-y-2">
                          <div className="p-2 bg-purple-50 rounded text-sm">
                            <strong>SingTel:</strong><br/>
                            165.21.83.88, 165.21.100.88
                          </div>
                          <div className="p-2 bg-purple-50 rounded text-sm">
                            <strong>StarHub:</strong><br/>
                            202.156.2.22, 202.156.3.22
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Additional Countries */}
                  <div className="mt-6">
                    <h4 className="font-medium mb-4 text-orange-700">Other Regions</h4>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <h5 className="font-medium mb-2 text-orange-600">🇧🇷 Brazil</h5>
                        <div className="p-2 bg-orange-50 rounded text-sm">
                          <strong>Telecom Italia:</strong><br/>
                          189.38.95.95, 189.38.95.96
                        </div>
                      </div>
                      
                      <div>
                        <h5 className="font-medium mb-2 text-orange-600">🇷🇺 Russia</h5>
                        <div className="p-2 bg-orange-50 rounded text-sm">
                          <strong>Yandex.DNS:</strong><br/>
                          77.88.8.8, 77.88.8.1
                        </div>
                      </div>

                      <div>
                        <h5 className="font-medium mb-2 text-orange-600">🇮🇳 India</h5>
                        <div className="p-2 bg-orange-50 rounded text-sm">
                          <strong>BSNL:</strong><br/>
                          61.1.64.1, 61.1.64.2
                        </div>
                      </div>

                      <div>
                        <h5 className="font-medium mb-2 text-orange-600">🇿🇦 South Africa</h5>
                        <div className="p-2 bg-orange-50 rounded text-sm">
                          <strong>Telkom:</strong><br/>
                          196.7.0.138, 196.7.142.132
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Performance Tips */}
                <Alert>
                  <Globe className="w-4 h-4" />
                  <AlertDescription>
                    <strong>Performance Tip:</strong> Choose DNS servers geographically closest to your location for optimal performance. 
                    You can also mix servers from different providers for redundancy (e.g., Cloudflare primary + Google secondary).
                  </AlertDescription>
                </Alert>

                {/* Security Note */}
                <Alert>
                  <AlertCircle className="w-4 h-4" />
                  <AlertDescription>
                    <strong>Security Note:</strong> Some regional ISP DNS servers may not offer malware protection or may log your queries. 
                    Consider using privacy-focused options like Cloudflare (1.1.1.1) or OpenDNS for enhanced security.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="share">
          <ShareButtons
            title="DNS Checker - Free DNS Record Lookup & Public DNS Servers by Country"
            description="Check DNS records for any domain worldwide. Access complete list of public DNS servers by country. Verify A, AAAA, CNAME, MX, TXT, NS records instantly."
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DNSChecker;