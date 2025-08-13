// stores/useFavoritesStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface FontData {
  fontId: string;
  weight: number;
  size: number;
}

export interface Preset {
  display: FontData;
  heading: FontData;
  body: FontData;
}

interface FavoritesState {
  favorites: Preset[];
  addFavorite: (preset: Preset) => void;
  removeFavorite: (preset: Preset) => void;
  isFavorite: (preset: Preset) => boolean;
}

export const useFavoritesFonts = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],

      addFavorite: (preset) => {
        const { favorites } = get();

        // Evita duplicados (comparando por fontId de cada campo)
        const exists = favorites.some(
          (f) =>
            f.display.fontId === preset.display.fontId &&
            f.heading.fontId === preset.heading.fontId &&
            f.body.fontId === preset.body.fontId,
        );

        if (!exists) {
          set({ favorites: [...favorites, preset] });
        }
      },

      removeFavorite: (preset) => {
        set({
          favorites: get().favorites.filter(
            (f) =>
              !(
                f.display.fontId === preset.display.fontId &&
                f.heading.fontId === preset.heading.fontId &&
                f.body.fontId === preset.body.fontId
              ),
          ),
        });
      },

      isFavorite: (preset) => {
        return get().favorites.some(
          (f) =>
            f.display.fontId === preset.display.fontId &&
            f.heading.fontId === preset.heading.fontId &&
            f.body.fontId === preset.body.fontId,
        );
      },
    }),
    {
      name: "favorites-fonts",
    },
  ),
);
