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
- **Database**: PostgreSQL with Neon serverless hosting for scalability
- **ORM**: Drizzle ORM for type-safe database operations and schema management
- **Schema**: Comprehensive relational design with tables for users, casinos, bonuses, games, casino_games, casino_ratings, reviews, blog posts, newsletter subscribers, and comparisons
- **Connection**: Connection pooling with @neondatabase/serverless for efficient database access
- **Data Architecture**: Fully dynamic system - all content loaded from PostgreSQL database with no hardcoded mock data (as of August 2025)

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

### Dynamic Data Implementation
- **Complete Mock Data Removal**: All hardcoded casino, bonus, and game data removed from storage layer
- **PostgreSQL Integration**: Full transition to dynamic PostgreSQL-based data loading
- **Storage Layer Rewrite**: MemStorage class completely rebuilt with async database operations
- **API Compatibility**: All existing API endpoints maintain compatibility while now using real database queries
- **Performance**: Database queries optimized with proper error handling and connection pooling

### User Interaction Tracking System
- **User Interactions Table**: Added database table to track all user clicks and interactions
- **InteractionTracker**: Frontend system to automatically track casino, bonus, and game clicks
- **Dynamic Statistics**: Hero section "Happy Users" count now displays real user engagement data
- **API Integration**: /api/interactions endpoint for recording user actions with proper analytics

### Admin Panel Implementation
- **Admin Authentication**: Secure admin system with JWT tokens and bcrypt password hashing
- **Role-Based Access**: Owner (alkox) can manage other administrators, regular admins have limited access
- **Admin Database**: PostgreSQL-based admin user management with proper relationships
- **Frontend Admin Panel**: Complete admin interface accessible at /admin with login at /admin/login
- **Admin Management**: Owner can add/remove administrators, view statistics, and manage site
- **Security**: Protected admin routes with token verification and role-based permissions

### Advanced Admin Forms Implementation (August 2025)
- **Comprehensive Casino Form**: 4-tab interface (Osnovno, Funkcionalnosti, Expert Review, Status) with all database fields, 6 expert review categories, logo upload capability, and dynamic lists for payment methods
- **Enhanced Bonus Form**: 3-tab structure (Osnovno, Detalji, Status) with image upload, casino linking, comprehensive bonus details including wagering requirements, terms, and validity dates
- **Advanced Game Form**: 4-tab organization (Osnovno, Detalji, Kazini, Status) with description fields, casino connections, tag management, detailed game specifications (paylines, multipliers), and bulk casino selection
- **Complete Blog Form**: 5-tab interface (Sadržaj, Meta, Medija, Povezano, Status) with full content management, SEO meta fields, image upload, casino/game relationships, tag system, and publishing controls
- **Object Storage Integration**: Complete setup with Replit Object Storage for file uploads across all admin forms
- **Inter-Content Linking**: All content types can now reference each other - games connect to casinos, blog posts reference casinos and games, comprehensive relationship management
- **Upload Functionality**: Image upload buttons integrated across all forms with object storage backend support

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