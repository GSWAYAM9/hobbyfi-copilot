import { mockUsers, mockBookings, mockVendors, addApprovalRequest, addAuditLog } from './mock-data'
import { v4 as uuidv4 } from 'uuid'
import { ApprovalRequest, QueryResult, User } from './types'

// ============ GUARDRAILS ============

export const guardrails = {
  // Detect common injection patterns
  detectInjection(query: string): boolean {
    const suspiciousPatterns = [
      /(\bDROP\b|\bDELETE\b|\bTRUNCATE\b|\bINSERT\b.*INTO\b|\bUPDATE\b|\bALTER\b)/i,
      /(<script|javascript:|onerror|onclick)/i,
      /(\bOR\b\s+\d+\s*=\s*\d+)/i,
      /(--|;|\/\*|\*\/)/,
    ]
    return suspiciousPatterns.some((pattern) => pattern.test(query))
  },

  // Check rate limiting (simple implementation)
  checkRateLimit(vendorId: string): boolean {
    const RATE_LIMIT = 50 // queries per minute
    // In production, use Redis
    return true
  },

  // Redact PII from output
  redactPII(text: string): string {
    return text
      .replace(/[\w\.-]+@[\w\.-]+\.\w+/g, '[EMAIL]')
      .replace(/\d{10}/g, '[PHONE]')
  },

  // Validate input
  validateInput(query: string): { valid: boolean; error?: string } {
    if (!query || query.trim().length === 0) {
      return { valid: false, error: 'Query cannot be empty' }
    }
    if (query.length > 500) {
      return { valid: false, error: 'Query too long (max 500 chars)' }
    }
    if (this.detectInjection(query)) {
      return { valid: false, error: 'Suspicious query pattern detected' }
    }
    return { valid: true }
  },
}

// ============ INTENT ROUTER ============

export function routeIntent(query: string): {
  intent: 'read' | 'write'
  action?: string
  entities?: Record<string, any>
} {
  const lowerQuery = query.toLowerCase()

  // Write operations
  if (
    /extend|update.*membership|add.*trial|increase.*trial|refund|cancel.*booking/.test(
      lowerQuery
    )
  ) {
    if (/(extend|update).*membership|add.*trial|increase.*trial/.test(lowerQuery)) {
      return { intent: 'write', action: 'extend_membership' }
    }
    if (/cancel.*booking/.test(lowerQuery)) {
      return { intent: 'write', action: 'cancel_booking' }
    }
    if (/refund/.test(lowerQuery)) {
      return { intent: 'write', action: 'refund' }
    }
  }

  // Read operations
  return { intent: 'read', action: 'query' }
}

// ============ TOOLS ============

export const tools = {
  // SQL Query Tool (simulated)
  sqlQuery(vendorId: string, query: string): any {
    const vendor = mockVendors.find((v) => v.id === vendorId)
    if (!vendor) return { error: 'Vendor not found' }

    const lowerQuery = query.toLowerCase()

    // Revenue queries
    if (/revenue|income|earnings/.test(lowerQuery)) {
      if (/today|today's/.test(lowerQuery)) {
        // Calculate today's revenue from bookings
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const todayBookings = mockBookings.filter((b) => {
          const bookingDate = new Date(b.startTime)
          bookingDate.setHours(0, 0, 0, 0)
          return bookingDate.getTime() === today.getTime() && b.status === 'completed'
        })
        const revenue = todayBookings.reduce((sum, b) => sum + b.amount, 0)
        return {
          date: today.toLocaleDateString(),
          revenue,
          bookings: todayBookings.length,
        }
      }
      return { monthlyRevenue: vendor.monthlyRevenue }
    }

    // User/Trial queries
    if (/trial|users/.test(lowerQuery)) {
      if (/trial.*users|trial.*members/.test(lowerQuery)) {
        const trialUsers = mockUsers.filter(
          (u) => u.vendorId === vendorId && u.status === 'trial'
        )
        return {
          count: trialUsers.length,
          users: trialUsers.map((u) => ({ name: u.name, email: u.email })),
        }
      }
      if (/active.*users/.test(lowerQuery)) {
        const activeUsers = mockUsers.filter(
          (u) => u.vendorId === vendorId && u.status === 'active'
        )
        return {
          count: activeUsers.length,
          users: activeUsers.map((u) => ({ name: u.name, email: u.email })),
        }
      }
    }

    // Booking queries
    if (/booking/.test(lowerQuery)) {
      const vendorBookings = mockBookings.filter((b) => b.vendorId === vendorId)
      if (/today.*booking|today's.*booking/.test(lowerQuery)) {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const todayBookings = vendorBookings.filter((b) => {
          const bookingDate = new Date(b.startTime)
          bookingDate.setHours(0, 0, 0, 0)
          return bookingDate.getTime() === today.getTime()
        })
        return {
          count: todayBookings.length,
          bookings: todayBookings.map((b) => ({
            court: b.courtName,
            time: b.startTime.toLocaleTimeString(),
            status: b.status,
          })),
        }
      }
      return { totalBookings: vendorBookings.length }
    }

    // General vendor info
    if (/membership|member/.test(lowerQuery)) {
      return { membershipCount: vendor.membershipCount }
    }

    return { message: 'Query processed' }
  },

  // Analytics Tool
  analyticsQuery(vendorId: string, metric: string): any {
    const vendor = mockVendors.find((v) => v.id === vendorId)
    if (!vendor) return { error: 'Vendor not found' }

    const vendorBookings = mockBookings.filter((b) => b.vendorId === vendorId)
    const vendorUsers = mockUsers.filter((u) => u.vendorId === vendorId)

    return {
      membershipCount: vendor.membershipCount,
      trialUsersCount: vendor.trialUsersCount,
      activeUsers: vendorUsers.filter((u) => u.status === 'active').length,
      totalBookings: vendorBookings.length,
      completedBookings: vendorBookings.filter((b) => b.status === 'completed').length,
      monthlyRevenue: vendor.monthlyRevenue,
    }
  },

  // Knowledge Tool
  knowledgeLookup(query: string): any {
    const knowledge: Record<string, any> = {
      membership_duration: '30 days per membership',
      trial_duration: '7 days for new users',
      refund_policy: 'Full refund within 24 hours of booking cancellation',
      max_bookings: 'Unlimited bookings per month',
      cities: ['Bangalore', 'Mumbai', 'New Delhi', 'Hyderabad', 'Chennai'],
      sports: ['Badminton', 'Cricket', 'Tennis', 'Basketball', 'Swimming'],
    }

    for (const [key, value] of Object.entries(knowledge)) {
      if (query.toLowerCase().includes(key.replace('_', ' '))) {
        return { [key]: value }
      }
    }
    return { message: 'No matching knowledge found' }
  },
}

