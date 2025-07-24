import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import ToolCard from "@/components/tool-card";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  const toolGroups = [
    {
      title: "Data Formats",
      subtitle: "Most Popular Converters",
      tools: [
        {
          href: "/csv-converter",
          icon: "table_chart",
          iconColor: "text-blue-600",
          title: "CSV Converter",
          description: "Convert between CSV, JSON, YAML, and TSV formats with drag-and-drop support.",
          badge: "🔥 Popular"
        },
        {
          href: "/json-formatter",
          icon: "data_object",
          iconColor: "text-indigo-600",
          title: "JSON Formatter",
          description: "Format, validate, and minify JSON data with syntax highlighting and error detection.",
          badge: "🔥 Popular"
        },
        {
          href: "/json-xml-converter",
          icon: "swap_horiz",
          iconColor: "text-green-600",
          title: "JSON ↔ XML Converter",
          description: "Convert between JSON and XML formats bidirectionally with file upload support.",
          badge: "🆕 New"
        },
        {
          href: "/base64-converter",
          icon: "code",
          iconColor: "text-blue-600",
          title: "Base64 Encoder/Decoder",
          description: "Encode text or files to Base64 format or decode Base64 strings back to readable text."
        },
        {
          href: "/string-to-json",
          icon: "data_object",
          iconColor: "text-purple-600",
          title: "String to JSON Converter",
          description: "Convert malformed strings to valid JSON. Fixes single quotes, unquoted keys, and trailing commas.",
          badge: "🆕 New"
        }
      ]
    },
    {
      title: "PDF Tools",
      subtitle: "High Demand File Converters",
      tools: [
        {
          href: "/pdf-converter",
          icon: "picture_as_pdf",
          iconColor: "text-red-600",
          title: "PDF Converter",
          description: "Convert text, HTML, or images to PDF with customizable formatting and page settings."
        },
        {
          href: "/png-to-pdf",
          icon: "image",
          iconColor: "text-orange-600",
          title: "PNG to PDF Converter",
          description: "Convert PNG, JPG, and other image formats to PDF with batch processing support."
        },
        {
          href: "/pdf-to-ppt",
          icon: "slideshow",
          iconColor: "text-purple-600",
          title: "PDF to PPT Converter",
          description: "Convert PDF documents to PowerPoint presentations with automatic slide generation."
        }
      ]
    },
    {
      title: "HTML/Markdown",
      subtitle: "Web Content Converters",
      tools: [
        {
          href: "/html-minifier",
          icon: "compress",
          iconColor: "text-purple-600",
          title: "HTML Minifier/Beautifier",
          description: "Minify HTML to reduce file size or beautify HTML for better readability with customizable options."
        },
        {
          href: "/markdown-converter",
          icon: "description",
          iconColor: "text-red-600",
          title: "Markdown to HTML",
          description: "Convert Markdown content into clean HTML with live preview and export options."
        },
        {
          href: "/html-to-markdown",
          icon: "code",
          iconColor: "text-indigo-600",
          title: "HTML to Markdown",
          description: "Convert HTML content to clean Markdown format with support for headers, links, images, and more."
        }
      ]
    },
    {
      title: "Text Processing",
      subtitle: "Advanced Text Tools",
      tools: [
        {
          href: "/text-case-converter",
          icon: "text_fields",
          iconColor: "text-green-600",
          title: "Text Case Converter",
          description: "Convert text between different case formats like camelCase, snake_case, kebab-case, and more. Includes lowercase, UPPERCASE, and Capitalize options."
        },
        {
          href: "/text-diff-checker",
          icon: "compare_arrows",
          iconColor: "text-purple-600",
          title: "Text Diff Checker",
          description: "Compare two blocks of text to find differences, additions, and deletions with detailed analysis."
        },
        {
          href: "/text-line-tools",
          icon: "format_list_bulleted",
          iconColor: "text-blue-600",
          title: "Text Line Tools",
          description: "Sort, deduplicate, merge, and manipulate text lines with powerful processing options.",
          badge: "🆕 New"
        },
        {
          href: "/whitespace-tool",
          icon: "auto_fix_high",
          iconColor: "text-green-600",
          title: "Whitespace & Indentation Tool",
          description: "Clean up messy text formatting by normalizing whitespace, fixing indentation, and removing unwanted spaces.",
          badge: "🆕 New"
        },
        {
          href: "/regex-tester",
          icon: "search",
          iconColor: "text-green-600",
          title: "Regex Tester",
          description: "Test regular expressions with live matching, replace functionality, and pattern explanation."
        }
      ]
    },
    {
      title: "Developer Utils",
      subtitle: "Programming Utilities",
      tools: [
        {
          href: "/hash-generator",
          icon: "tag",
          iconColor: "text-red-600",
          title: "Hash Generator",
          description: "Generate MD5, SHA-1, SHA-256, and SHA-512 hashes from text or files for security and integrity."
        },
        {
          href: "/number-base-converter",
          icon: "calculate",
          iconColor: "text-blue-600",
          title: "Number Base Converter",
          description: "Convert numbers between binary, octal, decimal, and hexadecimal formats with live conversion."
        },
        {
          href: "/uuid-generator",
          icon: "fingerprint",
          iconColor: "text-purple-600",
          title: "UUID Generator",
          description: "Generate secure UUID v4 identifiers with bulk generation and copy functionality."
        },
        {
          href: "/timestamp-converter",
          icon: "schedule",
          iconColor: "text-orange-600",
          title: "Timestamp Converter",
          description: "Convert Unix timestamps to human-readable dates and back with timezone support."
        }
      ]
    },
    {
      title: "Image & Color Tools",
      subtitle: "Visual Design Utilities",
      tools: [
        {
          href: "/image-to-base64",
          icon: "image",
          iconColor: "text-purple-600",
          title: "Image to Base64",
          description: "Convert images to Base64 encoded strings for embedding in HTML, CSS, or applications.",
          badge: "🆕 New"
        },
        {
          href: "/color-converter",
          icon: "palette",
          iconColor: "text-pink-600",
          title: "Color Converter",
          description: "Convert colors between HEX, RGB, and HSL formats with visual color picker and sliders.",
          badge: "🆕 New"
        },
        {
          href: "/image-converter",
          icon: "image",
          iconColor: "text-indigo-600",
          title: "Image Format Converter",
          description: "Convert images between PNG, JPEG, and WebP formats with quality control.",
          badge: "🆕 New"
        },
        {
          href: "/image-resizer",
          icon: "photo_size_select_large",
          iconColor: "text-green-600",
          title: "Image Resizer & Compressor",
          description: "Resize images by pixels or percentage and compress with quality control.",
          badge: "🆕 New"
        },
        {
          href: "/color-palette-generator",
          icon: "palette",
          iconColor: "text-purple-600",
          title: "Color Palette Generator",
          description: "Extract beautiful color palettes from any image with hex, RGB, and HSL values.",
          badge: "🆕 New"
        }
      ]
    },
    {
      title: "Spreadsheet Tools",
      subtitle: "Excel & CSV Utilities",
      tools: [
        {
          href: "/excel-converter",
          icon: "swap_horiz",
          iconColor: "text-green-600",
          title: "Excel ↔ CSV Converter",
          description: "Convert between Excel (.xlsx) and CSV formats with support for multiple sheets and custom delimiters.",
          badge: "🆕 New"
        },
        {
          href: "/data-cleaner",
          icon: "cleaning_services",
          iconColor: "text-blue-600",
          title: "Smart Data Cleaner",
          description: "Clean messy Excel data: remove currency symbols, convert text to numbers, handle percentages.",
          badge: "🆕 New"
        },
        {
          href: "/csv-merger",
          icon: "merge",
          iconColor: "text-purple-600",
          title: "CSV Merger & Splitter",
          description: "Combine multiple CSV files or split large CSVs by rows or file size.",
          badge: "🆕 New"
        },
        {
          href: "/csv-viewer",
          icon: "table_view",
          iconColor: "text-indigo-600",
          title: "CSV/TSV Viewer",
          description: "View and sort CSV/TSV files in a tabular grid with filtering and column hiding features.",
          badge: "🆕 New"
        }
      ]
    },
    {
      title: "Advanced Tools",
      subtitle: "Power User Utilities",
      tools: [
        {
          href: "/text-analyzer",
          icon: "analytics",
          iconColor: "text-purple-600",
          title: "Text Analyzer",
          description: "Analyze text for readability, word count, sentence structure, and writing quality.",
          badge: "🆕 New"
        },
        {
          href: "/text-encryptor",
          icon: "lock",
          iconColor: "text-red-600",
          title: "Text Encryptor/Decryptor",
          description: "Securely encrypt and decrypt text using AES-256 encryption. All processing happens in your browser.",
          badge: "🆕 New"
        }
      ]
    },
    {
      title: "Content Generation",
      subtitle: "Text & Content Tools",
      tools: [
        {
          href: "/lorem-generator",
          icon: "text_snippet",
          iconColor: "text-gray-600",
          title: "Lorem Ipsum Generator",
          description: "Generate placeholder text with customizable length, paragraphs, and HTML formatting."
        }
      ]
    }
  ];

  // Filter tools based on search query
  const filteredGroups = toolGroups.map(group => ({
    ...group,
    tools: group.tools.filter(tool => 
      searchQuery === "" || 
      tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(group => group.tools.length > 0);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-10">
      <div className="text-center mb-8 sm:mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">Free In-Browser Tools</h2>
        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
          Professional utilities that work entirely in your browser. No data leaves your device - 100% private and secure.
        </p>
      </div>

      {/* Search Bar */}
      <section className="max-w-md mx-auto mb-8 sm:mb-12" role="search" aria-label="Tool search">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            type="text"
            placeholder="Search tools... (e.g., json, pdf, image)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 text-center bg-background border-border focus:ring-2 focus:ring-blue-500"
            aria-label="Search for tools by name or description"
          />
        </div>
        {searchQuery && (
          <p className="text-sm text-muted-foreground mt-2 text-center" role="status" aria-live="polite">
            Showing {filteredGroups.reduce((acc, group) => acc + group.tools.length, 0)} tools
          </p>
        )}
      </section>
      
      {filteredGroups.map((group, groupIndex) => (
        <div key={groupIndex} className="mb-8 sm:mb-12">
          <div className="text-center mb-6 sm:mb-8">
            <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2">{group.title}</h3>
            <p className="text-xs sm:text-sm text-muted-foreground uppercase tracking-wide">{group.subtitle}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {group.tools.map((tool, toolIndex) => (
              <ToolCard key={toolIndex} {...tool} />
            ))}
          </div>
        </div>
      ))}
      
      {/* Buy Me a Coffee Button */}
      <div className="text-center mt-12 pt-8 border-t border-border">
        <div 
          dangerouslySetInnerHTML={{
            __html: `<script type="text/javascript" src="https://cdnjs.buymeacoffee.com/1.0.0/button.prod.min.js" data-name="bmc-button" data-slug="freedownloads" data-color="#FFDD00" data-emoji=""  data-font="Cookie" data-text="Buy me a coffee" data-outline-color="#000000" data-font-color="#000000" data-coffee-color="#ffffff" ></script>`
          }}
        />
      </div>
    </div>
  );
}
