# GetABonus.net - Crypto Casino Affiliate Platform

## Project Overview

GetABonus.net is a comprehensive casino affiliate website that helps users discover and compare online casinos, bonuses, and promotions. The platform features detailed casino reviews, bonus listings, comparison tools, and educational blog content.

## Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Node.js + Express.js + TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Styling**: Tailwind CSS + Shadcn/ui components
- **State Management**: TanStack Query (React Query)
- **Authentication**: JWT-based admin authentication
- **Deployment**: Hostinger VPS with custom production script

## Project Structure

```
├── client/                     # Frontend React application
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── admin/          # Admin panel forms and components
│   │   │   ├── casino/         # Casino-related components
│   │   │   ├── bonus/          # Bonus-related components
│   │   │   ├── game/           # Game-related components
│   │   │   └── ui/             # Base UI components (Shadcn/ui)
│   │   ├── hooks/              # Custom React hooks
│   │   ├── lib/                # Utility functions and configurations
│   │   ├── pages/              # Page components for routing
│   │   └── App.tsx             # Main app component with routing
│   └── components.json         # Shadcn/ui configuration
├── server/                     # Backend Express application
│   ├── components.json         # Server-side component configs
│   ├── db.ts                   # Database connection setup
│   ├── index.ts                # Main server entry point
│   ├── routes.ts               # API routes definition
│   ├── storage.ts              # Database operations and business logic
│   └── vite.ts                 # Vite integration for development
├── shared/                     # Shared code between frontend and backend
│   └── schema.ts               # Database schema and TypeScript types
├── attached_assets/            # User-uploaded files and screenshots
├── drizzle.config.ts           # Database configuration
├── package.json                # Dependencies and scripts
├── start-production.js         # Production startup script
├── .env.hostinger              # Production environment template
├── DEPLOYMENT.md               # Deployment instructions
└── replit.md                   # Project documentation and architecture
```

## Core Files Explanation

### Frontend (client/)

#### Main Application Files
- **`client/src/App.tsx`** - Main application component with routing setup using Wouter
- **`client/src/index.css`** - Global styles, Tailwind CSS imports, and custom color schemes

#### Page Components (`client/src/pages/`)
- **`home.tsx`** - Homepage with featured casinos, bonuses, and games
- **`casinos.tsx`** - Casino listing page with filters and search
- **`casino-detail.tsx`** - Individual casino detail page with reviews
- **`bonuses.tsx`** - Bonus listing page
- **`bonus-detail.tsx`** - Individual bonus detail page
- **`games.tsx`** - Game listing page
- **`game-detail.tsx`** - Individual game detail page
- **`blog.tsx`** - Blog listing page
- **`blog-post.tsx`** - Individual blog post page
- **`compare.tsx`** - Casino comparison tool
- **`admin-panel.tsx`** - Admin dashboard (accessible at /admin)
- **`admin-login.tsx`** - Admin login page
- **`auth-page.tsx`** - User authentication (if needed)
- **`not-found.tsx`** - 404 error page

#### Admin Components (`client/src/components/admin/`)
- **`casino-form.tsx`** - Complete casino creation/editing form (4 tabs: Basic, Features, Expert Review, Status)
- **`bonus-form.tsx`** - Bonus creation/editing form (3 tabs: Basic, Details, Status)
- **`game-form.tsx`** - Game creation/editing form (4 tabs: Basic, Details, Casinos, Status)
- **`blog-form.tsx`** - Blog post creation/editing form (5 tabs: Content, Meta, Media, Related, Status)

#### UI Components (`client/src/components/`)
- **`casino/casino-card.tsx`** - Casino preview card with ratings
- **`bonus/bonus-card.tsx`** - Bonus preview card
- **`game/game-card.tsx`** - Game preview card with RTP and ratings
- **`newsletter.tsx`** - Newsletter subscription component
- **`hero-section.tsx`** - Homepage hero with statistics
- **`ui/`** - Shadcn/ui base components (buttons, forms, dialogs, etc.)

