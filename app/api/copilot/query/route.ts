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

    // Process query with AI analysis powered by Groq via Vercel AI Gateway
    const result = await processQuery(vendorId, query)

    // Add AI configuration status to response
    const aiConfigured = !!process.env.AI_GATEWAY_API_KEY
    const aiModel = aiConfigured
      ? 'groq/llama-3.1-8b-instant'
      : 'mock (demo mode - add AI_GATEWAY_API_KEY for real Groq AI)'

    return NextResponse.json({
      ...result,
      _metadata: {
        aiModel,
        aiConfigured,
        aiProvider: 'Vercel AI Gateway (Groq)',
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error('[Copilot] Query processing error:', error)
    return NextResponse.json(
      {
        error: 'Failed to process query',
        _metadata: {
          aiConfigured: !!process.env.AI_GATEWAY_API_KEY,
          aiProvider: 'Vercel AI Gateway (Groq)',
        },
      },
      { status: 500 }
    )
  }
}
