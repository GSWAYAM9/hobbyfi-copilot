'use server'

import { db } from '@/lib/db'
import { bookings } from '@/lib/db/schema'
import { eq, and, gte, lte } from 'drizzle-orm'

export async function getBooking(vendorId: string, bookingId: number) {
  const result = await db
    .select()
    .from(bookings)
    .where(and(eq(bookings.vendorId, vendorId), eq(bookings.id, bookingId)))
  return result[0] || null
}

export async function listVendorBookings(vendorId: string) {
  return await db.select().from(bookings).where(eq(bookings.vendorId, vendorId))
}

export async function getTodayRevenue(vendorId: string) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const result = await db
    .select()
    .from(bookings)
    .where(
      and(
        eq(bookings.vendorId, vendorId),
        gte(bookings.createdAt, today),
        lte(bookings.createdAt, tomorrow),
        eq(bookings.status, 'completed')
      )
    )

  return result.reduce((sum, b) => sum + parseFloat(b.amount as string), 0)
}

export async function getTodayBookingCount(vendorId: string) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const result = await db
    .select()
    .from(bookings)
    .where(
      and(
        eq(bookings.vendorId, vendorId),
        gte(bookings.createdAt, today),
        lte(bookings.createdAt, tomorrow)
      )
    )

  return result.length
}

export async function createBooking(data: {
  vendorId: string
  userId: number
  courtName: string
  startTime: Date
  endTime: Date
  amount: string
  status: string
}) {
  const result = await db.insert(bookings).values(data).returning()
  return result[0]
}

export async function updateBookingStatus(
  vendorId: string,
  bookingId: number,
  status: string
) {
  const result = await db
    .update(bookings)
    .set({ status })
    .where(and(eq(bookings.vendorId, vendorId), eq(bookings.id, bookingId)))
    .returning()
  return result[0]
}
