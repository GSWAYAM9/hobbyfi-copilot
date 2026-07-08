# HobbyFi Copilot - System Architecture

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Interface                           │
├──────────────────────────┬──────────────────────────────────────┤
│  Browser Demo UI         │    Mobile/External API Clients      │
│  - Vendor dropdown       │    - Mobile apps                    │
│  - Query input           │    - Third-party integrations       │
│  - Results display       │    - Admin dashboards               │
└──────────────┬───────────┴──────────────┬───────────────────────┘
               │                          │
               └──────────────┬───────────┘
                              │
                    ┌─────────▼──────────┐
                    │   HTTP/REST API    │
                    │                    │
                    │ /api/copilot/query │
                    │ /api/vendors       │
                    │ /api/approvals     │
                    └─────────┬──────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
    ┌────────┐          ┌─────────┐         ┌──────────┐
    │  Query │          │  Intent │         │ Security │
    │ Parser │          │ Router  │         │ Guards   │
    └────────┘          └─────────┘         └──────────┘
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              │
                    ┌─────────▼──────────┐
                    │  Query Processor   │
                    │                    │
                    │  - Validates input │
                    │  - Checks limits   │
                    │  - Routes intent   │
                    │  - Executes tools  │
                    └─────────┬──────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
    ┌────────┐          ┌──────────┐         ┌─────────┐
    │ Database│         │ Groq AI  │         │Approval │
    │ Tools  │          │ Analysis │         │Engine   │
    └────────┘          └──────────┘         └─────────┘
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────────────┐
        │                     │                             │
        ▼                     ▼                             ▼
    ┌──────────┐         ┌──────────┐            ┌──────────────┐
    │   Neon   │         │   Groq   │            │ Audit Trail  │
    │PostgreSQL│         │   LLM    │            │ & Approvals  │
    │ Database │         │  Service │            │   Database   │
    └──────────┘         └──────────┘            └──────────────┘
```

## Database Layer

```
┌─────────────────────────────────────────────────────────┐
│                   Neon PostgreSQL                        │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │             vendors                              │   │
│  │  (vendor-1, vendor-2, vendor-3 with stats)       │   │
│  └──────────────────────────────────────────────────┘   │
│                         │                                │
│  ┌──────────────────────┴───────────────────────────┐   │
│  │                                                  │   │
│  ▼                                                  ▼   │
│ ┌────────────────────┐              ┌────────────────┐  │
│ │   vendor_users     │              │   bookings     │  │
│ │  (6 members, 3    │              │  (today's      │  │
│ │   trial + active)  │              │   revenue)     │  │
│ └────────────────────┘              └────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │        approval_requests                         │   │
│  │  (write operations requiring vendor approval)    │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │        audit_logs                                │   │
│  │  (complete trace of all operations)              │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  Indexes:                                                │
│  - idx_vendors_userid                                    │
│  - idx_vendor_users_vendorid                             │
│  - idx_bookings_vendorid, idx_bookings_createdat         │
│  - idx_approval_requests_vendorid, idx_approval_status   │
│  - idx_audit_logs_vendorid, idx_audit_logs_createdat     │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## Query Processing Pipeline

```
User Query Input
       │
       ▼
┌──────────────────────────────┐
│   Input Validation           │
│  - Length check (max 500)    │
│  - Encoding check            │
│  - Sanitize special chars    │
└──────────────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│   Injection Detection        │
│  - SQL patterns              │
│  - Command patterns          │
│  - Encoding attacks          │
└──────────────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│   Rate Limit Check           │
│  - 50 queries/min per vendor │
│  - Tracked in memory         │
└──────────────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│   Intent Classification      │
│                              │
│  Keywords: READ              │
│  - what, list, show, how, get │
│                              │
│  Keywords: WRITE             │
│  - extend, update, add, etc  │
└──────────────────────────────┘
       │
       ├─────────────────────────┐
       │                         │
       ▼ (READ)                  ▼ (WRITE)
┌─────────────────────┐  ┌──────────────────┐
│ Execute Query       │  │ Create Approval  │
│                     │  │ Request          │
│ 1. Fetch Data       │  │                  │
│ 2. AI Analysis      │  │ 1. Validate      │
│ 3. Format Result    │  │ 2. Store in DB   │
│ 4. Log to Audit     │  │ 3. Notify Vendor │
│ 5. Return Response  │  │ 4. Log to Audit  │
└─────────────────────┘  └──────────────────┘
       │                         │
       └─────────────────────────┤
                                 │
                                 ▼
                        ┌─────────────────┐
                        │ Response to User│
                        │ - Status        │
                        │ - Results       │
                        │ - AI Insights   │
                        └─────────────────┘
```

