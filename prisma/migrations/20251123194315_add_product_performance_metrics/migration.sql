-- AlterTable
ALTER TABLE "opportunity_scores" ADD COLUMN "data_source_depends" TEXT;
ALTER TABLE "opportunity_scores" ADD COLUMN "data_source_score" INTEGER;
ALTER TABLE "opportunity_scores" ADD COLUMN "latency_requirement" TEXT;
ALTER TABLE "opportunity_scores" ADD COLUMN "latency_score" INTEGER;
ALTER TABLE "opportunity_scores" ADD COLUMN "match_rate_impact" REAL;
ALTER TABLE "opportunity_scores" ADD COLUMN "match_rate_score" INTEGER;
ALTER TABLE "opportunity_scores" ADD COLUMN "privacy_risk_level" TEXT;
ALTER TABLE "opportunity_scores" ADD COLUMN "privacy_risk_score" INTEGER;
ALTER TABLE "opportunity_scores" ADD COLUMN "scale_requirement" TEXT;
ALTER TABLE "opportunity_scores" ADD COLUMN "scale_score" INTEGER;
