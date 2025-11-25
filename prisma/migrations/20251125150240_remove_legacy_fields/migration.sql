/*
  Warnings:

  - You are about to drop the `capability_pillars` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `maturity_assessments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `category` on the `use_cases` table. All the data in the column will be lost.
  - You are about to drop the column `delivery_mechanism` on the `use_cases` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "capability_pillars_name_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "capability_pillars";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "maturity_assessments";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "use_case_categories" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "use_case_id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    CONSTRAINT "use_case_categories_use_case_id_fkey" FOREIGN KEY ("use_case_id") REFERENCES "use_cases" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "use_case_categories_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "delivery_mechanisms" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "use_case_delivery_mechanisms" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "use_case_id" TEXT NOT NULL,
    "delivery_mechanism_id" TEXT NOT NULL,
    CONSTRAINT "use_case_delivery_mechanisms_use_case_id_fkey" FOREIGN KEY ("use_case_id") REFERENCES "use_cases" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "use_case_delivery_mechanisms_delivery_mechanism_id_fkey" FOREIGN KEY ("delivery_mechanism_id") REFERENCES "delivery_mechanisms" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_use_cases" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "buyer_outcome" TEXT,
    "data_inputs" TEXT,
    "data_outputs" TEXT,
    "limitations" TEXT,
    "competitive_notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "owner" TEXT,
    "last_reviewed" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
INSERT INTO "new_use_cases" ("buyer_outcome", "competitive_notes", "created_at", "data_inputs", "data_outputs", "description", "id", "last_reviewed", "limitations", "name", "owner", "status", "updated_at") SELECT "buyer_outcome", "competitive_notes", "created_at", "data_inputs", "data_outputs", "description", "id", "last_reviewed", "limitations", "name", "owner", "status", "updated_at" FROM "use_cases";
DROP TABLE "use_cases";
ALTER TABLE "new_use_cases" RENAME TO "use_cases";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_key" ON "categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "use_case_categories_use_case_id_category_id_key" ON "use_case_categories"("use_case_id", "category_id");

-- CreateIndex
CREATE UNIQUE INDEX "delivery_mechanisms_name_key" ON "delivery_mechanisms"("name");

-- CreateIndex
CREATE UNIQUE INDEX "use_case_delivery_mechanisms_use_case_id_delivery_mechanism_id_key" ON "use_case_delivery_mechanisms"("use_case_id", "delivery_mechanism_id");