## Data Models

### Vendor Query Flow
```
vendor-1 (Pro Badminton Academy)
    │
    ├─ Query: "What is my revenue today?"
    │   └─ Routes to: READ operation
    │   └─ Fetches: bookings WHERE vendorId='vendor-1' AND date=today
    │   └─ Returns: { revenue: 1000, bookings: 2 }
    │   └─ AI Analysis: "Your revenue is $1000 from 2 bookings..."
    │
    └─ Query: "Extend Arjun's membership"
        └─ Routes to: WRITE operation
        └─ Creates: approval_request
        └─ Status: PENDING vendor approval
        └─ Notifies: Vendor to approve/reject
```

### Member Status Flow
```
Arjun Kumar (vendor-1, active member)
    ├─ Status: active
    ├─ Membership Expires: 2024-12-31
    ├─ Query availability: "How many active members?"
    │   └─ Returns: COUNT(users WHERE status='active') = 1
    │
    └─ Update request: "Extend by 30 days"
        ├─ Creates approval_request
        ├─ Proposed change: expires 2025-01-30
        ├─ Status: PENDING approval
        ├─ On approval: Update membershipExpiresAt
        └─ Audit log: Records action, approver, timestamp
```

## Security Layers

```
┌─────────────────────────────────────────────────────┐
│                  Incoming Request                    │
└─────────────────────┬───────────────────────────────┘
                      │
        ┌─────────────▼─────────────┐
        │  Layer 1: Input Validation │
        │  - Length limits           │
        │  - Character encoding      │
        │  - Null byte detection     │
        └─────────────┬─────────────┘
                      │
        ┌─────────────▼─────────────┐
        │  Layer 2: Injection Guards │
        │  - SQL patterns            │
        │  - Command injection       │
        │  - Regex patterns          │
        └─────────────┬─────────────┘
                      │
        ┌─────────────▼─────────────┐
        │  Layer 3: Rate Limiting    │
        │  - Per-vendor tracking     │
        │  - Time-window based       │
        │  - Graceful rejection      │
        └─────────────┬─────────────┘
                      │
        ┌─────────────▼─────────────┐
        │  Layer 4: Parameterization │
        │  - Drizzle ORM prevents    │
        │  - SQL injection           │
        │  - Type-safe queries       │
        └─────────────┬─────────────┘
                      │
        ┌─────────────▼─────────────┐
        │  Layer 5: Data Scoping     │
        │  - Query filtered by       │
        │  - vendorId parameter      │
        │  - No cross-vendor access  │
        └─────────────┬─────────────┘
                      │
        ┌─────────────▼─────────────┐
        │  Layer 6: Audit Logging    │
        │  - All queries logged      │
        │  - Results captured        │
        │  - Complete traceability   │
        └─────────────┬─────────────┘
                      │
        ┌─────────────▼─────────────┐
        │  Response to Client        │
        │  (Fully secured)           │
        └───────────────────────────┘
```

## Component Interaction Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      Application Layer                      │
│                                                              │
│  ┌────────────────┐  ┌──────────────┐  ┌────────────────┐  │
│  │  Demo UI Page  │  │ Query Router │  │  API Endpoint  │  │
│  │                │  │              │  │                │  │
│  │ - Vendor list  │  │ Classifies   │  │ REST interface │  │
│  │ - Input field  │  │ intent       │  │ for clients    │  │
│  │ - Results view │  │              │  │                │  │
│  └────────┬───────┘  └──────┬───────┘  └────────┬───────┘  │
│           │                 │                    │          │
│           └─────────────────┼────────────────────┘          │
│                             │                               │
│                    ┌────────▼─────────┐                     │
│                    │  Copilot Engine  │                     │
│                    │                  │                     │
│                    │ - Validates      │                     │
│                    │ - Routes intent  │                     │
│                    │ - Executes tools │                     │
│                    │ - Logs results   │                     │
│                    └────────┬─────────┘                     │
└────────────────────────────┼──────────────────────────────┘
                             │
            ┌────────────────┼────────────────┐
            │                │                │
            ▼                ▼                ▼
    ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
    │ DB Services  │  │  AI Service  │  │ Approval Eng │
    │              │  │              │  │              │
    │ - Vendors    │  │ - Groq API   │  │ - Creates    │
    │ - Users      │  │ - Analysis   │  │ - Tracks     │
    │ - Bookings   │  │ - Formatting │  │ - Notifies   │
    │ - Audits     │  │              │  │              │
    └──────┬───────┘  └──────┬───────┘  └──────┬───────┘
           │                 │                  │
           ▼                 ▼                  ▼
    ┌──────────────────────────────────────────────────┐
    │         External Services / Data                 │
    │                                                   │
    │  - Neon PostgreSQL (Database)                    │
    │  - Groq LLM (AI Analysis)                        │
    │  - Email Service (Notifications)                 │
    │  - Analytics Service (Metrics)                   │
    └──────────────────────────────────────────────────┘
