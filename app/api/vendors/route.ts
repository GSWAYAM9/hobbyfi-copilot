import { db } from '@/lib/db'
import { vendors as vendorsTable } from '@/lib/db/schema'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Fetch vendors from Neon database
    const vendors = await db.select().from(vendorsTable).limit(50)
    
    // Transform database vendors to match the UI format
    const transformedVendors = vendors.map((v) => ({
      id: v.id,
      name: v.name,
      email: v.email,
      sport: v.hobby,
      location: `${v.city}, India`,
      city: v.city,
      membershipCount: v.totalMembers,
      monthlyRevenue: Number(v.monthlyRevenue),
      trialUsersCount: 0, // We can calculate this from vendor_users if needed
    }))

    return NextResponse.json({ vendors: transformedVendors })
  } catch (error) {
    console.error('Error fetching vendors:', error)
    // Fallback to mock data if database fails
    return NextResponse.json({
      vendors: [
        {
          id: 'vendor-1',
          name: 'Pro Badminton Academy',
          email: 'contact@probadminton.com',
          sport: 'Badminton',
          location: 'Mumbai, India',
          city: 'Mumbai',
          membershipCount: 45,
          monthlyRevenue: 75000,
          trialUsersCount: 0,
        },
        {
          id: 'vendor-2',
          name: 'Yoga Masters Studio',
          email: 'info@yogamasters.com',
          sport: 'Yoga',
          location: 'Bangalore, India',
          city: 'Bangalore',
          membershipCount: 60,
          monthlyRevenue: 95000,
          trialUsersCount: 0,
        },
        {
          id: 'vendor-3',
          name: 'Cricket Elite Club',
          email: 'hello@cricketelite.com',
          sport: 'Cricket',
          location: 'Delhi, India',
          city: 'Delhi',
          membershipCount: 80,
          monthlyRevenue: 125000,
          trialUsersCount: 0,
        },
      ],
    })
  }
}
