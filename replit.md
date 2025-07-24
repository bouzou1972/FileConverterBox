# replit.md

## Overview

File Converter Box is a web application that provides free, in-browser developer utilities. The application is built as a full-stack TypeScript project using React for the frontend and Express.js for the backend, with a focus on client-side processing to ensure user privacy and security.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state
- **Build Tool**: Vite with custom configuration for development and production

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Module System**: ESM (ES Modules)
- **Development**: tsx for TypeScript execution
- **Production**: esbuild for bundling
- **Storage**: In-memory storage with interface for potential database integration

### Database Layer
- **ORM**: Drizzle ORM configured for PostgreSQL
- **Schema**: User management with username/password authentication
- **Migrations**: Drizzle Kit for schema migrations
- **Current State**: Uses in-memory storage, with PostgreSQL configuration ready for production

## Recent Changes

### SEO Content Optimizer Tool Addition (✅ COMPLETE - January 24, 2025)
- Added comprehensive SEO Content Optimizer tool with advanced analysis features:
  - Keyword density analysis with optimal range recommendations (1-3%)
  - Flesch Reading Ease score calculation for readability assessment
  - SEO element validation (title tags, H1 tags, meta descriptions)
  - Real-time content statistics (word count, sentence count, keyword matches)
  - Visual indicators for SEO compliance with checkmarks and color coding
  - Intelligent keyword suggestions with 50+ categories and 300+ related terms
  - Client-side keyword association engine with partial matching capabilities
  - Interactive suggestion buttons for quick keyword selection
  - Comprehensive usage guide with blog post and landing page optimization examples
- Integrated tool into "👨‍💻 Code Utilities" category on homepage
- Full SEO optimization with ToolSEO, ShareButtons, and UsageGuide components

### UX-Driven Homepage Redesign (✅ COMPLETE - January 24, 2025)
- Reorganized tool categories from format-based to user intent-based:
  - "🧩 File Converters" → "📂 Convert Files" 
  - "📄 PDF Tools" → "📝 Create or Edit PDFs"
  - "✍️ Text Tools" → "🔤 Edit or Analyze Text"
  - "</> Developer Tools" → "👨‍💻 Code Utilities"
  - "🎨 Images & Colors" → "🎨 Image + Color Tools"
  - "📊 Spreadsheet Tools" → "📈 Data + Spreadsheets"
- Added "Tool Spotlight" section featuring one lesser-known tool with contextual description
- Implemented cleaner, warm-neutral color palette with better contrast
- Enhanced card design with subtle shadows and improved hover states
- Reduced visual fatigue by showing only 1 featured tool per category instead of multiple
- Updated category descriptions to be more user-goal oriented
- Improved responsive layout for Recently Used and Favorites sections (50/50 split)

## Key Components

### Content & SEO Enhancement System (✅ COMPLETE)

#### ToolSEO Component
- **Dynamic Meta Tags**: Automatically generates title, description, keywords, and canonical URLs
- **Open Graph Integration**: Social media sharing optimization with custom titles and descriptions
- **Twitter Card Support**: Proper Twitter sharing metadata
- **JSON-LD Structured Data**: Schema.org markup for search engines
- **Automatic Updates**: Meta tags update dynamically as users navigate between tools
- **100% Coverage**: Successfully implemented across ALL 43+ tool pages including Image Format Converter, Image Resizer, and all remaining tools for maximum search visibility

#### ShareButtons Component
- **Native Share API**: Uses browser's native share functionality when available
- **Platform-Specific Sharing**: Direct integration with Twitter, Facebook, LinkedIn
- **Fallback Copy Function**: Clipboard copy when native sharing isn't supported
- **Customizable Content**: Tool-specific titles and descriptions for each share
- **Universal Implementation**: Deployed on every tool page for viral growth potential

#### UsageGuide Component
- **Step-by-Step Examples**: Real-world usage scenarios with detailed instructions
- **Pro Tips Section**: Expert advice and optimization suggestions
- **Best Practices**: Industry-standard recommendations for each tool
- **Common Use Cases**: Tagged examples of typical applications
- **Visual Hierarchy**: Clear organization with icons and structured layouts
- **Comprehensive Content**: Rich examples and tutorials for each tool's specific use cases

## Key Components

