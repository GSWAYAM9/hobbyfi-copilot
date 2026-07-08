# Groq AI Implementation for HobbyFi Copilot

## Overview

HobbyFi Copilot now features **Groq AI integration** powered by the **Vercel AI SDK** and **Vercel AI Gateway**. The copilot uses Groq's fast LLM inference to provide real-time business insights, analytics, and natural language processing for vendor management.

## Architecture

### Integration Points

1. **AI Client Layer** (`lib/ai-client.ts`)
   ```typescript
   import { generateText } from 'ai'
   
   const MODEL = 'groq/llama-3.1-8b-instant'
   
   export async function generateAIResponse(options) {
     // Uses Vercel AI Gateway + Groq
     const result = await generateText({
       model: 'groq/llama-3.1-8b-instant',
       prompt,
       system,
       temperature: 0.7,
       maxTokens: 1024,
     })
   }
   ```

2. **Copilot Orchestration** (`lib/copilot-engine.ts`)
   ```typescript
   // Integrate AI analysis into query processing
   const aiResponse = await analyzeWithAI(userQuery, toolResult)
   result = {
     ...toolResult,
     aiInsights: aiResponse.analysis,
     confidence: aiResponse.confidence,
     requiresApproval: aiResponse.requiresApproval,
   }
   ```

3. **API Response Enhancement** (`app/api/copilot/query/route.ts`)
   ```typescript
   return NextResponse.json({
     ...result,
     _metadata: {
       aiModel: 'groq/llama-3.1-8b-instant',
       aiProvider: 'Vercel AI Gateway (Groq)',
       aiConfigured: !!process.env.AI_GATEWAY_API_KEY,
       timestamp: new Date().toISOString(),
     },
   })
   ```

4. **Frontend Display** (`components/copilot/chat-interface.tsx`)
   ```typescript
   // Display AI insights in chat
   if (result.result.aiInsights) {
     formattedResult = `**AI Analysis (Powered by Groq):**\n${result.result.aiInsights}`
   }
   ```

5. **AI Badge** (`components/copilot/chat-message.tsx`)
   ```tsx
   {message.metadata?.aiModel && !isUser && (
     <div className="mt-2 pt-2">
       <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
         {message.metadata.aiConfigured ? '🤖 Groq AI' : '🔄 Demo Mode'}
       </span>
       <span className="text-xs text-gray-500">{message.metadata.aiModel}</span>
     </div>
   )}
   ```

## Groq Model Details

### Model: `groq/llama-3.1-8b-instant`

**Key Specifications:**
- **Provider**: Groq (via Vercel AI Gateway)
- **Model Name**: Llama 3.1 8B Instant
- **Input Tokens**: $0.05 / 1M
- **Output Tokens**: $0.15 / 1M
- **Speed**: 1000+ tokens/second
- **Context Window**: 128K tokens
- **Temperature**: 0.5 (balanced)
- **Max Output**: 1024 tokens

**Why Llama 3.1 8B?**
- Fast inference (perfect for real-time vendor queries)
- Excellent instruction following
- Strong at structured data analysis
- Lower latency than larger models
- Cost-effective for frequent queries

### Alternative Models

Via Vercel AI Gateway, you can also use:

```typescript
// More powerful analysis
'groq/llama-3.1-70b-versatile' // 70B model, higher accuracy

// Multi-expert system
'groq/mixtral-8x7b-32768'       // 8 experts, specialized tasks

// Latest releases
'groq/llama-3.2-90b-vision-preview' // Vision capabilities
```

## Data Flow

