# HobbyFi Copilot - Complete Mock Data Schema

## Overview

All mock data is now **visible on the website** at `/mock-data` page. You can access it from:
- Demo page → Click "View Mock Data" button
- Direct URL: `http://localhost:3000/mock-data`

---

## 📋 VENDORS TABLE (3 vendors)

| Field | vendor_1 | vendor_2 | vendor_3 |
|-------|----------|----------|----------|
| **ID** | `vendor_1` | `vendor_2` | `vendor_3` |
| **Name** | Smash Arena | Cricket Connect | Tennis Pro |
| **Sport** | Badminton | Cricket | Tennis |
| **Email** | contact@smasharena.com | info@cricketconnect.com | hello@tennispro.com |
| **Location** | Bangalore, India | Mumbai, India | New Delhi, India |
| **City** | Bangalore | Mumbai | New Delhi |
| **Members** | 245 | 180 | 156 |
| **Monthly Revenue** | ₹125,000 | ₹98,000 | ₹87,500 |
| **Trial Users** | 32 | 28 | 22 |

### TypeScript Schema:
```typescript
interface Vendor {
  id: string                    // Unique vendor ID (e.g., vendor_1)
  name: string                  // Business name
  sport: string                 // Sport offered
  email: string                 // Contact email
  location: string              // Full location with country
  city: string                  // City name
  membershipCount: number       // Total active members
  monthlyRevenue: number        // Monthly revenue in rupees
  trialUsersCount: number       // Number of trial users
}
```

---

## 👥 USERS TABLE (5 members for vendor_1)

| Field | Arjun | Priya | Rahul | Kavya | Siddharth |
|-------|-------|-------|-------|-------|-----------|
| **ID** | `user_1` | `user_2` | `user_3` | `user_4` | `user_5` |
| **Name** | Arjun Mehta | Priya Sharma | Rahul Nair | Kavya Reddy | Siddharth Joshi |
| **Email** | arjun.mehta@email.com | priya.sharma@email.com | rahul.nair@email.com | kavya.reddy@email.com | siddharth.j@email.com |
| **Sport** | Badminton | Badminton | Badminton | Badminton | Badminton |
| **Status** | active | **trial** | active | **trial** | **inactive** |
| **Membership** | +30 days | +60 days | +15 days | +30 days | ❌ Expired |
| **Trial Expiry** | ❌ Expired | +5 days | ❌ Expired | +2 days | ❌ Expired |
| **Joined** | 2024-01-15 | 2024-06-20 | 2024-02-10 | 2024-07-01 | 2023-12-01 |

### TypeScript Schema:
```typescript
interface User {
  id: string                    // Unique user ID (e.g., user_1)
  vendorId: string              // Associated vendor
  name: string                  // Full name
  email: string                 // Email address
  sport: string                 // Sport they're registered for
  status: 'active' | 'trial' | 'inactive'  // Member status
  membershipExpiry: Date        // When membership expires
  trialExpiresAt: Date          // When trial expires
  joinedAt: Date                // Date joined
}
```

### Member Statistics for vendor_1:
- **Active Members:** 2 (Arjun Mehta, Rahul Nair)
- **Trial Members:** 2 (Priya Sharma, Kavya Reddy)
- **Inactive Members:** 1 (Siddharth Joshi)
- **Total Members:** 5

---

## 📅 BOOKINGS TABLE (5 bookings today)

| Booking | User | Court | Time | Amount | Status |
|---------|------|-------|------|--------|--------|
| `booking_1` | Arjun Mehta | Court A | 6:00 PM - 7:00 PM | ₹500 | ✅ Confirmed |
| `booking_2` | Priya Sharma | Court B | 7:30 PM - 8:30 PM | ₹500 | ✅ Confirmed |
| `booking_3` | Rahul Nair | Court C | 4:00 PM - 5:00 PM | ₹500 | ✅ Completed |
| `booking_4` | Kavya Reddy | Court A | 2:00 PM - 3:00 PM | ₹500 | ✅ Completed |
| `booking_5` | Arjun Mehta | Court B | Yesterday 5:00 PM - 6:00 PM | ₹500 | ✅ Completed |

### TypeScript Schema:
```typescript
interface Booking {
  id: string                    // Unique booking ID
  userId: string                // User who booked
  vendorId: string              // Vendor/Business
  court: string                 // Court/Facility name
  startTime: Date               // Booking start time
  endTime: Date                 // Booking end time
  amount: number                // Booking amount in rupees
  status: 'confirmed' | 'completed' | 'cancelled'  // Booking status
}
```

### Revenue Calculation:
- **Today's Total Revenue:** ₹2,500 (5 bookings × ₹500)
- **Confirmed Bookings:** 2 (₹1,000)
- **Completed Bookings:** 3 (₹1,500)

---

## ✅ APPROVAL REQUESTS TABLE (Dynamic)

| Field | approval_1 | approval_2 |
|-------|-----------|-----------|
| **ID** | `approval_1` | `approval_2` |
| **Action** | EXTEND MEMBERSHIP | EXTEND TRIAL |
| **Target User** | Arjun Mehta | Priya Sharma |
| **Change** | Extend membership by 30 days | Extend trial by 7 days |
| **Status** | ⏳ Pending | ⏳ Pending |
| **Created** | 2024-07-08 10:30 AM | 2024-07-08 11:15 AM |

