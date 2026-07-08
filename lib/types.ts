export interface Vendor {
  id: string
  name: string
  email: string
  sport: string
  location: string
  city: string
  membershipCount: number
  monthlyRevenue: number
  trialUsersCount: number
}

export interface User {
  id: string
  vendorId: string
  name: string
  email: string
  sport: string
  status: 'trial' | 'active' | 'inactive'
  membershipExpiry: Date
  trialExpiresAt: Date
  joinedAt: Date
}

export interface Booking {
  id: string
  userId: string
  vendorId: string
  courtName: string
  startTime: Date
  endTime: Date
  amount: number
  status: 'confirmed' | 'completed' | 'cancelled'
}

export interface ApprovalRequest {
  id: string
  vendorId: string
  action: string
  targetUserId?: string
  targetBookingId?: string
  details: Record<string, any>
  status: 'pending' | 'approved' | 'rejected'
  createdAt: Date
  approvedAt?: Date
}

export interface QueryResult {
  intent: 'read' | 'write'
  query?: string
  sql?: string
  result?: any
  requiresApproval: boolean
  approvalRequestId?: string
  error?: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  metadata?: {
    intent?: string
    approvalId?: string
    sql?: string
  }
}

export interface ApprovalData {
  action: string
  description: string
  details: Record<string, any>
  isApproved?: boolean
}

export interface AuditLog {
  id: string
  vendorId: string
  action: string
  query: string
  result: any
  status: 'success' | 'failed' | 'pending_approval' | 'rejected'
  timestamp: Date
  userId?: string
}