```
┌──────────────┐
│ User Query   │ "What is my revenue today?"
└──────────────┘
       ↓
┌──────────────────────────────────────┐
│ 1. Input Validation & Guardrails     │ ✓ Valid (500 chars)
│    • Length check                    │ ✓ No injection patterns
│    • Pattern detection               │ ✓ Rate limit OK
└──────────────────────────────────────┘
       ↓
┌──────────────────────────────────────┐
│ 2. Intent Router                     │ → READ operation
│    • Parse user intent               │ → Query data, no approval needed
└──────────────────────────────────────┘
       ↓
┌──────────────────────────────────────┐
│ 3. Tool Execution                    │ Returns:
│    • SQL Query Tool                  │ {
│    • Analytics Tool                  │   revenue: 8500,
│    • Knowledge Tool                  │   bookings: 12,
│                                      │   date: '7/8/2026'
│                                      │ }
└──────────────────────────────────────┘
       ↓
┌──────────────────────────────────────┐
│ 4. AI Analysis (Groq)                │ Generates:
│    model: groq/llama-3.1-8b-instant │ "Based on today's booking
│    temp: 0.5                         │  data, your total revenue
│    system: "You are a business       │  is ₹8,500 from 12
│             analyst for HobbyFi"     │  completed bookings..."
└──────────────────────────────────────┘
       ↓
┌──────────────────────────────────────┐
│ 5. Format & Return                   │ {
│    • Combine raw data + insights     │   revenue: 8500,
│    • Add AI metadata                 │   aiInsights: "...",
│    • Timestamp response              │   _metadata: { aiModel,
│                                      │     aiConfigured, ... }
│                                      │ }
└──────────────────────────────────────┘
       ↓
┌──────────────────────────────────────┐
│ 6. Display in Chat                   │ Shows:
│    • AI badge (🤖 Groq AI)           │ **AI Analysis (Powered
│    • Model info                      │  by Groq):**
│    • Raw data                        │ [Insight text]
│    • Timestamp                       │ 🤖 groq/llama-3.1-8b
│                                      │ 4:10:43 AM
└──────────────────────────────────────┘
```

## Demo Mode vs Real Groq

### Demo Mode (No API Key)
```
AI_GATEWAY_API_KEY = not set
↓
Uses generateMockResponse() function
↓
Responses are pre-written based on query patterns
↓
Badge shows: 🔄 Demo Mode
↓
No API calls made
```

**Mock Response Examples:**
```typescript
if (lowerPrompt.includes('revenue')) {
  return `Based on today's booking data, your total revenue is **₹8,500**...`
}

if (lowerPrompt.includes('trial')) {
  return `You currently have **42 trial users**...`
}
```

### Real Groq Mode (With API Key)
```
AI_GATEWAY_API_KEY = <your-key>
↓
Calls Vercel AI Gateway
↓
AI Gateway routes to Groq
↓
Groq runs inference
↓
Response streamed back
↓
Badge shows: 🤖 Groq AI
↓
Logs token usage for monitoring
```

## Error Handling

The implementation includes graceful fallbacks:

```typescript
try {
  const result = await generateAIResponse({
    prompt: userQuery,
    system: systemPrompt,
    temperature: 0.5,
    maxTokens: 1024,
  })
  return result
} catch (error) {
  console.error('[Copilot] AI generation failed:', error)
  // Fallback to mock response on error
  return generateMockResponse(userQuery)
}
```

**Fallback Scenarios:**
- AI Gateway down → Mock response
- Groq model unavailable → Mock response
- Rate limit hit → Mock response with warning
- Invalid API key → Mock response
- Network timeout → Mock response

## Configuration

### Environment Variables

```env
# For Real Groq AI via Vercel AI Gateway
AI_GATEWAY_API_KEY=<your-vercel-ai-gateway-key>

# Alternative: Direct Groq (requires @ai-sdk/groq)
# GROQ_API_KEY=<your-groq-api-key>
```

### Feature Flags

In `lib/ai-client.ts`:

```typescript
// Control AI mode
const USE_MOCK_RESPONSES = !process.env.AI_GATEWAY_API_KEY

// Control model selection
const MODEL = 'groq/llama-3.1-8b-instant'

// Control temperature (0 = deterministic, 1 = creative)
const temperature = 0.5

// Control response length
const maxTokens = 1024
```

## Performance Characteristics

### Latency Breakdown

| Component | Time | Notes |
|-----------|------|-------|
| Input validation | 10ms | Fast regex checks |
| Intent routing | 5ms | Pattern matching |
| Tool execution | 100-300ms | Mock data retrieval |
| Groq inference | 300ms-2s | LLM processing |
| Response formatting | 20ms | String concatenation |
| **Total** | **~500ms-2.5s** | **Typical case** |

### Token Usage per Query

| Component | Tokens | Notes |
|-----------|--------|-------|
| System prompt | 100-150 | Fixed context |
| User query | 50-100 | Typical query |
| Tool context | 200-500 | Data + metadata |
| Response generation | 400-800 | AI output |
| **Total** | **750-1550** | **Avg ~1000** |

### Cost Estimate (per 1000 queries)

```
Input tokens: 1000 queries × 500 avg input = 500K tokens
Output tokens: 1000 queries × 600 avg output = 600K tokens