// ============ ORCHESTRATOR ============

export async function processQuery(
  vendorId: string,
  userQuery: string
): Promise<QueryResult> {
  // 1. Validate input
  const validation = guardrails.validateInput(userQuery)
  if (!validation.valid) {
    return {
      intent: 'read',
      error: validation.error,
      requiresApproval: false,
    }
  }

  // 2. Route intent
  const routing = routeIntent(userQuery)

  // 3. Check rate limiting
  if (!guardrails.checkRateLimit(vendorId)) {
    return {
      intent: 'read',
      error: 'Rate limit exceeded',
      requiresApproval: false,
    }
  }

  // 4. Execute tools based on intent
  let result: any

  if (routing.intent === 'read') {
    // Execute SQL Query
    result = tools.sqlQuery(vendorId, userQuery)
  } else if (routing.intent === 'write') {
    // Generate approval request
    const approvalId = uuidv4()

    // Determine what user to update (simple extraction)
    let targetUserId: string | undefined
    const userMatch = userQuery.match(/for\s+([A-Za-z\s]+?)(?:\s+by|\s+to|\.|$)/i)
    if (userMatch) {
      const userName = userMatch[1].trim()
      const user = mockUsers.find(
        (u) => u.vendorId === vendorId && u.name.toLowerCase().includes(userName.toLowerCase())
      )
      targetUserId = user?.id
    } else {
      // Use first trial user if extending membership
      if (routing.action === 'extend_membership') {
        const trialUser = mockUsers.find(
          (u) => u.vendorId === vendorId && u.status === 'trial'
        )
        targetUserId = trialUser?.id
      }
    }

    const approval: ApprovalRequest = {
      id: approvalId,
      vendorId,
      action: routing.action || 'unknown',
      targetUserId,
      details: {
        query: userQuery,
        timestamp: new Date(),
      },
      status: 'pending',
      createdAt: new Date(),
    }

    addApprovalRequest(approval)

    // Log the pending action
    addAuditLog({
      id: `audit_${Date.now()}`,
      vendorId,
      action: routing.action || 'unknown',
      query: userQuery,
      result: { approvalId },
      status: 'pending_approval',
      timestamp: new Date(),
    })

    return {
      intent: 'write',
      requiresApproval: true,
      approvalRequestId: approvalId,
      result: {
        message: `Approval required for: ${routing.action}`,
        details: approval,
      },
    }
  }

  // Log successful read operation
  addAuditLog({
    id: `audit_${Date.now()}`,
    vendorId,
    action: routing.action || 'read',
    query: userQuery,
    result,
    status: 'success',
    timestamp: new Date(),
  })

  return {
    intent: 'read',
    query: userQuery,
    result,
    requiresApproval: false,
  }
}
