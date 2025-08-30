"use client";

import { useEffect } from "react";

import { useFontStore } from "@/stores/fonts";
import { useSelectedFont } from "@/stores/selected-fonts";

import { generateFontFaceCSS } from "@/lib/generate";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { fonts } = useFontStore();
  const { selectedFont } = useSelectedFont();

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

  return children;
}
