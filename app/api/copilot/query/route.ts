import { processQuery } from '@/lib/copilot-engine'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { vendorId, query } = body

    if (!vendorId || !query) {
      return NextResponse.json(
        { error: 'Missing vendorId or query' },
        { status: 400 }
      )
    }

    const result = await processQuery(vendorId, query)
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process query' },
      { status: 500 }
    )
  }
}
