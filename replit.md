# replit.md

## Overview

ToolGenius is a web application that provides free, in-browser developer utilities. The application is built as a full-stack TypeScript project using React for the frontend and Express.js for the backend, with a focus on client-side processing to ensure user privacy and security.

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
The application provides various developer utilities:
- **CSV/JSON/YAML/TSV Converter**: Data format conversion with file upload support
- **Regex Tester**: Pattern testing with live feedback and match highlighting
- **Timestamp Converter**: Unix timestamp conversion with timezone support
- **UUID Generator**: v4 UUID generation with bulk options
- **JSON Formatter**: JSON validation, formatting, and minification
- **Lorem Ipsum Generator**: Placeholder text generation with HTML options
- **Markdown Converter**: Markdown to HTML conversion with preview

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