"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import { presets } from "@/lib/presets";
import { useFontStore } from "@/stores/fonts";
import { useSelectedFont } from "@/stores/selected-fonts";

import Footer from "@/components/footer";
import { Font } from "@/components/font-combobox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { RiHeart3Line, RiSparkling2Fill } from "@remixicon/react";
import PresetList from "./preset-list";

function generateFontFaceCSS(font: Font) {
  const css: string[] = [];

  if (font.variable) {
    // Variable fonts: subset, wght & style
    font.subsets.forEach((subset) => {
      font.styles.forEach((style) => {
        const url = `https://cdn.jsdelivr.net/fontsource/fonts/${font.id}:vf@latest/${subset}-wght-${style}.woff2`;
        css.push(`
          @font-face {
            font-family: '${font.family}';
            font-style: ${style};
            font-weight: 100 900;
            font-display: swap;
            src: url('${url}') format('woff2-variations');
          }
        `);
      });
    });
  } else {
    // Static fonts: subset, weight & style
    font.subsets.forEach((subset) => {
      font.weights.forEach((weight) => {
        font.styles.forEach((style) => {
          const url = `https://cdn.jsdelivr.net/fontsource/fonts/${font.id}@latest/${subset}-${weight}-${style}.woff2`;
          css.push(`
            @font-face {
              font-family: '${font.family}';
              font-style: ${style};
              font-weight: ${weight};
              font-display: swap;
              src: url('${url}') format('woff2');
            }
          `);
        });
      });
    });
  }

  return css.join("\n");
}

export default function Preview() {
  const t = useTranslations("Dashboard.preview.homepage");

  const { fonts } = useFontStore();
  const { selectedFont, setSelectedFont } = useSelectedFont();
  const [lastIndex, setLastIndex] = useState<number | null>(null);

  const displayFont = fonts.find((f) => f.id === selectedFont.display.fontId);
  const headingFont = fonts.find((f) => f.id === selectedFont.heading.fontId);
  const bodyFont = fonts.find((f) => f.id === selectedFont.body.fontId);

  useEffect(() => {
    const styleEl = document.createElement("style");
    styleEl.setAttribute("data-fontsource", "true");

    const allFonts = [displayFont, headingFont, bodyFont]
      .filter(Boolean)
      .filter(
        (font, index, self) =>
          self.findIndex((f) => f?.id === font?.id) === index,
      );

    const cssRules = allFonts
      .map((font) => generateFontFaceCSS(font!))
      .join("\n");

    styleEl.textContent = cssRules;
    document.head.appendChild(styleEl);

    return () => {
      document.head
        .querySelectorAll("[data-fontsource='true']")
        .forEach((el) => el.remove());
    };
  }, [selectedFont]);

  useEffect(() => {
    if (displayFont) {
      document.documentElement.style.setProperty(
        "--font-display",
        `'${displayFont.family}', sans-serif`,
      );
      document.documentElement.style.setProperty(
        "--font-display-weight",
        selectedFont.display.weight.toString(),
      );
      document.documentElement.style.setProperty(
        "--font-display-size",
        selectedFont.display.size.toString() + "px",
      );
    }
    if (headingFont) {
      document.documentElement.style.setProperty(
        "--font-heading",
        `'${headingFont.family}', sans-serif`,
      );
      document.documentElement.style.setProperty(
        "--font-heading-weight",
        selectedFont.heading.weight.toString(),
      );
      document.documentElement.style.setProperty(
        "--font-heading-size",
        selectedFont.heading.size.toString() + "px",
      );
    }
    if (bodyFont) {
      document.documentElement.style.setProperty(
        "--font-body",
        `'${bodyFont.family}', sans-serif`,
      );
      document.documentElement.style.setProperty(
        "--font-body-weight",
        selectedFont.body.weight.toString(),
      );
      document.documentElement.style.setProperty(
        "--font-body-size",
        selectedFont.body.size.toString() + "px",
      );
    }
  }, [selectedFont]);

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
          {`${displayFont?.family || "Bitter"} + ${bodyFont?.family || "Inter"}`}
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
      <Footer />
    </div>
  );
}
