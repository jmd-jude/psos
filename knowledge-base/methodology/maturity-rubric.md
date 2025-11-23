---
title: "Capability Maturity Assessment Rubric"
category: methodology
lastUpdated: 2025-01-15
author: "Product Strategy Team"
---

# Capability Maturity Assessment Rubric

## Overview

The PSOS framework assesses use-case maturity across multiple capability pillars using a **1-5 scale**:
- **1 (Initial)**: Ad-hoc, undocumented, manual processes
- **2 (Developing)**: Documented but inconsistent, partial automation
- **3 (Defined)**: Standardized processes, mostly automated, monitored
- **4 (Managed)**: Quantitatively controlled, predictable outcomes, optimized
- **5 (Optimizing)**: Continuous improvement, industry-leading, competitive moat

This rubric provides specific criteria for each maturity level across common capability pillars.

---

## Infrastructure & Operations

### Score 1: Initial
- Manual deployments, no automation
- No monitoring or alerting
- Frequent outages (>5% downtime)
- No documented runbooks
- Single points of failure everywhere

**Example**: "We SSH into production servers and manually restart services when they crash."

### Score 2: Developing
- Some automation (deployment scripts)
- Basic monitoring (uptime checks)
- Downtime 1-5% (80-95% uptime)
- Partial documentation
- Some redundancy but not comprehensive

**Example**: "We have deployment scripts but still require manual intervention. We know when things break but not why."

### Score 3: Defined
- CI/CD pipeline for deployments
- Comprehensive monitoring and alerting
- Downtime 0.1-1% (99-99.9% uptime)
- Full runbooks and playbooks
- Redundancy and failover mechanisms

**Example**: "We have automated deployments, comprehensive monitoring, and clear operational procedures. Most issues are caught before they impact customers."

### Score 4: Managed
- Fully automated deployments with rollback
- Predictive monitoring and auto-remediation
- Downtime 0.01-0.1% (99.9-99.99% uptime)
- Incident post-mortems drive continuous improvement
- Chaos engineering and resiliency testing

**Example**: "Our systems self-heal. We proactively identify and fix issues before they become incidents. Deployments are zero-downtime."

### Score 5: Optimizing
- Self-healing, self-scaling infrastructure
- Predictive scaling and capacity planning
- Downtime <0.01% (>99.99% uptime)
- Industry-leading operational excellence
- Competitive moat from infrastructure

**Example**: "Our infrastructure is a competitive advantage. We can scale to billions of requests without manual intervention. Competitors can't match our uptime or latency."

---

## Data Quality & Accuracy

### Score 1: Initial
- No data validation or quality checks
- Error rates unknown
- Reactive to customer complaints
- No quality metrics tracked
- Data lineage unknown

**Example**: "We don't know how accurate our data is. We find out about quality issues when customers complain."

### Score 2: Developing
- Basic validation rules (format, range checks)
- Error rates estimated (5-15%)
- Spot checks and sampling
- Some quality metrics tracked
- Partial data lineage

**Example**: "We have basic validation but still see frequent data quality issues. We estimate 10% error rate but don't have precise measurements."

### Score 3: Defined
- Automated validation and quality checks
- Error rates measured (<5%)
- Quality dashboards and alerting
- Comprehensive quality metrics
- Full data lineage and provenance

**Example**: "We continuously monitor data quality with automated checks. Our error rate is <5% and we have full visibility into data lineage."

### Score 4: Managed
- ML-based anomaly detection
- Error rates <1%
- Proactive quality improvement
- SLAs on data quality
- Root cause analysis for all quality issues

**Example**: "Our ML models detect anomalies before they impact customers. We maintain <1% error rate and have SLAs with customers on data quality."

### Score 5: Optimizing
- Self-correcting data quality systems
- Error rates <0.1%
- Industry-leading quality
- Competitive moat from data accuracy
- Published quality benchmarks exceed competitors

**Example**: "Our data quality is our competitive advantage. Customers trust our data more than any competitor. We publish benchmarks showing our superiority."

---

## Market Readiness & Go-to-Market

### Score 1: Initial
- No sales materials or collateral
- Product not documented
- No pricing or packaging
- Sales team not trained
- No reference customers

**Example**: "We have a capability but can't sell it. No one knows it exists or how to position it."

### Score 2: Developing
- Basic product documentation
- Rough pricing model
- Sales team aware but not trained
- 0-1 customer using it
- Minimal competitive intelligence

**Example**: "We have basic materials but sales struggles to articulate value. We have one pilot customer."

### Score 3: Defined
- Complete sales collateral (decks, one-pagers, demos)
- Defined pricing and packaging
- Sales team trained and certified
- 2-5 reference customers with case studies
- Competitive positioning documented

**Example**: "Sales can confidently pitch this use case. We have multiple reference customers and clear competitive differentiation."

### Score 4: Managed
- Repeatable sales playbooks
- Win rate >40%
- Sales cycle <90 days
- 10+ reference customers across multiple verticals
- Competitive win rate improving

**Example**: "We have a proven sales motion. Win rates are strong and sales cycles are predictable. We're winning competitive deals."

### Score 5: Optimizing
- Industry-leading go-to-market
- Win rate >60%
- Sales cycle <60 days
- Market-defining capability (others copy us)
- Thought leadership and category creation

**Example**: "We define this category. Competitors position against us. Customers seek us out. We're the gold standard."

---

## Compliance & Privacy

### Score 1: Initial
- No privacy or compliance documentation
- Unknown regulatory requirements
- Reactive to legal/compliance issues
- No consent management
- Privacy risk unassessed

