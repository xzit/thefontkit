"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { FontCombobox } from "@/components/font-combobox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { RiArrowRightSLine, RiFontSansSerif } from "@remixicon/react";
import { Font } from "@/components/font-combobox";
import { Slider } from "@/components/ui/slider";

interface FontSelectorProps {
  label: string;
  fonts: Font[];
  selectedFontId: string;
  onFontChange: (fontId: string) => void;
  weight: number;
  onWeightChange: (weight: number) => void;
  font?: Font;
}

const weightNames: Record<number, string> = {
  100: "Thin",
  200: "Extra Light",
  300: "Light",
  400: "Regular",
  500: "Medium",
  600: "Semi Bold",
  700: "Bold",
  800: "Extra Bold",
  900: "Black",
};

export function FontEditor({
  label,
  fonts,
  selectedFontId,
  onFontChange,
  weight,
  onWeightChange,
  font,
}: FontSelectorProps) {
  const currentFont = font || fonts.find((f) => f.id === selectedFontId);

  const fontWeights = currentFont?.weights ?? [400];
  const minWeight = Math.min(...fontWeights);
  const maxWeight = Math.max(...fontWeights);
  const weightIndex = Math.max(
    0,
    fontWeights.findIndex((w) => w === weight),
  );

  return (
    <div className="space-y-4">
      <div className="space-y-2.5">
        <Label>{label}</Label>
        <FontCombobox
          fonts={fonts}
          label={label}
          value={selectedFontId}
          onChange={(fontId) => {
            onFontChange(fontId);
            onWeightChange(fontWeights.length > 1 ? 400 : fontWeights[0]);
          }}
        />
      </div>

      <div className="space-y-4">
        <Label className="flex justify-between">
          <span>Weight</span>
          <span className="text-xs text-muted-foreground ml-auto">
            {weightNames[weight] ? `${weightNames[weight]} ${weight}` : weight}
          </span>
        </Label>
        {currentFont?.variable ? (
          // Variable font
          <Slider
            value={[weight]}
            min={minWeight}
            max={maxWeight}
            step={1}
            onValueChange={([w]) => onWeightChange(w)}
          />
        ) : (
          // Static font
          <Slider
            value={[fontWeights.length > 1 ? weightIndex : 1]}
            min={0}
            max={fontWeights.length > 1 ? fontWeights.length - 1 : 1}
            step={1}
            onValueChange={([i]) => {
              const realWeight = fontWeights[i];
              onWeightChange(realWeight);
            }}
            disabled={fontWeights.length === 1}
          />
        )}
      </div>
    </div>
  );
}

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

export default function Editor() {
  const t = useTranslations("Dashboard.sidebar.font-family");

  const [fonts, setFonts] = useState<Font[]>([]);

  const [displayFontId, setDisplayFontId] = useState("inter");
  const [headingFontId, setHeadingFontId] = useState("inter");
  const [bodyFontId, setBodyFontId] = useState("inter");
  const [displayWeight, setDisplayWeight] = useState(400);
  const [headingWeight, setHeadingWeight] = useState(400);
  const [bodyWeight, setBodyWeight] = useState(400);

  useEffect(() => {
    async function fetchFonts() {
      try {
        const res = await fetch("/api/fonts");
        if (!res.ok) throw new Error(t("error"));
        const data = await res.json();
        setFonts(data);
      } catch (err) {
        toast((err as Error).message);
      } finally {
      }
    }

    fetchFonts();
  }, []);

  const displayFont = fonts.find((f) => f.id === displayFontId);
  const headingFont = fonts.find((f) => f.id === headingFontId);
  const bodyFont = fonts.find((f) => f.id === bodyFontId);

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
  }, [
    displayFont,
    headingFont,
    bodyFont,
    displayWeight,
    headingWeight,
    bodyWeight,
  ]);

  useEffect(() => {
    if (displayFont) {
      document.documentElement.style.setProperty(
        "--font-display",
        `'${displayFont.family}', sans-serif`,
      );
      document.documentElement.style.setProperty(
        "--font-display-weight",
        displayWeight.toString(),
      );
    }
    if (headingFont) {
      document.documentElement.style.setProperty(
        "--font-heading",
        `'${headingFont.family}', sans-serif`,
      );
      document.documentElement.style.setProperty(
        "--font-heading-weight",
        headingWeight.toString(),
      );
    }
    if (bodyFont) {
      document.documentElement.style.setProperty(
        "--font-body",
        `'${bodyFont.family}', sans-serif`,
      );
      document.documentElement.style.setProperty(
        "--font-body-weight",
        bodyWeight.toString(),
      );
    }
  }, [
    displayFont,
    headingFont,
    bodyFont,
    displayWeight,
    headingWeight,
    bodyWeight,
  ]);

  return (
    <div className="space-y-4">
      <Collapsible defaultOpen className="group/collapsible">
        <SidebarGroup className="gap-4">
          <SidebarGroupLabel
            asChild
            className="group/label text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sm"
          >
            <CollapsibleTrigger asChild>
              <SidebarMenuButton tooltip={t("title")}>
                <RiFontSansSerif />
                {t("title")}
                <RiArrowRightSLine className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
          </SidebarGroupLabel>
          <CollapsibleContent>
            <div className="px-2 flex flex-col gap-4">
              <FontEditor
                label={t("form.display")}
                fonts={fonts}
                selectedFontId={displayFontId}
                onFontChange={setDisplayFontId}
                weight={displayWeight}
                onWeightChange={setDisplayWeight}
                font={displayFont}
              />
              <Separator />
              <FontEditor
                label={t("form.heading")}
                fonts={fonts}
                selectedFontId={headingFontId}
                onFontChange={setHeadingFontId}
                weight={headingWeight}
                onWeightChange={setHeadingWeight}
                font={headingFont}
              />
              <Separator />
              <FontEditor
                label={t("form.body")}
                fonts={fonts}
                selectedFontId={bodyFontId}
                onFontChange={setBodyFontId}
                weight={bodyWeight}
                onWeightChange={setBodyWeight}
                font={bodyFont}
              />
            </div>
          </CollapsibleContent>
        </SidebarGroup>
      </Collapsible>
    </div>
  );
}
