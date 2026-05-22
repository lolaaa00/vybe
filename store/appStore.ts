import { create } from 'zustand'

type Step = 1 | 2 | 3 | 4

type Platform = 'github' | 'spotify' | 'discord' | 'x' | 'wallet'

interface User {
  id: string
  name: string
  handle: string
  avatar: string
  loginMethod: 'google' | 'apple' | 'wallet'
}

interface AppStore {
  step: Step
  user: User | null
  connectedPlatforms: Platform[]
  isGenerating: boolean
  setStep: (step: Step) => void
  setUser: (user: User) => void
  togglePlatform: (platform: Platform) => void
  setGenerating: (val: boolean) => void
  reset: () => void
}

export const useAppStore = create<AppStore>((set) => ({
  step: 1,
  user: null,
  connectedPlatforms: [],
  isGenerating: false,
  setStep: (step) => set({ step }),
  setUser: (user) => set({ user }),
  togglePlatform: (platform) =>
    set((state) => ({
      connectedPlatforms: state.connectedPlatforms.includes(platform)
        ? state.connectedPlatforms.filter((p) => p !== platform)
        : [...state.connectedPlatforms, platform],
    })),
  setGenerating: (val) => set({ isGenerating: val }),
  reset: () =>
    set({
      step: 1,
      user: null,
      connectedPlatforms: [],
      isGenerating: false,
    }),
}))
