# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PSOS (Product Strategy & Opportunity Scoring) is a Next.js application for evaluating and prioritizing product use-cases using a two-dimensional scoring matrix:
- **Capability Readiness (Y-axis)**: Maturity assessment across organizational capability pillars
- **Market Potential (X-axis)**: Combined score from business growth metrics and technical requirements

Use-cases are plotted on a prioritization matrix and categorized into quadrants: INVEST, HARVEST, MAINTAIN, or DEPRIORITIZE.

### Terminology

The application uses business-friendly terminology in the UI while maintaining technical terms in the code:
- **Market Potential** = Opportunity Score (business growth + technical requirements)
- **Capability Readiness** = Maturity Score (organizational capability assessment)
- **Evaluate Use Case** = Combined scoring workflow for both dimensions

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

- **Framework**: Next.js 16.0.3 (App Router)
- **React**: Version 19.2.0 with React Compiler enabled (babel-plugin-react-compiler)
- **Database**: SQLite with Prisma ORM (v6.17.0)
- **UI**: shadcn/ui (Radix UI + Tailwind CSS)
- **AI**: Anthropic Claude SDK (v0.70.1) for AI insights
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Styling**: Tailwind CSS with tailwindcss-animate

## Architecture

### Data Flow Pattern

This application uses Next.js Server Components and Server Actions extensively:

1. **Server Components** (pages in `app/`) fetch data directly using Server Actions from `app/actions.ts`
2. **Client Components** (`'use client'`) interact with API routes (`app/api/*/route.ts`) for mutations
3. Data fetching happens at the layout/page level and is passed down to components as props

Example: `app/layout.tsx` fetches verticals via `getVerticals()` server action and passes them to the `<Sidebar>` component.

### Database Architecture

The Prisma schema (`prisma/schema.prisma`) defines the core domain model:

**Core Entities:**
- **UseCase**: Core entity representing a product use-case with:
  - **Feature Definition**: Structured documentation fields (problemContext, targetAudience, valueBenefit, successMeasures) that capture institutional knowledge from sales/product teams. These fields inform scoring decisions but are not scored themselves.
  - Basic metadata: description, buyer outcomes, data I/O, limitations, competitive notes
  - Taxonomy: categories, verticals, delivery mechanisms
- **Vertical**: Market segments that use-cases target with buyer personas, pain points, and compliance considerations
- **UseCaseVertical**: Many-to-many relationship between use-cases and verticals with fit level (Primary/Secondary)
- **Category**: Functional classifications for use-cases
- **UseCaseCategory**: Many-to-many join table for use-cases and categories
- **DeliveryMechanism**: How use-cases are delivered to customers (e.g., API, UI, Batch)
- **UseCaseDeliveryMechanism**: Many-to-many join table for use-cases and delivery mechanisms

**Scoring & Assessment:**
- **CompanyCapability**: Organization-level capability definitions with scores (1-5 scale)
- **UseCaseCapabilityAssessment**: Use-case specific assessments with inherit/override pattern
- **OpportunityScore**: Business value and technical requirement metrics including:
  - **Business Growth Metrics**: ARR, pipeline, velocity, win rate, strategic fit
  - **Technical Requirements**: Match rate impact, latency requirements, privacy risk level, data source dependencies, scale requirements

**Support Tables:**
- **Glossary**: Terminology definitions organized by category
- **AIInsight**: Stored AI-generated analyses and insights

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

- **Opportunity Score (Market Potential)**: Average of business growth metrics (ARR, pipeline, velocity, win rate, strategic fit) and technical requirement metrics (match rate, latency, privacy risk, data source complexity, scale requirements)

- **Quadrant Assignment**: Based on midpoint (3.0) of 1-5 scale:
  - INVEST: High maturity (≥3.0), High opportunity (≥3.0)
  - HARVEST: High maturity (≥3.0), Low opportunity (<3.0)
  - MAINTAIN: Low maturity (<3.0), High opportunity (≥3.0)
  - DEPRIORITIZE: Low maturity (<3.0), Low opportunity (<3.0)

### Navigation Structure

