"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import { presets } from "@/lib/presets";
import { useFontStore } from "@/stores/fonts";
import { useSelectedFont } from "@/stores/selected-fonts";
import { useFavoritesFonts } from "@/stores/favorites-fonts";

import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { RiHeart3Fill, RiHeart3Line } from "@remixicon/react";
import { Skeleton } from "@/components/skeleton";

export default function PresetList() {
  const t = useTranslations("Dashboard.presets");

  const { fonts } = useFontStore();
  const { setSelectedFont } = useSelectedFont();
  const { addFavorite, removeFavorite, isFavorite, favorites } =
    useFavoritesFonts();

  const [itemsCount, setItemsCount] = useState(12);
  const presetsList = presets.slice(0, itemsCount);

  const handleLoadMore = () => {
    setItemsCount((prev) => prev + 12);
  };

  function applyPreset(preset: (typeof presets)[number]) {
    (Object.keys(preset) as Array<"display" | "heading" | "body">).forEach(
      (section) => {
        Object.entries(preset[section]).forEach(([prop, value]) => {
          setSelectedFont(section, prop as "fontId" | "weight" | "size", value);
        });
      },
    );
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="flex w-full flex-col gap-8">
      <div className="flex flex-col gap-4">
        {favorites.length > 0 && (
          <h4 className="text-lg font-semibold">{t("favorites")}</h4>
        )}
        <div className="grid w-full auto-rows-fr gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {favorites.map((preset, index) => {
            const fontMap = Object.fromEntries(
              fonts.map((f) => [f.id, f.family]),
            );
            const fav = isFavorite(preset);
            return (
              <Card
                key={index}
                onClick={() => applyPreset(preset)}
                className="hover:bg-accent dark:hover:bg-input/50 cursor-pointer"
              >
                <CardHeader>
                  <CardTitle className="line-clamp-1">
                    <Skeleton loading={!fonts.length}>
                      {fonts.length > 0
                        ? fontMap[preset.display.fontId] +
                          " + " +
                          fontMap[preset.body.fontId]
                        : "Loading..."}
                    </Skeleton>
                  </CardTitle>
                  <CardDescription className="col-span-2 line-clamp-1">
                    <Skeleton loading={!fonts.length}>
                      {t("display")}: {preset.display.weight} • {t("heading")}:{" "}
                      {preset.heading.weight} • {t("body")}:{" "}
                      {preset.body.weight}
                    </Skeleton>
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
                      {fonts.length > 0 ? (
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
      </div>
      <div className="flex flex-col gap-4">
        <h4 className="text-lg font-semibold">{t("presets")}</h4>
        <div className="grid w-full auto-rows-fr gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {presetsList.map((preset, index) => {
            const fontMap = Object.fromEntries(
              fonts.map((f) => [f.id, f.family]),
            );
            const fav = isFavorite(preset);
            return (
              <Card
                key={index}
                onClick={() => applyPreset(preset)}
                className="hover:bg-accent dark:hover:bg-input/50 cursor-pointer"
              >
                <CardHeader>
                  <CardTitle className="line-clamp-1">
                    <Skeleton loading={!fonts.length}>
                      {fonts.length > 0
                        ? fontMap[preset.display.fontId] +
                          " + " +
                          fontMap[preset.body.fontId]
                        : "Loading..."}
                    </Skeleton>
                  </CardTitle>
                  <CardDescription className="col-span-2 line-clamp-1">
                    <Skeleton loading={!fonts.length}>
                      {t("display")}: {preset.display.weight} • {t("heading")}:{" "}
                      {preset.heading.weight} • {t("body")}:{" "}
                      {preset.body.weight}
                    </Skeleton>
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
                      {fonts.length > 0 ? (
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
      </div>
      <div className="flex justify-center">
        {itemsCount < presets.length && (
          <Button
            variant="outline"
            className="w-full max-w-3xs rounded-full"
            onClick={handleLoadMore}
          >
            {t("load")}
          </Button>
        )}
      </div>
    </div>
  );
}
