// Base adapter interface
// All Rialo adapters implement this pattern
// Swap the implementation without changing feature code

export interface AdapterStatus {
  available: boolean
  phase: "current" | "phase2" | "phase3"
  note: string
}

export interface BaseAdapter {
  status: AdapterStatus
}
