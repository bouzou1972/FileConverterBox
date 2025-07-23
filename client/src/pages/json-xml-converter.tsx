import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Copy, Download, Upload, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function JsonXmlConverter() {
  const [jsonInput, setJsonInput] = useState("");
  const [xmlInput, setXmlInput] = useState("");
  const [jsonOutput, setJsonOutput] = useState("");
  const [xmlOutput, setXmlOutput] = useState("");
  const [error, setError] = useState("");
  const { toast } = useToast();

  const jsonToXml = (obj: any, rootName = "root"): string => {
    const buildXml = (obj: any, name: string): string => {
      if (obj === null || obj === undefined) {
        return `<${name}></${name}>`;
      }
      
      if (typeof obj === "string" || typeof obj === "number" || typeof obj === "boolean") {
        return `<${name}>${String(obj).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</${name}>`;
      }
      
      if (Array.isArray(obj)) {
        return obj.map(item => buildXml(item, name)).join("");
      }
      
      if (typeof obj === "object") {
        const children = Object.entries(obj)
          .map(([key, value]) => buildXml(value, key))
          .join("");
        return `<${name}>${children}</${name}>`;
      }
      
      return `<${name}>${obj}</${name}>`;
    };
    
    return `<?xml version="1.0" encoding="UTF-8"?>\n${buildXml(obj, rootName)}`;
  };

  const xmlToJson = (xmlStr: string): any => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlStr, "text/xml");
    
    if (xmlDoc.getElementsByTagName("parsererror").length > 0) {
      throw new Error("Invalid XML format");
    }
    
    const xmlToObj = (node: Element): any => {
      if (node.children.length === 0) {
        return node.textContent || "";
      }
      
      const result: any = {};
      const children = Array.from(node.children);
      
      for (const child of children) {
        const key = child.tagName;
        const value = xmlToObj(child);
        
        if (result[key]) {
          if (!Array.isArray(result[key])) {
            result[key] = [result[key]];
          }
          result[key].push(value);
        } else {
          result[key] = value;
        }
      }
      
      return result;
    };
    
    return xmlToObj(xmlDoc.documentElement);
  };

  const handleJsonToXml = () => {
    try {
      setError("");
      const parsed = JSON.parse(jsonInput);
      const xml = jsonToXml(parsed);
      setXmlOutput(xml);
      toast({
        title: "Success",
        description: "JSON converted to XML successfully",
      });
    } catch (err) {
      setError("Invalid JSON format. Please check your input.");
    }
  };

  const handleXmlToJson = () => {
    try {
      setError("");
      const json = xmlToJson(xmlInput);
      setJsonOutput(JSON.stringify(json, null, 2));
      toast({
        title: "Success",
        description: "XML converted to JSON successfully",
      });
    } catch (err) {
      setError("Invalid XML format. Please check your input.");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Content copied to clipboard",
    });
  };

  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, setInput: (value: string) => void) => {
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

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">JSON ↔ XML Converter</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Convert between JSON and XML formats instantly. All processing happens in your browser - no data is sent to servers.
        </p>
      </div>

      {error && (
        <Alert className="mb-6 border-red-200 bg-red-50">
          <AlertDescription className="text-red-700">{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="json-to-xml" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="json-to-xml">JSON to XML</TabsTrigger>
          <TabsTrigger value="xml-to-json">XML to JSON</TabsTrigger>
        </TabsList>

        <TabsContent value="json-to-xml" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="material-icons text-blue-600">data_object</span>
                  JSON Input
                </CardTitle>
                <CardDescription>Paste your JSON data or upload a file</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => document.getElementById('json-file')?.click()}>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload File
                  </Button>
                  <input
                    id="json-file"
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, setJsonInput)}
                  />
                </div>
                <Textarea
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  placeholder='{"name": "John", "age": 30, "city": "New York"}'
                  className="min-h-[300px] font-mono text-sm"
                />
                <Button onClick={handleJsonToXml} className="w-full">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Convert to XML
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="material-icons text-green-600">code</span>
                  XML Output
                </CardTitle>
                <CardDescription>Generated XML from your JSON input</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => copyToClipboard(xmlOutput)} disabled={!xmlOutput}>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => downloadFile(xmlOutput, "converted.xml")} disabled={!xmlOutput}>
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
                <Textarea
                  value={xmlOutput}
                  readOnly
                  placeholder="XML output will appear here..."
                  className="min-h-[300px] font-mono text-sm bg-gray-50"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="xml-to-json" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="material-icons text-green-600">code</span>
                  XML Input
                </CardTitle>
                <CardDescription>Paste your XML data or upload a file</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => document.getElementById('xml-file')?.click()}>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload File
                  </Button>
                  <input
                    id="xml-file"
                    type="file"
                    accept=".xml"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, setXmlInput)}
                  />
                </div>
                <Textarea
                  value={xmlInput}
                  onChange={(e) => setXmlInput(e.target.value)}
                  placeholder='<?xml version="1.0"?><root><name>John</name><age>30</age></root>'
                  className="min-h-[300px] font-mono text-sm"
                />
                <Button onClick={handleXmlToJson} className="w-full">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Convert to JSON
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="material-icons text-blue-600">data_object</span>
                  JSON Output
                </CardTitle>
                <CardDescription>Generated JSON from your XML input</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => copyToClipboard(jsonOutput)} disabled={!jsonOutput}>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => downloadFile(jsonOutput, "converted.json")} disabled={!jsonOutput}>
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
                <Textarea
                  value={jsonOutput}
                  readOnly
                  placeholder="JSON output will appear here..."
                  className="min-h-[300px] font-mono text-sm bg-gray-50"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}