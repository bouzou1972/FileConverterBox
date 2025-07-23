import ToolCard from "@/components/tool-card";

export default function Home() {
  const tools = [
    {
      href: "/csv-converter",
      icon: "code",
      iconColor: "text-blue-500",
      title: "CSV ↔ JSON/YAML/TSV",
      description: "Convert structured data between formats in seconds. Upload files or paste content directly."
    },
    {
      href: "/regex-tester",
      icon: "filter_alt",
      iconColor: "tool-green",
      title: "Regex Tester",
      description: "Test and debug regular expressions with live feedback and match highlighting."
    },
    {
      href: "/timestamp-converter",
      icon: "schedule",
      iconColor: "tool-purple",
      title: "Timestamp Converter",
      description: "Convert UNIX timestamps to human-readable time and vice versa with timezone support."
    },
    {
      href: "/uuid-generator",
      icon: "vpn_key",
      iconColor: "tool-yellow",
      title: "UUID Generator",
      description: "Generate unique UUID v4 identifiers instantly with copy-to-clipboard functionality."
    },
    {
      href: "/json-formatter",
      icon: "data_object",
      iconColor: "tool-pink",
      title: "JSON Formatter",
      description: "Beautify and validate JSON data with syntax highlighting and error detection."
    },
    {
      href: "/lorem-generator",
      icon: "text_snippet",
      iconColor: "tool-indigo",
      title: "Lorem Ipsum Generator",
      description: "Generate placeholder text for mockups and layouts with customizable options."
    },
    {
      href: "/markdown-converter",
      icon: "html",
      iconColor: "tool-red",
      title: "Markdown to HTML",
      description: "Convert Markdown content into clean HTML with live preview and export options."
    },
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
    },
    {
      href: "/base64-converter",
      icon: "code",
      iconColor: "text-blue-600",
      title: "Base64 Encoder/Decoder",
      description: "Encode text or files to Base64 format or decode Base64 strings back to readable text."
    },
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
      href: "/html-to-markdown",
      icon: "code",
      iconColor: "text-indigo-600",
      title: "HTML to Markdown",
      description: "Convert HTML content to clean Markdown format with support for headers, links, images, and more."
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
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {tools.map((tool, index) => (
          <ToolCard key={index} {...tool} />
        ))}
      </div>
    </div>
  );
}
