import { db } from '@/lib/db'
import { vendorUsers } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

export async function getVendorUser(vendorId: string, userId: number) {
  const result = await db
    .select()
    .from(vendorUsers)
    .where(and(eq(vendorUsers.vendorId, vendorId), eq(vendorUsers.id, userId)))
  return result[0] || null
}

export async function listVendorUsers(vendorId: string) {
  return await db.select().from(vendorUsers).where(eq(vendorUsers.vendorId, vendorId))
}

export async function listTrialUsers(vendorId: string, hobby: string) {
  return await db
    .select()
    .from(vendorUsers)
    .where(
      and(eq(vendorUsers.vendorId, vendorId), eq(vendorUsers.status, 'trial'))
    )
}

export async function listActiveUsers(vendorId: string) {
  return await db
    .select()
    .from(vendorUsers)
    .where(
      and(eq(vendorUsers.vendorId, vendorId), eq(vendorUsers.status, 'active'))
    )
}

export async function createVendorUser(data: {
  vendorId: string
  name: string
  email: string
  status: string
  trialExpiresAt?: Date
  membershipExpiresAt?: Date
}) {
  const result = await db.insert(vendorUsers).values(data).returning()
  return result[0]
}

export async function updateVendorUserMembership(
  vendorId: string,
  userId: number,
  data: {
    status?: string
    membershipExpiresAt?: Date
    trialExpiresAt?: Date
  }
) {
  const result = await db
    .update(vendorUsers)
    .set(data)
    .where(and(eq(vendorUsers.vendorId, vendorId), eq(vendorUsers.id, userId)))
    .returning()
  return result[0]
}

export async function extendMembership(
  vendorId: string,
  userId: number,
  days: number
) {
  const user = await getVendorUser(vendorId, userId)
  if (!user) return null

  const newDate = new Date(user.membershipExpiresAt || new Date())
  newDate.setDate(newDate.getDate() + days)

  return await updateVendorUserMembership(vendorId, userId, {
    membershipExpiresAt: newDate,
  })
}

export async function extendTrial(vendorId: string, userId: number, days: number) {
  const user = await getVendorUser(vendorId, userId)
  if (!user) return null

  const newDate = new Date(user.trialExpiresAt || new Date())
  newDate.setDate(newDate.getDate() + days)

  return await updateVendorUserMembership(vendorId, userId, {
    trialExpiresAt: newDate,
  })
}
