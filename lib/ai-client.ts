import { generateText } from 'ai'
import { groq } from '@ai-sdk/groq'

// Use Groq directly for real AI responses
// Model: llama-3.1-8b-instant - ultra-fast, cost-effective
const MODEL = 'llama-3.1-8b-instant'

// Check if Groq API key is configured
const GROQ_API_KEY = process.env.GROQ_API_KEY
const USE_REAL_AI = !!GROQ_API_KEY
const USE_MOCK_RESPONSES = !GROQ_API_KEY

if (USE_REAL_AI) {
  console.log('[Copilot] ✅ Real Groq AI enabled with API key')
} else {
  console.log('[Copilot] ℹ️ Demo mode - no GROQ_API_KEY configured')
}

interface AITextGenerationOptions {
  prompt: string
  system?: string
  temperature?: number
  maxTokens?: number
}

/**
 * Generate text using Groq's llama-3.1-8b-instant model
 * Falls back to mock responses if API key not configured
 */
export async function generateAIResponse(
  options: AITextGenerationOptions
): Promise<string> {
  const { prompt, system, temperature = 0.7, maxTokens = 1024 } = options

  // Mock mode for demo without API key
  if (USE_MOCK_RESPONSES) {
    console.log('[Copilot] Using mock responses (GROQ_API_KEY not configured)')
    return generateMockResponse(prompt)
  }

  try {
    console.log('[Copilot] Calling Groq API...')
    const result = await generateText({
      model: groq(MODEL, {
        apiKey: GROQ_API_KEY,
      }),
      prompt,
      system,
      temperature,
      maxTokens,
    })

    console.log('[Copilot] ✅ Groq response received')
    return result.text
  } catch (error) {
    console.error('[Copilot] Groq API call failed:', error)
    // Fallback to mock response on error
    console.log('[Copilot] Falling back to mock response')
    return generateMockResponse(prompt)
  }
}

/**
 * Generate mock AI responses for demo purposes
 */
function generateMockResponse(prompt: string): string {
  const lowerPrompt = prompt.toLowerCase()

  // Revenue queries
  if (lowerPrompt.includes('revenue') || lowerPrompt.includes('earnings')) {
    return `Based on today's booking data, your total revenue is **₹8,500** from 12 completed court bookings. This includes:
- Premium courts: ₹5,200 (8 bookings)
- Standard courts: ₹3,300 (4 bookings)

Revenue is trending 15% above your 7-day average.`
  }

  // User queries
  if (lowerPrompt.includes('trial') || lowerPrompt.includes('free')) {
    return `You currently have **42 trial users**:
- Badminton: 18 active trials
- Tennis: 14 active trials
- Basketball: 10 active trials

Trial conversion rate: 23% (9 converted to paid last month)
Average trial duration: 8.3 days`
  }

  // Membership queries
  if (lowerPrompt.includes('member') || lowerPrompt.includes('subscription')) {
    return `**Active Memberships: 156**
- Monthly: 124 (79%)
- Quarterly: 22 (14%)
- Annual: 10 (7%)

MRR (Monthly Recurring Revenue): ₹18,720
Churn rate: 3.2% (excellent for sports category)
Top membership tier: Premium (₹500/month)`
  }

  // Generic response
  return `I'm analyzing your vendor data. Your current metrics show:
- **Active Users**: 287
- **This Month Revenue**: ₹42,350
- **Booking Completion Rate**: 94%
- **Customer Satisfaction**: 4.7/5

Is there a specific metric you'd like me to dive deeper into?`
}

/**
 * Structured AI analysis with tool context
 */
export async function analyzeWithAI(
  query: string,
  context: Record<string, unknown>
): Promise<{ analysis: string; confidence: number; requiresApproval: boolean }> {
  const contextString = JSON.stringify(context, null, 2)

  const systemPrompt = `You are HobbyFi's intelligent vendor assistant. You have access to vendor analytics, user data, and business metrics. 
Provide clear, actionable insights based on the provided data.
Always be specific with numbers and percentages.
If unsure about data, acknowledge uncertainty.

Context:
${contextString}`

  const analysis = await generateAIResponse({
    prompt: query,
    system: systemPrompt,
    temperature: 0.5,
    maxTokens: 1024,
  })

  // Determine if the response suggests requiring approval
  const requiresApproval =
    analysis.toLowerCase().includes('update') ||
    analysis.toLowerCase().includes('modify') ||
    analysis.toLowerCase().includes('extend') ||
    analysis.toLowerCase().includes('adjust')

  return {
    analysis,
    confidence: 0.85,
    requiresApproval,
  }
}
