-- CreateTable
CREATE TABLE "company_capabilities" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "score" INTEGER NOT NULL,
    "rationale" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "last_updated" DATETIME NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "use_case_capability_assessments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "use_case_id" TEXT NOT NULL,
    "capability_id" TEXT NOT NULL,
    "use_company_score" BOOLEAN NOT NULL DEFAULT true,
    "override_score" INTEGER,
    "override_rationale" TEXT,
    "assessed_date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assessed_by" TEXT,
    CONSTRAINT "use_case_capability_assessments_use_case_id_fkey" FOREIGN KEY ("use_case_id") REFERENCES "use_cases" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "use_case_capability_assessments_capability_id_fkey" FOREIGN KEY ("capability_id") REFERENCES "company_capabilities" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "company_capabilities_name_key" ON "company_capabilities"("name");

-- CreateIndex
CREATE UNIQUE INDEX "use_case_capability_assessments_use_case_id_capability_id_key" ON "use_case_capability_assessments"("use_case_id", "capability_id");
