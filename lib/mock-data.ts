import { Vendor, User, Booking, ApprovalRequest, AuditLog } from './types'

export const mockVendors: Vendor[] = [
  {
    id: 'vendor_1',
    name: 'Smash Arena',
    email: 'admin@smasharena.com',
    sport: 'Badminton',
    location: 'Koramangala, Bangalore',
    city: 'Bangalore',
    membershipCount: 245,
    monthlyRevenue: 125000,
    trialUsersCount: 32,
  },
  {
    id: 'vendor_2',
    name: 'Cricket Connect',
    email: 'admin@cricketconnect.com',
    sport: 'Cricket',
    location: 'Bandra, Mumbai',
    city: 'Mumbai',
    membershipCount: 180,
    monthlyRevenue: 98000,
    trialUsersCount: 28,
  },
  {
    id: 'vendor_3',
    name: 'Tennis Pro',
    email: 'admin@tennispro.com',
    sport: 'Tennis',
    location: 'Defence Colony, New Delhi',
    city: 'New Delhi',
    membershipCount: 156,
    monthlyRevenue: 87500,
    trialUsersCount: 22,
  },
]

export const mockUsers: User[] = [
  {
    id: 'user_1',
    vendorId: 'vendor_1',
    name: 'Arjun Mehta',
    email: 'arjun.mehta@email.com',
    sport: 'Badminton',
    status: 'active',
    membershipExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    trialExpiresAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    joinedAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'user_2',
    vendorId: 'vendor_1',
    name: 'Priya Sharma',
    email: 'priya.sharma@email.com',
    sport: 'Badminton',
    status: 'trial',
    membershipExpiry: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    trialExpiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    joinedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'user_3',
    vendorId: 'vendor_1',
    name: 'Rahul Nair',
    email: 'rahul.nair@email.com',
    sport: 'Badminton',
    status: 'active',
    membershipExpiry: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    trialExpiresAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    joinedAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'user_4',
    vendorId: 'vendor_1',
    name: 'Kavya Reddy',
    email: 'kavya.reddy@email.com',
    sport: 'Badminton',
    status: 'trial',
    membershipExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    trialExpiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    joinedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'user_5',
    vendorId: 'vendor_1',
    name: 'Siddharth Joshi',
    email: 'siddharth.j@email.com',
    sport: 'Badminton',
    status: 'inactive',
    membershipExpiry: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    trialExpiresAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    joinedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
  },
]

export const mockBookings: Booking[] = [
  {
    id: 'booking_1',
    userId: 'user_1',
    vendorId: 'vendor_1',
    courtName: 'Court A',
    startTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
    endTime: new Date(Date.now() + 3 * 60 * 60 * 1000),
    amount: 500,
    status: 'confirmed',
  },
  {
    id: 'booking_2',
    userId: 'user_2',
    vendorId: 'vendor_1',
    courtName: 'Court B',
    startTime: new Date(Date.now() + 4 * 60 * 60 * 1000),
    endTime: new Date(Date.now() + 5 * 60 * 60 * 1000),
    amount: 500,
    status: 'confirmed',
  },
  {
    id: 'booking_3',
    userId: 'user_3',
    vendorId: 'vendor_1',
    courtName: 'Court C',
    startTime: new Date(Date.now() - 1 * 60 * 60 * 1000),
    endTime: new Date(Date.now()),
    amount: 500,
    status: 'completed',
  },
  {
    id: 'booking_4',
    userId: 'user_4',
    vendorId: 'vendor_1',
    courtName: 'Court A',
    startTime: new Date(Date.now() - 3 * 60 * 60 * 1000),
    endTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
    amount: 500,
    status: 'completed',
  },
  {
    id: 'booking_5',
    userId: 'user_1',
    vendorId: 'vendor_1',
    courtName: 'Court B',
    startTime: new Date(Date.now() - 48 * 60 * 60 * 1000),
    endTime: new Date(Date.now() - 47 * 60 * 60 * 1000),
    amount: 500,
    status: 'completed',
  },
]

let approvalRequests: ApprovalRequest[] = []
let auditLogs: AuditLog[] = []

export function addApprovalRequest(request: ApprovalRequest) {
  approvalRequests.push(request)
  return request
}

export function getApprovalRequests() {
  return approvalRequests
}

export function approveRequest(requestId: string) {
  const request = approvalRequests.find((r) => r.id === requestId)
  if (request) {
    request.status = 'approved'
    request.approvedAt = new Date()

    // Execute the action
    if (request.action === 'extend_membership' && request.targetUserId) {
      const user = mockUsers.find((u) => u.id === request.targetUserId)
      if (user) {
        user.membershipExpiry = new Date(
          user.membershipExpiry.getTime() + 30 * 24 * 60 * 60 * 1000
        )
      }
    }

    addAuditLog({
      id: `audit_${Date.now()}`,
      vendorId: request.vendorId,
      action: request.action,
      query: `Action: ${request.action}`,
      result: { success: true },
      status: 'success',
      timestamp: new Date(),
    })
  }
  return request
}

export function rejectRequest(requestId: string) {
  const request = approvalRequests.find((r) => r.id === requestId)
  if (request) {
    request.status = 'rejected'
  }
  return request
}

export function addAuditLog(log: AuditLog) {
  auditLogs.push(log)
  return log
}

export function getAuditLogs(vendorId: string) {
  return auditLogs.filter((log) => log.vendorId === vendorId)
}
