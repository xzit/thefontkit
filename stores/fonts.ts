import { toast } from "sonner";
import { create } from "zustand";

export type Font = {
  id: string;
  family: string;
  subsets: string[];
  weights: number[];
  styles: string[];
  defSubset: string;
  variable: boolean;
  lastModified: string;
  category: string;
  version: string;
  type: string;
};

interface FontStore {
  fonts: Font[];
  loading: boolean;
  error?: string;
  hasFetched: boolean;
  fetchFonts: () => Promise<void>;
}

export const useFontStore = create<FontStore>((set, get) => ({
  fonts: [],
  loading: false,
  error: undefined,
  hasFetched: false,

  fetchFonts: async () => {
    if (get().hasFetched) return;

    set({ loading: true, error: undefined, hasFetched: true });
    try {
      const res = await fetch("/api/fonts");
      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || "Unknown error");
      }
      const data = await res.json();
      set({ fonts: data, loading: false });
    } catch (err) {
      const message = (err as Error).message;
      toast.error(message);
      set({ error: message, loading: false });
    }
  },
}));
