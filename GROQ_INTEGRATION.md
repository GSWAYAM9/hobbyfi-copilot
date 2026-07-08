# HobbyFi Copilot - Groq AI Integration Guide

## Overview

The HobbyFi Copilot now uses **Groq** as its AI backbone, powered by the **Vercel AI SDK** and **Vercel AI Gateway** for seamless integration. This enables intelligent, real-time vendor analytics with natural language understanding.

## Architecture

```
User Query
    ↓
Validation & Guardrails (Injection Detection, Rate Limiting, PII)
    ↓
Intent Router (READ vs WRITE)
    ↓
Tool Execution (SQL, Analytics, Knowledge)
    ↓
AI Analysis (Groq via Vercel AI Gateway)
    ↓
Approval Workflow (if WRITE operation)
    ↓
Audit Log & Response
```

## Setup & Configuration

### Prerequisites

1. **Vercel AI SDK** (already installed)
   ```bash
   pnpm add ai
   ```

2. **Vercel AI Gateway** API Key (optional for demo mode)
   - The copilot works in **demo mode** with mock responses when no API key is configured
   - For real AI responses, add `AI_GATEWAY_API_KEY` to your environment

### Getting Groq API Access

1. Groq is available through the **Vercel AI Gateway** (zero-config)
2. Alternative: Set up direct Groq access via `@ai-sdk/groq` (requires `GROQ_API_KEY`)

### Environment Variables

```env
# Option 1: Use Vercel AI Gateway (Recommended)
AI_GATEWAY_API_KEY=<your-vercel-ai-gateway-key>

# Option 2: Direct Groq (if using @ai-sdk/groq)
# GROQ_API_KEY=<your-groq-api-key>
```

## How It Works

### Read Operations (Queries)

1. **Query Processing**
   ```
   User: "What is my revenue today?"
   ↓
   Intent: READ
   ↓
   Tool: SQL Query on mock data
   Result: ₹8,500 from 12 bookings
   ↓
   AI Analysis (Groq): Generates human-readable insights
   "Based on today's booking data, your total revenue is ₹8,500..."
   ```

2. **AI-Powered Response** (Groq)
   - Model: `groq/llama-3.1-8b-instant`
   - Temperature: 0.5 (balanced between deterministic & creative)
   - Context: Vendor data, historical metrics, HobbyFi knowledge base

### Write Operations (Modifications)

1. **Approval Gate**
   ```
   User: "Extend Arjun's membership by 30 days"
   ↓
   Intent: WRITE
   ↓
   Action: Generate approval request
   ↓
   Status: Pending Vendor Approval
   ```

2. **Vendor Review**
   - Vendor sees detailed approval modal
   - Modal displays query, impact, and action details
   - Vendor can approve/reject

3. **Execution & Audit**
   - On approval: Execute the write operation
   - Log to audit trail with timestamp and vendor ID

## Code Integration Points

### 1. AI Client (`lib/ai-client.ts`)

```typescript
import { generateAIResponse, analyzeWithAI } from '@/lib/ai-client'

// Generate text with Groq
const response = await generateAIResponse({
  prompt: 'Analyze vendor performance',
  system: 'You are a business analyst...',
  temperature: 0.5,
  maxTokens: 1024,
})

// Structured analysis with context
const { analysis, confidence, requiresApproval } = await analyzeWithAI(
  query,
  vendorContext
)
```

### 2. Copilot Engine (`lib/copilot-engine.ts`)

The engine integrates AI analysis into the query orchestration:

```typescript
if (routing.intent === 'read') {
  const toolResult = tools.sqlQuery(vendorId, userQuery)

  // Get AI insights
  const aiResponse = await analyzeWithAI(userQuery, toolResult)
  result = {
    ...toolResult,
    aiInsights: aiResponse.analysis,
  }
}
```

### 3. API Route (`app/api/copilot/query/route.ts`)

Returns metadata about which AI model was used:

```json
{
  "intent": "read",
  "result": {
    "revenue": 8500,
    "bookings": 12,
    "aiInsights": "Based on today's booking data..."
  },
  "_metadata": {
    "aiModel": "groq/llama-3.1-8b-instant",
    "aiProvider": "Vercel AI Gateway (Groq)",
    "aiConfigured": true,
    "timestamp": "2025-07-08T..."
  }
}
```

### 4. Chat Interface (`components/copilot/chat-interface.tsx`)

Displays AI insights with model badge:

```tsx
if (result.result.aiInsights) {
  formattedResult = `**AI Analysis (Powered by Groq):**\n${result.result.aiInsights}`
}
```

### 5. Chat Message Component (`components/copilot/chat-message.tsx`)

Shows model badge and configuration status:

```tsx
{message.metadata?.aiModel && !isUser && (
  <div className="mt-2 pt-2 border-t">
    <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-1 rounded">
      {message.metadata.aiConfigured ? '🤖 Groq AI' : '🔄 Demo Mode'}
    </span>
    <span className="text-xs text-gray-500">{message.metadata.aiModel}</span>
  </div>
)}
```

