'use server'

import { generateAIResponse, analyzeWithAI } from './ai-client'
import { v4 as uuidv4 } from 'uuid'
import { ApprovalRequest, QueryResult } from './types'
import { logAction } from './db/services/audit-logs'
import { getVendor, updateVendorMetrics } from './db/services/vendors'
import { listVendorUsers, listTrialUsers, listActiveUsers, extendMembership, extendTrial } from './db/services/vendor-users'
import { listVendorBookings, getTodayRevenue, getTodayBookingCount } from './db/services/bookings'
import { createApprovalRequest, listPendingApprovals, approveRequest } from './db/services/approvals'

// ============ GUARDRAILS ============

export const guardrails = {
  detectInjection(query: string): boolean {
    const suspiciousPatterns = [
      /(\bDROP\b|\bDELETE\b|\bTRUNCATE\b|\bINSERT\b.*INTO\b|\bUPDATE\b|\bALTER\b)/i,
      /(<script|javascript:|onerror|onclick)/i,
      /(\bOR\b\s+\d+\s*=\s*\d+)/i,
      /(--|;|\/\*|\*\/)/,
    ]
    return suspiciousPatterns.some((pattern) => pattern.test(query))
  },

  checkRateLimit(vendorId: string): boolean {
    return true
  },

  redactPII(text: string): string {
    return text
      .replace(/[\w\.-]+@[\w\.-]+\.\w+/g, '[EMAIL]')
      .replace(/\d{10}/g, '[PHONE]')
  },

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
    if (/extend.*membership|add.*days/.test(lowerQuery)) {
      return { intent: 'write', action: 'extend_membership' }
    }
    if (/extend.*trial|add.*trial|increase.*trial/.test(lowerQuery)) {
      return { intent: 'write', action: 'extend_trial' }
    }
    return { intent: 'write', action: 'generic_update' }
  }

  return { intent: 'read', action: 'query_data' }
}

// ============ TOOLS ============

export const tools = {
  async queryVendorData(vendorId: string, query: string) {
    const lowerQuery = query.toLowerCase()

    // Get vendor info
    const vendor = await getVendor(vendorId)
    if (!vendor) {
      return { error: 'Vendor not found' }
    }

    // Revenue queries
    if (/revenue|earnings|income|total|money/.test(lowerQuery)) {
      const todayRevenue = await getTodayRevenue(vendorId)
      const bookingCount = await getTodayBookingCount(vendorId)
      return {
        date: new Date().toLocaleDateString(),
        revenue: todayRevenue,
        bookings: bookingCount,
        vendorName: vendor.name,
        period: 'today',
      }
    }

    // User queries
    if (/members|users|trial|active/.test(lowerQuery)) {
      const allUsers = await listVendorUsers(vendorId)
      const trialUsers = await listTrialUsers(vendorId, vendor.hobby)
      const activeUsers = await listActiveUsers(vendorId)

      if (/trial/.test(lowerQuery)) {
        return {
          type: 'trial_users',
          hobby: vendor.hobby,
          users: trialUsers.map((u) => ({ name: u.name, email: u.email, expiresAt: u.trialExpiresAt })),
          count: trialUsers.length,
        }
      }

      if (/active/.test(lowerQuery)) {
        return {
          type: 'active_users',
          users: activeUsers.map((u) => ({ name: u.name, email: u.email })),
          count: activeUsers.length,
        }
      }

      return {
        totalMembers: allUsers.length,
        activeMembers: activeUsers.length,
        trialMembers: trialUsers.length,
      }
    }

    // Bookings
    if (/booking|reservation|slot|court/.test(lowerQuery)) {
      const bookings = await listVendorBookings(vendorId)
      return {
        totalBookings: bookings.length,
        bookings: bookings.slice(0, 5),
      }
    }

    return { data: vendor }
  },

  async extendMembershipTool(vendorId: string, userId: number, days: number) {
    const result = await extendMembership(vendorId, userId, days)
    if (!result) {
      return { error: `User ${userId} not found` }
    }
    return {
      success: true,
      message: `Membership extended by ${days} days`,
      newExpiryDate: result.membershipExpiresAt,
    }
  },

  async extendTrialTool(vendorId: string, userId: number, days: number) {
    const result = await extendTrial(vendorId, userId, days)
    if (!result) {
      return { error: `User ${userId} not found` }
    }
    return {
      success: true,
      message: `Trial extended by ${days} days`,
      newExpiryDate: result.trialExpiresAt,
    }
  },
}

