import { create } from 'zustand'
import { ChatMessage, ApprovalRequest } from './types'

interface CopilotStore {
  currentVendorId: string | null
  chatHistory: ChatMessage[]
  pendingApprovals: ApprovalRequest[]
  isLoading: boolean
  error: string | null

  setCurrentVendor: (vendorId: string) => void
  addChatMessage: (message: ChatMessage) => void
  clearChat: () => void
  setIsLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  addPendingApproval: (approval: ApprovalRequest) => void
  updateApprovalStatus: (
    approvalId: string,
    status: 'pending' | 'approved' | 'rejected'
  ) => void
  removePendingApproval: (approvalId: string) => void
}

export const useCopilotStore = create<CopilotStore>((set) => ({
  currentVendorId: null,
  chatHistory: [],
  pendingApprovals: [],
  isLoading: false,
  error: null,

  setCurrentVendor: (vendorId) =>
    set((state) => ({
      ...state,
      currentVendorId: vendorId,
      chatHistory: [],
    })),

  addChatMessage: (message) =>
    set((state) => ({
      ...state,
      chatHistory: [...state.chatHistory, message],
    })),

  clearChat: () =>
    set((state) => ({
      ...state,
      chatHistory: [],
    })),

  setIsLoading: (loading) =>
    set((state) => ({
      ...state,
      isLoading: loading,
    })),

  setError: (error) =>
    set((state) => ({
      ...state,
      error,
    })),

  addPendingApproval: (approval) =>
    set((state) => ({
      ...state,
      pendingApprovals: [...state.pendingApprovals, approval],
    })),

  updateApprovalStatus: (approvalId, status) =>
    set((state) => ({
      ...state,
      pendingApprovals: state.pendingApprovals.map((a) =>
        a.id === approvalId ? { ...a, status } : a
      ),
    })),

  removePendingApproval: (approvalId) =>
    set((state) => ({
      ...state,
      pendingApprovals: state.pendingApprovals.filter((a) => a.id !== approvalId),
    })),
}))
