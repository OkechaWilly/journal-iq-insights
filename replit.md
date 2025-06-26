# replit.md

## Overview

This is a full-stack trading journal application built with a modern React frontend and Express backend. The application allows traders to log trades, analyze performance, and generate reports. It features institutional-grade analytics, AI-powered insights, and comprehensive compliance tools.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Library**: Radix UI components with shadcn/ui styling
- **Styling**: Tailwind CSS with dark theme design system
- **State Management**: TanStack React Query for server state, React hooks for local state
- **Routing**: React Router for client-side navigation
- **Charts**: Recharts for data visualization

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon (serverless PostgreSQL) via @neondatabase/serverless
- **Authentication**: Supabase Auth integration
- **Session Management**: PostgreSQL-based sessions with connect-pg-simple

### Database Architecture
- **Primary Database**: PostgreSQL (configured for Neon serverless)
- **ORM**: Drizzle with schema-first approach
- **Migrations**: Located in `migrations/` directory via drizzle-kit
- **Schema**: Centralized in `shared/schema.ts` for type safety across frontend/backend

## Key Components

### Core Features
1. **Trade Management**: Create, read, update, delete trades with comprehensive metadata
2. **Analytics Dashboard**: Real-time performance metrics and visualizations
3. **AI Insights**: Pattern recognition and trading recommendations
4. **Risk Management**: Advanced risk metrics including VaR, Sharpe ratio, drawdown analysis
5. **Compliance Hub**: Audit trails, regulatory reporting, and compliance monitoring
6. **Report Generation**: PDF export capabilities with customizable reports

### Authentication & Security
- Supabase-based authentication with email/password and social login
- Row Level Security (RLS) policies for data isolation
- Audit logging for all critical operations
- Session management with secure storage

### Mobile Responsiveness
- Responsive design with mobile-first approach
- Swipeable trade items for mobile interaction
- Adaptive layouts using Tailwind's responsive utilities

## Data Flow

### Trade Lifecycle
1. User creates trade via form submission
2. Data validated on frontend with Zod schemas
3. Submitted to backend API endpoints
4. Stored in PostgreSQL with user association
5. Real-time updates trigger UI refreshes via React Query
6. Analytics automatically recalculated

### Analytics Pipeline
1. Trade data aggregated from database
2. Monthly performance calculated via materialized views
3. Risk metrics computed using advanced statistical functions
4. AI insights generated based on pattern analysis
5. Results cached and delivered to frontend components

### Report Generation
1. User selects date range and report options
2. Trade data filtered and processed
3. PDF generated using jsPDF with charts and tables
4. File downloaded to user's device

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL connection
- **drizzle-orm**: Type-safe database operations
- **@supabase/supabase-js**: Authentication and real-time features
- **@tanstack/react-query**: Server state management
- **react-router-dom**: Client-side routing
- **recharts**: Chart rendering
- **jspdf**: PDF report generation

### UI/UX Dependencies
- **@radix-ui/***: Accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library
- **date-fns**: Date manipulation utilities

### Development Dependencies
- **vite**: Frontend build tool
- **typescript**: Type checking
- **eslint**: Code linting
- **tailwindcss**: CSS framework

## Deployment Strategy

### Development Environment
- Replit-based development with hot reload
- Vite dev server for frontend
- tsx for TypeScript execution in development
- PostgreSQL database provisioned via Replit

### Production Build
- Frontend: `vite build` creates optimized static assets
- Backend: `esbuild` bundles server code for production
- Assets served from Express static middleware
- Database migrations applied via `drizzle-kit push`

### Environment Configuration
- Database connection via `DATABASE_URL` environment variable
- Supabase configuration embedded in client
- Port configuration for Replit deployment (5000 -> 80)

### Deployment Pipeline
1. Build frontend assets with Vite
2. Bundle backend with esbuild
3. Deploy to Replit's autoscale infrastructure
4. Database migrations automatically applied

## Changelog

- June 26, 2025. Successfully migrated from Lovable to Replit with full Supabase integration
  - Restored Supabase authentication with email/password and Google OAuth
  - Updated all hooks to use Supabase functions instead of API client
  - Fixed MetricsCards component data structure compatibility
  - Verified all functionality working correctly
- June 25, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.