### TypeScript Schema:
```typescript
interface ApprovalRequest {
  id: string                    // Unique approval request ID
  vendorId: string              // Vendor requesting approval
  action: string                // Action type (extend_membership, extend_trial, etc.)
  targetUserId: string          // User affected
  proposedChanges: Record<string, any>  // What will change
  status: 'pending' | 'approved' | 'rejected'  // Current status
  createdAt: Date               // Request creation time
  approvedAt?: Date             // When it was approved (if applicable)
  approverNotes?: string        // Notes from approver
}
```

---

## 📊 AUDIT LOGS TABLE (Complete History)

All operations are logged with:
- **Timestamp** - When the action occurred
- **Vendor ID** - Which vendor performed it
- **Action Type** - What was done (query, approval, etc.)
- **Query Text** - The actual query or request
- **Results** - What was returned/affected
- **Status** - Success or failure
- **Metadata** - Additional context

### TypeScript Schema:
```typescript
interface AuditLog {
  id: string                    // Unique log ID
  vendorId: string              // Vendor who performed action
  action: string                // Action name
  query: string                 // Original query/request
  result: Record<string, any>   // What happened
  status: 'success' | 'failed'  // Result status
  timestamp: Date               // When it occurred
  metadata?: Record<string, any>  // Additional info
}
```

---

## 🔍 How the Copilot Uses This Data

### Read Operations (Instant Results + AI Analysis)

**Query:** `"What is my revenue today?"`
- Filters: `vendor_id = vendor_1 AND date = today`
- Source: `bookings` table
- Result: Shows ₹2,500 from 5 bookings
- AI Analysis: "Your revenue today is ₹2,500 from 5 confirmed bookings..."

**Query:** `"List trial users of badminton"`
- Filters: `vendor_id = vendor_1 AND status = 'trial' AND sport = 'Badminton'`
- Source: `users` table
- Result: Shows Priya Sharma (trial expires +5 days), Kavya Reddy (trial expires +2 days)
- AI Analysis: "You have 2 trial members in Badminton..."

**Query:** `"How many active members do I have?"`
- Filters: `vendor_id = vendor_1 AND status = 'active'`
- Source: `users` table
- Result: Shows count = 2
- AI Analysis: "You currently have 2 active members..."

### Write Operations (Approval Required)

**Query:** `"Extend Arjun's membership by 30 days"`
- Creates: New `approval_request`
- Status: `pending`
- On Approval: Updates `users.membershipExpiry`
- Logs: Records in `audit_logs`

**Query:** `"Extend Priya's trial by 7 days"`
- Creates: New `approval_request`
- Status: `pending`
- On Approval: Updates `users.trialExpiresAt`
- Logs: Records in `audit_logs`

---

## 🎯 Supported Query Patterns

### Revenue & Financial
- "What is my revenue today?"
- "How much did I earn this month?"
- "Show me my bookings"
- "What's my average booking amount?"

### Members & Users
- "List trial users of badminton"
- "How many active members do I have?"
- "Show inactive members"
- "List all my users"
- "Who are the newest members?"

### Write Operations
- "Extend [user] membership by [days]"
- "Extend [user] trial by [days]"
- "Update [user] to active status"
- "Mark [user] as inactive"

---

## 🔗 Accessing the Mock Data

### On the Website:

1. **From Demo Page:**
   - Go to: http://localhost:3000/demo
   - Click: "View Mock Data" button
   - Redirects to: http://localhost:3000/mock-data

2. **Direct URL:**
   - Visit: http://localhost:3000/mock-data
   - Shows complete schema with all data

3. **Features:**
   - ✓ Interactive tables with sorting
   - ✓ Color-coded status badges
   - ✓ Easy navigation between sections
   - ✓ Back to Demo link
   - ✓ Shows how copilot uses each data source

---

## 📝 Data Relationships

```
Vendor (3)
├─ Users (5 per vendor)
│  ├─ Bookings (multiple per user)
│  └─ Approval Requests (pending actions)
│
├─ Bookings (generates revenue)
│
├─ Approval Requests (for write operations)
│
└─ Audit Logs (tracks all actions)
```

---

## 🚀 Testing Queries

Try these queries in the Copilot:

**Read Operations:**
1. `"What is my revenue today?"` → Returns ₹2,500 + AI
2. `"List trial users"` → Returns Priya, Kavya + AI
3. `"How many active members?"` → Returns 2 + AI
4. `"Show all my users"` → Returns all 5 + AI

**Write Operations:**
1. `"Extend Priya trial by 7 days"` → Creates approval
2. `"Extend Arjun membership by 30 days"` → Creates approval

---

## ✨ Key Features

✓ **Real Data:** All visible on `/mock-data` page
✓ **Type-Safe:** TypeScript interfaces defined
✓ **Comprehensive:** 5 data tables with relationships
✓ **Interactive:** Website displays all data
✓ **Filterable:** Copilot filters based on queries
✓ **Auditable:** All operations logged
✓ **Scalable:** Can add more vendors/users/bookings

---

## 📌 Summary

- **3 Vendors** with different sports and metrics
- **5 Users** in varying membership states
- **5 Bookings** generating revenue data
- **2 Approval Requests** pending action
- **Complete Audit Trail** for all operations
- **Website Page** to view all mock data
- **AI-Powered Analysis** on all queries

All data is visible, structured, and ready for the copilot to use!