#### Utilities (`client/src/lib/`)
- **`queryClient.ts`** - TanStack Query configuration and API request helpers
- **`utils.ts`** - Utility functions and class name helpers
- **`protected-route.tsx`** - Route protection for authenticated areas

#### Hooks (`client/src/hooks/`)
- **`use-toast.tsx`** - Toast notification system
- **`use-auth.tsx`** - Authentication state management (if needed)

### Backend (server/)

#### Core Server Files
- **`index.ts`** - Main Express server setup with middleware and routing
- **`routes.ts`** - All API endpoints for casinos, bonuses, games, blog, admin, etc.
- **`storage.ts`** - Database operations and business logic implementation
- **`db.ts`** - PostgreSQL database connection using Drizzle ORM
- **`vite.ts`** - Vite integration for development environment

#### API Endpoints (in `routes.ts`)

**Public Endpoints:**
- `GET /api/casinos` - List all casinos with filters
- `GET /api/casinos/featured` - Featured casinos
- `GET /api/casinos/:id` - Casino details
- `GET /api/bonuses` - List bonuses
- `GET /api/bonuses/featured` - Featured bonuses
- `GET /api/games` - List games
- `GET /api/blog` - Blog posts
- `GET /api/stats` - Site statistics
- `POST /api/newsletter` - Newsletter subscription
- `POST /api/interactions` - Track user interactions

**Admin Endpoints (Protected):**
- `POST /api/admin/login` - Admin authentication
- `GET /api/admin/stats` - Admin dashboard statistics
- `POST /api/admin/casinos` - Create casino
- `PUT /api/admin/casinos/:id` - Update casino
- `POST /api/admin/bonuses` - Create bonus
- `POST /api/admin/games` - Create game
- `POST /api/admin/blog` - Create blog post
- `GET /api/admin/admins` - List administrators
- `POST /api/admin/admins` - Create administrator

### Shared Code (shared/)

#### Database Schema (`shared/schema.ts`)
Contains all database table definitions and TypeScript types:

**Main Tables:**
- **`users`** - User accounts and admin accounts
- **`casinos`** - Casino information, ratings, features
- **`bonuses`** - Casino bonuses with terms and conditions
- **`games`** - Casino games with RTP, volatility, providers
- **`reviews`** - User reviews for casinos, bonuses, and games
- **`expertReviews`** - Professional reviews with 6-category ratings
- **`blogPosts`** - Blog content with SEO fields
- **`userInteractions`** - User click and engagement tracking
- **`newsletterSubscribers`** - Email subscription list
- **`admins`** - Administrator accounts

**Key Features:**
- All tables use UUID primary keys
- JSONB fields for flexible data (payment methods, features, tags)
- Proper foreign key relationships
- Timestamp tracking for creation and updates

### Configuration Files

#### Database Configuration
- **`drizzle.config.ts`** - Drizzle ORM configuration for migrations
- **`.env.hostinger`** - Production environment variables template

#### Frontend Configuration
- **`vite.config.ts`** - Vite build tool configuration
- **`tailwind.config.ts`** - Tailwind CSS customization
- **`tsconfig.json`** - TypeScript configuration
- **`components.json`** - Shadcn/ui component configuration

#### Deployment
- **`start-production.js`** - Custom production startup script that loads environment variables
- **`DEPLOYMENT.md`** - Step-by-step deployment instructions for Hostinger VPS
- **`package.json`** - NPM scripts and dependencies

## Key Features Implemented

### Content Management
- **Dynamic Casino Management** - Complete casino profiles with safety ratings, licenses, payment methods
- **Bonus System** - Comprehensive bonus tracking with wagering requirements and terms
- **Game Database** - Casino games with RTP, volatility, demo links, and provider information
- **Blog Platform** - Content management for guides, strategies, and news

### Review System
- **Expert Reviews** - 6-category professional reviews (bonuses, design, payouts, support, games, mobile)
- **User Reviews** - Community reviews with ratings and helpful voting
- **Combined Ratings** - Automatic calculation of expert + user ratings

