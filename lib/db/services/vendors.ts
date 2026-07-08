'use server'

import { db } from '@/lib/db'
import { vendors } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function getVendor(vendorId: string) {
  const result = await db.select().from(vendors).where(eq(vendors.id, vendorId))
  return result[0] || null
}

export async function getVendorByUserId(userId: string) {
  const result = await db.select().from(vendors).where(eq(vendors.userId, userId))
  return result[0] || null
}

export async function listVendors() {
  return await db.select().from(vendors)
}

export async function createVendor(data: {
  id: string
  userId: string
  name: string
  email: string
  city: string
  hobby: string
}) {
  const result = await db.insert(vendors).values(data).returning()
  return result[0]
}

export async function updateVendorMetrics(
  vendorId: string,
  data: {
    totalMembers?: number
    activeMembers?: number
    monthlyRevenue?: string
  }
) {
  const result = await db
    .update(vendors)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(vendors.id, vendorId))
    .returning()
  return result[0]
}