```

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      Vercel Edge                         │
│                  (Running Next.js 16)                    │
│                                                          │
│  ┌───────────────────────────────────────────────────┐  │
│  │  API Routes (/api/copilot/*)                      │  │
│  │  - Handle HTTP requests                           │  │
│  │  - Process queries                                │  │
│  │  - Return JSON responses                          │  │
│  └─────────────────────┬─────────────────────────────┘  │
│                        │                                 │
│  ┌─────────────────────▼─────────────────────────────┐  │
│  │  Server Actions & Library Code                    │  │
│  │  - Copilot Engine                                 │  │
│  │  - Database Services                              │  │
│  │  - AI Client                                      │  │
│  └─────────────────────┬─────────────────────────────┘  │
└────────────────────────┼──────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
    ┌────────────┐  ┌──────────┐   ┌──────────┐
    │  Neon      │  │  Groq    │   │ Vercel   │
    │ PostgreSQL │  │   LLM    │   │  KV      │
    │            │  │  (Cloud) │   │ (Cache)  │
    │ - Tables   │  │          │   │          │
    │ - Indexes  │  │  Llama   │   │ - Limits │
    │ - Pooling  │  │  3.1-8b  │   │ - Metrics│
    └────────────┘  └──────────┘   └──────────┘
```

## Performance Metrics Flow

```
Query Received
    │
    ├─ t0: Request arrives (0ms)
    │
    ├─ t1: Validation (1-2ms)
    │  - Input checks
    │  - Injection detection
    │
    ├─ t2: Rate limit check (0.1ms)
    │  - In-memory lookup
    │
    ├─ t3: Intent classification (1-2ms)
    │  - Regex matching
    │
    ├─ t4: Database query (10-50ms)
    │  - Neon PostgreSQL
    │  - Indexed lookup
    │
    ├─ t5: AI Analysis (1000-3000ms)
    │  - Groq API call
    │  - LLM inference
    │
    ├─ t6: Formatting (5-10ms)
    │  - JSON serialization
    │
    ├─ t7: Audit logging (10-20ms)
    │  - Database insert
    │
    └─ t8: Response (1500-3100ms total)
       - User receives result
```

## Example Request Flow

```
Browser Request:
"What is my revenue today?" from vendor-1

1. HTTP POST /api/copilot/query
   { vendorId: "vendor-1", query: "..." }

2. Next.js API Route Handler
   - Receives request
   - Calls processQuery()

3. Copilot Engine
   - Validates input ✓
   - Checks rate limit ✓
   - Routes intent → READ

4. Query Processor
   - Identifies: Revenue data needed
   - Prepares SQL: bookings WHERE vendorId='vendor-1' AND date=today
   - Executes via Drizzle ORM

5. Database Query
   - Neon PostgreSQL
   - Returns: 2 bookings, ₹1000 revenue

6. AI Analysis
   - Groq API call
   - LLM generates insights
   - Returns: "Your revenue for today is $1000..."

7. Audit Logging
   - Inserts record with: query, result, timestamp
   - Logs success status

8. Response to Client
   - JSON: {
       intent: "read",
       result: { revenue: 1000, ... },
       aiInsights: "..."
     }

9. Browser Display
   - Renders results
   - Shows AI badge
   - Displays Groq model info
```

## Scalability Considerations

```
Current Setup:
├─ Database connections: 10 (Neon pool)
├─ Queries per minute: 50 (per vendor)
├─ Query latency: 1.5-3.5s
└─ Concurrent requests: Limited by pool

Future Scaling:
├─ Increase pool size (up to 50 connections)
├─ Implement query caching
├─ Add read replicas for reports
├─ Use CDN for static assets
└─ Implement rate limiting tiers
```

---

**Status:** Production Deployment Ready
**Last Updated:** 2024-07-08
