---
title: "Latency Requirements & Infrastructure Implications"
category: product
lastUpdated: 2025-01-15
author: "Product Team"
---

# Latency Requirements & Infrastructure Implications

## Latency Classifications

### Real-Time (<100ms)
**Definition**: Identity resolution or enrichment must complete within 100 milliseconds

**Use Cases**:
- Programmatic advertising bidding (RTB)
- Web personalization at page load
- Fraud detection at transaction time
- In-session recommendation engines

**Infrastructure Requirements**:
- Edge-deployed caching layers (Redis, Memcached)
- CDN distribution for global coverage
- Pre-computed identity graphs (no on-the-fly resolution)
- Horizontal scaling with auto-failover
- 99.99%+ uptime SLA

**Cost Profile**: 
- 5-10x infrastructure cost vs. batch
- Requires 24/7 SRE support
- Premium pricing justified (3-5x standard rates)

**Market Sizing**: ~15% of current addressable market requires true real-time

---

### Near-Real-Time (<1 second)
**Definition**: Identity resolution or enrichment completes within 1 second

**Use Cases**:
- In-app personalization
- Email content personalization (send-time)
- Call center decisioning support
- Real-time dashboards and reporting

**Infrastructure Requirements**:
- API-based access with distributed caching
- Database read replicas across regions
- Query optimization and indexing
- Standard monitoring and alerting

**Cost Profile**:
- 2-3x infrastructure cost vs. batch
- Standard support hours acceptable
- Moderate pricing premium (1.5-2x standard rates)

**Market Sizing**: ~35% of current addressable market operates in this tier

---

### Batch (Hours to Days)
**Definition**: Identity resolution or enrichment completes within scheduled processing windows

**Use Cases**:
- Offline attribution modeling
- Audience building for campaigns
- Data enrichment for CRM systems
- Monthly/quarterly reporting and analytics
- Model training and scoring

**Infrastructure Requirements**:
- Standard database or data warehouse
- Scheduled job processing (nightly/weekly)
- Bulk API or file-based transfer
- Standard backup and recovery

**Cost Profile**:
- Baseline infrastructure cost
- No premium pricing required
- Economies of scale enable competitive pricing

**Market Sizing**: ~50% of current addressable market operates in batch mode

---

## Strategic Considerations

### Real-Time Premium Paradox

While real-time capabilities command premium pricing (3-5x), they also:
- Require significant upfront investment ($500K-$1M+ in infrastructure)
- Increase operational complexity and risk
- Limit ability to iterate on identity graph (changes must be backwards compatible)
- **Only 15% of market actually needs real-time**

**Strategic Question**: Should we build real-time for all use cases or segment by latency requirement?

**Recommendation**: 
- Default to near-real-time (<1s) for new use cases
- Reserve real-time for high-value verticals (AdTech, Fraud)
- Charge appropriate premiums to justify infrastructure costs

---

### Latency-Match Rate Tradeoff

Lower latency often means lower match rates:

**Real-Time Constraints**:
- Must use pre-computed graphs (no dynamic resolution)
- Limited data sources (can't query slow external APIs)
- Cached data may be stale
- **Typical match rate impact: -5-10% vs. batch**

**Batch Flexibility**:
- Can perform iterative resolution (multiple passes)
- Can integrate slower, higher-quality data sources
- Can apply ML models for probabilistic linking
- **Highest match rate potential**

**Client Education**: Some clients request real-time without understanding this tradeoff. Recommend starting with near-real-time or batch to establish baseline performance, then evaluating whether real-time is worth the quality reduction.

---

## Infrastructure Investment Decision Framework

When evaluating latency requirements for a use case:

### Question 1: What's the business outcome?
- If outcome depends on <100ms response (e.g., ad bidding), real-time is required
- If outcome tolerates 1-2 second delay (e.g., web personalization), near-real-time is sufficient
- If outcome is analysis/reporting, batch is appropriate

### Question 2: What's the revenue potential?
- Real-time infrastructure ROI requires >$1M ARR per use case
- Near-real-time infrastructure ROI requires >$250K ARR per use case
- Batch infrastructure ROI requires >$50K ARR per use case

### Question 3: What's the competitive landscape?
- If competitors offer real-time and we don't, we lose deals
- If competitors only offer batch, real-time is overkill
- If we're first-to-market with real-time in a vertical, premium pricing justified

### Question 4: What's the technical maturity?
- Real-time requires Infrastructure maturity score ≥4.0
- Near-real-time requires Infrastructure maturity score ≥3.0
- Batch requires Infrastructure maturity score ≥2.0

---

## Latency SLA Examples

### Real-Time SLA
- **P50**: <50ms
- **P95**: <100ms
- **P99**: <200ms
- **Uptime**: 99.99% (4.38 minutes downtime/month)

### Near-Real-Time SLA
- **P50**: <500ms
- **P95**: <1s
- **P99**: <2s
- **Uptime**: 99.9% (43.8 minutes downtime/month)

### Batch SLA
- **Processing Window**: Complete by 6 AM daily
- **Max Latency**: 24 hours from data ingestion
- **Uptime**: 99.5% (3.6 hours downtime/month)

---

## Migration Paths

### Batch → Near-Real-Time
- **Effort**: Medium (6-8 weeks)
- **Investment**: $100K-$200K in infrastructure
- **Risk**: Low (can run parallel systems)

### Near-Real-Time → Real-Time
- **Effort**: High (12-16 weeks)
- **Investment**: $500K-$1M in infrastructure + edge deployment
- **Risk**: Medium (requires architecture changes)

### Real-Time → Batch
- **Effort**: Low (2-4 weeks)
- **Investment**: Minimal (cost reduction)
- **Risk**: High (perceived quality downgrade, customer churn risk)

**Key Learning**: It's easier to upgrade latency requirements than downgrade them. Default to higher latency (batch/near-real-time) unless client explicitly requires and will pay for real-time.