### Tool Collection
The application provides various developer utilities grouped by category, now including 43+ tools with comprehensive SEO optimization and usage guides:

#### Data Format Converters (Most Popular)
- **CSV/JSON/YAML/TSV Converter**: Data format conversion with file upload support
- **JSON Formatter**: JSON validation, formatting, and minification
- **JSON ↔ XML Converter**: Bidirectional conversion between JSON and XML formats with file support
- **Base64 Encoder/Decoder**: Encode text/files to Base64 or decode Base64 strings with file support
- **ZIP File Viewer & Extractor**: View ZIP archive contents, preview text files, and extract individual files or entire archives with complete privacy
- **Offline File Organizer**: Organize multiple files by type, name, date, or size with detailed analysis and export reports using local processing
- **Large File Splitter & Joiner**: Split large files into smaller chunks for easier sharing or storage, then rejoin them back to the original file

#### PDF Tools (High Demand)
- **PDF Converter**: Text, HTML, and image to PDF conversion with formatting options
- **PNG to PDF Converter**: Dedicated image-to-PDF converter with batch processing and SEO optimization
- **PDF to PPT Converter**: Convert PDF documents to PowerPoint presentations with automatic content extraction

#### HTML/Markdown Tools
- **HTML Minifier/Beautifier**: Minify HTML to reduce file size or beautify for readability with customizable options
- **Markdown Converter**: Markdown to HTML conversion with preview
- **HTML to Markdown Converter**: Convert HTML content to clean Markdown with comprehensive element support

#### Text Processing Tools
- **Text Case Converter**: Convert text between 10 different case formats (camelCase, snake_case, etc.)
- **Text Diff Checker**: Compare text blocks with detailed difference analysis and statistics
- **Text Line Tools**: Sort, deduplicate, merge, and manipulate text lines with powerful processing options
- **Regex Tester**: Pattern testing with live feedback and match highlighting

#### Developer Utilities
- **Hash Generator**: Generate MD5, SHA-1, SHA-256, and SHA-512 hashes from text or files for security verification
- **Number Base Converter**: Convert numbers between binary, octal, decimal, and hexadecimal formats with live conversion
- **UUID Generator**: v4 UUID generation with bulk options
- **Timestamp Converter**: Unix timestamp conversion with timezone support
- **QR Code Generator**: Generate QR codes locally for URLs, text, WiFi credentials with customizable options
- **Barcode Generator**: Create various barcode formats (Code128, EAN, UPC) with industry-standard compliance
- **Password Generator**: Secure password creation with customizable rules and strength analysis

#### Image & Color Tools (New Category)
- **Image to Base64 Converter**: Convert images to Base64 encoded strings for embedding in HTML, CSS, or applications
- **Color Converter**: Convert colors between HEX, RGB, and HSL formats with visual color picker and sliders
- **Favicon Generator**: Upload any image and generate favicons in all standard sizes for websites (ICO & PNG formats)
- **Social Media Image Cropper**: Auto-crop images to perfect sizes for Instagram, Facebook, Twitter, LinkedIn, YouTube, and more platforms
- **Logo Background Remover**: Remove backgrounds from logos and images with manual brush and magic wand tools
- **Image Optimizer**: Compress images while preserving quality with customizable size and quality settings
- **Color Palette Extractor**: Extract dominant colors from any image with frequency analysis and multiple format support

#### Spreadsheet Tools (New Category)
- **Excel ↔ CSV Converter**: Convert between Excel (.xlsx) and CSV formats with support for multiple sheets and custom delimiters using SheetJS
- **Smart Data Cleaner**: Clean messy Excel data by removing currency symbols, converting text to numbers, handling percentages, and fixing formatting issues
- **CSV Merger & Splitter**: Combine multiple CSV files or split large CSVs by rows or file size with advanced processing options
- **CSV/TSV Viewer**: View and sort CSV/TSV files in a tabular grid with filtering and column hiding features