**Example**: "We haven't thought about compliance. We'll figure it out when we get a legal notice."

### Score 2: Developing
- Basic privacy policy and terms
- Aware of major regulations (CCPA, GDPR)
- Manual compliance processes
- Basic consent mechanisms
- Privacy risk identified but not mitigated

**Example**: "We know we need to comply with privacy laws. We have basic documentation but manual processes."

### Score 3: Defined
- Comprehensive privacy program
- Full compliance with CCPA/GDPR
- Automated consent management
- Data subject rights infrastructure (delete, access, portability)
- Privacy by design principles applied

**Example**: "We're fully compliant with major privacy regulations. We have automated systems for consent and data subject rights."

### Score 4: Managed
- Proactive privacy program
- Compliance ahead of regulations (not reactive)
- Privacy audits and certifications (SOC 2, ISO 27001)
- Privacy as a competitive advantage
- Legal team embedded in product development

**Example**: "Privacy is a core competency. We're certified and audited. Customers choose us because of our privacy practices."

### Score 5: Optimizing
- Industry-leading privacy practices
- Setting standards others follow
- Privacy innovations (differential privacy, secure enclaves)
- Regulatory involvement (help shape laws)
- Privacy as a brand differentiator

**Example**: "We're leaders in privacy-preserving technology. Regulators consult with us. Our privacy innovations are competitive moats."

---

## Partner & Integration Ecosystem

### Score 1: Initial
- No integrations or partnerships
- Proprietary/closed system
- Manual data transfer processes
- No API or APIs are undocumented

**Example**: "We're a silo. No integrations exist. Customers have to manually move data."

### Score 2: Developing
- 1-2 basic integrations
- APIs exist but poorly documented
- Limited partner ecosystem
- Manual onboarding for partners

**Example**: "We have a couple integrations but they're brittle. API docs are incomplete. Partners struggle to integrate."

### Score 3: Defined
- 5-10 strategic integrations
- Well-documented REST APIs
- Partner program established
- Self-service partner onboarding
- Marketplace presence (if applicable)

**Example**: "We have a healthy integration ecosystem. Partners can self-serve with our APIs. We're in major marketplaces."

### Score 4: Managed
- 20+ integrations across major platforms
- Developer-friendly APIs (SDKs, webhooks)
- Thriving partner ecosystem
- Co-marketing with major partners
- API-first product architecture

**Example**: "Integrations are a growth engine. We have SDKs in multiple languages. Partners actively promote our solution."

### Score 5: Optimizing
- Platform play - others build on us
- Industry-standard APIs (others copy our patterns)
- Ecosystem network effects
- Partners can't build their products without us
- Developer community and advocacy

**Example**: "We're a platform. An ecosystem of companies builds on our APIs. Our integrations are a competitive moat."

---

## Team Capability & Knowledge

### Score 1: Initial
- No dedicated team or owner
- Knowledge in one person's head
- High turnover or no bench
- Reactive firefighting mode

**Example**: "One person knows how this works. If they leave, we're in trouble."

### Score 2: Developing
- 1-2 people own it
- Partial documentation
- Some cross-training
- Still reactive more than proactive

**Example**: "We have a small team but they're overloaded. Documentation is incomplete. Still lots of firefighting."

### Score 3: Defined
- Dedicated team (3-5 people)
- Comprehensive documentation
- Cross-trained team members
- Proactive rather than reactive
- Clear ownership and accountability

**Example**: "We have a solid team with clear ownership. Knowledge is documented and shared. We're proactive about improvements."

### Score 4: Managed
- Mature team (5-10 people)
- Subject matter experts
- Strong bench and succession planning
- Continuous learning and development
- Industry thought leadership (conferences, blogs)

**Example**: "Our team is a strength. We have deep expertise and strong succession planning. We're known in the industry."

### Score 5: Optimizing
- Industry-leading team
- Recruiting advantage (top talent wants to work here)
- Thought leadership and category creation
- Training/mentoring others in the industry
- Team capability is a competitive moat

**Example**: "Our team is the best in the industry. Top talent seeks us out. We train and mentor others. Our expertise is a competitive advantage."

---

## How to Use This Rubric

### Assessment Process
1. **Assemble cross-functional team**: Product, Engineering, Sales, Operations
2. **Review each pillar independently**: Don't let one pillar influence others
3. **Use specific examples**: "We do X" not "We're pretty good at this"
4. **Be honest**: Inflated scores lead to bad decisions
5. **Document rationale**: Why did you assign this score?
6. **Reassess quarterly**: Maturity changes over time

### Scoring Guidelines
- **Score the current state**, not aspirations or plans
- **Use half-points** (2.5, 3.5) if truly between levels
- **Err on the conservative side**: Better to under-promise and over-deliver
- **Include evidence**: Screenshots, metrics, customer quotes

### Common Pitfalls
- **Overscoring**: "We're almost at 4" (probably you're a 3)
- **Anchor bias**: Scoring based on internal comparison, not external reality
- **Recency bias**: Recent success/failure skews perception
- **Halo effect**: Strong in one area doesn't mean strong everywhere

### Action Planning
- **Score <2.0**: Major capability gaps, high risk
- **Score 2.0-2.9**: Approaching readiness but not there yet
- **Score 3.0-3.9**: Production-ready, competitive
- **Score 4.0-4.9**: Industry-leading, differentiated
- **Score 5.0**: World-class, competitive moat

For INVEST quadrant use cases, prioritize getting all pillars to ≥3.0 before declaring "ready for market."
