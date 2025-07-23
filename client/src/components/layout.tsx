import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

const tools = [
  // Data Format Converters (Most Popular)
  { href: "/csv-converter", title: "CSV Converter", icon: "table_chart", group: "Data" },
  { href: "/json-formatter", title: "JSON Formatter", icon: "data_object", group: "Data" },
  { href: "/json-xml-converter", title: "JSON ↔ XML Converter", icon: "swap_horiz", group: "Data" },
  { href: "/base64-converter", title: "Base64 Encoder/Decoder", icon: "code", group: "Data" },
  
  // PDF Tools (High Demand)
  { href: "/pdf-converter", title: "PDF Converter", icon: "picture_as_pdf", group: "PDF" },
  { href: "/png-to-pdf", title: "PNG to PDF", icon: "image", group: "PDF" },
  { href: "/pdf-to-ppt", title: "PDF to PPT", icon: "slideshow", group: "PDF" },
  
  // HTML/Markdown Tools
  { href: "/html-minifier", title: "HTML Minifier/Beautifier", icon: "compress", group: "HTML" },
  { href: "/markdown-converter", title: "Markdown to HTML", icon: "description", group: "HTML" },
  { href: "/html-to-markdown", title: "HTML to Markdown", icon: "code", group: "HTML" },
  
  // Text Processing Tools
  { href: "/text-case-converter", title: "Text Case Converter", icon: "text_fields", group: "Text" },
  { href: "/text-diff-checker", title: "Text Diff Checker", icon: "compare_arrows", group: "Text" },
  { href: "/regex-tester", title: "Regex Tester", icon: "search", group: "Text" },
  
  // Developer Utilities
  { href: "/hash-generator", title: "Hash Generator", icon: "tag", group: "Dev" },
  { href: "/number-base-converter", title: "Number Base Converter", icon: "calculate", group: "Dev" },
  { href: "/uuid-generator", title: "UUID Generator", icon: "fingerprint", group: "Dev" },
  { href: "/timestamp-converter", title: "Timestamp Converter", icon: "schedule", group: "Dev" },
  
  // Content Generation (Least Essential)
  { href: "/lorem-generator", title: "Lorem Generator", icon: "text_snippet", group: "Content" }
];

export default function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          {/* Site Name */}
          <Link href="/">
            <h1 className="text-2xl font-bold text-blue-600 cursor-pointer">
              FileConverterData
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <span className="text-sm text-gray-500">100% Local, Free & Private</span>
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Menu className="w-4 h-4" />
                  All Tools
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 max-h-screen overflow-y-auto">
                <SheetHeader>
                  <SheetTitle className="text-left">All Tools ({tools.length})</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-1 pb-6">
                  {(() => {
                    const groupedTools = tools.reduce((acc, tool) => {
                      if (!acc[tool.group]) acc[tool.group] = [];
                      acc[tool.group].push(tool);
                      return acc;
                    }, {} as Record<string, typeof tools>);

                    const groupOrder = ['Data', 'PDF', 'HTML', 'Text', 'Dev', 'Content'];
                    const groupLabels = {
                      'Data': 'Data Formats',
                      'PDF': 'PDF Tools',
                      'HTML': 'HTML/Markdown',
                      'Text': 'Text Processing',
                      'Dev': 'Developer Utils',
                      'Content': 'Content Gen'
                    };

                    return groupOrder.map(groupKey => (
                      <div key={groupKey} className="mb-4">
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-3 py-2 bg-gray-50 rounded-sm">
                          {groupLabels[groupKey as keyof typeof groupLabels]}
                        </div>
                        {groupedTools[groupKey]?.map((tool) => (
                          <Link key={tool.href} href={tool.href}>
                            <div 
                              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer border-b border-gray-100 last:border-b-0"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              <span className="material-icons text-blue-600 text-lg flex-shrink-0">
                                {tool.icon}
                              </span>
                              <span className="font-medium text-sm">{tool.title}</span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ));
                  })()}
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Mobile Hamburger Menu */}
          <div className="md:hidden">
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 max-h-screen overflow-y-auto">
                <SheetHeader>
                  <SheetTitle className="text-left">All Tools ({tools.length})</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-1 pb-6">
                  <div className="text-xs text-gray-500 mb-4 p-2 bg-green-50 rounded">
                    100% Local, Free & Private
                  </div>
                  {(() => {
                    const groupedTools = tools.reduce((acc, tool) => {
                      if (!acc[tool.group]) acc[tool.group] = [];
                      acc[tool.group].push(tool);
                      return acc;
                    }, {} as Record<string, typeof tools>);

                    const groupOrder = ['Data', 'PDF', 'HTML', 'Text', 'Dev', 'Content'];
                    const groupLabels = {
                      'Data': 'Data Formats',
                      'PDF': 'PDF Tools',
                      'HTML': 'HTML/Markdown',
                      'Text': 'Text Processing',
                      'Dev': 'Developer Utils',
                      'Content': 'Content Gen'
                    };

                    return groupOrder.map(groupKey => (
                      <div key={groupKey} className="mb-4">
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-3 py-2 bg-gray-50 rounded-sm">
                          {groupLabels[groupKey as keyof typeof groupLabels]}
                        </div>
                        {groupedTools[groupKey]?.map((tool) => (
                          <Link key={tool.href} href={tool.href}>
                            <div 
                              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer border-b border-gray-100 last:border-b-0"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              <span className="material-icons text-blue-600 text-lg flex-shrink-0">
                                {tool.icon}
                              </span>
                              <span className="font-medium text-sm">{tool.title}</span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ));
                  })()}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main>{children}</main>

      <footer className="text-center py-6 text-sm text-gray-500 border-t bg-white mt-12">
        <p>
          © 2025 FileConverterData. All rights reserved. |{" "}
          <span className="text-green-600">●</span> All processing happens locally in your browser
        </p>
      </footer>
    </div>
  );
}
