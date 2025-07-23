import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

const tools = [
  { href: "/csv-converter", title: "CSV Converter", icon: "table_chart" },
  { href: "/regex-tester", title: "Regex Tester", icon: "search" },
  { href: "/timestamp-converter", title: "Timestamp Converter", icon: "schedule" },
  { href: "/uuid-generator", title: "UUID Generator", icon: "fingerprint" },
  { href: "/json-formatter", title: "JSON Formatter", icon: "data_object" },
  { href: "/lorem-generator", title: "Lorem Generator", icon: "text_snippet" },
  { href: "/markdown-converter", title: "Markdown to HTML", icon: "description" },
  { href: "/pdf-converter", title: "PDF Converter", icon: "picture_as_pdf" },
  { href: "/png-to-pdf", title: "PNG to PDF", icon: "image" },
  { href: "/pdf-to-ppt", title: "PDF to PPT", icon: "slideshow" },
  { href: "/base64-converter", title: "Base64 Encoder/Decoder", icon: "code" },
  { href: "/text-case-converter", title: "Text Case Converter", icon: "text_fields" },
  { href: "/text-diff-checker", title: "Text Diff Checker", icon: "compare_arrows" },
  { href: "/html-to-markdown", title: "HTML to Markdown", icon: "code" }
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
              <SheetContent side="right" className="w-80">
                <SheetHeader>
                  <SheetTitle className="text-left">All Tools</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-2">
                  {tools.map((tool) => (
                    <Link key={tool.href} href={tool.href}>
                      <div 
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <span className="material-icons text-blue-600 text-xl">
                          {tool.icon}
                        </span>
                        <span className="font-medium">{tool.title}</span>
                      </div>
                    </Link>
                  ))}
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
              <SheetContent side="right" className="w-80">
                <SheetHeader>
                  <SheetTitle className="text-left">All Tools</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-2">
                  <div className="text-xs text-gray-500 mb-4 p-2 bg-green-50 rounded">
                    100% Local, Free & Private
                  </div>
                  {tools.map((tool) => (
                    <Link key={tool.href} href={tool.href}>
                      <div 
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <span className="material-icons text-blue-600 text-xl">
                          {tool.icon}
                        </span>
                        <span className="font-medium">{tool.title}</span>
                      </div>
                    </Link>
                  ))}
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
