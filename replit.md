# replit.md

## Overview

FileConverterData is a web application that provides free, in-browser developer utilities. The application is built as a full-stack TypeScript project using React for the frontend and Express.js for the backend, with a focus on client-side processing to ensure user privacy and security.

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

## Key Components

### Tool Collection
The application provides various developer utilities grouped by category, now including 25+ tools:

#### Data Format Converters (Most Popular)
- **CSV/JSON/YAML/TSV Converter**: Data format conversion with file upload support
- **JSON Formatter**: JSON validation, formatting, and minification
- **JSON ↔ XML Converter**: Bidirectional conversion between JSON and XML formats with file support
- **Base64 Encoder/Decoder**: Encode text/files to Base64 or decode Base64 strings with file support

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

#### Image & Color Tools (New Category)
- **Image to Base64 Converter**: Convert images to Base64 encoded strings for embedding in HTML, CSS, or applications
- **Color Converter**: Convert colors between HEX, RGB, and HSL formats with visual color picker and sliders

#### Smart Add-On Tools (New)
- **Whitespace & Indentation Tool**: Clean up messy text formatting by normalizing whitespace, fixing indentation, and removing unwanted spaces
- **CSV/TSV Viewer**: View and sort CSV/TSV files in a tabular grid with filtering and column hiding features
- **Text Encryptor/Decryptor**: Securely encrypt and decrypt text using AES-256 encryption with client-side processing
- **Color Palette Generator**: Extract beautiful color palettes from images with hex, RGB, and HSL values

#### Content Generation
- **Lorem Ipsum Generator**: Placeholder text generation with HTML options

### UI/UX Features
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Component Library**: Complete shadcn/ui implementation with Radix primitives
- **Toast Notifications**: User feedback system
- **Dark Mode Ready**: CSS variables setup for theme switching
- **Material Icons**: Google Material Icons for consistent iconography

### Development Features
- **Hot Reload**: Vite development server with HMR
- **Error Handling**: Runtime error overlay for development
- **TypeScript**: Full type safety across frontend and backend
- **Path Aliases**: Configured for clean imports (@/, @shared/)

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