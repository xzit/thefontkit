"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import { presets } from "@/lib/presets";
import { useFontStore } from "@/stores/fonts";
import { useSelectedFont } from "@/stores/selected-fonts";

import { Font } from "@/components/font-combobox";
import { Button } from "@/components/ui/button";

import { RiSparkling2Fill } from "@remixicon/react";
import { Badge } from "@/components/ui/badge";

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

    function applyPreset(preset: (typeof presets)[number]) {
      (Object.keys(preset) as Array<"display" | "heading" | "body">).forEach(
        (section) => {
          Object.entries(preset[section]).forEach(([prop, value]) => {
            setSelectedFont(
              section,
              prop as "fontId" | "weight" | "size",
              value,
            );
          });
        },
      );
    }
  }

  return (
    <div className="my-6 space-y-4 mx-auto max-w-5xl px-4 flex flex-col items-center">
      <Badge variant="outline" className="rounded-full">
        {`${displayFont?.family} + ${headingFont?.family} + ${bodyFont?.family}`}
      </Badge>
      <div className="preview">
        <div className="space-y-6 text-center max-w-3xl mx-auto">
          <div className="space-y-4">
            <h1 className="display text-pretty leading-none">{t("display")}</h1>
            <h2 className="text-pretty leading-none">{t("heading")}</h2>
          </div>
          <p className="text-pretty leading-normal">
            {t.rich("body", {
              b: (chunks) => <strong>{chunks}</strong>,
              i: (chunks) => <em>{chunks}</em>,
            })}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
      </div>
    </div>
  );
}
