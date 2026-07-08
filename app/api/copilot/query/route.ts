import { processQuery } from '@/lib/copilot-engine-db'
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

    // Process query with Neon database + AI analysis powered by Groq
    const result = await processQuery(vendorId, query)

    // Add database and AI configuration status to response
    const aiConfigured = !!process.env.GROQ_API_KEY
    const dbConfigured = !!process.env.DATABASE_URL
    const aiModel = aiConfigured
      ? 'groq/llama-3.1-8b-instant'
      : 'mock (demo mode - add GROQ_API_KEY for real Groq AI)'

    return NextResponse.json({
      ...result,
      _metadata: {
        database: 'Neon PostgreSQL',
        dbConfigured,
        aiModel,
        aiConfigured,
        aiProvider: 'Groq via Vercel AI SDK',
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error('[Copilot] Query processing error:', error)
    return NextResponse.json(
      {
        error: 'Failed to process query',
        _metadata: {
          database: 'Neon PostgreSQL',
          dbConfigured: !!process.env.DATABASE_URL,
          aiConfigured: !!process.env.GROQ_API_KEY,
          aiProvider: 'Groq via Vercel AI SDK',
        },
      },
      { status: 500 }
    )
  }
}