#### Smart Add-On Tools (New)
- **String to JSON Converter**: Convert malformed strings to valid JSON, automatically fixing single quotes, unquoted keys, trailing commas, and other common issues
- **Whitespace & Indentation Tool**: Clean up messy text formatting by normalizing whitespace, fixing indentation, and removing unwanted spaces
- **Text Encryptor/Decryptor**: Securely encrypt and decrypt text using AES-256 encryption with client-side processing
- **Color Palette Generator**: Extract beautiful color palettes from images with hex, RGB, and HSL values
- **Readability Grader**: Analyze text with 6 readability formulas including Flesch-Kincaid, Gunning Fog, and SMOG indices with grade level assessments
- **Passive Voice Detector**: Identify passive voice constructions in writing and get suggestions for converting them to active voice
- **Academic Writing Formatter**: Generate properly formatted citations and bibliographies in APA, MLA, and Chicago styles with in-text citation examples
- **SEO Content Optimizer**: Analyze and optimize content for search engines with keyword density analysis, readability scoring, and SEO element validation

#### Content Generation
- **Lorem Ipsum Generator**: Placeholder text generation with HTML options

### UI/UX Features
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Component Library**: Complete shadcn/ui implementation with Radix primitives
- **Toast Notifications**: User feedback system
- **Dark Mode Ready**: CSS variables setup for theme switching
- **Material Icons**: Google Material Icons for consistent iconography
- **Usage Guides**: Comprehensive usage examples, pro tips, and best practices for each tool
- **SEO Components**: Dynamic meta tags, structured data, and social sharing integration
- **Content Rich**: Step-by-step tutorials and real-world usage scenarios

### Development Features
- **Hot Reload**: Vite development server with HMR
- **Error Handling**: Runtime error overlay for development
- **TypeScript**: Full type safety across frontend and backend
- **Path Aliases**: Configured for clean imports (@/, @shared/)
- **SEO Optimization**: Dynamic meta tags, Open Graph, Twitter Cards, and JSON-LD structured data
- **Content Enhancement**: Usage guides, examples, tips, and best practices for each tool
- **Social Sharing**: Native and platform-specific share buttons for tool promotion

## Data Flow

### Client-Side Processing
- All tool operations happen entirely in the browser
- No sensitive data is sent to the server
- File uploads are processed locally using FileReader API
- Results can be downloaded directly without server involvement

### Server Communication
- Minimal API surface focused on potential user management
- Query client configured for future API integration
- Session-based authentication ready (connect-pg-simple)
- Error handling middleware for API routes

### Storage Interface
- Abstract storage interface allows switching between in-memory and database
- Current implementation uses Map-based memory storage
- Ready for PostgreSQL integration via Drizzle ORM
- User schema defined but not actively used

## External Dependencies

### Frontend Dependencies
- **React Ecosystem**: React 18, React DOM, React Query
- **UI Components**: Radix UI primitives, shadcn/ui components
- **Utilities**: date-fns, clsx, class-variance-authority
- **Icons**: Lucide React icons, Google Material Icons
- **Routing**: Wouter for lightweight routing
- **PDF Generation**: jsPDF, html2canvas for client-side PDF creation

### Backend Dependencies
- **Server**: Express.js with TypeScript
- **Database**: Drizzle ORM, @neondatabase/serverless
- **Session**: connect-pg-simple for PostgreSQL sessions
- **Validation**: Zod with Drizzle integration
- **Development**: tsx, esbuild, Vite

### Development Dependencies
- **Build Tools**: Vite, esbuild, TypeScript
- **Styling**: Tailwind CSS, PostCSS, Autoprefixer
- **Linting**: TypeScript compiler for type checking

## Deployment Strategy

### Build Process
- **Frontend**: Vite builds React app to `dist/public`
- **Backend**: esbuild bundles Express server to `dist/index.js`
- **Assets**: Static files served from build output
- **Environment**: NODE_ENV-based configuration

### Production Setup
- Express serves both API routes and static frontend
- Database connection via DATABASE_URL environment variable
- Session storage configured for PostgreSQL
- Error handling with appropriate status codes

### Development Workflow
- **dev**: tsx runs server with hot reload
- **build**: Dual build process for frontend and backend
- **start**: Production server from built files
- **db:push**: Drizzle schema synchronization

### Hosting Considerations
- Environment variables needed: DATABASE_URL
- Static file serving from dist/public
- Session persistence requires PostgreSQL
- All tools work offline after initial load
- **Content Strategy**: SEO-optimized tool pages with comprehensive usage guides
- **Social Integration**: Share buttons for tool discovery and user engagement