/* Prisma Seed Data */

// prisma/seed.ts

import prisma from '../lib/prisma'; // Use the client instance from lib/prisma

async function main() {
  console.log('Start seeding...');

  // --- 1. Capability Pillars (6 records) ---
  const pillarsData = [
    { name: 'Match Rate / Accuracy', sortOrder: 1, whatItMeasures: 'How effectively the system links disparate data points.', keyMetrics: 'Linkage rate, accuracy score' },
    { name: 'Scale / Coverage', sortOrder: 2, whatItMeasures: 'The breadth of data and geographic reach of the solution.', keyMetrics: 'Total records, geographical reach' },
    { name: 'Latency / Real-Time', sortOrder: 3, whatItMeasures: 'Speed of data retrieval and processing.', keyMetrics: 'P95 latency (ms), freshness delta' },
    { name: 'Compliance Infrastructure', sortOrder: 4, whatItMeasures: 'Adherence to global data privacy standards (GDPR, CCPA).', keyMetrics: 'Audit score, incident rate' },
    { name: 'ML Readiness', sortOrder: 5, whatItMeasures: 'Traditional machine learning and predictive analytics capabilities (propensity models, scoring algorithms, feature engineering).', keyMetrics: 'Model accuracy, retraining frequency, prediction lift' },
    { name: 'GenAI Readiness', sortOrder: 6, whatItMeasures: 'Compatibility with GenAI agent workflows and LLM-based systems (semantic APIs, tool calling, structured schemas, agentic integration).', keyMetrics: 'API schema quality, LLM accessibility, agent integration time' },
  ];

  await prisma.capabilityPillar.createMany({
    data: pillarsData,
  });

  const pillars = await prisma.capabilityPillar.findMany();
  console.log(`Seeded ${pillars.length} Capability Pillars.`);

  // --- 2. Company Capabilities (5 records) ---
  const companyCapabilitiesData = [
    {
      name: 'Infrastructure & Operations',
      description: 'Deployment automation, monitoring, uptime, scalability',
      score: 3,
      rationale: 'Batch infrastructure solid (4/5), real-time immature (2/5), average 3/5',
      sortOrder: 1
    },
    {
      name: 'Data Quality & Accuracy',
      description: 'Match rates, data validation, accuracy, freshness',
      score: 4,
      rationale: 'Deterministic linkage proven, match rates above industry standard',
      sortOrder: 2
    },
    {
      name: 'Market Readiness & GTM',
      description: 'Sales enablement, collateral, pricing, case studies',
      score: 3,
      rationale: 'Strong in core verticals, gaps in new market segments',
      sortOrder: 3
    },
    {
      name: 'Compliance & Privacy',
      description: 'CCPA/GDPR compliance, audit trails, consent management',
      score: 4,
      rationale: 'SOC 2 certified, CCPA/GDPR compliant, mature framework',
      sortOrder: 4
    },
    {
      name: 'Integration Ecosystem',
      description: 'Partner integrations, API quality, marketplace presence',
      score: 3,
      rationale: '15 major DSP integrations, gaps in regional platforms',
      sortOrder: 5
    }
  ];

  await prisma.companyCapability.createMany({
    data: companyCapabilitiesData,
  });

  const companyCapabilities = await prisma.companyCapability.findMany();
  console.log(`Seeded ${companyCapabilities.length} Company Capabilities.`);

  // --- 3. Verticals (5 records) ---
  const verticalsData = [
    { name: 'Retail / D2C', strategicPriority: 'Critical', keyBuyerPersona: 'CMO, Head of Digital', primaryPainPoint: 'Attribution and personalization at scale.' },
    { name: 'Agency', strategicPriority: 'High', keyBuyerPersona: 'Data Strategy Lead', primaryPainPoint: 'Need for multi-client data unification and activation.' },
    { name: 'CRM / Marketing Services', strategicPriority: 'Medium', keyBuyerPersona: 'Product Manager', primaryPainPoint: 'Enhancing existing customer profiles with external data.' },
    { name: 'FinTech', strategicPriority: 'High', keyBuyerPersona: 'Head of Risk & Fraud', primaryPainPoint: 'Need for accurate identity verification and fraud prevention.' },
    { name: 'Publishing', strategicPriority: 'Low', keyBuyerPersona: 'Audience Strategy Lead', primaryPainPoint: 'Building 1st party audience segments to monetize inventory.' },
  ];

  await prisma.vertical.createMany({
    data: verticalsData,
  });

  const verticals = await prisma.vertical.findMany();
  console.log(`Seeded ${verticals.length} Verticals.`);

  // --- 4. Sample Use-Cases (4 records) ---
  const useCasesData = [
    { 
      name: 'Profile Unification (CRM IDR)', 
      category: 'Identity Management', 
      buyerOutcome: 'Single Customer View', 
      status: 'Active',
      limitations: 'Limited real-time sync with legacy systems.' 
    },
    { 
      name: 'Data Enrichment - Attributes', 
      category: 'Data Enrichment', 
      buyerOutcome: 'Deeper Personalization', 
      status: 'Active',
      competitiveNotes: 'Requires a strong focus on data freshness.'
    },
    { 
      name: 'Audience Activation', 
      category: 'Activation', 
      buyerOutcome: 'Higher Campaign ROI', 
      status: 'Under Review' 
    },
    { 
      name: 'Site Abandonment Recapture', 
      category: 'Activation', 
      buyerOutcome: 'Revenue Recovery', 
      status: 'Deprecated',
      limitations: 'High cost of implementation relative to value.'
    },
  ];

  await prisma.useCase.createMany({
    data: useCasesData,
  });

  const useCases = await prisma.useCase.findMany();
  console.log(`Seeded ${useCases.length} Use-Cases.`);

  // --- 5. Linking Use-Cases and Verticals (Sample) ---
  // Profile Unification is Primary for FinTech and CRM
  const fintech = verticals.find(v => v.name === 'FinTech');
  const crm = verticals.find(v => v.name === 'CRM / Marketing Services');
  const profileUnification = useCases.find(uc => uc.name === 'Profile Unification (CRM IDR)');

  if (fintech && crm && profileUnification) {
    await prisma.useCaseVertical.createMany({
      data: [
        { useCaseId: profileUnification.id, verticalId: fintech.id, fit: 'Primary' },
        { useCaseId: profileUnification.id, verticalId: crm.id, fit: 'Secondary' },
      ],
    });
    console.log('Linked sample UseCaseVerticals.');
  }

  // --- 6. Sample Assessments (to populate the matrix) ---
  const matchRatePillar = pillars.find(p => p.name.includes('Match Rate'));
  const scalePillar = pillars.find(p => p.name.includes('Scale'));
  const latencyPillar = pillars.find(p => p.name.includes('Latency'));
  const compliancePillar = pillars.find(p => p.name.includes('Compliance'));
  const mlPillar = pillars.find(p => p.name.includes('ML Readiness'));
  const genaiPillar = pillars.find(p => p.name.includes('GenAI'));

  const dataEnrichment = useCases.find(uc => uc.name.includes('Data Enrichment'));
  const audienceActivation = useCases.find(uc => uc.name.includes('Audience Activation'));
  const siteAbandonment = useCases.find(uc => uc.name.includes('Site Abandonment'));

  // HARVEST Use-Case: Profile Unification (High Maturity ~3.6, High Opportunity ~4.6)
  if (profileUnification && matchRatePillar && scalePillar && latencyPillar && compliancePillar && mlPillar && genaiPillar) {
    await prisma.maturityAssessment.createMany({
      data: [
        { useCaseId: profileUnification.id, pillarId: matchRatePillar.id, score: 5, rationale: 'Best-in-class match accuracy with 95%+ linkage rate.' },
        { useCaseId: profileUnification.id, pillarId: scalePillar.id, score: 5, rationale: 'Handles billions of records globally.' },
        { useCaseId: profileUnification.id, pillarId: latencyPillar.id, score: 4, rationale: 'Sub-100ms P95 latency meets market expectations.' },
        { useCaseId: profileUnification.id, pillarId: compliancePillar.id, score: 4, rationale: 'GDPR/CCPA compliant, active audit program.' },
        { useCaseId: profileUnification.id, pillarId: mlPillar.id, score: 5, rationale: 'Advanced ML models for probabilistic matching.' },
        { useCaseId: profileUnification.id, pillarId: genaiPillar.id, score: 4, rationale: 'RESTful JSON API with Swagger docs, but no semantic layer or NL query support.' },
      ]
    });
    await prisma.opportunityScore.create({
      data: {
        useCaseId: profileUnification.id,
        // Business metrics
        arrScore: 5, pipelineScore: 4, velocityScore: 5, winRateScore: 4, strategicFitScore: 5,
        arrRaw: 1200000, pipelineRaw: 5000000, velocityRaw: 30, winRateRaw: 0.85,
        // Product metrics
        matchRateImpact: 0.08,  // 8% improvement
        matchRateScore: 4,
        latencyRequirement: 'near-real-time',
        latencyScore: 3,
        privacyRiskLevel: 'medium',
        privacyRiskScore: 3,
        dataSourceDepends: 'Email, MAID, Postal',
        dataSourceScore: 3,
        scaleRequirement: 'subset',
        scaleScore: 3,
        sourceNotes: 'Based on Q3 2025 sales data. Largest ARR driver, high strategic fit. Product requires near real-time processing with moderate privacy controls.'
      }
    });
    console.log('Seeded HARVEST: Profile Unification');
  }

  // INVEST Use-Case: Data Enrichment (Low Maturity ~1.8, High Opportunity ~4.0)
  if (dataEnrichment && matchRatePillar && scalePillar && latencyPillar && compliancePillar && mlPillar && genaiPillar) {
    await prisma.maturityAssessment.createMany({
      data: [
        { useCaseId: dataEnrichment.id, pillarId: matchRatePillar.id, score: 3, rationale: 'Functional but requires significant customization per client.' },
        { useCaseId: dataEnrichment.id, pillarId: scalePillar.id, score: 3, rationale: 'Limited to specific data categories, not comprehensive.' },
        { useCaseId: dataEnrichment.id, pillarId: latencyPillar.id, score: 2, rationale: 'Batch processing only, 24hr+ refresh cycles.' },
        { useCaseId: dataEnrichment.id, pillarId: compliancePillar.id, score: 3, rationale: 'Basic compliance, lacks comprehensive audit trail.' },
        { useCaseId: dataEnrichment.id, pillarId: mlPillar.id, score: 3, rationale: 'Rule-based enrichment, minimal ML integration.' },
        { useCaseId: dataEnrichment.id, pillarId: genaiPillar.id, score: 3, rationale: 'API exists but poorly documented with large unstructured payloads.' },
      ]
    });
    await prisma.opportunityScore.create({
      data: {
        useCaseId: dataEnrichment.id,
        // Business metrics
        arrScore: 4, pipelineScore: 4, velocityScore: 3, winRateScore: 4, strategicFitScore: 5,
        arrRaw: 800000, pipelineRaw: 3500000, velocityRaw: 45, winRateRaw: 0.75,
        // Product metrics
        matchRateImpact: 0.05,  // 5% improvement
        matchRateScore: 3,
        latencyRequirement: 'batch',
        latencyScore: 1,
        privacyRiskLevel: 'low',
        privacyRiskScore: 5,
        dataSourceDepends: 'Email',
        dataSourceScore: 5,
        scaleRequirement: 'sample',
        scaleScore: 5,
        sourceNotes: 'Strong pipeline, high demand. Lower win rate due to competitive landscape. Batch processing with low privacy risk.'
      }
    });
    console.log('Seeded INVEST: Data Enrichment');
  }

  // MAINTAIN Use-Case: Audience Activation (High Maturity ~3.2, Low Opportunity ~2.4)
  if (audienceActivation && matchRatePillar && scalePillar && latencyPillar && compliancePillar && mlPillar && genaiPillar) {
    await prisma.maturityAssessment.createMany({
      data: [
        { useCaseId: audienceActivation.id, pillarId: matchRatePillar.id, score: 4, rationale: 'Competitive match rates for activation use cases.' },
        { useCaseId: audienceActivation.id, pillarId: scalePillar.id, score: 5, rationale: 'Integrates with all major ad platforms at scale.' },
        { useCaseId: audienceActivation.id, pillarId: latencyPillar.id, score: 4, rationale: 'Near real-time sync with most platforms.' },
        { useCaseId: audienceActivation.id, pillarId: compliancePillar.id, score: 4, rationale: 'Strong consent management, platform-specific compliance.' },
        { useCaseId: audienceActivation.id, pillarId: mlPillar.id, score: 4, rationale: 'Predictive audience modeling available.' },
        { useCaseId: audienceActivation.id, pillarId: genaiPillar.id, score: 4, rationale: 'Standard REST API with basic documentation and structured outputs.' },
      ]
    });
    await prisma.opportunityScore.create({
      data: {
        useCaseId: audienceActivation.id,
        // Business metrics
        arrScore: 2, pipelineScore: 3, velocityScore: 2, winRateScore: 2, strategicFitScore: 3,
        arrRaw: 350000, pipelineRaw: 1200000, velocityRaw: 90, winRateRaw: 0.55,
        // Product metrics
        matchRateImpact: 0.12,  // 12% improvement
        matchRateScore: 5,
        latencyRequirement: 'real-time',
        latencyScore: 5,
        privacyRiskLevel: 'high',
        privacyRiskScore: 1,
        dataSourceDepends: 'Email, MAID, Postal, Device ID, Cookie ID',
        dataSourceScore: 2,
        scaleRequirement: 'full-graph',
        scaleScore: 1,
        sourceNotes: 'Commoditized market, low differentiation. Long sales cycles. Requires real-time processing with high privacy risk and full graph scale.'
      }
    });
    console.log('Seeded MAINTAIN: Audience Activation');
  }

  // DEPRIORITIZE Use-Case: Site Abandonment (Low Maturity ~1.4, Low Opportunity ~1.8)
  if (siteAbandonment && matchRatePillar && scalePillar && latencyPillar && compliancePillar && mlPillar && genaiPillar) {
    await prisma.maturityAssessment.createMany({
      data: [
        { useCaseId: siteAbandonment.id, pillarId: matchRatePillar.id, score: 2, rationale: 'Requires heavy customization, limited out-of-box value.' },
        { useCaseId: siteAbandonment.id, pillarId: scalePillar.id, score: 3, rationale: 'Works for small-medium sites, struggles at enterprise scale.' },
        { useCaseId: siteAbandonment.id, pillarId: latencyPillar.id, score: 2, rationale: 'High latency impacts real-time trigger effectiveness.' },
        { useCaseId: siteAbandonment.id, pillarId: compliancePillar.id, score: 3, rationale: 'Cookie-dependent, vulnerable to privacy restrictions.' },
        { useCaseId: siteAbandonment.id, pillarId: mlPillar.id, score: 2, rationale: 'Basic rule-based triggers, no predictive modeling.' },
        { useCaseId: siteAbandonment.id, pillarId: genaiPillar.id, score: 2, rationale: 'Batch-only file delivery via SFTP, no API or programmatic access.' },
      ]
    });
    await prisma.opportunityScore.create({
      data: {
        useCaseId: siteAbandonment.id,
        // Business metrics
        arrScore: 1, pipelineScore: 2, velocityScore: 2, winRateScore: 2, strategicFitScore: 2,
        arrRaw: 120000, pipelineRaw: 400000, velocityRaw: 120, winRateRaw: 0.45,
        // Product metrics
        matchRateImpact: 0.02,  // 2% improvement
        matchRateScore: 1,
        latencyRequirement: 'near-real-time',
        latencyScore: 3,
        privacyRiskLevel: 'medium',
        privacyRiskScore: 3,
        dataSourceDepends: 'Cookie ID, Device ID',
        dataSourceScore: 4,
        scaleRequirement: 'subset',
        scaleScore: 3,
        sourceNotes: 'Low ARR, small pipeline. High implementation cost vs value. Deprecated in roadmap. Limited match rate improvement potential.'
      }
    });
    console.log('Seeded DEPRIORITIZE: Site Abandonment');
  }

  // --- 7. Categories (5 records) ---
  const categoriesData = [
    { name: 'Identity Management', description: 'Use cases focused on unifying and resolving customer identities across systems', sortOrder: 1 },
    { name: 'Data Enrichment', description: 'Use cases that augment existing customer data with additional attributes', sortOrder: 2 },
    { name: 'Analytics', description: 'Use cases enabling measurement, reporting, and insights', sortOrder: 3 },
    { name: 'Activation', description: 'Use cases deploying audiences to marketing and advertising platforms', sortOrder: 4 },
    { name: 'Measurement', description: 'Use cases tracking performance and attribution', sortOrder: 5 },
  ];

  await prisma.category.createMany({
    data: categoriesData,
  });

  const categories = await prisma.category.findMany();
  console.log(`Seeded ${categories.length} Categories.`);

  // --- 8. Delivery Mechanisms (4 records) ---
  const deliveryMechanismsData = [
    { name: 'Onsight', description: 'Real-time API for identity resolution and enrichment', sortOrder: 1 },
    { name: 'Realink', description: 'Batch processing for offline identity linkage', sortOrder: 2 },
    { name: 'Identity Authority', description: 'Authoritative identity graph and resolution service', sortOrder: 3 },
    { name: 'Audiences', description: 'Audience segment creation and activation platform', sortOrder: 4 },
  ];

  await prisma.deliveryMechanism.createMany({
    data: deliveryMechanismsData,
  });

  const deliveryMechanisms = await prisma.deliveryMechanism.findMany();
  console.log(`Seeded ${deliveryMechanisms.length} Delivery Mechanisms.`);

  // --- 9. Migrate existing use case categories to many-to-many relationships ---
  const allUseCases = await prisma.useCase.findMany();

  for (const useCase of allUseCases) {
    // Migrate category (single value to many-to-many)
    if (useCase.category) {
      const category = categories.find(c => c.name === useCase.category);
      if (category) {
        await prisma.useCaseCategory.create({
          data: {
            useCaseId: useCase.id,
            categoryId: category.id,
          },
        });
      }
    }

    // Migrate delivery mechanism (comma-separated to many-to-many)
    if (useCase.deliveryMechanism) {
      const mechanismNames = useCase.deliveryMechanism.split(',').map(m => m.trim());
      for (const mechanismName of mechanismNames) {
        const mechanism = deliveryMechanisms.find(m => m.name === mechanismName);
        if (mechanism) {
          await prisma.useCaseDeliveryMechanism.create({
            data: {
              useCaseId: useCase.id,
              deliveryMechanismId: mechanism.id,
            },
          });
        }
      }
    }
  }

  console.log(`Migrated category and delivery mechanism data for ${allUseCases.length} use cases.`);

  // --- 10. Glossary Terms ---
  const glossaryTerms = [
    { term: 'Identity Resolution', abbreviation: 'IDR', category: 'Identity & Data', definition: 'The process of matching disparate data points across systems to create a unified customer profile.', context: 'Core capability for CRM and personalization use cases.' },
    { term: 'Match Rate', abbreviation: null, category: 'Identity & Data', definition: 'The percentage of records successfully linked to a known identity.', context: 'Key performance indicator for identity resolution solutions.' },
    { term: 'Deterministic Matching', abbreviation: null, category: 'Identity & Data', definition: 'Identity resolution using exact identifier matches (email, phone, customer ID).', context: 'Most accurate but limited by PII availability.' },
    { term: 'Probabilistic Matching', abbreviation: null, category: 'Identity & Data', definition: 'Identity resolution using statistical algorithms to infer matches based on patterns.', context: 'Broader coverage than deterministic but requires ML models.' },
    { term: 'First-Party Data', abbreviation: '1P Data', category: 'Identity & Data', definition: 'Data collected directly from customer interactions (CRM, website, transactions).', context: 'Most valuable and compliant data source for personalization.' },
    { term: 'Real-Time Data', abbreviation: 'RTD', category: 'Platform & Technology', definition: 'Data processed and available for use within seconds of collection.', context: 'Critical for activation use cases like triggered campaigns.' },
    { term: 'Latency', abbreviation: null, category: 'Platform & Technology', definition: 'The time delay between data collection and availability for use.', context: 'Measured in P95 (95th percentile) for SLA purposes.' },
    { term: 'Data Enrichment', abbreviation: null, category: 'Platform & Technology', definition: 'Augmenting existing customer records with additional attributes from external sources.', context: 'Enhances personalization and segmentation capabilities.' },
    { term: 'GDPR', abbreviation: null, category: 'Compliance & Privacy', definition: 'General Data Protection Regulation - EU privacy law governing personal data processing.', context: 'Requires consent, right to erasure, and data portability.' },
    { term: 'CCPA', abbreviation: null, category: 'Compliance & Privacy', definition: 'California Consumer Privacy Act - State privacy law with consumer data rights.', context: 'Similar to GDPR, applies to California residents.' },
    { term: 'Consent Management', abbreviation: 'CMP', category: 'Compliance & Privacy', definition: 'System for capturing, storing, and enforcing user privacy preferences.', context: 'Required for GDPR/CCPA compliance in data processing.' },
    { term: 'Data Clean Room', abbreviation: 'DCR', category: 'Compliance & Privacy', definition: 'Secure environment for data collaboration without exposing raw PII.', context: 'Enables compliant data sharing between organizations.' },
    { term: 'Activation', abbreviation: null, category: 'Company Delivery', definition: 'The process of deploying audience segments to marketing/advertising platforms.', context: 'Final step in the data-to-insights-to-action workflow.' },
    { term: 'Audience Segment', abbreviation: null, category: 'Company Delivery', definition: 'A group of customers/prospects defined by shared attributes or behaviors.', context: 'Building block for targeted campaigns and personalization.' },
    { term: 'ARR', abbreviation: null, category: 'Company Delivery', definition: 'Annual Recurring Revenue - Predictable revenue from subscriptions.', context: 'Key metric for SaaS business health and use case prioritization.' },
  ];

  await prisma.glossary.createMany({ data: glossaryTerms });
  console.log(`Seeded ${glossaryTerms.length} Glossary terms.`);

  console.log('\nSeeding finished. All 4 use cases have complete maturity and opportunity scores.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
