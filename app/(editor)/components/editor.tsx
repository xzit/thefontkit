"use client";

import { useState, useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";

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
import { RiArrowRightSLine, RiEqualizer3Fill } from "@remixicon/react";
import { Font } from "@/components/font-combobox";

const fonts: Font[] = [
  {
    id: "abeezee",
    family: "ABeeZee",
    subsets: ["latin"],
    weights: [400],
    styles: ["italic", "normal"],
    defSubset: "latin",
    variable: false,
    lastModified: "2020-09-02",
    category: "sans-serif",
    version: "v14",
    type: "google",
  },
];

function generateFontFaceCSS(font: Font) {
  const css: string[] = [];

  if (font.variable) {
    // Variable fonts: solo subset, wght y style
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
    // Static fonts: subset, weight y style
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
  const t = useTranslations("Dashboard.sidebar.settings");
  const [displayFontId, setDisplayFontId] = useState("inter");
  const [headingFontId, setHeadingFontId] = useState("inter");
  const [bodyFontId, setBodyFontId] = useState("inter");

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
  }, [displayFont, headingFont, bodyFont]);

  useEffect(() => {
    if (displayFont) {
      document.documentElement.style.setProperty(
        "--font-display",
        `'${displayFont.family}', sans-serif`,
      );
    }
    if (headingFont) {
      document.documentElement.style.setProperty(
        "--font-heading",
        `'${headingFont.family}', sans-serif`,
      );
    }
    if (bodyFont) {
      document.documentElement.style.setProperty(
        "--font-body",
        `'${bodyFont.family}', sans-serif`,
      );
    }
  }, [displayFont, headingFont, bodyFont]);

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
                <RiEqualizer3Fill />
                {t("title")}
                <RiArrowRightSLine className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
          </SidebarGroupLabel>
          <CollapsibleContent>
            <div className="px-2 flex flex-col gap-4">
              <div className="space-y-2">
                <Label>{t("form.display")}</Label>
                <FontCombobox
                  fonts={fonts}
                  label={t("form.display")}
                  value={displayFontId}
                  onChange={setDisplayFontId}
                />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>{t("form.heading")}</Label>
                <FontCombobox
                  fonts={fonts}
                  label={t("form.heading")}
                  value={headingFontId}
                  onChange={setHeadingFontId}
                />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>{t("form.body")}</Label>
                <FontCombobox
                  fonts={fonts}
                  label={t("form.body")}
                  value={bodyFontId}
                  onChange={setBodyFontId}
                />
              </div>
            </div>
          </CollapsibleContent>
        </SidebarGroup>
      </Collapsible>
    </div>
  );
}
