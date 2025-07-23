import ToolCard from "@/components/tool-card";

export default function Home() {
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
          description: "Convert between CSV, JSON, YAML, and TSV formats with drag-and-drop support."
        },
        {
          href: "/json-formatter",
          icon: "data_object",
          iconColor: "text-indigo-600",
          title: "JSON Formatter",
          description: "Format, validate, and minify JSON data with syntax highlighting and error detection."
        },
        {
          href: "/json-xml-converter",
          icon: "swap_horiz",
          iconColor: "text-green-600",
          title: "JSON ↔ XML Converter",
          description: "Convert between JSON and XML formats bidirectionally with file upload support."
        },
        {
          href: "/base64-converter",
          icon: "code",
          iconColor: "text-blue-600",
          title: "Base64 Encoder/Decoder",
          description: "Encode text or files to Base64 format or decode Base64 strings back to readable text."
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
          description: "Convert text between different case formats like camelCase, snake_case, kebab-case, and more."
        },
        {
          href: "/text-diff-checker",
          icon: "compare_arrows",
          iconColor: "text-purple-600",
          title: "Text Diff Checker",
          description: "Compare two blocks of text to find differences, additions, and deletions with detailed analysis."
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

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">Free In-Browser Tools</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Professional utilities that work entirely in your browser. No data leaves your device - 100% private and secure.
        </p>
      </div>
      
      {toolGroups.map((group, groupIndex) => (
        <div key={groupIndex} className="mb-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">{group.title}</h3>
            <p className="text-sm text-gray-500 uppercase tracking-wide">{group.subtitle}</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {group.tools.map((tool, toolIndex) => (
              <ToolCard key={toolIndex} {...tool} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
