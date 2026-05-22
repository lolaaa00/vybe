import { create } from "zustand"
import { PassportSection, ReputationSignal, PrivacyState } from "@/types"

interface PassportStore {
  sections: PassportSection[]
  signals: ReputationSignal[]
  passportNumber: string
  setSections: (sections: PassportSection[]) => void
  setSignals: (signals: ReputationSignal[]) => void
  updatePrivacy: (sectionId: string, privacy: PrivacyState) => void
  reset: () => void
}

function generatePassportNumber(): string {
  return "VP-" + Math.floor(Math.random() * 900000 + 100000)
}

export const usePassportStore = create<PassportStore>((set) => ({
  sections: [],
  signals: [],
  passportNumber: generatePassportNumber(),
  setSections: (sections) => set({ sections }),
  setSignals: (signals) => set({ signals }),
  updatePrivacy: (sectionId, privacy) =>
    set((state) => ({
      sections: state.sections.map((s) =>
        s.id === sectionId ? { ...s, privacy } : s
      ),
    })),
  reset: () =>
    set({
      sections: [],
      signals: [],
      passportNumber: generatePassportNumber(),
    }),
}))
