# HobbyFi Copilot - Complete Guide

## Overview

The HobbyFi Copilot is an AI-powered assistant that helps hobby business owners (vendors) query their business data and manage operations. It supports both read operations (queries) and write operations (with approval workflows).

**Technology Stack:**
- Database: Neon PostgreSQL
- AI: Groq LLM (llama-3.1-8b-instant)
- Backend: Next.js 16 with Server Actions
- ORM: Drizzle ORM

---

## Database Schema

### Vendors Table (`vendors`)
Stores information about hobby business owners.

| Field | Type | Description |
|-------|------|-------------|
| `id` | TEXT (PK) | Unique vendor identifier (e.g., `vendor-1`) |
| `userId` | TEXT | Owner's user account ID |
| `name` | TEXT | Business name (e.g., "Pro Badminton Academy") |
| `email` | TEXT | Business email |
| `city` | TEXT | Business location (e.g., "Mumbai") |
| `hobby` | TEXT | Sport/hobby type (e.g., "Badminton", "Yoga", "Cricket") |
| `totalMembers` | INTEGER | Total members count |
| `activeMembers` | INTEGER | Currently active members |
| `monthlyRevenue` | NUMERIC(10,2) | Monthly revenue in rupees |
| `createdAt` | TIMESTAMP | Account creation date |
| `updatedAt` | TIMESTAMP | Last update date |

**Sample Data:**
```
vendor-1: Pro Badminton Academy, Mumbai, 45 members, ₹75,000/month
vendor-2: Yoga Masters Studio, Bangalore, 60 members, ₹95,000/month
vendor-3: Cricket Elite Club, Delhi, 80 members, ₹125,000/month
```

### Vendor Users Table (`vendor_users`)
Stores member information for each vendor.

| Field | Type | Description |
|-------|------|-------------|
| `id` | SERIAL (PK) | Auto-incremented ID |
| `vendorId` | TEXT (FK) | Reference to vendor |
| `name` | TEXT | Member name |
| `email` | TEXT | Member email |
| `status` | TEXT | 'trial', 'active', or 'inactive' |
| `trialExpiresAt` | TIMESTAMP | Trial expiration date (if applicable) |
| `membershipExpiresAt` | TIMESTAMP | Membership expiration date |
| `joinedAt` | TIMESTAMP | Date member joined |
| `createdAt` | TIMESTAMP | Record creation date |

**Sample Data:**
```
vendor-1 users:
  - Arjun Kumar (active, expires: 2024-12-31)
  - Priya Singh (trial, expires: 2024-08-15)
  - Rohit Patel (trial, expires: 2024-08-20)

vendor-2 users:
  - Meera Sharma (active, expires: 2024-11-30)
  - Ananya Das (trial, expires: 2024-07-31)

vendor-3 users:
  - Vikram Singh (active, expires: 2024-10-15)
```

### Bookings Table (`bookings`)
Records sessions/bookings for revenue tracking.

| Field | Type | Description |
|-------|------|-------------|
| `id` | SERIAL (PK) | Auto-incremented ID |
| `vendorId` | TEXT (FK) | Reference to vendor |
| `userId` | INTEGER (FK) | Reference to member |
| `courtName` | TEXT | Venue name (e.g., "Court A", "Studio 1") |
| `startTime` | TIMESTAMP | Session start time |
| `endTime` | TIMESTAMP | Session end time |
| `amount` | NUMERIC(10,2) | Booking amount |
| `status` | TEXT | 'confirmed', 'completed', or 'cancelled' |
| `createdAt` | TIMESTAMP | Booking creation date |

**Sample Data:**
```
Today's bookings (2024-07-08):
  - vendor-1, user-1: Court A, 2 hours, ₹500 (completed)
  - vendor-1, user-2: Court B, 2 hours, ₹500 (completed)
  - vendor-2, user-4: Studio 1, 1 hour, ₹1,000 (completed)
  - vendor-3, user-6: Ground 1, 2 hours, ₹1,500 (completed)
```

### Approval Requests Table (`approval_requests`)
Tracks pending write operations requiring vendor approval.

| Field | Type | Description |
|-------|------|-------------|
| `id` | TEXT (PK) | Unique request ID (UUID) |
| `vendorId` | TEXT (FK) | Requesting vendor |
| `type` | TEXT | 'extend_membership', 'trial_extension', 'user_update' |
| `description` | TEXT | Original query/request |
| `targetUserId` | INTEGER | User affected by this request |
| `proposedChanges` | JSONB | Proposed changes (extensible) |
| `status` | TEXT | 'pending', 'approved', or 'rejected' |
| `approvedBy` | TEXT | Admin who approved |
| `approvedAt` | TIMESTAMP | Approval timestamp |
| `createdAt` | TIMESTAMP | Request creation date |

