import { create } from "zustand";

type FontType = "display" | "heading" | "body";

interface FontSettings {
  fontId: string;
  weight: number;
  size: number;
}

interface FontStore {
  selectedFont: Record<FontType, FontSettings>;
  setSelectedFont: (
    type: FontType,
    key: keyof FontSettings,
    value: string | number,
  ) => void;
}

export const useSelectedFont = create<FontStore>((set) => ({
  selectedFont: {
    display: { fontId: "bitter", weight: 700, size: 48 },
    heading: { fontId: "inter", weight: 600, size: 24 },
    body: { fontId: "inter", weight: 400, size: 16 },
  },
  setSelectedFont: (type, key, value) =>
    set((state) => ({
      selectedFont: {
        ...state.selectedFont,
        [type]: {
          ...state.selectedFont[type],
          [key]: value,
        },
      },
    })),
}));