Cost = (500K × $0.05/1M) + (600K × $0.15/1M)
     = $0.025 + $0.09
     = $0.115 per 1000 queries
     ≈ $0.0001 per query
```

## Security Considerations

All Groq calls include security measures:

1. **Input Sanitization**
   ```typescript
   // Before sending to Groq
   const validationError = guardrails.validateInput(userQuery)
   if (!validation.valid) return error
   ```

2. **Output Redaction**
   ```typescript
   // After Groq response
   const redacted = guardrails.redactPII(aiResponse)
   ```

3. **Rate Limiting**
   ```typescript
   if (!guardrails.checkRateLimit(vendorId)) {
     return { error: 'Rate limit exceeded' }
   }
   ```

4. **Request Logging**
   ```typescript
   addAuditLog({
     action: 'ai_query',
     query: userQuery,
     model: 'groq/llama-3.1-8b-instant',
     vendorId,
     timestamp: new Date(),
   })
   ```

## Testing Groq Integration

### Test Cases

1. **Basic Query**
   ```
   Query: "What is my revenue today?"
   Expected: Raw data + AI insights + Groq badge
   ```

2. **Trial Users Query**
   ```
   Query: "List trial users of badminton"
   Expected: Trial user list + AI recommendations
   ```

3. **Write Operation**
   ```
   Query: "Extend Arjun's membership by 30 days"
   Expected: Approval request (no AI analysis)
   ```

4. **Error Case**
   ```
   Query: "DROP TABLE users; --"
   Expected: "Suspicious query pattern detected"
   ```

5. **Long Query**
   ```
   Query: (>500 characters)
   Expected: "Query too long (max 500 chars)"
   ```

### Manual Testing

```bash
# Test demo mode
unset AI_GATEWAY_API_KEY
npm run dev
# Chat should work with mock responses

# Test real Groq
export AI_GATEWAY_API_KEY=<your-key>
npm run dev
# Chat should use real AI with badge showing 🤖 Groq AI
```

## Monitoring & Analytics

### Key Metrics to Track

```typescript
{
  queryCount: number,           // Total queries processed
  aiSuccessRate: number,        // % of successful AI calls
  averageLatency: number,       // ms per query
  tokenUsage: {
    input: number,              // Input tokens used
    output: number,             // Output tokens used
    cost: number,               // Estimated cost
  },
  errorRate: number,            // % of errors/fallbacks
  fallbackCount: number,        // Times mock was used
}
```

### Logging Example

```typescript
console.log('[Copilot] Query processed', {
  vendorId,
  queryLength: userQuery.length,
  intent: routing.intent,
  aiConfigured: !!process.env.AI_GATEWAY_API_KEY,
  model: 'groq/llama-3.1-8b-instant',
  latency: `${Date.now() - startTime}ms`,
})
```

## Deployment Checklist

- [ ] Install AI SDK: `pnpm add ai`
- [ ] Set up Vercel AI Gateway API key (or leave empty for demo)
- [ ] Test demo mode locally
- [ ] Test real Groq mode locally
- [ ] Review GROQ_INTEGRATION.md
- [ ] Add AI_GATEWAY_API_KEY to Vercel environment
- [ ] Deploy to Vercel
- [ ] Monitor token usage and costs
- [ ] Set up error alerts
- [ ] Document fallback behavior

## References

- **AI SDK Docs**: https://ai-sdk.dev/docs
- **Vercel AI Gateway**: https://vercel.com/docs/ai
- **Groq Console**: https://console.groq.com
- **Llama 3.1 Docs**: https://www.llama.com
- **HobbyFi Docs**: https://www.hobbyfi.in

## Support

For issues or questions:
1. Check `GROQ_QUICKSTART.md` for quick answers
2. Review `GROQ_INTEGRATION.md` for detailed docs
3. Check console logs for error details
4. Verify API key is set if real AI needed
5. Test in demo mode first
