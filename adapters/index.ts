// Adapter Registry
// Single import point for all adapters
// Swap implementations here when Rialo goes live

export { rialOIPCAdapter } from "./rialo/ipcAdapter"
export { rialoREXAdapter } from "./rialo/rexAdapter"
export { rialoEdgeAdapter } from "./rialo/edgeAdapter"
export { rialoWorkflowAdapter } from "./rialo/workflowAdapter"
export { rialoOmniAdapter } from "./rialo/omniAccountAdapter"
export { rialoNativeWebCallsAdapter } from "./rialo/nativeWebCallsAdapter"

export const ADAPTER_STATUS = {
  ipc: { name: "Rialo IPC", phase: "Phase 3", available: false },
  rex: { name: "Rialo REX", phase: "Phase 3", available: false },
  edge: { name: "Rialo Edge", phase: "Phase 3", available: false },
  workflow: { name: "Rialo Workflow", phase: "Phase 3", available: false },
  omni: { name: "Rialo Omni Account", phase: "Phase 3", available: false },
  nativeWebCalls: { name: "Rialo Native Web Calls", phase: "Phase 3", available: false },
}