// ============ MAIN ENGINE ============

export async function processQuery(vendorId: string, userQuery: string): Promise<QueryResult> {
  const requestId = uuidv4()

  // 1. Validate input
  const validation = guardrails.validateInput(userQuery)
  if (!validation.valid) {
    await logAction({
      vendorId,
      action: 'query',
      query: userQuery,
      result: { error: validation.error },
      metadata: { requestId, status: 'rejected' },
    })
    return {
      intent: 'read',
      error: validation.error,
      requiresApproval: false,
    }
  }

  // 2. Check rate limit
  if (!guardrails.checkRateLimit(vendorId)) {
    return {
      intent: 'read',
      error: 'Rate limit exceeded',
      requiresApproval: false,
    }
  }

  // 3. Route intent
  const routing = routeIntent(userQuery)

  // 4. Execute tools based on intent
  let result: any
  let aiAnalysis: string | undefined
  const vendor = await getVendor(vendorId)

  if (routing.intent === 'read') {
    // Execute query
    const toolResult = await tools.queryVendorData(vendorId, userQuery)

    // Get AI-powered analysis
    try {
      const aiResponse = await analyzeWithAI(userQuery, {
        ...toolResult,
        vendorName: vendor?.name,
      })
      aiAnalysis = aiResponse.analysis
    } catch (error) {
      console.error('[Copilot] AI analysis failed:', error)
    }

    result = {
      ...toolResult,
      aiInsights: aiAnalysis,
    }

    // Log to audit trail
    await logAction({
      vendorId,
      action: 'query',
      query: userQuery,
      result: result,
      metadata: { requestId, intent: 'read' },
    })
  } else if (routing.intent === 'write') {
    // Write operations require approval
    const approvalRequest = await createApprovalRequest({
      vendorId,
      type: routing.action || 'generic_update',
      description: userQuery,
      proposedChanges: { query: userQuery },
    })

    // Log approval request
    await logAction({
      vendorId,
      action: 'approval',
      query: userQuery,
      result: { approvalId: approvalRequest.id },
      metadata: { requestId, status: 'pending' },
    })

    return {
      intent: 'write',
      requiresApproval: true,
      approvalRequestId: approvalRequest.id,
      result: {
        message: `${routing.action} operation submitted for approval`,
        details: routing.action,
      },
    }
  }

  return {
    intent: routing.intent,
    result,
    requiresApproval: false,
    sql: `SELECT * FROM vendors WHERE id = '${vendorId}'`,
  }
}

export async function executeApprovedAction(
  vendorId: string,
  approvalId: string
): Promise<{ success: boolean; message: string; error?: string }> {
  try {
    const approvalRequest = await listPendingApprovals(vendorId)
    const approval = approvalRequest.find((a) => a.id === approvalId)

    if (!approval) {
      return { success: false, message: 'Approval not found', error: 'Not found' }
    }

    const changes = approval.proposedChanges as any

    // Execute based on type
    if (approval.type === 'extend_membership' && approval.targetUserId) {
      const days = changes?.days || 30
      const result = await tools.extendMembershipTool(vendorId, approval.targetUserId, days)
      await approveRequest(vendorId, approvalId, 'system')
      return { success: true, message: result.message }
    }

    if (approval.type === 'extend_trial' && approval.targetUserId) {
      const days = changes?.days || 7
      const result = await tools.extendTrialTool(vendorId, approval.targetUserId, days)
      await approveRequest(vendorId, approvalId, 'system')
      return { success: true, message: result.message }
    }

    return { success: false, message: 'Unknown approval type' }
  } catch (error) {
    console.error('[Copilot] Execution error:', error)
    return {
      success: false,
      message: 'Execution failed',
      error: String(error),
    }
  }
}
