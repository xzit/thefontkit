"use client";

import { Button } from "@/components/ui/button";
import { RiGlobalLine, RiTerminalFill } from "@remixicon/react";

import { useFontStore } from "@/stores/fonts";
import { useSelectedFont } from "@/stores/selected-fonts";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function FontInstall() {
  const { fonts } = useFontStore();
  const { selectedFont } = useSelectedFont();

  const fontIds = [
    selectedFont.display?.fontId,
    selectedFont.heading?.fontId,
    selectedFont.body?.fontId,
  ].filter(Boolean);

  const uniqueFontIds = Array.from(new Set(fontIds));

  return (
    <div className="flex flex-col gap-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button>
            <RiTerminalFill />
            Install
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Install Font</DialogTitle>
            <DialogDescription>
              Install the font to your system
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <pre>
              {uniqueFontIds
                .map((id) => `npm install @fontsource/${id}`)
                .join("\n")}
            </pre>
            <pre>
              {uniqueFontIds
                .map((id) => `import "@fontsource/${id}"`)
                .join("\n")}
            </pre>
            <pre>
              {uniqueFontIds
                .map((id) => {
                  const font = fonts.find((f) => f.id === id);
                  if (!font) return "";

                  const family = font.family;
                  const category = font.category || "sans-serif";

                  return `body {
  font-family: '${family}', ${category};
}`;
                })
                .join("\n")}
            </pre>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog>
        <DialogTrigger asChild>
          <Button>
            <RiGlobalLine />
            CDN
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>CDN Font</DialogTitle>
            <DialogDescription>Use the font from a CDN</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
