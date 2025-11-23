---
title: "Privacy & Compliance Risk Framework"
category: product
lastUpdated: 2025-01-15
author: "Legal & Product Teams"
---

# Privacy & Compliance Risk Framework

## Risk Level Classifications

### HIGH RISK
**Definition**: Direct PII exposure, sensitive categories, or cross-context tracking without explicit consent

**Characteristics**:
- Raw PII (unhashed email, phone, postal address) exposed to third parties
- Sensitive data categories: health, finance, children, precise geolocation
- Cross-context tracking without user knowledge (e.g., browsing → offline purchase)
- Persistent identifiers shared across unrelated sites/apps

**Compliance Requirements**:
- Legal review required (2-4 weeks lead time)
- Enhanced consent mechanisms (opt-in, not opt-out)
- Audit trails and data lineage documentation
- Right-to-delete and data portability infrastructure
- Privacy impact assessments (PIAs)
- Data protection impact assessments (DPIAs) for EU operations

**Revenue Impact**:
- Potential 10-20% revenue reduction due to opt-out rates
- Higher legal and operational costs (20-30% margin impact)
- Slower time-to-market (2-3 month delays)

**Example Use Cases**:
- Prescription drug targeting based on health conditions
- Credit score-based audience segmentation
- Deterministic cross-site tracking for retargeting
- Children's app behavior analysis

**Mitigation Strategies**:
- Use hashed/pseudonymized identifiers when possible
- Implement differential privacy or aggregation
- Limit data retention periods (30-90 days)
- Partner with compliant data sources only
- Build consent management infrastructure

---

### MEDIUM RISK
**Definition**: Pseudonymous tracking, household-level data, or behavioral signals without sensitive categories

**Characteristics**:
- Hashed identifiers (SHA256 email, MAIDs) used
- Household-level (not individual-level) targeting
- Non-sensitive behavioral signals (product browsing, content consumption)
- Aggregated or modeled attributes (no direct PII link)

**Compliance Requirements**:
- Standard privacy policy disclosure
- Opt-out mechanisms (not necessarily opt-in)
- Data retention policies (1-2 years)
- Standard security practices (encryption, access controls)
- Vendor due diligence on data sources

**Revenue Impact**:
- Minimal revenue reduction (0-5% opt-out rates)
- Standard compliance costs (5-10% margin impact)
- Standard time-to-market

**Example Use Cases**:
- Lookalike audience modeling
- CTV household targeting
- Email-to-MAID linkage for app install campaigns
- Offline-to-online attribution (aggregated)

**Best Practices**:
- Use SHA256 hashing with client-specific salts
- Implement 180-day data refresh cycles
- Provide clear privacy policy disclosures
- Honor Global Privacy Control (GPC) signals

---

### LOW RISK
**Definition**: Aggregated insights, statistical modeling, or anonymized analysis with no re-identification risk

**Characteristics**:
- K-anonymity (k≥5) or differential privacy applied
- Statistical/aggregate reporting only (no individual records)
- No persistent identifiers shared
- Synthetic data or modeled outcomes

**Compliance Requirements**:
- Standard privacy policy disclosure
- No special consent mechanisms required
- No data retention limits (data is anonymized)
- Standard security practices

**Revenue Impact**:
- No revenue reduction
- Minimal compliance costs (<5% margin impact)
- Fast time-to-market

**Example Use Cases**:
- Market research and trend analysis
- Anonymous foot traffic measurement
- Aggregate audience insights (age/gender distributions)
- Modeled propensity scores (no individual output)

**Advantages**:
- Minimal legal review required
- Low customer objection rate
- Can operate in highly regulated verticals (healthcare, finance)
- Future-proof against evolving privacy regulations

---

## Key Privacy Regulations

### CCPA (California Consumer Privacy Act)
**Scope**: California residents (40M people, ~12% of U.S. population)

**Key Requirements**:
- Right to know what data is collected
- Right to delete data
- Right to opt-out of data sales
- Non-discrimination for exercising privacy rights

**Business Impact**:
- "Sale" is broadly defined (includes data sharing for targeting)
- Opt-out rates in California: 2-5% of users
- Requires infrastructure for data deletion and portability

**Penalties**: Up to $7,500 per intentional violation

---

### GDPR (General Data Protection Regulation)
**Scope**: EU residents (450M people), applies to any company serving EU customers

**Key Requirements**:
- Lawful basis for processing (consent, legitimate interest, contract, legal obligation)
- Data minimization and purpose limitation
- Right to access, rectify, erase, restrict processing
- Data portability
- Privacy by design and by default

**Business Impact**:
- Opt-in consent required (not opt-out)
- Typical consent rates: 30-50% (50-70% data loss)
- Extensive documentation requirements
- DPIAs required for high-risk processing

**Penalties**: Up to 4% of global revenue or €20M, whichever is higher

---

### State Privacy Laws (Virginia, Colorado, Connecticut, Utah, etc.)
**Scope**: Growing patchwork of state-level regulations

**Key Requirements**:
- Similar to CCPA but with variations
- Universal opt-out mechanisms (e.g., Global Privacy Control)
- Sensitive data categories have stricter requirements

**Business Impact**:
- Compliance complexity increases with each new state
- Need for jurisdiction-aware consent management
- Potential for contradictory requirements across states

---

## Compliance-by-Design Principles

### 1. Minimize Data Collection
Only collect data necessary for the specific use case. Resist "collect everything, figure out use later" approach.

### 2. Use Pseudonymization by Default
Hash identifiers (email, phone) before sharing. Only expose raw PII when absolutely necessary.

### 3. Implement Data Retention Limits
Default to 90-180 day retention. Purge data that's no longer needed.

### 4. Build Consent Infrastructure Early
Don't bolt on consent management after the fact. Build it into data collection workflows.

### 5. Enable Data Subject Rights
Automate right-to-delete, right-to-access, and data portability. Manual processes don't scale.

### 6. Document Everything
Data lineage, processing purposes, legal bases, and vendor relationships. Essential for audits and PIAs.

---

## Risk Assessment Checklist

When evaluating a new use case, ask:

- [ ] Does it involve raw PII (unhashed email, phone, address)?
- [ ] Does it include sensitive categories (health, finance, children, precise geo)?
- [ ] Will data be shared with third parties?
- [ ] Is it cross-context tracking (linking unrelated activities)?
- [ ] What's the user expectation? Would they be surprised by this use?
- [ ] Is explicit consent obtained, or are we relying on legitimate interest?
- [ ] Can we achieve the same outcome with anonymized/aggregated data?
- [ ] What's our data retention period?
- [ ] Do we have infrastructure for data deletion requests?

**Scoring**:
- 0-2 "yes" answers: LOW RISK
- 3-5 "yes" answers: MEDIUM RISK  
- 6+ "yes" answers: HIGH RISK (requires legal review)

---

## Strategic Implications

### High-Risk Use Cases
**When to pursue**:
- High revenue potential (>$1M ARR)
- Competitive necessity (lose deals without it)
- Strong legal/compliance team in place

**When to avoid**:
- Early-stage company with limited legal resources
- Low revenue potential (<$250K ARR)
- Alternative low-risk approaches exist

### Future-Proofing

Privacy regulations are becoming stricter, not looser. Build with assumption that:
- Opt-in consent will become universal (not opt-out)
- Sensitive categories will expand (political views, biometric data, etc.)
- Cross-border data transfers will be more restricted
- Penalties will increase

**Recommendation**: Default to LOW RISK approaches where possible. Only escalate to MEDIUM/HIGH RISK when business case strongly justifies the compliance burden and risk exposure.
