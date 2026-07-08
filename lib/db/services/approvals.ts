import { db } from '@/lib/db'
import { approvalRequests } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'

export async function getApprovalRequest(vendorId: string, requestId: string) {
  const result = await db
    .select()
    .from(approvalRequests)
    .where(
      and(eq(approvalRequests.vendorId, vendorId), eq(approvalRequests.id, requestId))
    )
  return result[0] || null
}

export async function listPendingApprovals(vendorId: string) {
  return await db
    .select()
    .from(approvalRequests)
    .where(
      and(
        eq(approvalRequests.vendorId, vendorId),
        eq(approvalRequests.status, 'pending')
      )
    )
}

export async function listAllApprovals(vendorId: string) {
  return await db
    .select()
    .from(approvalRequests)
    .where(eq(approvalRequests.vendorId, vendorId))
}

export async function createApprovalRequest(data: {
  vendorId: string
  type: string
  description: string
  targetUserId?: number
  proposedChanges?: Record<string, any>
}) {
  const result = await db
    .insert(approvalRequests)
    .values({
      id: uuidv4(),
      ...data,
      status: 'pending',
    })
    .returning()
  return result[0]
}

export async function approveRequest(
  vendorId: string,
  requestId: string,
  approvedBy: string
) {
  const result = await db
    .update(approvalRequests)
    .set({
      status: 'approved',
      approvedBy,
      approvedAt: new Date(),
    })
    .where(
      and(eq(approvalRequests.vendorId, vendorId), eq(approvalRequests.id, requestId))
    )
    .returning()
  return result[0]
}

export async function rejectRequest(vendorId: string, requestId: string) {
  const result = await db
    .update(approvalRequests)
    .set({
      status: 'rejected',
      approvedAt: new Date(),
    })
    .where(
      and(eq(approvalRequests.vendorId, vendorId), eq(approvalRequests.id, requestId))
    )
    .returning()
  return result[0]
}
