"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import { presets } from "@/lib/presets";
import { useFontStore } from "@/stores/fonts";
import { useSelectedFont } from "@/stores/selected-fonts";

import PresetList from "@/components/preset-list";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { RiSparkling2Fill } from "@remixicon/react";

export default function Preview() {
  const t = useTranslations("Dashboard.preview.homepage");

  const { fonts } = useFontStore();
  const { selectedFont, setSelectedFont } = useSelectedFont();
  const [lastIndex, setLastIndex] = useState<number | null>(null);

  const displayFont = fonts.find((f) => f.id === selectedFont.display.fontId);
  const headingFont = fonts.find((f) => f.id === selectedFont.heading.fontId);
  const bodyFont = fonts.find((f) => f.id === selectedFont.body.fontId);

  function randomizeFonts() {
    if (presets.length === 0) return;

    let newIndex: number;
    do {
      newIndex = Math.floor(Math.random() * presets.length);
    } while (newIndex === lastIndex && presets.length > 1);

    setLastIndex(newIndex);
    applyPreset(presets[newIndex]);
  }

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
    <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-16">
      <div className="mx-auto my-6 flex w-full max-w-5xl flex-col items-center space-y-4 px-4">
        <Badge variant="outline" className="rounded-full text-sm">
          {[
            displayFont?.family || "Bitter",
            headingFont?.family || "Inter",
            bodyFont?.family || "Inter",
          ]
            .filter(Boolean)
            .filter((v, i, arr) => arr.indexOf(v) === i)
            .join(" + ")}
        </Badge>
        <div className="preview w-full space-y-16">
          <div className="mx-auto max-w-3xl space-y-6 text-center">
            <div className="space-y-4">
              <h1 className="display leading-none text-pretty">
                {t("display")}
              </h1>
              <h2 className="leading-none text-pretty">{t("heading")}</h2>
            </div>
            <p className="text-[1.125em] leading-normal text-pretty">
              {t.rich("body", {
                b: (chunks) => <strong>{chunks}</strong>,
                i: (chunks) => <em>{chunks}</em>,
              })}
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button
                variant="default"
                size="lg"
                onClick={() => randomizeFonts()}
              >
                <RiSparkling2Fill />
                {t("randomize")}
              </Button>
            </div>
          </div>
          <div className="mx-auto grid w-full max-w-5xl gap-6 text-pretty sm:grid-cols-3">
            <div className="flex w-full flex-col items-center gap-2 text-center">
              <h2>{t("features.one.title")}</h2>
              <p>{t("features.one.description")}</p>
            </div>
            <div className="flex w-full flex-col items-center gap-2 text-center">
              <h2>{t("features.two.title")}</h2>
              <p>{t("features.two.description")}</p>
            </div>
            <div className="flex w-full flex-col items-center gap-2 text-center">
              <h2>{t("features.three.title")}</h2>
              <p>{t("features.three.description")}</p>
            </div>
          </div>
        </div>
      </div>
      <PresetList />
    </div>
  );
}
