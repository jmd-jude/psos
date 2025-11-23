---
title: "Match Rate Performance Benchmarks"
category: product
lastUpdated: 2025-01-15
author: "Product Team"
---

# Match Rate Performance Benchmarks

## Industry Context

Match rates are the foundational metric for identity graph quality. They measure how successfully we can link one identifier type to another, enabling cross-channel tracking, personalization, and measurement.

## Performance by Identifier Type

### Email to MAID (Mobile Advertising ID)
- **Industry Standard**: 45-65%
- **Our Performance**: 62-68%
- **Competitive Advantage**: +8-15% over baseline

**Why it matters**: Email-to-MAID linkage enables cross-device targeting and allows email campaigns to extend to mobile app environments.

### Postal Address to Email
- **Industry Standard**: 55-70%
- **Our Performance**: 68-74%
- **Competitive Advantage**: +10-15% over baseline

**Why it matters**: Offline-to-online bridging enables direct mail campaigns to be measured against digital outcomes.

### Household Resolution
- **Industry Standard**: 75-85%
- **Our Performance**: 82-88%
- **Competitive Advantage**: +5-10% over baseline

**Why it matters**: Household resolution powers CTV advertising, household-level attribution, and family structure analysis.

### Cross-Device Linkage
- **Industry Standard**: 60-75%
- **Our Performance**: 71-79%
- **Competitive Advantage**: +8-12% over baseline

**Why it matters**: Understanding that a mobile device, tablet, and laptop all belong to the same person enables unified frequency capping and journey orchestration.

## Business Impact of Match Rate Improvements

### 5%+ Improvement
- Considered **significant market differentiation**
- Typically results in 10-15% improvement in campaign performance
- Justifies 15-25% price premium

### 10%+ Improvement
- Considered **transformative capability**
- Drives 20-30% faster sales cycles
- Can unlock new verticals (e.g., healthcare, finance) where precision is critical
- Justifies 30-50% price premium

### Example: Email-to-MAID Use Case
If a competitor achieves 55% match rate and we achieve 65%:
- Client uploads 1M emails
- Competitor matches 550K to MAIDs
- We match 650K to MAIDs
- **+100K incremental addressable audience (+18% expansion)**

This incremental reach often translates directly to incremental revenue for clients, making ROI calculations straightforward.

## Match Rate vs. Scale Tradeoff

Higher match rates don't always mean better business outcomes. Consider:

### High Match Rate, Low Scale
- 95% match rate on 10M records = 9.5M matched
- **Niche solution, limited addressability**

### Moderate Match Rate, High Scale
- 70% match rate on 250M records = 175M matched
- **Broad solution, maximum addressability**

Our strategy: **Optimize for scale first, then maximize match rate within that scale.**

## Factors That Influence Match Rates

### Data Freshness
- Email addresses change ~25% annually
- MAIDs reset on device changes (~18-month average lifecycle)
- Phone numbers port between carriers
- **Implication**: Regular data refresh cycles are critical

### Identifier Quality
- Invalid/fake emails reduce match rates
- Hashed email mismatches (different salt/hash algorithms)
- MAIDs from older devices with limited activity
- **Implication**: Data validation and quality scoring improves outcomes

### Geographic Coverage
- Urban areas typically have 10-15% higher match rates
- Rural areas have fewer digital touchpoints
- Regional data source availability varies
- **Implication**: Vertical-specific match rates may differ

## Reporting Match Rates to Clients

When communicating match rates:
1. **Be specific about identifier pairs**: "Email-to-MAID" not just "match rate"
2. **Provide context**: Industry benchmarks, competitive comparison
3. **Show business impact**: Incremental reach, cost savings, performance lift
4. **Acknowledge limitations**: Geographic, demographic, or temporal constraints

## Match Rate Improvement Roadmap

Potential areas for improvement (prioritized by impact):

1. **MAID Refresh Cycles** (Expected: +3-5% improvement)
2. **Email Validation & Hygiene** (Expected: +2-4% improvement)
3. **Household Clustering Algorithm** (Expected: +4-6% improvement)
4. **Cross-Device Machine Learning Models** (Expected: +5-8% improvement)
5. **New Data Source Partnerships** (Expected: +3-7% improvement)

Total potential: **+17-30% improvement over current baseline**