### Audit Logs Table (`audit_logs`)
Complete audit trail of all queries and actions.

| Field | Type | Description |
|-------|------|-------------|
| `id` | SERIAL (PK) | Auto-incremented ID |
| `vendorId` | TEXT (FK) | Vendor who made the request |
| `action` | TEXT | 'query', 'update', 'delete', or 'approval' |
| `query` | TEXT | Original query text |
| `result` | JSONB | Query result or error |
| `metadata` | JSONB | Additional context (intent, status, etc.) |
| `createdAt` | TIMESTAMP | Action timestamp |

---

## API Endpoints

### Query Endpoint
```
POST /api/copilot/query
Content-Type: application/json

{
  "vendorId": "vendor-1",
  "query": "What is my revenue today?"
}
```

**Response (Read Operation):**
```json
{
  "intent": "read",
  "result": {
    "date": "2024-07-08",
    "revenue": 1000,
    "bookings": 2,
    "vendorName": "Pro Badminton Academy",
    "aiInsights": "According to the provided data, your revenue for today is $1000..."
  },
  "requiresApproval": false,
  "_metadata": {
    "database": "Neon PostgreSQL",
    "dbConfigured": true,
    "aiModel": "groq/llama-3.1-8b-instant",
    "aiConfigured": true
  }
}
```

**Response (Write Operation - Approval Required):**
```json
{
  "intent": "write",
  "action": "extend_membership",
  "approvalId": "req-uuid-1234",
  "message": "Membership extension request created. Pending vendor approval.",
  "requiresApproval": true,
  "proposedChanges": {
    "userId": 1,
    "action": "extend_membership"
  }
}
```

---

## Query Examples

### Read Operations (Instant Results with AI Analysis)

#### Query: Revenue Information
```
User: "What is my revenue today?"
Response:
{
  "date": "2024-07-08",
  "revenue": 1000,
  "bookings": 2
}
AI Analysis: "Based on today's data, you've had 2 bookings generating ₹1000 in revenue..."
```

#### Query: Member List
```
User: "List all my users"
Response:
{
  "totalMembers": 3,
  "activeMembers": 1,
  "trialMembers": 2,
  "users": [
    { "name": "Arjun Kumar", "status": "active", "expiresAt": "2024-12-31" },
    { "name": "Priya Singh", "status": "trial", "expiresAt": "2024-08-15" },
    { "name": "Rohit Patel", "status": "trial", "expiresAt": "2024-08-20" }
  ]
}
AI Analysis: "You have 3 total members with 1 active member and 2 trial members..."
```

#### Query: Trial Users by Sport
```
User: "List trial users of badminton"
Response:
{
  "sport": "Badminton",
  "trialCount": 2,
  "users": [
    { "name": "Priya Singh", "email": "priya@email.com", "expiresAt": "2024-08-15" },
    { "name": "Rohit Patel", "email": "rohit@email.com", "expiresAt": "2024-08-20" }
  ]
}
AI Analysis: "Your badminton program has 2 trial members expiring soon..."
```

#### Query: Active Members Count
```
User: "How many active members do I have?"
Response:
{
  "activeMembers": 1,
  "percentage": "33%"
}
AI Analysis: "You currently have 1 active member out of 3 total members (33%)..."
```

#### Query: Booking History
```
User: "Show all my bookings"
Response:
{
  "totalBookings": 4,
  "completedBookings": 4,
  "completedRevenue": 3500,
  "bookings": [
    { "date": "2024-07-08", "member": "Arjun Kumar", "court": "Court A", "amount": 500 },
    { "date": "2024-07-08", "member": "Priya Singh", "court": "Court B", "amount": 500 },
    { "date": "2024-07-08", "member": "Meera Sharma", "court": "Studio 1", "amount": 1000 },
    { "date": "2024-07-08", "member": "Vikram Singh", "court": "Ground 1", "amount": 1500 }
  ]
}
AI Analysis: "You have completed 4 bookings totaling ₹3,500 in revenue..."
```

### Write Operations (Require Vendor Approval)

#### Operation: Extend Membership
```
User: "Extend Arjun's membership by 30 days"
Response:
{
  "intent": "write",
  "action": "extend_membership",
  "approvalId": "req-ext-001",
  "message": "Approval request created",
  "proposedChanges": {
    "userId": 1,
    "userName": "Arjun Kumar",
    "currentExpiry": "2024-12-31",
    "newExpiry": "2025-01-30",
    "days": 30
  }
}
Status: PENDING APPROVAL
```

