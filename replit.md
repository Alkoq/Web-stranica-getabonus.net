# replit.md

## Overview

GetABonus.net is a comprehensive casino affiliate website that helps users discover and compare online casinos, bonuses, and promotions. The application provides detailed casino reviews, bonus listings, comparison tools, and educational blog content to help players make informed gambling decisions. Built as a full-stack web application, it features a modern React frontend with a Node.js/Express backend and PostgreSQL database.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development
- **Routing**: Wouter for lightweight client-side routing
- **UI Components**: Shadcn/ui component library built on Radix UI primitives for accessibility
- **Styling**: Tailwind CSS with custom color schemes (turquoise primary, orange accent)
- **State Management**: React Query (TanStack Query) for server state management and caching
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules for modern JavaScript features
- **API Design**: RESTful API endpoints organized by resource (casinos, bonuses, reviews, blog)
- **Middleware**: Custom logging, JSON parsing, error handling, and development-only Vite integration

### Data Storage
- **Storage Backend**: JSON file-based storage system (getabonus-data.json) for complete data persistence
- **Schema Compatibility**: Maintains full TypeScript type safety and existing data structures
- **Real-time Updates**: Instant data synchronization across all pages and admin panel
- **Data Architecture**: Fully dynamic system - all content loaded from JSON storage with no hardcoded mock data
- **Initial Data**: Pre-populated with sample casinos, bonuses, games, and blog posts for immediate functionality

### Key Features
- **Casino Management**: Detailed casino profiles with safety ratings, licenses, payment methods, and features
- **Bonus System**: Comprehensive bonus tracking with types (welcome, no-deposit, free spins, cashback)
- **Game Database**: Casino game catalog with RTP, volatility, demo links, and provider information
- **Integrated Review System**: Casino pages include expert reviews (6 criteria with ratings/explanations) and user reviews (1-10 ratings + comments)
- **Comparison Tools**: Side-by-side casino comparison functionality with detailed ratings
- **Blog Platform**: Content management for guides, strategies, and news
- **Newsletter**: Email subscription system for user engagement
- **Admin Panel**: Hidden admin system accessible only via direct URL (/admin) for content management
- **Authentication**: Secure admin login system with JWT tokens protecting admin panel access
- **Rating System**: 6-category casino rating system (bonuses, design, payouts, support, games, mobile)
- **Casino Page Structure**: Basic casino info → expert reviews → user reviews → related articles → casino games

### Development Features
- **Theme Support**: Light/dark mode with system preference detection
- **Responsive Design**: Mobile-first approach with adaptive layouts including optimized hamburger menu
- **AI Chatbot**: Interactive assistance for users (simulated responses)
- **Search & Filtering**: Advanced filtering capabilities across all content types
- **SEO Optimization**: Structured data and semantic HTML for search engines
- **Navigation**: Complete navigation system with Games section, mobile-optimized hamburger menu (280px width)
- **Neon Styling**: Casino-themed neon design with turquoise/orange color scheme and glow effects
- **Enhanced Review System**: 
  - "Helpful" voting functionality added to casino reviews (fully functional with API backend)
  - Extended character limits for user reviews (500 chars for casinos, 450 for bonuses)
  - Average rating displays on bonus and game preview cards (Expert + User combined)
  - Detailed review prompts encouraging specific feedback about legitimacy and fairness
  - Game preview cards now display combined expert+user ratings with star icons
- **Improved Game Cards**: 
  - Combined rating system showing expert+user ratings with star icons in top-left corner
  - RTP values color-coded (green for 97%+, orange for 95-97%, red for <95%)
  - Enhanced information display: provider, volatility badges, bet ranges, game tags
  - Neon glow effects and hover animations matching casino theme
- **Enhanced Bonus Cards**: 
  - Additional details: minimum deposit, maximum winnings, promotional codes
  - Improved wagering requirements display with clear formatting
  - Better visual hierarchy and information organization

## Recent Changes (August 2025)

### Complete Platform Rebuild (Latest)
- **Fresh Dynamic System**: Completely rebuilt platform from scratch using localStorage for data persistence
- **Main Site Architecture**: Single-page application with sections for home, casinos, bonuses, games, and news
- **Individual Pages System**: Each casino, bonus, game, and news item has its own detailed page accessible via ID
- **Admin Panel Integration**: Separate admin.html accessible at /admin route for content management
- **Real-time Data Flow**: Admin changes immediately reflect on main site through localStorage synchronization
- **Preview Card System**: All preview cards pull real data from individual pages, no mock data whatsoever
- **Search Engine**: Comprehensive search functionality across all content types
- **Navigation System**: Smooth navigation between sections and individual pages with proper back buttons

### Dynamic Content Management
- **Admin Panel Features**: Complete CRUD operations for casinos, bonuses, games, and news
- **Form Validation**: Comprehensive forms with required fields and data validation
- **Featured Content**: Admin can mark items as featured to appear on homepage previews
- **Relationship Management**: Bonuses linked to specific casinos with dropdown selection
- **Statistics Dashboard**: Real-time counts and management overview
- **Authentication**: Simple admin login system (admin/admin123 for demo)

### Technical Implementation
- **JSON Storage Backend**: Complete transition from PostgreSQL to JSON file storage system
- **Existing UI Preserved**: All existing React pages, components, and routes remain unchanged
- **Real-time Data Flow**: Admin panel changes immediately reflect across all site pages
- **Type Safety**: Full TypeScript compatibility maintained with existing schema definitions
- **Dynamic Content**: All preview cards, detail pages, and listings pull real data from JSON storage
- **No Mock Data**: Complete removal of placeholder content - everything is dynamically loaded

## External Dependencies

### Database & Hosting
- **Neon PostgreSQL**: Serverless PostgreSQL database hosting
- **Replit**: Development and hosting platform integration

### UI & Styling
- **Radix UI**: Accessible component primitives for complex UI elements
- **Tailwind CSS**: Utility-first CSS framework for rapid styling
- **Lucide Icons**: Consistent icon library for interface elements

### Email Services
- **SendGrid**: Email delivery service for newsletter and notifications

### Development Tools
- **Drizzle Kit**: Database schema migrations and management
- **React Hook Form**: Form state management with validation
- **Zod**: Runtime type validation and schema parsing
- **Date-fns**: Date manipulation and formatting utilities

### Build & Development
- **Vite**: Build tool with HMR and development server
- **TypeScript**: Static type checking and enhanced development experience
- **ESBuild**: Fast JavaScript bundling for production builds