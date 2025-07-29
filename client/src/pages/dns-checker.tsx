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
        title="DNS Checker Tool - Free DNS Record Lookup | File Converter Box"
        description="Check DNS records for any domain instantly. Look up A, AAAA, CNAME, MX, TXT, NS, and other DNS records with our free DNS checker tool."
        keywords={["dns checker", "dns lookup", "dns records", "domain lookup", "mx records", "a records", "cname records", "txt records"]}
        canonicalUrl="/dns-checker"
      />

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">DNS Checker</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Check DNS records for any domain instantly. Look up A, AAAA, CNAME, MX, TXT, NS, SOA, and other DNS record types. 
          Perfect for troubleshooting domain issues and verifying DNS configurations.
        </p>
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

      <Tabs defaultValue="guide" className="mt-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="guide">Usage Guide</TabsTrigger>
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
              "A records point to IPv4 addresses",
              "AAAA records point to IPv6 addresses", 
              "CNAME records are aliases pointing to other domains",
              "MX records specify mail servers for email delivery",
              "TXT records contain text information, often used for verification",
              "NS records specify the authoritative name servers",
              "Use this tool to troubleshoot domain and email issues"
            ]}
            commonUses={[
              "Website troubleshooting",
              "Email configuration",
              "Domain verification",
              "DNS propagation monitoring",
              "Security analysis"
            ]}
          />
        </TabsContent>
        
        <TabsContent value="share">
          <ShareButtons
            title="DNS Checker Tool - Free DNS Record Lookup"
            description="Check DNS records for any domain instantly with this free online tool"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DNSChecker;