The sidebar navigation (`components/layout/Sidebar.tsx`) is organized into three main sections that separate operational workflows from configuration:

**CORE ENTITIES** (Operational - Daily Use):
- Use Cases: Create, view, and edit product use-cases
- Prioritization Matrix: Visual dashboard for strategic planning

**EVALUATE USE CASES** (Scoring Workflow):
- Evaluate Use Case: Unified page for scoring market potential, technical requirements, and capability readiness

**SETUP & SETTINGS** (Configuration - Occasional Use):
- Company Capabilities: Set organizational capability baselines
- Categories: Functional taxonomy setup
- Delivery Mechanisms: How use-cases are delivered
- Verticals: Market segment management
- Glossary: Terminology reference

This structure was designed to clearly distinguish between "do work" (operational) and "configure system" (setup) activities. Categories, Delivery Mechanisms, and Verticals were moved from being nested under Use Cases to being top-level items in Setup & Settings since they are taxonomy/configuration concerns rather than daily operational tasks.

### Key Directories

```
app/
├── actions.ts              # Server Actions for data fetching (used by Server Components)
├── layout.tsx              # Root layout with Sidebar data fetching
├── page.tsx                # Dashboard with prioritization matrix
├── api/                    # API routes for mutations (used by Client Components)
│   ├── capabilities/       # Company capability CRUD operations
│   ├── maturity/           # Use case capability assessments (inherit/override)
│   ├── opportunity/        # Market potential/opportunity scoring
│   ├── use-cases/          # Use case CRUD operations
│   ├── verticals/          # Vertical CRUD operations
│   ├── categories/         # Category CRUD operations
│   ├── delivery-mechanisms/ # Delivery mechanism CRUD operations
│   ├── glossary/           # Glossary CRUD operations
│   └── insights/           # AI-powered analysis endpoints
├── use-cases/              # Use-case management pages (list, detail, new, edit)
├── verticals/              # Vertical market management pages
├── categories/             # Category taxonomy management
├── delivery-mechanisms/    # Delivery mechanism management
├── assessments/            # Scoring workflow pages
│   ├── evaluate/           # Unified evaluation page (primary workflow)
│   ├── maturity/           # Legacy maturity assessment page
│   └── opportunity/        # Legacy opportunity scoring page
├── settings/               # Admin configuration pages
│   └── capabilities/       # Company capabilities management UI
├── matrix/                 # Prioritization matrix visualization
├── insights/               # AI-powered analysis features
└── glossary/               # Terminology management

components/
├── layout/                 # Header, Sidebar
├── use-cases/              # Use-case display and forms
├── verticals/              # Vertical display components
├── glossary/               # Glossary display components
├── assessments/            # Scoring forms (EvaluateUseCaseForm, MaturityAssessmentForm, OpportunityScoreForm)
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
└── prisma/psos.db          # SQLite database file (nested path)
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

1. Navigate to `/settings/capabilities` (in Setup & Settings section of sidebar)
2. View the default 5 capabilities seeded from `prisma/seed.cjs`
3. Click "Edit" on any capability to update score (1-5) and rationale
4. Changes save via `PUT /api/capabilities/:id` endpoint
5. Updates instantly propagate to all use cases inheriting that capability

**Adding New Capabilities**: Insert directly into `company_capabilities` table via Prisma Studio or SQL. The system supports any number of capabilities (no hard-coded limits). Set `sort_order` to control display order.

### Configuring Taxonomy

**Categories** (`/categories`): Functional classifications for use-cases (e.g., Identity Resolution, Data Enrichment)
- Create/edit categories with name, description, and sort order
- Associate multiple categories with each use case

**Delivery Mechanisms** (`/delivery-mechanisms`): How use-cases are delivered (e.g., API, UI Component, Batch Process)
- Define delivery mechanisms with descriptions
- Use cases can have multiple delivery mechanisms

**Verticals** (`/verticals`): Market segments with detailed buyer context
- Define vertical markets with buyer personas, pain points, compliance considerations, and strategic priority
- Create use case detail pages showing vertical fit (Primary/Secondary)

### Evaluating Use Cases (Primary Workflow)

Navigate to `/assessments/evaluate` for the unified evaluation workflow:

**Step 1: Select Use Case**
- Choose from dropdown of existing use cases

**Step 2: Market Potential (Business Growth Metrics)**
- ARR (Annual Recurring Revenue) impact
- Pipeline opportunity value
- Sales velocity (days to close)
- Win rate improvement
- Strategic fit alignment

**Step 3: Technical Requirements (Product Performance Metrics)**
- Match rate impact (expected improvement %)
- Latency requirements (real-time, near-real-time, batch)
- Privacy risk level (high, medium, low)
- Data source dependencies (complexity)
- Scale requirements (full-graph, subset, sample)

**Step 4: Capability Readiness**
- For each company capability, choose:
  - **Checked checkbox** (default): Inherit from company capability (read-only score)
  - **Unchecked checkbox**: Override with custom score (1-5) + required rationale
- Submit saves all three dimensions via API endpoints

### Viewing Use Case Details

On any use case detail page (`/use-cases/:id`):
- View full use case description, buyer outcomes, data I/O, limitations, and competitive notes
- See market potential score breakdown
- See capability readiness breakdown with inherited/overridden indicators
- View associated verticals, categories, and delivery mechanisms
- Access links to edit use case or capability scores

## AI Integration

The application integrates with Anthropic's Claude API for generating insights. AI features are located in:
- `app/api/insights/route.ts`: General AI insights endpoint
- `app/api/insights/competitive-analysis/route.ts`: Competitive positioning analysis
- `app/api/insights/capability-gaps/route.ts`: Gap analysis for capabilities
- `app/api/insights/vertical-fit/route.ts`: Vertical market fit analysis
- `app/insights/page.tsx`: AI insights dashboard page
- `components/insights/`: UI components for generating and displaying insights
- `lib/prompts.ts`: Prompt templates for different insight types
- `lib/fieldGuideContext.ts`: Domain knowledge context for AI

Requires `ANTHROPIC_API_KEY` in `.env.local`.

### AI Insight Types

The system supports multiple types of AI-powered analyses:
- **Use Case Analysis**: Deep dive into individual use cases
- **Competitive Analysis**: Market positioning and competitive landscape
- **Capability Gaps**: Identify missing or weak organizational capabilities
- **Vertical Fit**: Analyze use case fit for specific market segments
- **Quarterly Review**: Strategic portfolio review across all use cases

All insights are stored in the `ai_insights` table for historical reference.

## Recent Changes & Evolution

### Navigation Restructure (November 2025)
- Reorganized sidebar into three logical sections: Core Entities, Evaluate Use Cases, and Setup & Settings
- Moved taxonomy items (Categories, Delivery Mechanisms, Verticals) from nested under Use Cases to top-level Setup & Settings
- Renamed "Assessments & Scoring" to "Evaluate Use Cases" for clarity
- Renamed "Configuration" to "Setup & Settings" for better user understanding

### Unified Evaluation Workflow
- Created `/assessments/evaluate` as the primary scoring workflow page
- Combines capability readiness (maturity), market potential (business growth), and technical requirements scoring in one interface
- Legacy `/assessments/maturity` and `/assessments/opportunity` pages remain for backward compatibility

### Expanded Opportunity Scoring
- Added Product Performance Metrics to OpportunityScore model:
  - Match rate impact
  - Latency requirements
  - Privacy risk level
  - Data source dependencies
  - Scale requirements
- Now supports dual scoring dimensions: Business Growth + Technical Requirements

### Taxonomy Expansion
- Added Category model and many-to-many relationship with use cases
- Added DeliveryMechanism model and many-to-many relationship with use cases
- Enhanced Vertical model with buyer personas, pain points, and compliance considerations
- All taxonomy entities now have dedicated management pages with CRUD operations

### Terminology Updates
- User-facing labels use business-friendly terms while code maintains technical precision
- "Opportunity Scoring" → "Market Potential" in UI
- "Maturity Assessment" → "Capability Readiness" in UI
- Technical field names remain unchanged for backward compatibility