### Admin Panel
- **Secure Authentication** - JWT-based admin login system
- **Content Management** - Full CRUD operations for all content types
- **Inter-Content Linking** - Connect games to casinos, blog posts to casinos/games
- **Statistics Dashboard** - Real-time site analytics and user engagement

### User Experience
- **Responsive Design** - Mobile-first approach with optimized navigation
- **Search & Filtering** - Advanced filtering across all content types
- **Comparison Tools** - Side-by-side casino comparison
- **Newsletter System** - Email subscription with SendGrid integration
- **User Interaction Tracking** - Analytics for clicks and engagement

## Development Workflow

### Adding New Features

1. **Database Changes:**
   - Update `shared/schema.ts` with new tables or fields
   - Run `npm run db:push` to update database

2. **Backend Changes:**
   - Add new functions to `server/storage.ts`
   - Create API endpoints in `server/routes.ts`

3. **Frontend Changes:**
   - Create components in appropriate `client/src/components/` subdirectory
   - Add pages to `client/src/pages/` if needed
   - Update routing in `client/src/App.tsx`

### Admin Panel Development

All admin forms follow a consistent pattern:
- Multi-tab interface for organization
- Form validation with Zod schemas
- Real-time preview where applicable
- Proper error handling and success notifications

### Database Operations

All database operations go through the `IStorage` interface in `storage.ts`:
- Consistent error handling
- Type-safe operations with Drizzle ORM
- Automatic relationship handling
- Transaction support where needed

## Environment Setup

### Development
- Uses Replit's built-in PostgreSQL database
- Hot module replacement with Vite
- Automatic server restart on changes

### Production (Hostinger VPS)
- Custom PostgreSQL database connection
- Environment variables loaded from `.env` file
- Production-optimized builds
- PM2 or similar for process management

## Security Features

- **JWT Authentication** for admin access
- **Password hashing** with bcrypt
- **Role-based permissions** (owner vs regular admin)
- **Input validation** with Zod schemas
- **SQL injection prevention** with Drizzle ORM
- **Environment variable protection**

## Performance Optimizations

- **React Query caching** with 5-minute stale time
- **Database connection pooling** with Neon serverless
- **Optimized database queries** with proper indexing
- **Image optimization** recommendations in components
- **Lazy loading** for heavy components

## Styling System

### Color Scheme
- **Primary**: Turquoise (`--primary`)
- **Accent**: Orange (`--accent`)
- **Background**: Dark purple theme
- **Text**: High contrast for accessibility

### Component Design
- **Neon effects** with CSS glow animations
- **Casino-themed styling** throughout
- **Consistent spacing** with Tailwind utilities
- **Responsive breakpoints** for all screen sizes

## Troubleshooting Common Issues

### Database Connection
- Verify `DATABASE_URL` in environment variables
- Check network connectivity to database
- Ensure database schema is up to date with `npm run db:push`

### Admin Panel Access
- Access via `/admin` URL
- Default credentials: `alkox` / `Katapult00..alkox`
- Check JWT token in localStorage for authentication issues

### Cache Issues
- Clear browser cache for data inconsistencies
- React Query cache automatically expires after 5 minutes
- Use browser DevTools to disable cache during development

### Form Validation
- All forms use Zod validation schemas
- Check browser console for validation errors
- Expert review fields are optional for basic casino creation

## Deployment Instructions

See `DEPLOYMENT.md` for complete step-by-step deployment instructions to Hostinger VPS.

## Maintenance Tasks

### Regular Updates
- Update dependencies monthly
- Review and optimize database queries
- Monitor error logs for issues
- Backup database regularly

### Content Management
- Review and moderate user submissions
- Update casino information as needed
- Publish new blog content regularly
- Monitor affiliate link functionality

---

This documentation should help you navigate and modify the codebase effectively. For specific questions about any component or feature, refer to the inline comments in the relevant files.