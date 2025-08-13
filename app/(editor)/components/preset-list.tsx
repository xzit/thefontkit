"use client";

import { presets } from "@/lib/presets";
import { useFontStore } from "@/stores/fonts";
import { useSelectedFont } from "@/stores/selected-fonts";

import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { RiHeart3Fill, RiHeart3Line } from "@remixicon/react";
import { useFavoritesFonts } from "@/stores/favorites-fonts";
import { useEffect, useState } from "react";

export default function PresetList() {
  const fonts = useFontStore((state) => state.fonts);
  const { setSelectedFont } = useSelectedFont();
  const { addFavorite, removeFavorite, isFavorite } = useFavoritesFonts();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  function applyPreset(preset: (typeof presets)[number]) {
    (Object.keys(preset) as Array<"display" | "heading" | "body">).forEach(
      (section) => {
        Object.entries(preset[section]).forEach(([prop, value]) => {
          setSelectedFont(section, prop as "fontId" | "weight" | "size", value);
        });
      },
    );
  }

  return (
    <div className="grid w-full auto-rows-fr gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {presets.map((preset, index) => {
        const fontMap = Object.fromEntries(fonts.map((f) => [f.id, f.family]));
        const fav = isFavorite(preset);
        return (
          <Card
            key={index}
            onClick={() => applyPreset(preset)}
            className="hover:bg-accent dark:hover:bg-input/50 cursor-pointer"
          >
            <CardHeader>
              <CardTitle className="line-clamp-1">
                {fontMap[preset.display.fontId]} + {fontMap[preset.body.fontId]}
              </CardTitle>
              <CardDescription className="col-span-2 line-clamp-1">
                Display: {preset.display.weight} • Heading:{" "}
                {preset.heading.weight} • Body: {preset.body.weight}
              </CardDescription>
              <CardAction className="-mt-4 -mr-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    fav ? removeFavorite(preset) : addFavorite(preset);
                  }}
                >
                  {mounted ? (
                    fav ? (
                      <RiHeart3Fill />
                    ) : (
                      <RiHeart3Line />
                    )
                  ) : (
                    <RiHeart3Line />
                  )}
                </Button>
              </CardAction>
            </CardHeader>
          </Card>
        );
      })}
    </div>
  );
}
