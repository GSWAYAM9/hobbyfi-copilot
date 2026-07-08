import { approveRequest, rejectRequest, getApprovalRequests } from '@/lib/mock-data'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { approvalId, vendorId, action } = body

    if (!approvalId || !vendorId || !action) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (action === 'approve') {
      const result = approveRequest(approvalId)
      return NextResponse.json({ success: true, approval: result })
    } else if (action === 'reject') {
      const result = rejectRequest(approvalId)
      return NextResponse.json({ success: true, approval: result })
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process approval' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const approvals = getApprovalRequests()
  return NextResponse.json({ approvals })
}
