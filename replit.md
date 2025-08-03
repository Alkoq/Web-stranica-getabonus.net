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

### Key Features
- **Casino Management**: Detailed casino profiles with safety ratings, licenses, payment methods, and features
- **Bonus System**: Comprehensive bonus tracking with types (welcome, no-deposit, free spins, cashback)
- **Game Database**: Casino game catalog with RTP, volatility, demo links, and provider information
- **Review Platform**: User-generated reviews with rating systems and verification
- **Comparison Tools**: Side-by-side casino comparison functionality with detailed ratings
- **Blog Platform**: Content management for guides, strategies, and news
- **Newsletter**: Email subscription system for user engagement
- **Admin Panel**: Complete content management system with forms for casinos, bonuses, games, blog posts, and detailed ratings
- **Rating System**: 6-category casino rating system (bonuses, design, payouts, support, games, mobile)

### Development Features
- **Theme Support**: Light/dark mode with system preference detection
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **AI Chatbot**: Interactive assistance for users (simulated responses)
- **Search & Filtering**: Advanced filtering capabilities across all content types
- **SEO Optimization**: Structured data and semantic HTML for search engines

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