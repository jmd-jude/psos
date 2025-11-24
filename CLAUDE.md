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
- **CompanyCapability**: Organization-level capability definitions with scores (1-5 scale)
- **UseCaseCapabilityAssessment**: Use-case specific assessments with inherit/override pattern
- **OpportunityScore**: Business value metrics (ARR, pipeline, velocity, win rate, strategic fit)
- **Glossary**: Terminology definitions
- **AIInsight**: Stored AI-generated analyses and insights

**Legacy tables** (still present for backward compatibility):
- **CapabilityPillar**: Old maturity assessment dimensions
- **MaturityAssessment**: Old per-use-case capability scores

### Company Capabilities System (Inherit/Override Pattern)

The application uses a two-tier capability scoring system to eliminate duplication:

1. **Company Capabilities** (`company_capabilities` table):
   - Organization-wide capability definitions and scores
   - Managed via admin UI at `/settings/capabilities`
   - Includes: name, description, score (1-5), rationale, sortOrder
   - Changes automatically propagate to all inheriting use cases

2. **Use Case Assessments** (`use_case_capability_assessments` table):
   - Each use case has an assessment record for each capability
   - `useCompanyScore` boolean flag (default: `true`)
   - When `true`: Inherits from company capability at runtime (no stored score)
   - When `false`: Uses `overrideScore` and `overrideRationale` (stored locally)
   - Override rationale is required for all overrides

3. **Automatic Propagation**:
   - Inherited scores are read from `company_capabilities` at query time
   - Updates to company capabilities instantly affect all inheriting use cases
   - Only overridden scores remain unchanged when company scores update

4. **Dual-System Fallback**:
   - Code checks for new capability assessments first
   - Falls back to old `maturity_assessments` if none exist
   - Allows gradual migration without breaking existing functionality

### Scoring Logic

Located in `app/actions.ts`:

- **Maturity Score Calculation**:
  1. Checks for new `capabilityAssessments` on the use case
  2. For each assessment: uses `capability.score` if `useCompanyScore=true`, otherwise uses `overrideScore`
  3. Calculates average of all capability scores
  4. Falls back to old `maturityAssessments` if no new assessments exist

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
│   ├── capabilities/       # Company capability CRUD operations
│   ├── maturity/           # Use case capability assessments (inherit/override)
│   └── ...                 # Other API endpoints
├── use-cases/              # Use-case management pages
├── verticals/              # Vertical market management pages
├── assessments/            # Maturity and opportunity scoring pages
├── settings/               # Admin pages
│   └── capabilities/       # Company capabilities management UI
├── matrix/                 # Prioritization matrix visualization
├── insights/               # AI-powered analysis features
└── glossary/               # Terminology management

components/
├── layout/                 # Header, Sidebar
├── use-cases/              # Use-case display and forms
├── assessments/            # Scoring forms with inherit/override UI
├── settings/               # Admin components (CapabilitiesTable, etc.)
├── matrix/                 # Prioritization matrix components
├── insights/               # AI insight generation UI
├── common/                 # Reusable components (DeleteButton, ScoreDisplay, etc.)
└── ui/                     # shadcn/ui components (button, card, checkbox, etc.)

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

## Key User Workflows

### Setting Up Company Capabilities

1. Navigate to `/settings/capabilities` (linked in sidebar as "Company Capabilities")
2. View the default 5 capabilities seeded from `prisma/seed.cjs`
3. Click "Edit" on any capability to update score (1-5) and rationale
4. Changes save via `PUT /api/capabilities/:id` endpoint
5. Updates instantly propagate to all use cases inheriting that capability

**Adding New Capabilities**: Insert directly into `company_capabilities` table via Prisma Studio or SQL. The system supports any number of capabilities (no hard-coded limits). Set `sort_order` to control display order.

### Assessing Use Case Maturity

1. Navigate to `/assessments/maturity`
2. Select a use case from dropdown
3. For each capability, choose:
   - **Checked checkbox** (default): Inherit from company capability (shows read-only score)
   - **Unchecked checkbox**: Override with custom score + required rationale
4. Submit form to save via `POST /api/maturity` endpoint
5. Creates entries in `use_case_capability_assessments` table
6. View results on use case detail page (`/use-cases/:id`) with inherit/override indicators

### Viewing Maturity Breakdown

On any use case detail page (`/use-cases/:id`), the maturity section shows:
- Overall maturity average score
- Per-capability breakdown with scores
- Inherited capabilities show "Inherited from company capability" label
- Overridden capabilities show "Override" badge and custom rationale
- Link to `/settings/capabilities` for quick access to company scores

## AI Integration

The application integrates with Anthropic's Claude API for generating insights. AI features are located in:
- `app/api/insights/route.ts`: API endpoint for AI requests
- `components/insights/`: UI for generating and displaying insights
- `lib/prompts.ts`: Prompt templates
- `lib/fieldGuideContext.ts`: Domain knowledge context

Requires `ANTHROPIC_API_KEY` in `.env.local`.