## Demo Mode vs Real AI

### Demo Mode (No API Key)
- Uses mock AI responses
- Badge shows: "🔄 Demo Mode"
- Perfect for testing the architecture
- Responses are realistic but pre-written

### Real AI Mode (With API Key)
- Uses actual Groq models via Vercel AI Gateway
- Badge shows: "🤖 Groq AI - groq/llama-3.1-8b-instant"
- Live AI analysis and insights
- Contextual responses based on actual vendor data

## Example Queries

### Read Operations (No Approval)
```
"What is my revenue today?"
→ Revenue: ₹8,500 (12 bookings)
→ AI Insight: "Revenue is trending 15% above 7-day average"

"List trial users of badminton"
→ Trial Users: 18 active trials
→ AI Insight: "Trial conversion rate: 23% (9 converted last month)"

"How many active memberships do I have?"
→ Memberships: 156 total (79% monthly, 14% quarterly, 7% annual)
→ AI Insight: "MRR is ₹18,720 with excellent 3.2% churn rate"
```

### Write Operations (Approval Required)
```
"Extend Arjun's membership by 30 days"
→ Approval Required
→ Vendor Reviews & Approves
→ Action Executed & Logged

"Increase free trial for Priya by 7 days"
→ Approval Required
→ Vendor Reviews & Approves
→ Action Executed & Logged
```

## Security & Guardrails

All queries go through multiple security layers:

1. **Input Validation**
   - Max length: 500 characters
   - Empty check
   - Pattern validation

2. **Injection Detection**
   - SQL injection patterns: `DROP`, `DELETE`, `UPDATE`, etc.
   - Script injection: `<script>`, `javascript:`, etc.
   - Suspicious operators: `--`, `;`, `/* */`

3. **Rate Limiting**
   - Per-vendor quota (currently mock, use Redis in production)
   - Configurable per-minute limit

4. **PII Protection**
   - Email address redaction: `[EMAIL]`
   - Phone number redaction: `[PHONE]`
   - Applied to all output

5. **Approval Gates**
   - All write operations require vendor approval
   - Audit trail for all changes
   - Full query history preserved

## Available Groq Models

Via Vercel AI Gateway, you can use:

- `groq/llama-3.1-8b-instant` (Recommended - balanced)
- `groq/llama-3.1-70b-versatile` (More powerful)
- `groq/mixtral-8x7b-32768` (Expert mixture)

To list all available models:
```bash
curl -s https://ai-gateway.vercel.sh/v1/models | jq -r '.data[].id'
```

## Performance Considerations

### Latency
- Read queries: <1 second (tool + AI analysis)
- Write queries: <2 seconds (approval generation)
- AI response time: 500ms-2s depending on model

### Cost
- Groq via AI Gateway: Vercel pricing
- Direct Groq: ~$0.05/1M input tokens, $0.15/1M output tokens

### Token Usage
- Average vendor query: 200-500 tokens
- AI analysis adds: 500-1000 tokens
- Approval requests: 100-200 tokens

## Troubleshooting

### "No response from AI"
- Check `AI_GATEWAY_API_KEY` is set (if real AI desired)
- App automatically falls back to demo mode
- Check browser console for errors

### "Model not found"
- Verify model name is correct
- Check available models with curl command above
- Update `ai-client.ts` with correct model name

### "Rate limit exceeded"
- Per-vendor query limit hit
- Wait 1 minute for reset (demo)
- Implement Redis for production

### "Query too long"
- Maximum 500 characters
- Simplify your query

## Production Deployment Checklist

- [ ] Set `AI_GATEWAY_API_KEY` in Vercel environment
- [ ] Enable Redis-backed rate limiting
- [ ] Add PII redaction for sensitive fields
- [ ] Set up error alerting
- [ ] Configure audit log retention policy
- [ ] Add comprehensive logging for all AI calls
- [ ] Set up cost monitoring for API usage
- [ ] Test approval workflow at scale
- [ ] Validate all guardrails with penetration testing

## Future Enhancements

1. **Multi-Turn Conversations**
   - Maintain context across multiple queries
   - Follow-up question support

2. **Custom Models**
   - Fine-tuning on HobbyFi domain
   - Vendor-specific models

3. **Advanced Analytics**
   - Predictive insights
   - Anomaly detection
   - Trend analysis

4. **Streaming Responses**
   - Real-time AI response streaming
   - Faster perceived response time

5. **Function Calling**
   - AI-triggered tool execution
   - Conditional workflows

## Support & Resources

- **AI SDK Docs**: https://ai-sdk.dev/docs
- **Vercel AI Gateway**: https://vercel.com/docs/ai
- **Groq API**: https://console.groq.com
- **HobbyFi Copilot GitHub**: (your repo)
