import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Link } from "wouter";
import { Search, ChevronDown, ChevronRight, TrendingUp, Sparkles, ArrowRight, Star, Clock, Heart } from "lucide-react";
import { useRecentTools } from "@/hooks/use-recent-tools";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { FavoritesModal } from "@/components/favorites-modal";

interface Tool {
  href: string;
  icon: string;
  iconColor: string;
  title: string;
  description: string;
  badge?: string;
}

interface ToolCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  iconColor: string;
  featured: Tool[];
  allTools: Tool[];
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openCategories, setOpenCategories] = useState<string[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  const { recentTools, addRecentTool } = useRecentTools();
  const { bookmarksSortedByUsage, isBookmarked, toggleBookmark, incrementUsage } = useBookmarks();

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onSearchToggle: () => {
      searchInputRef.current?.focus();
      setIsSearchFocused(true);
    },
    onEscape: () => {
      if (searchQuery) {
        setSearchQuery("");
      }
      searchInputRef.current?.blur();
      setIsSearchFocused(false);
    }
  });

  // Top 6 most popular tools (manually curated)
  const popularTools: Tool[] = [
    {
      href: "/csv-converter",
      icon: "table_chart",
      iconColor: "text-blue-600",
      title: "CSV Converter",
      description: "Convert between CSV, JSON, YAML, and TSV formats with drag-and-drop support.",
      badge: "🔥 #1 Popular"
    },
    {
      href: "/json-formatter",
      icon: "data_object",
      iconColor: "text-indigo-600",
      title: "JSON Formatter",
      description: "Format, validate, and minify JSON data with syntax highlighting and error detection.",
      badge: "🔥 #2 Popular"
    },
    {
      href: "/pdf-converter",
      icon: "picture_as_pdf",
      iconColor: "text-red-600",
      title: "PDF Converter",
      description: "Convert text, HTML, or images to PDF with customizable formatting and page settings.",
      badge: "🔥 #3 Popular"
    },
    {
      href: "/excel-converter",
      icon: "swap_horiz",
      iconColor: "text-green-600",
      title: "Excel ↔ CSV Converter",
      description: "Convert between Excel (.xlsx) and CSV formats with support for multiple sheets.",
      badge: "🔥 #4 Popular"
    },
    {
      href: "/image-converter",
      icon: "image",
      iconColor: "text-purple-600",
      title: "Image Format Converter",
      description: "Convert images between PNG, JPEG, and WebP formats with quality control.",
      badge: "🔥 #5 Popular"
    },
    {
      href: "/string-to-json",
      icon: "data_object",
      iconColor: "text-orange-600",
      title: "String to JSON Converter",
      description: "Convert malformed strings to valid JSON. Fixes single quotes, unquoted keys, and trailing commas.",
      badge: "🔥 #6 Popular"
    }
  ];

  // UX-driven categories organized by user intent
  const categories: ToolCategory[] = [
    {
      id: "convert-files",
      title: "📂 Convert Files",
      description: "Convert files between CSV, JSON, PDF, Image & more — in your browser",
      icon: "swap_horiz",
      iconColor: "text-blue-600",
      featured: [
        {
          href: "/csv-converter",
          icon: "table_chart",
          iconColor: "text-blue-600",
          title: "CSV Converter",
          description: "Most popular: Convert between CSV, JSON, YAML, and TSV formats with drag-and-drop support."
        }
      ],
      allTools: [
        {
          href: "/csv-converter",
          icon: "table_chart",
          iconColor: "text-blue-600",
          title: "CSV Converter",
          description: "Convert between CSV, JSON, YAML, and TSV formats with drag-and-drop support."
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
        },
        {
          href: "/zip-viewer",
          icon: "folder_zip",
          iconColor: "text-orange-600",
          title: "ZIP File Viewer & Extractor",
          description: "View ZIP archive contents, preview text files, and extract individual files or entire archives.",
          badge: "🆕 New"
        },
        {
          href: "/file-organizer",
          icon: "folder_open",
          iconColor: "text-purple-600",
          title: "Offline File Organizer",
          description: "Organize multiple files by type, name, date, or size with detailed analysis and export reports.",
          badge: "🆕 New"
        },
        {
          href: "/file-splitter",
          icon: "content_cut",
          iconColor: "text-red-600",
          title: "Large File Splitter & Joiner",
          description: "Split large files into smaller chunks for easier sharing, then rejoin them back to the original file.",
          badge: "🆕 New"
        }
      ]
    },
    {
      id: "create-edit-pdfs",
      title: "📝 Create or Edit PDFs",
      description: "Create, convert and modify PDF documents with professional formatting",
      icon: "picture_as_pdf",
      iconColor: "text-red-600",
      featured: [
        {
          href: "/pdf-converter",
          icon: "picture_as_pdf",
          iconColor: "text-red-600",
          title: "PDF Converter",
          description: "Convert text, HTML, or images to PDF with customizable formatting and page settings."
        }
      ],
      allTools: [
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
      id: "edit-analyze-text",
      title: "🔤 Edit or Analyze Text",
      description: "Transform, format and analyze text content for better readability",
      icon: "text_fields",
      iconColor: "text-green-600",
      featured: [
        {
          href: "/text-case-converter",
          icon: "format_clear",
          iconColor: "text-indigo-600",
          title: "Text Case Converter",
          description: "Convert text between 10 different formats: camelCase, snake_case, PascalCase, kebab-case, and more."
        }
      ],
      allTools: [
        {
          href: "/text-case-converter",
          icon: "format_clear",
          iconColor: "text-indigo-600",
          title: "Text Case Converter",
          description: "Convert text between 10 different formats: camelCase, snake_case, PascalCase, kebab-case, and more."
        },
        {
          href: "/text-diff-checker",
          icon: "difference",
          iconColor: "text-orange-600",
          title: "Text Diff Checker",
          description: "Compare two text blocks and highlight differences with detailed analysis and statistics."
        },
        {
          href: "/text-line-tools",
          icon: "format_line_spacing",
          iconColor: "text-purple-600",
          title: "Text Line Tools",
          description: "Sort, deduplicate, merge, and manipulate text lines with powerful processing options."
        },
        {
          href: "/readability-grader",
          icon: "analytics",
          iconColor: "text-blue-600",
          title: "Readability Grader",
          description: "Analyze text with 6 readability formulas including Flesch-Kincaid, Gunning Fog, and SMOG indices.",
          badge: "🆕 New"
        },
        {
          href: "/passive-voice-detector",
          icon: "visibility",
          iconColor: "text-purple-600",
          title: "Passive Voice Detector",
          description: "Identify passive voice constructions and get suggestions for converting to active voice.",
          badge: "🆕 New"
        },
        {
          href: "/academic-writing-formatter",
          icon: "school",
          iconColor: "text-indigo-600",
          title: "Academic Writing Formatter",
          description: "Generate properly formatted citations and bibliographies in APA, MLA, and Chicago styles.",
          badge: "🆕 New"
        },
        {
          href: "/whitespace-tool",
          icon: "format_indent_increase",
          iconColor: "text-gray-600",
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
        },
        {
          href: "/grammar-checker",
          icon: "spellcheck",
          iconColor: "text-indigo-600",
          title: "Grammar Checker",
          description: "Check text for grammar, spelling, punctuation, and style issues with suggestions for improvement.",
          badge: "🆕 New"
        },
        {
          href: "/dns-checker",
          icon: "dns",
          iconColor: "text-blue-600",
          title: "DNS Checker",
          description: "Check DNS records for any domain instantly. Look up A, AAAA, CNAME, MX, TXT, NS records for troubleshooting.",
          badge: "🆕 New"
        },
        {
          href: "/seo-optimizer",
          icon: "search",
          iconColor: "text-blue-600",
          title: "SEO Content Optimizer",
          description: "Analyze and optimize your content for search engines with keyword density analysis, readability scoring, and SEO element validation.",
          badge: "🆕 New"
        },
        {
          href: "/seo-tools-suite",
          icon: "trending_up",
          iconColor: "text-purple-600",
          title: "SEO Tools Suite",
          description: "Complete collection of 9 professional SEO tools including meta tag generator, robots.txt creator, XML sitemap builder, and more.",
          badge: "🆕 New"
        }
      ]
    },
    {
      id: "code-utilities",
      title: "👨‍💻 Code Utilities", 
      description: "Essential tools for developers and programmers to debug and optimize code",
      icon: "code",
      iconColor: "text-orange-600",
      featured: [
        {
          href: "/json-formatter",
          icon: "data_object",
          iconColor: "text-indigo-600",
          title: "JSON Formatter",
          description: "Format, validate, and minify JSON data with syntax highlighting and error detection."
        },
        {
          href: "/hash-generator",
          icon: "tag",
          iconColor: "text-red-600",
          title: "Hash Generator",
          description: "Generate MD5, SHA-1, SHA-256, and SHA-512 hashes from text or files for security verification."
        }
      ],
      allTools: [
        {
          href: "/json-formatter",
          icon: "data_object",
          iconColor: "text-indigo-600",
          title: "JSON Formatter",
          description: "Format, validate, and minify JSON data with syntax highlighting and error detection."
        },
        {
          href: "/hash-generator",
          icon: "tag",
          iconColor: "text-red-600",
          title: "Hash Generator",
          description: "Generate MD5, SHA-1, SHA-256, and SHA-512 hashes from text or files for security verification."
        },
        {
          href: "/uuid-generator",
          icon: "fingerprint",
          iconColor: "text-purple-600",
          title: "UUID Generator",
          description: "Generate v4 UUIDs with bulk generation options and format validation."
        },
        {
          href: "/number-base-converter",
          icon: "functions",
          iconColor: "text-blue-600",
          title: "Number Base Converter",
          description: "Convert numbers between binary, octal, decimal, and hexadecimal formats with live conversion."
        },
        {
          href: "/timestamp-converter",
          icon: "schedule",
          iconColor: "text-green-600",
          title: "Timestamp Converter",
          description: "Convert Unix timestamps to readable dates and vice versa with timezone support."
        },
        {
          href: "/lorem-ipsum",
          icon: "article",
          iconColor: "text-gray-600",
          title: "Lorem Ipsum Generator",
          description: "Generate placeholder text with options for paragraphs, words, and HTML formatting."
        },
        {
          href: "/qr-generator",
          icon: "qr_code",
          iconColor: "text-blue-600",
          title: "QR Code Generator",
          description: "Generate QR codes locally for URLs, text, WiFi credentials with customizable options.",
          badge: "🆕 New"
        },
        {
          href: "/barcode-generator",
          icon: "barcode",
          iconColor: "text-gray-600",
          title: "Barcode Generator",
          description: "Create various barcode formats (Code128, EAN, UPC) with industry-standard compliance.",
          badge: "🆕 New"
        },
        {
          href: "/password-generator",
          icon: "security",
          iconColor: "text-red-600",
          title: "Password Generator",
          description: "Secure password creation with customizable rules and strength analysis.",
          badge: "🆕 New"
        },
        {
          href: "/seo-optimizer",
          icon: "search",
          iconColor: "text-blue-600",
          title: "SEO Content Optimizer",
          description: "Analyze and optimize your content for search engines with keyword density analysis and readability scoring.",
          badge: "🆕 New"
        }
      ]
    },
    {
      id: "image-color-tools",
      title: "🎨 Image + Color Tools",
      description: "Compress, convert, and extract colors from images locally",
      icon: "palette",
      iconColor: "text-pink-600",
      featured: [
        {
          href: "/image-optimizer",
          icon: "speed",
          iconColor: "text-green-600",
          title: "Image Optimizer",
          description: "Compress images while preserving quality with customizable size and quality settings."
        }
      ],
      allTools: [
        {
          href: "/image-converter",
          icon: "image",
          iconColor: "text-purple-600",
          title: "Image Format Converter",
          description: "Convert images between PNG, JPEG, and WebP formats with quality control."
        },
        {
          href: "/color-converter",
          icon: "palette",
          iconColor: "text-pink-600",
          title: "Color Converter",
          description: "Convert colors between HEX, RGB, and HSL formats with visual color picker and sliders."
        },
        {
          href: "/image-to-base64",
          icon: "photo",
          iconColor: "text-blue-600",
          title: "Image to Base64 Converter",
          description: "Convert images to Base64 encoded strings for embedding in HTML, CSS, or applications."
        },
        {
          href: "/favicon-generator",
          icon: "web",
          iconColor: "text-orange-600",
          title: "Favicon Generator",
          description: "Upload any image and generate favicons in all standard sizes for websites (ICO & PNG formats).",
          badge: "🆕 New"
        },
        {
          href: "/social-media-cropper",
          icon: "crop",
          iconColor: "text-green-600",
          title: "Social Media Image Cropper",
          description: "Auto-crop images to perfect sizes for Instagram, Facebook, Twitter, LinkedIn, YouTube, and more platforms.",
          badge: "🆕 New"
        },
        {
          href: "/logo-cleaner",
          icon: "auto_fix_high",
          iconColor: "text-purple-600",
          title: "Logo Background Remover",
          description: "Remove backgrounds from logos and images with manual brush and magic wand tools.",
          badge: "🆕 New"
        },
        {
          href: "/image-optimizer",
          icon: "speed",
          iconColor: "text-orange-600",
          title: "Image Optimizer",
          description: "Compress images while preserving quality with customizable size and quality settings.",
          badge: "🆕 New"
        },
        {
          href: "/color-palette-extractor",
          icon: "palette",
          iconColor: "text-pink-600",
          title: "Color Palette Extractor",
          description: "Extract dominant colors from any image with frequency analysis and multiple format support.",
          badge: "🆕 New"
        }
      ]
    },
    {
      id: "data-spreadsheets",
      title: "📈 Data + Spreadsheets",
      description: "Transform, clean and merge data from Excel, CSV and other formats",
      icon: "table_view",
      iconColor: "text-green-600",
      featured: [
        {
          href: "/excel-converter",
          icon: "swap_horiz",
          iconColor: "text-green-600",
          title: "Excel ↔ CSV Converter",
          description: "Most popular: Convert between Excel (.xlsx) and CSV formats with support for multiple sheets and custom delimiters."
        }
      ],
      allTools: [
        {
          href: "/excel-converter",
          icon: "swap_horiz",
          iconColor: "text-green-600",
          title: "Excel ↔ CSV Converter",
          description: "Convert between Excel (.xlsx) and CSV formats with support for multiple sheets and custom delimiters."
        },
        {
          href: "/csv-merger",
          icon: "merge_type",
          iconColor: "text-blue-600",
          title: "CSV Merger & Splitter",
          description: "Combine multiple CSV files or split large CSVs by rows or file size with advanced processing options."
        },
        {
          href: "/csv-viewer",
          icon: "table_chart",
          iconColor: "text-purple-600",
          title: "CSV/TSV Viewer",
          description: "View and sort CSV/TSV files in a tabular grid with filtering and column hiding features."
        },
        {
          href: "/data-cleaner",
          icon: "cleaning_services",
          iconColor: "text-orange-600",
          title: "Smart Data Cleaner",
          description: "Clean messy Excel data by removing currency symbols, converting text to numbers, handling percentages, and fixing formatting issues."
        }
      ]
    },
    {
      id: "field-technician-tools",
      title: "🔧 Field Technician Tools",
      description: "Professional calculators for HVAC, electrical, and refrigeration technicians",
      icon: "build",
      iconColor: "text-amber-600",
      featured: [
        {
          href: "/hvac-btu-calculator",
          icon: "thermostat",
          iconColor: "text-blue-600",
          title: "HVAC BTU Calculator",
          description: "Calculate required BTU capacity for heating and cooling systems based on room size and environmental factors."
        },
        {
          href: "/voltage-drop-calculator",
          icon: "electrical_services",
          iconColor: "text-yellow-600",
          title: "Voltage Drop Calculator",
          description: "Calculate voltage loss in electrical circuits to ensure proper wire sizing and code compliance."
        }
      ],
      allTools: [
        // HVAC Tools
        {
          href: "/hvac-btu-calculator",
          icon: "thermostat",
          iconColor: "text-blue-600",
          title: "HVAC BTU Calculator",
          description: "Calculate how much heating or cooling power you need for any room based on size, insulation, and usage.",
          badge: "🆕 New"
        },
        {
          href: "/duct-size-calculator",
          icon: "tune",
          iconColor: "text-indigo-600",
          title: "Duct Size Calculator",
          description: "Find the right duct size for your airflow needs - works for both round and rectangular ducts.",
          badge: "🆕 New"
        },
        {
          href: "/static-pressure-calculator",
          icon: "speed",
          iconColor: "text-purple-600",
          title: "Static Pressure Calculator",
          description: "Calculate airflow resistance in HVAC systems - measures how hard the fan works to push air through ducts and components.",
          badge: "🆕 New"
        },
        {
          href: "/superheat-calculator",
          icon: "ac_unit",
          iconColor: "text-cyan-600",
          title: "Superheat Calculator",
          description: "Check if AC system has correct refrigerant amount - compares actual temperature to expected temperature at suction line.",
          badge: "🆕 New"
        },
        {
          href: "/hvac-tonnage-calculator",
          icon: "ac_unit",
          iconColor: "text-sky-600",
          title: "HVAC Tonnage Calculator",
          description: "Figure out what size AC unit you need for a building based on square footage and heat sources.",
          badge: "🆕 New"
        },
        {
          href: "/pt-chart-tool",
          icon: "thermostat",
          iconColor: "text-purple-600",
          title: "PT Chart Tool",
          description: "Look up pressure-temperature relationships for R-410A, R-22, R-134a, and R-404A refrigerants for system diagnostics.",
          badge: "🆕 New"
        },
        // Electrical Tools
        {
          href: "/voltage-drop-calculator",
          icon: "electrical_services",
          iconColor: "text-yellow-600",
          title: "Voltage Drop Calculator",
          description: "Check how much electrical power is lost over wire distance to make sure your circuits work properly.",
          badge: "🆕 New"
        },
        {
          href: "/ohms-law-calculator",
          icon: "calculate",
          iconColor: "text-orange-600",
          title: "Ohm's Law Calculator",
          description: "Calculate electrical values when you know any two - voltage, current, resistance, or power using V=IR formulas.",
          badge: "🆕 New"
        },
        {
          href: "/wire-size-calculator",
          icon: "cable",
          iconColor: "text-red-600",
          title: "Wire Size Calculator",
          description: "Find the right wire thickness for electrical circuits based on how much power you're running and distance.",
          badge: "🆕 New"
        },
        // Utility Tools
        {
          href: "/wattage-calculator",
          icon: "bolt",
          iconColor: "text-yellow-500",
          title: "Wattage Calculator",
          description: "Find out how much electrical power something uses by entering voltage and current readings.",
          badge: "🆕 New"
        },
        {
          href: "/pipe-volume-calculator",
          icon: "circle",
          iconColor: "text-blue-500",
          title: "Pipe Volume Calculator",
          description: "Calculate how much water fits inside pipes - useful for system capacity planning and chemical treatment dosing.",
          badge: "🆕 New"
        },
        {
          href: "/job-timer",
          icon: "timer",
          iconColor: "text-green-500",
          title: "Job Timer",
          description: "Time how long you spend on different jobs and projects with start/stop tracking and work history.",
          badge: "🆕 New"
        },
        {
          href: "/area-volume-calculator",
          icon: "square",
          iconColor: "text-purple-500",
          title: "Area & Volume Calculator",
          description: "Calculate square footage, cubic space, and perimeter measurements for construction projects and material estimates.",
          badge: "🆕 New"
        },
        // Refrigeration Tools
        {
          href: "/refrigerant-charge-calculator",
          icon: "ac_unit",
          iconColor: "text-cyan-500",
          title: "Refrigerant Charge Calculator",
          description: "Calculate how much extra refrigerant to add when copper lines are longer than standard 25 feet in AC installations.",
          badge: "🆕 New"
        },
        // General Tools
        {
          href: "/unit-converter",
          icon: "repeat",
          iconColor: "text-emerald-500",
          title: "Unit Converter",
          description: "Convert measurements between different units - feet to meters, Fahrenheit to Celsius, PSI to kPa, and more.",
          badge: "🆕 New"
        },
        {
          href: "/scientific-calculator",
          icon: "calculate",
          iconColor: "text-indigo-500",
          title: "Scientific Calculator",
          description: "Professional calculator with advanced math functions - sine, cosine, logarithms, square roots, and more for technical calculations.",
          badge: "🆕 New"
        }
      ]
    }
  ];

  const toggleCategory = (categoryId: string) => {
    setOpenCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // Filter logic for search
  const allTools = [
    ...popularTools,
    ...categories.flatMap(cat => cat.allTools)
  ];

  const filteredTools = searchQuery 
    ? allTools.filter(tool => 
        tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const ToolCard = ({ href, icon, iconColor, title, description, badge }: Tool) => {
    const tool = { href, icon, iconColor, title, description, badge };
    
    const handleClick = () => {
      addRecentTool(tool);
      incrementUsage(href);
    };

    const handleBookmarkClick = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      toggleBookmark(tool);
    };

    return (
      <Link href={href}>
        <Card className="hover:shadow-md transition-all duration-200 cursor-pointer group bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-600" onClick={handleClick} style={{ boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              {icon && (
                <div className={`p-2 rounded-lg bg-gray-50 dark:bg-gray-700 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors flex-shrink-0`}>
                  <span className={`material-icons text-base ${iconColor}`}>{icon}</span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold text-base text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {title}
                  </h3>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-1 h-auto opacity-100 transition-all duration-200 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      onClick={handleBookmarkClick}
                    >
                      <Heart 
                        className={`w-4 h-4 transition-all duration-200 ${
                          isBookmarked(href) 
                            ? 'fill-red-500 text-red-500' 
                            : 'text-gray-400 hover:text-red-500'
                        }`} 
                      />
                    </Button>
                    {badge && (
                      <Badge 
                        variant="secondary" 
                        className="text-xs whitespace-nowrap bg-orange-50 text-orange-700 border-orange-200 font-medium"
                      >
                        {badge}
                      </Badge>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                  {description}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  };

  const CategoryCard = ({ category }: { category: ToolCategory }) => (
    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 cursor-pointer group" style={{ boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl bg-gray-50 dark:bg-gray-700 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors flex-shrink-0`}>
              <span className={`material-icons text-xl ${category.iconColor}`}>{category.icon}</span>
            </div>
            <div className="flex-1">
              <CardTitle className="text-sm font-bold mb-1 uppercase tracking-wider text-gray-900 dark:text-white">{category.title}</CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{category.description}</p>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-xl">
                  {category.allTools.length} tools available
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {/* Top Featured Tool */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">Featured Tool:</h4>
          <div className="bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <Link href={category.featured[0].href} className="block">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg bg-white dark:bg-gray-600 flex-shrink-0`}>
                  <span className={`material-icons text-base ${category.featured[0].iconColor}`}>
                    {category.featured[0].icon}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h5 className="font-semibold text-base text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      {category.featured[0].title}
                    </h5>
                    {category.featured[0].badge && (
                      <Badge 
                        variant="secondary" 
                        className="text-xs whitespace-nowrap bg-orange-50 text-orange-700 border-orange-200 font-medium"
                      >
                        {category.featured[0].badge}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {category.featured[0].description}
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
        
        {/* View All Button */}
        <Collapsible
          open={openCategories.includes(category.id)}
          onOpenChange={() => toggleCategory(category.id)}
        >
          <CollapsibleTrigger asChild>
            <Button 
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white transition-colors rounded-xl"
            >
              {openCategories.includes(category.id) ? (
                <>
                  <ChevronDown className="w-4 h-4" />
                  Hide all tools
                </>
              ) : (
                <>
                  <ChevronRight className="w-4 h-4" />
                  View all {category.allTools.length} tools
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {category.allTools.map((tool, index) => (
                <ToolCard key={index} {...tool} />
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: '#9664C7' }}>
          🧰 File Converter Box
        </h1>
        <p className="text-lg sm:text-xl font-medium text-foreground max-w-2xl mx-auto mb-3">
          Your All-in-One Private Toolset — Convert, Edit & Format Files Securely in Your Browser.
        </p>
        <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
          No data leaves your device — 100% local & secure.
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-md mx-auto mb-8 sm:mb-12">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            ref={searchInputRef}
            type="text"
            placeholder="Search tools... (Ctrl+K to focus)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            className={`pl-10 text-center bg-background border-border focus:ring-2 focus:ring-purple-500 transition-all rounded-xl shadow-md ${
              isSearchFocused ? 'ring-2 ring-purple-500 border-purple-500' : ''
            }`}
          />
          {!searchQuery && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-muted-foreground hidden sm:block">
              Ctrl+K
            </div>
          )}
        </div>
        {searchQuery && (
          <p className="text-sm text-muted-foreground mt-2 text-center">
            Found {filteredTools.length} tools
          </p>
        )}
      </div>

      {/* Search Results */}
      {searchQuery && (
        <div className="mb-12">
          <h2 className="text-sm font-bold mb-6 flex items-center gap-2 uppercase tracking-wider">
            <Search className="w-6 h-6" />
            SEARCH RESULTS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredTools.map((tool, index) => (
              <ToolCard key={index} {...tool} />
            ))}
          </div>
          {filteredTools.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No tools found matching "{searchQuery}"</p>
            </div>
          )}
        </div>
      )}

      {/* Show main content only when not searching */}
      {!searchQuery && (
        <>
          {/* Tool Spotlight Section */}
          <div className="mb-12">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-100 dark:border-blue-800">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-800 rounded-lg">
                  <span className="material-icons text-2xl text-blue-600 dark:text-blue-400">table_chart</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">🔍 Tool Spotlight</h2>
                    <Badge className="bg-orange-100 text-orange-800 border-orange-200">Featured</Badge>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">CSV Converter</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Convert between CSV, JSON, YAML, and TSV formats with drag-and-drop support. Most popular tool with powerful data transformation features.
                  </p>
                  <Link href="/csv-converter">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                      Try Tool <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Favorites Section - Single Tool Display */}
          {bookmarksSortedByUsage.length > 0 && (
            <div className="mb-12">
              <div className="text-center mb-6">
                <h2 className="text-sm font-bold mb-2 flex items-center justify-center gap-2 uppercase tracking-wider">
                  <Heart className="w-6 h-6 text-red-500" />
                  FAVORITE TOOL
                </h2>
                <p className="text-sm text-muted-foreground">
                  Your most used tool • Used {bookmarksSortedByUsage[0].usageCount || 0} times
                </p>
              </div>
              
              <div className="max-w-md mx-auto mb-6">
                <ToolCard 
                  key={bookmarksSortedByUsage[0].href} 
                  {...bookmarksSortedByUsage[0]} 
                />
              </div>

              {bookmarksSortedByUsage.length > 1 && (
                <div className="text-center">
                  <FavoritesModal 
                    favorites={bookmarksSortedByUsage}
                    trigger={
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        See All {bookmarksSortedByUsage.length} Favorites
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    }
                  />
                </div>
              )}
            </div>
          )}
          {/* Most Popular Tools */}
          <div className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-sm font-bold mb-2 flex items-center justify-center gap-2 uppercase tracking-wider text-gray-700 dark:text-gray-300">
                <TrendingUp className="w-6 h-6 text-teal-500" />
                MOST POPULAR TOOLS
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Top 6 most-used converters and utilities</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {popularTools.map((tool, index) => (
                <ToolCard key={index} {...tool} />
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-sm font-bold mb-2 flex items-center justify-center gap-2 uppercase tracking-wider text-gray-700 dark:text-gray-300">
                <Sparkles className="w-6 h-6 text-indigo-500" />
                TOOL CATEGORIES
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Explore our complete collection organized by what you want to do</p>
            </div>
            <div className="space-y-8">
              {categories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          </div>
        </>
      )}


    </div>
  );
}