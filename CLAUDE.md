# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PSOS (Product Strategy & Opportunity Scoring) is a Next.js application for evaluating and prioritizing product use-cases using a two-dimensional scoring matrix:
- **Maturity Score (Y-axis)**: Capability assessment across multiple pillars
- **Opportunity Score (X-axis)**: Business value based on ARR, pipeline, velocity, win rate, and strategic fit

Use-cases are plotted on a prioritization matrix and categorized into quadrants: INVEST, HARVEST, MAINTAIN, or DEPRIORITIZE.

## Development Commands

```bash
# Start development server (runs on port 8080)
npm run dev

# Build for production
npm run build

# Run production server
npm start

# Lint code
npm run lint

# Database seeding
npm run seed
```

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **React**: Version 19.2 with React Compiler enabled
- **Database**: SQLite with Prisma ORM
- **UI**: shadcn/ui (Radix UI + Tailwind CSS)
- **AI**: Anthropic Claude SDK for AI insights

## Architecture

### Data Flow Pattern

This application uses Next.js Server Components and Server Actions extensively:

1. **Server Components** (pages in `app/`) fetch data directly using Server Actions from `app/actions.ts`
2. **Client Components** (`'use client'`) interact with API routes (`app/api/*/route.ts`) for mutations
3. Data fetching happens at the layout/page level and is passed down to components as props

Example: `app/layout.tsx` fetches verticals via `getVerticals()` server action and passes them to the `<Sidebar>` component.

### Database Architecture

The Prisma schema (`prisma/schema.prisma`) defines the core domain model:

- **UseCase**: Core entity representing a product use-case
- **Vertical**: Market segments that use-cases target
- **UseCaseVertical**: Many-to-many relationship between use-cases and verticals
- **CapabilityPillar**: Dimensions for maturity assessment
- **MaturityAssessment**: Scores for each use-case across capability pillars (1-5 scale)
- **OpportunityScore**: Business value metrics (ARR, pipeline, velocity, win rate, strategic fit)
- **Glossary**: Terminology definitions
- **AIInsight**: Stored AI-generated analyses and insights

### Scoring Logic

Located in `app/actions.ts`:

- **Maturity Score**: Average of all MaturityAssessment scores for a use-case
- **Opportunity Score**: Average of the 5 opportunity metrics (arrScore, pipelineScore, etc.)
- **Quadrant Assignment**: Based on midpoint (3.0) of 1-5 scale:
  - INVEST: High maturity (≥3.0), High opportunity (≥3.0)
  - HARVEST: High maturity (≥3.0), Low opportunity (<3.0)
  - MAINTAIN: Low maturity (<3.0), High opportunity (≥3.0)
  - DEPRIORITIZE: Low maturity (<3.0), Low opportunity (<3.0)

### Key Directories

```
app/
├── actions.ts              # Server Actions for data fetching (used by Server Components)
├── layout.tsx              # Root layout with Sidebar data fetching
├── page.tsx                # Dashboard with prioritization matrix
├── api/                    # API routes for mutations (used by Client Components)
├── use-cases/              # Use-case management pages
├── verticals/              # Vertical market management pages
├── assessments/            # Maturity and opportunity scoring pages
├── matrix/                 # Prioritization matrix visualization
├── insights/               # AI-powered analysis features
└── glossary/               # Terminology management

components/
├── layout/                 # Header, Sidebar, PageContainer
├── use-cases/              # Use-case display and forms
├── assessments/            # Scoring forms and displays
├── matrix/                 # Prioritization matrix components
├── insights/               # AI insight generation UI
├── common/                 # Reusable components (DeleteButton, ScoreDisplay, etc.)
└── ui/                     # shadcn/ui components (button, card, input, etc.)

lib/
├── types.ts                # TypeScript interfaces (PrioritizationPlotPoint, etc.)
├── prisma.ts               # Prisma client singleton
├── calculations.ts         # Score calculation utilities
├── prompts.ts              # Anthropic prompt templates
└── fieldGuideContext.ts    # Domain context for AI

prisma/
├── schema.prisma           # Database schema
├── seed.cjs                # Database seed script
└── psos.db                 # SQLite database file
```

### Path Aliases

The project uses `@/*` to reference the root directory (configured in `tsconfig.json`):
```typescript
import prisma from '@/lib/prisma';
import { getVerticals } from '@/app/actions';
```

## Database Operations

### Working with Prisma

```bash
# Generate Prisma Client after schema changes
npx prisma generate

# Create a new migration
npx prisma migrate dev --name description_of_changes

# Reset database and re-seed
npx prisma migrate reset

# Open Prisma Studio (GUI for database)
npx prisma studio
```

### Database Location

SQLite database is at `prisma/prisma/psos.db` (note the nested path due to schema configuration).

## Important Patterns

### Server Actions vs API Routes

- **Server Actions** (`app/actions.ts`): Use for data fetching in Server Components
- **API Routes** (`app/api/*/route.ts`): Use for mutations from Client Components

### UI Components

The app uses shadcn/ui, a collection of reusable components built with Radix UI and Tailwind CSS. Components are located in `components/ui/` and can be customized by editing the component files directly. The design system uses Tailwind's utility classes for styling.

### Type Safety

Use Prisma-generated types (`@prisma/client`) and custom interfaces from `lib/types.ts`. The scoring logic heavily relies on `PrioritizationPlotPoint` type which combines maturity and opportunity summaries.

## AI Integration

The application integrates with Anthropic's Claude API for generating insights. AI features are located in:
- `app/api/insights/route.ts`: API endpoint for AI requests
- `components/insights/`: UI for generating and displaying insights
- `lib/prompts.ts`: Prompt templates
- `lib/fieldGuideContext.ts`: Domain knowledge context

Requires `ANTHROPIC_API_KEY` in `.env.local`.
