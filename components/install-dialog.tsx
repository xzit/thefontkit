"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

import { Font, useFontStore } from "@/stores/fonts";
import { useSelectedFont } from "@/stores/selected-fonts";
import { useFavoritesFonts } from "@/stores/favorites-fonts";

import { CopyablePre } from "@/components/copyable-pre";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  RiDownloadLine,
  RiExternalLinkLine,
  RiGlobalLine,
  RiHeart3Fill,
  RiHeart3Line,
  RiTerminalLine,
} from "@remixicon/react";

function generateFontFaceCSS(font: Font) {
  const cssBlocks: string[] = [];
  const baseId = font.variable ? `${font.id}:vf` : font.id;
  const familyName = font.family + (font.variable ? " Variable" : "");

  // Normal style
  if (font.variable) {
    // Variable font
    cssBlocks.push(`@font-face {
  font-family: '${familyName}';
  font-style: normal;
  font-display: swap;
  font-weight: 100 900;
  src: url(https://cdn.jsdelivr.net/fontsource/fonts/${baseId}@latest/latin-wght-normal.woff2) format('woff2-variations');
}`);
  } else {
    // Static, puede tener varios pesos, genera uno por peso
    for (const weight of font.weights) {
      cssBlocks.push(`@font-face {
  font-family: '${familyName}';
  font-style: normal;
  font-display: swap;
  font-weight: ${weight};
  src: url(https://cdn.jsdelivr.net/fontsource/fonts/${baseId}@latest/latin-${weight}-normal.woff2) format('woff2');
}`);
    }
  }

  // Italic style (si existe)
  if (font.styles.includes("italic")) {
    if (font.variable) {
      cssBlocks.push(`@font-face {
  font-family: '${familyName}';
  font-style: italic;
  font-display: swap;
  font-weight: 100 900;
  src: url(https://cdn.jsdelivr.net/fontsource/fonts/${baseId}@latest/latin-wght-italic.woff2) format('woff2-variations');
}`);
    } else {
      for (const weight of font.weights) {
        cssBlocks.push(`@font-face {
  font-family: '${familyName}';
  font-style: italic;
  font-display: swap;
  font-weight: ${weight};
  src: url(https://cdn.jsdelivr.net/fontsource/fonts/${baseId}@latest/latin-${weight}-italic.woff2) format('woff2');
}`);
      }
    }
  }

  return cssBlocks.join("\n\n");
}

export default function FontInstall() {
  const t = useTranslations("Dashboard.sidebar.install");
  const { fonts } = useFontStore();
  const { selectedFont } = useSelectedFont();
  const { addFavorite, removeFavorite, isFavorite } = useFavoritesFonts();

  const fontIds = [
    selectedFont.display?.fontId,
    selectedFont.heading?.fontId,
    selectedFont.body?.fontId,
  ].filter(Boolean);

  const uniqueFontIds = Array.from(new Set(fontIds));

  return (
    <div className="flex flex-col gap-2">
      <Button
        variant="outline"
        onClick={() =>
          isFavorite(selectedFont)
            ? removeFavorite(selectedFont)
            : addFavorite(selectedFont)
        }
      >
        {fonts.length > 0 ? (
          isFavorite(selectedFont) ? (
            <RiHeart3Fill />
          ) : (
            <RiHeart3Line />
          )
        ) : (
          <RiHeart3Line />
        )}
        {fonts.length > 0
          ? isFavorite(selectedFont)
            ? t("unsave")
            : t("save")
          : t("save")}
      </Button>
      <Dialog>
        <Tabs defaultValue="install" className="gap-0">
          <DialogTrigger asChild>
            <Button>
              <RiDownloadLine />
              {t("trigger")}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-3xl">
            <DialogHeader>
              <DialogTitle>{t("title")}</DialogTitle>
              <DialogDescription>{t("description")}</DialogDescription>
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
                <TabsList className="w-full sm:w-auto">
                  <TabsTrigger value="install">
                    <RiTerminalLine />
                    {t("install.title")}
                  </TabsTrigger>
                  <TabsTrigger value="cdn">
                    <RiGlobalLine />
                    {t("cdn.title")}
                  </TabsTrigger>
                </TabsList>
                <div>
                  <Button className="w-full sm:w-auto" asChild>
                    <Link
                      href="https://fontsource.org/docs/getting-started/install"
                      target="_blank"
                    >
                      {t("docs")}
                      <RiExternalLinkLine className="size-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </DialogHeader>
            <div className="-mx-6 -mb-6 max-h-[500px] overflow-y-auto px-6 pb-6">
              <TabsContent value="install">
                <div className="flex flex-col space-y-4">
                  <div>
                    <h3 className="font-semibold">
                      {t("install.steps.one.title")}
                    </h3>
                    <p>{t("install.steps.one.description")}</p>
                  </div>
                  <CopyablePre>
                    {uniqueFontIds
                      .map((id) => {
                        const font = fonts.find((f) => f.id === id);
                        if (!font) return `npm install @fontsource/${id}`;

                        const pkgPrefix = font.variable
                          ? "@fontsource-variable"
                          : "@fontsource";
                        return `npm install ${pkgPrefix}/${id}`;
                      })
                      .join("\n")}
                  </CopyablePre>
                  <div>
                    <h3 className="font-semibold">
                      {t("install.steps.two.title")}
                    </h3>
                    <p>{t("install.steps.two.description")}</p>
                  </div>
                  <CopyablePre>
                    {uniqueFontIds
                      .map((id) => {
                        const font = fonts.find((f) => f.id === id);
                        if (!font) return `import "@fontsource/${id}"`;

                        const pkgPrefix = font.variable
                          ? "@fontsource-variable"
                          : "@fontsource";
                        return `import "${pkgPrefix}/${id}"`;
                      })
                      .join("\n")}
                  </CopyablePre>
                  <div>
                    <h3 className="font-semibold">
                      {t("install.steps.three.title")}
                    </h3>
                    <p>{t("install.steps.three.description")}</p>
                  </div>
                  <CopyablePre>
                    {(["display", "heading", "body"] as const)
                      .map((role) => {
                        const fontId = selectedFont[role]?.fontId;
                        if (!fontId) return "";

                        const font = fonts.find((f) => f.id === fontId);
                        if (!font) return "";

                        const family =
                          font.family + (font.variable ? " Variable" : "");
                        const category = font.category || "sans-serif";

                        return `${role !== "body" ? "." : ""}${role} {
  font-family: '${family}', ${category};
}`;
                      })
                      .filter(Boolean)
                      .join("\n\n")}
                  </CopyablePre>
                </div>
              </TabsContent>
              <TabsContent value="cdn">
                <div className="flex flex-col space-y-4">
                  <div>
                    <h3 className="font-semibold">
                      {t("cdn.steps.one.title")}
                    </h3>
                    <p>{t("cdn.steps.one.description")}</p>
                  </div>
                  <CopyablePre>
                    {uniqueFontIds
                      .map((id) => {
                        const font = fonts.find((f) => f.id === id);
                        if (!font) return "";

                        return generateFontFaceCSS(font);
                      })
                      .filter(Boolean)
                      .join("\n\n")}
                  </CopyablePre>
                </div>
              </TabsContent>
            </div>
          </DialogContent>
        </Tabs>
      </Dialog>
    </div>
  );
}
