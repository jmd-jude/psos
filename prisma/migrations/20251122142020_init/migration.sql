-- CreateTable
CREATE TABLE "use_cases" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "buyer_outcome" TEXT,
    "data_inputs" TEXT,
    "data_outputs" TEXT,
    "delivery_mechanism" TEXT,
    "limitations" TEXT,
    "competitive_notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "owner" TEXT,
    "last_reviewed" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "verticals" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "key_buyer_persona" TEXT,
    "primary_pain_point" TEXT,
    "compliance_considerations" TEXT,
    "strategicPriority" TEXT NOT NULL DEFAULT 'Medium',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "use_case_verticals" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "use_case_id" TEXT NOT NULL,
    "vertical_id" TEXT NOT NULL,
    "fit" TEXT NOT NULL DEFAULT 'Primary',
    CONSTRAINT "use_case_verticals_use_case_id_fkey" FOREIGN KEY ("use_case_id") REFERENCES "use_cases" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "use_case_verticals_vertical_id_fkey" FOREIGN KEY ("vertical_id") REFERENCES "verticals" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "capability_pillars" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "what_it_measures" TEXT,
    "key_metrics" TEXT,
    "why_it_matters" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "maturity_assessments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "use_case_id" TEXT NOT NULL,
    "pillar_id" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "rationale" TEXT,
    "assessed_by" TEXT,
    "assessed_date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "maturity_assessments_use_case_id_fkey" FOREIGN KEY ("use_case_id") REFERENCES "use_cases" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "maturity_assessments_pillar_id_fkey" FOREIGN KEY ("pillar_id") REFERENCES "capability_pillars" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "opportunity_scores" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "use_case_id" TEXT NOT NULL,
    "arr_raw" REAL,
    "arr_score" INTEGER,
    "pipeline_raw" REAL,
    "pipeline_score" INTEGER,
    "velocity_raw" REAL,
    "velocity_score" INTEGER,
    "win_rate_raw" REAL,
    "win_rate_score" INTEGER,
    "strategic_fit_score" INTEGER,
    "source_notes" TEXT,
    "scored_by" TEXT,
    "score_date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "opportunity_scores_use_case_id_fkey" FOREIGN KEY ("use_case_id") REFERENCES "use_cases" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "glossary" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "term" TEXT NOT NULL,
    "abbreviation" TEXT,
    "definition" TEXT NOT NULL,
    "context" TEXT,
    "category" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "ai_insights" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "insight_type" TEXT NOT NULL,
    "input_data" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "response" TEXT NOT NULL,
    "use_case_id" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "verticals_name_key" ON "verticals"("name");

-- CreateIndex
CREATE UNIQUE INDEX "use_case_verticals_use_case_id_vertical_id_key" ON "use_case_verticals"("use_case_id", "vertical_id");

-- CreateIndex
CREATE UNIQUE INDEX "capability_pillars_name_key" ON "capability_pillars"("name");
