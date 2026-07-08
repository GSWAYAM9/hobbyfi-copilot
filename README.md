# HobbyFi Copilot - Enterprise AI Vendor Assistant

A sophisticated AI copilot for vendor management in the HobbyFi ecosystem. This is a full-stack demonstration of enterprise-grade AI architecture with safety-critical design patterns.

## 🎯 What is HobbyFi Copilot?

An intelligent assistant that helps vendors manage their businesses through natural language. It can:
- **Read**: Answer questions about revenue, users, bookings, and memberships
- **Write**: Perform actions like extending memberships (with vendor approval)
- **Analyze**: Provide real-time business metrics and insights
- **Audit**: Track all operations for compliance

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- pnpm (or npm/yarn)

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Open http://localhost:3000 in browser
```

The app includes:
- **Landing page** (`/`) - Marketing + architecture docs
- **Demo interface** (`/demo`) - Interactive copilot chat

### Try These Queries in Demo

**Read Operations:**
- "What is my revenue today?"
- "List trial users in badminton"
- "How many active members do I have?"

**Write Operations (Requires Approval):**
- "Extend Arjun's membership by 30 days"
- "Extend Priya's membership"

## 📂 Project Structure

```
HobbyFi-Copilot/
├── app/
│   ├── page.tsx                 # Landing page
│   ├── layout.tsx               # Root layout
│   ├── globals.css              # Design system
│   ├── demo/
│   │   └── page.tsx             # Copilot demo interface
│   └── api/
│       └── copilot/
│           ├── query/route.ts   # Process user queries
│           └── approve/route.ts # Handle approvals
├── components/
│   ├── landing/                 # Landing page sections
│   │   ├── navbar.tsx
│   │   ├── hero.tsx
│   │   ├── features.tsx
│   │   ├── architecture.tsx
│   │   ├── tech-stack.tsx
│   │   ├── security.tsx
│   │   └── footer.tsx
│   └── copilot/                 # Demo components
│       ├── chat-interface.tsx
│       ├── chat-message.tsx
│       ├── approval-modal.tsx
│       ├── metrics-dashboard.tsx
│       └── audit-log.tsx
├── lib/
│   ├── types.ts                 # TypeScript interfaces
│   ├── mock-data.ts             # Mock database
│   ├── copilot-engine.ts        # Core AI logic
│   └── store.ts                 # Zustand state
├── IMPLEMENTATION_SUMMARY.md    # Detailed architecture docs
└── README.md                    # This file
```

## 🏗️ Architecture

### Intent Router
Classifies queries as READ or WRITE operations and extracts context.

### Memory Layer
Zustand-based store managing conversation history, vendor context, and pending approvals.

### Tool Registry
4 specialized tools:
1. **SQL Query Tool** - Database queries (simulated)
2. **Analytics Tool** - Business metrics aggregation
3. **Knowledge Tool** - Business logic & rules
4. **Approval Tool** - Write operation approval

### Guardrails
- Input validation (length, format)
- Injection attack detection
- Rate limiting
- PII redaction
- Output validation

### Orchestrator
Manages tool selection, error handling, and approval workflows.

## 🔐 Security Features

✅ **Injection Prevention**  
Detects SQL, JavaScript, and prompt injection patterns

✅ **Rate Limiting**  
50 queries per minute per vendor

✅ **PII Protection**  
Automatic redaction of emails and phone numbers

✅ **Human Approval Gates**  
All write operations require vendor review

✅ **Audit Logging**  
Complete action history for compliance

## 💾 Mock Data

The demo includes 3 pre-configured vendors:

1. **Smash Arena** (Badminton, Bangalore)
   - 245 members
   - ₹125,000/month revenue
   - 32 trial users

2. **Cricket Connect** (Cricket, Mumbai)
   - 180 members
   - ₹98,000/month revenue
   - 28 trial users

3. **Tennis Pro** (Tennis, New Delhi)
   - 156 members
   - ₹87,500/month revenue
   - 22 trial users

## 🎨 Design System

- **Colors**: Blue, Green, Gray
- **Typography**: Inter, SF Pro Display
- **Components**: Shadcn/ui + custom
- **Animations**: Framer Motion
- **Responsive**: Mobile-first Tailwind

## 📊 Key Metrics Displayed

- **Total Members**: Active paid memberships
- **Trial Users**: Free trial participants
- **Monthly Revenue**: Total bookings in the month
- **Active Users**: Members minus trials

## 🔄 Query Flow

```
User Input
   ↓
[Validation] → Check for injections, length, rate limits
   ↓
[Intent Router] → Classify as READ or WRITE
   ↓
[Tool Selection] → SQL / Analytics / Knowledge / Approval
   ↓
[Read] → Execute immediately, return results
[Write] → Create approval request, wait for vendor approval
   ↓
[Audit Log] → Log all operations
   ↓
Response to User
```

## 🧪 Testing

The application includes mock API endpoints:

```bash
# Test query endpoint
curl -X POST http://localhost:3000/api/copilot/query \
  -H "Content-Type: application/json" \
  -d '{
    "vendorId": "vendor_1",
    "query": "What is my revenue today?"
  }'

# Test approval endpoint
curl -X POST http://localhost:3000/api/copilot/approve \
  -H "Content-Type: application/json" \
  -d '{
    "approvalId": "uuid",
    "vendorId": "vendor_1",
    "action": "approve"
  }'
```

## 📚 Technologies

- **Next.js 15** - Full-stack framework
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Zustand** - State management
- **Lucide React** - Icons

## 🎓 Learning Resources

See `IMPLEMENTATION_SUMMARY.md` for:
- Detailed architecture explanation
- Security implementation details
- Tool registry documentation
- Future enhancement roadmap

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Push to GitHub
git push origin main

# Deploy via Vercel dashboard
# or use CLI
pnpm exec vercel
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN pnpm install
RUN pnpm run build
EXPOSE 3000
CMD ["pnpm", "start"]
```

## 📝 Environment Variables

Current demo uses in-memory mock data. For production:

```
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
OPENAI_API_KEY=sk-...
AUTH_SECRET=...
```

## 🤝 Contributing

This is an assessment project. For improvements or feedback, please reach out.

## 📄 License

© 2026 Clam AI Venture Pvt. Ltd. (HobbyFi). All rights reserved.

---

**Made with ❤️ for HobbyFi**

Visit: https://www.hobbyfi.in/
