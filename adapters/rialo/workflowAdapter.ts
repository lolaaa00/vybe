// Rialo Workflow Adapter
// Phase 3: Native async execution without external job queues
// Current: Simulated cron jobs via Vercel

import { BaseAdapter } from "@/adapters/baseAdapter"
import { Platform } from "@/types"

export interface WorkflowJob {
  id: string
  type: "platform_sync" | "badge_evaluation" | "passport_rebuild"
  userId: string
  platform?: Platform
  scheduledAt: string
  status: "pending" | "running" | "completed" | "failed"
}

export interface WorkflowAdapter extends BaseAdapter {
  scheduleSync: (userId: string, platform: Platform) => Promise<WorkflowJob>
  scheduleBadgeEvaluation: (userId: string) => Promise<WorkflowJob>
  getJobStatus: (jobId: string) => Promise<WorkflowJob>
}

export const rialoWorkflowAdapter: WorkflowAdapter = {
  status: {
    available: false,
    phase: "phase3",
    note: "Rialo Workflow not yet public. Using Vercel Cron + Trigger.dev for async jobs.",
  },

  async scheduleSync(userId: string, platform: Platform): Promise<WorkflowJob> {
    await new Promise((r) => setTimeout(r, 100))
    return {
      id: `job_${Math.random().toString(36).slice(2, 10)}`,
      type: "platform_sync",
      userId,
      platform,
      scheduledAt: new Date().toISOString(),
      status: "pending",
    }
  },

  async scheduleBadgeEvaluation(userId: string): Promise<WorkflowJob> {
    await new Promise((r) => setTimeout(r, 100))
    return {
      id: `job_${Math.random().toString(36).slice(2, 10)}`,
      type: "badge_evaluation",
      userId,
      scheduledAt: new Date().toISOString(),
      status: "pending",
    }
  },

  async getJobStatus(jobId: string): Promise<WorkflowJob> {
    await new Promise((r) => setTimeout(r, 100))
    return {
      id: jobId,
      type: "platform_sync",
      userId: "sim_user",
      scheduledAt: new Date().toISOString(),
      status: "completed",
    }
  },
}
