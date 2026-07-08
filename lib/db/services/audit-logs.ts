import { db } from '@/lib/db'
import { auditLogs } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

export async function logAction(data: {
  vendorId: string
  action: string
  query?: string
  result?: Record<string, any>
  metadata?: Record<string, any>
}) {
  const result = await db.insert(auditLogs).values(data).returning()
  return result[0]
}

export async function listVendorAuditLogs(vendorId: string, limit = 100) {
  return await db
    .select()
    .from(auditLogs)
    .where(eq(auditLogs.vendorId, vendorId))
    .orderBy(auditLogs.createdAt)
    .limit(limit)
}

export async function getAuditLog(vendorId: string, logId: number) {
  const result = await db
    .select()
    .from(auditLogs)
    .where(
      and(eq(auditLogs.vendorId, vendorId), eq(auditLogs.id, logId))
    )
  return result[0] || null
}
