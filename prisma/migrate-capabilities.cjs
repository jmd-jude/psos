/* Data Migration Script: Convert MaturityAssessments to UseCaseCapabilityAssessments */

import prisma from '../lib/prisma';

// Mapping of old pillar names to new company capability names
const PILLAR_TO_CAPABILITY_MAP = {
  'Match Rate / Accuracy': 'Data Quality & Accuracy',
  'Scale / Coverage': 'Infrastructure & Operations',
  'Latency / Real-Time': 'Infrastructure & Operations',
  'Compliance Infrastructure': 'Compliance & Privacy',
  'ML Readiness': 'Data Quality & Accuracy',
  'GenAI Readiness': 'Integration Ecosystem',
};

async function migrateToCompanyCapabilities() {
  console.log('Starting migration from MaturityAssessment to UseCaseCapabilityAssessment...\n');

  try {
    // Get all company capabilities
    const capabilities = await prisma.companyCapability.findMany();
    console.log(`Found ${capabilities.length} company capabilities.`);

    if (capabilities.length === 0) {
      console.log('⚠️  No company capabilities found. Please run seed first.');
      return;
    }

    // Get all use cases with their maturity assessments
    const useCases = await prisma.useCase.findMany({
      include: {
        maturityAssessments: {
          include: {
            pillar: true
          }
        }
      }
    });

    console.log(`Found ${useCases.length} use cases to migrate.\n`);

    let totalMigrated = 0;
    let totalSkipped = 0;

    for (const useCase of useCases) {
      console.log(`Processing: ${useCase.name}`);

      if (useCase.maturityAssessments.length === 0) {
        console.log(`  ↳ No assessments to migrate, skipping.`);
        totalSkipped++;
        continue;
      }

      // Group assessments by capability (multiple pillars might map to same capability)
      const capabilityScores = {};

      for (const assessment of useCase.maturityAssessments) {
        const capabilityName = PILLAR_TO_CAPABILITY_MAP[assessment.pillar.name];

        if (!capabilityName) {
          console.log(`  ⚠️  No mapping found for pillar: ${assessment.pillar.name}, skipping.`);
          continue;
        }

        // Average scores if multiple pillars map to same capability
        if (!capabilityScores[capabilityName]) {
          capabilityScores[capabilityName] = {
            scores: [],
            rationales: []
          };
        }

        capabilityScores[capabilityName].scores.push(assessment.score);
        if (assessment.rationale) {
          capabilityScores[capabilityName].rationales.push(assessment.rationale);
        }
      }

      // Create capability assessments
      for (const [capabilityName, data] of Object.entries(capabilityScores)) {
        const capability = capabilities.find(c => c.name === capabilityName);

        if (!capability) {
          console.log(`  ⚠️  Capability not found: ${capabilityName}, skipping.`);
          continue;
        }

        // Calculate average score from mapped pillars
        const avgScore = Math.round(
          data.scores.reduce((sum, s) => sum + s, 0) / data.scores.length
        );

        // Check if score differs from company capability
        const useCompanyScore = (avgScore === capability.score);

        // Check if assessment already exists
        const existing = await prisma.useCaseCapabilityAssessment.findUnique({
          where: {
            useCaseId_capabilityId: {
              useCaseId: useCase.id,
              capabilityId: capability.id
            }
          }
        });

        if (existing) {
          console.log(`  ↳ Already migrated: ${capabilityName}`);
          continue;
        }

        await prisma.useCaseCapabilityAssessment.create({
          data: {
            useCaseId: useCase.id,
            capabilityId: capability.id,
            useCompanyScore: useCompanyScore,
            overrideScore: useCompanyScore ? null : avgScore,
            overrideRationale: useCompanyScore ? null : data.rationales.join(' | '),
            assessedDate: new Date()
          }
        });

        console.log(`  ✓ Migrated: ${capabilityName} (score: ${avgScore}, inherited: ${useCompanyScore})`);
        totalMigrated++;
      }

      // For capabilities not covered by old assessments, create inherited entries
      for (const capability of capabilities) {
        const existing = await prisma.useCaseCapabilityAssessment.findUnique({
          where: {
            useCaseId_capabilityId: {
              useCaseId: useCase.id,
              capabilityId: capability.id
            }
          }
        });

        if (!existing) {
          await prisma.useCaseCapabilityAssessment.create({
            data: {
              useCaseId: useCase.id,
              capabilityId: capability.id,
              useCompanyScore: true,
              overrideScore: null,
              overrideRationale: null,
              assessedDate: new Date()
            }
          });

          console.log(`  ✓ Created inherited: ${capability.name}`);
          totalMigrated++;
        }
      }

      console.log('');
    }

    console.log('\n=== Migration Summary ===');
    console.log(`Total assessments migrated: ${totalMigrated}`);
    console.log(`Use cases skipped (no assessments): ${totalSkipped}`);
    console.log('\n✅ Migration completed successfully!');
    console.log('\nNote: Old MaturityAssessment records are preserved for reference.');
    console.log('You can safely delete them after verifying the new system works correctly.');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

// Run migration
migrateToCompanyCapabilities()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