#### Operation: Extend Trial
```
User: "Increase Priya's trial by 7 days"
Response:
{
  "intent": "write",
  "action": "extend_trial",
  "approvalId": "req-trial-001",
  "message": "Trial extension request created",
  "proposedChanges": {
    "userId": 2,
    "userName": "Priya Singh",
    "currentExpiry": "2024-08-15",
    "newExpiry": "2024-08-22",
    "days": 7
  }
}
Status: PENDING APPROVAL
```

#### Operation: User Status Update
```
User: "Update Rohit's status to active"
Response:
{
  "intent": "write",
  "action": "generic_update",
  "approvalId": "req-update-001",
  "message": "User update request created",
  "proposedChanges": {
    "userId": 3,
    "userName": "Rohit Patel",
    "currentStatus": "trial",
    "newStatus": "active"
  }
}
Status: PENDING APPROVAL
```

---

## Security Features

### Input Validation
- Maximum query length: 500 characters
- Injection pattern detection (blocks SQL injection attempts)
- Query sanitization

### Rate Limiting
- 50 queries per minute per vendor
- Prevents abuse and overload

### Approval Workflows
- All write operations require explicit vendor approval
- Change tracking with proposed changes stored
- Audit trail of who approved what and when

### Data Isolation
- All queries scoped to specific vendor
- No cross-vendor data leakage
- Per-user access control

### Audit Logging
- Every query logged with timestamp
- Result and metadata captured
- Action type tracked (query, update, delete, approval)

---

## Intent Routing

The copilot automatically classifies queries into READ or WRITE operations:

### READ Operations (Instant Execution)
- Revenue queries
- Member listing
- User status checks
- Booking history
- Statistics and counts

**Keywords:** "what", "list", "show", "how many", "get", "find"

### WRITE Operations (Require Approval)
- Membership extensions
- Trial period updates
- User status changes
- Profile modifications
- Cancellations or deletions

**Keywords:** "extend", "update", "add", "increase", "modify", "change", "refund", "cancel"

---

## Implementation Details

### Query Processing Flow

```
User Query
    ↓
Input Validation
    ↓
Rate Limit Check
    ↓
Intent Classification
    ├─ READ
    │  ├─ Fetch Data from Database
    │  ├─ AI Analysis with Groq
    │  └─ Log to Audit Trail
    │
    └─ WRITE
       ├─ Create Approval Request
       └─ Notify Vendor for Approval
```

### Technology Stack per Component

| Component | Technology | Details |
|-----------|-----------|---------|
| Database | Neon PostgreSQL | Serverless, scales automatically |
| Query Engine | Drizzle ORM | Type-safe queries, parameterized |
| AI Analysis | Groq (llama-3.1-8b-instant) | Fast inference, cost-effective |
| Backend | Next.js 16 | API routes for query processing |
| Cache | In-memory (guardrails) | Rate limiting and injection detection |

---

## Performance Metrics

- Database query latency: 10-50ms (indexed queries)
- Groq AI response time: 1-3 seconds
- Total query latency: 1.5-3.5 seconds
- Throughput: 50+ queries per minute
- Connection pool size: 10 concurrent connections

---

## Error Handling

### Database Errors
```json
{
  "error": "Vendor not found",
  "intent": "read",
  "requiresApproval": false
}
```

### Rate Limit Exceeded
```json
{
  "error": "Rate limit exceeded (50 queries/minute)",
  "intent": "read",
  "requiresApproval": false
}
```

### Injection Detection
```json
{
  "error": "Invalid query: potential injection detected",
  "intent": "read",
  "requiresApproval": false
}
```

### AI Analysis Fallback
```json
{
  "result": { ... },
  "aiInsights": null,
  "note": "AI analysis unavailable, returning raw data"
}
```

---

## Environment Variables

```
DATABASE_URL=postgresql://...     # Neon connection string
GROQ_API_KEY=gsk_...              # Groq API key for LLM
BETTER_AUTH_SECRET=...             # Auth secret (optional)
```

---

## Testing the Copilot

### Via Browser UI
```
1. Open: http://localhost:3000/demo
2. Select vendor from dropdown
3. Type query: "What is my revenue today?"
4. Click submit
5. See real-time response with AI analysis
```

### Via API
```bash
curl -X POST http://localhost:3000/api/copilot/query \
  -H "Content-Type: application/json" \
  -d '{
    "vendorId": "vendor-1",
    "query": "List trial users of badminton"
  }'
```

---

## Future Enhancements

- Multi-language support
- Advanced analytics and reporting
- Predictive insights (churn analysis, revenue forecasting)
- Integration with payment gateways
- Email notifications for approvals
- Dashboard for approval management
