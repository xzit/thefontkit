"use client";

import { useTranslations } from "next-intl";

import { useSelectedFont } from "@/stores/selected-fonts";
import { useFontStore } from "@/stores/fonts";

import { FontCombobox, type Font } from "@/components/font-combobox";
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
import { Slider } from "@/components/ui/slider";

import { RiArrowRightSLine, RiFontSansSerif } from "@remixicon/react";

interface FontSelectorProps {
  label: string;
  fonts: Font[];
  selectedFontId: string;
  onFontChange: (fontId: string) => void;
  weight: number;
  onWeightChange: (weight: number) => void;
  size: number;
  onSizeChange: (size: number) => void;
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
  selectedFontId,
  onFontChange,
  weight,
  onWeightChange,
  size,
  onSizeChange,
  font,
}: FontSelectorProps) {
  const { fonts } = useFontStore();
  const currentFont = font || fonts.find((f) => f.id === selectedFontId);

  const fontWeights = currentFont?.weights ?? [400];
  const minWeight = Math.min(...fontWeights);
  const maxWeight = Math.max(...fontWeights);
  const weightIndex = Math.max(
    0,
    fontWeights.findIndex((w) => w === weight),
  );

  function getClosestWeight(weights: number[], target: number) {
    return weights.reduce((prev, curr) =>
      Math.abs(curr - target) < Math.abs(prev - target) ? curr : prev,
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2.5">
        <Label>{label}</Label>
        <FontCombobox
          label={label}
          value={selectedFontId}
          onChange={(fontId) => {
            const newFont = fonts.find((f) => f.id === fontId);
            const newWeights = newFont?.weights ?? [400];
            const closestWeight = getClosestWeight(newWeights, weight);

            onFontChange(fontId);
            onWeightChange(closestWeight);
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
            step={10}
            onValueChange={([w]) => onWeightChange(w)}
            disabled={fontWeights.length === 1}
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
        <Label className="flex justify-between">
          <span>Size</span>
          <span className="text-xs text-muted-foreground ml-auto">
            {size}px
          </span>
        </Label>
        <Slider
          value={[size]}
          min={12}
          max={96}
          step={1}
          onValueChange={([s]) => onSizeChange(s)}
        />
      </div>
    </div>
  );
}

export default function Editor() {
  const t = useTranslations("Dashboard.sidebar.font-family");

  const { fonts } = useFontStore();
  const { selectedFont, setSelectedFont } = useSelectedFont();

  const displayFont = fonts.find((f) => f.id === selectedFont.display.fontId);
  const headingFont = fonts.find((f) => f.id === selectedFont.heading.fontId);
  const bodyFont = fonts.find((f) => f.id === selectedFont.body.fontId);

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
                selectedFontId={selectedFont.display.fontId}
                onFontChange={(fontId) =>
                  setSelectedFont("display", "fontId", fontId)
                }
                weight={selectedFont.display.weight}
                onWeightChange={(weight) =>
                  setSelectedFont("display", "weight", weight)
                }
                size={selectedFont.display.size}
                onSizeChange={(size) =>
                  setSelectedFont("display", "size", size)
                }
                font={displayFont}
              />
              <Separator />
              <FontEditor
                label={t("form.heading")}
                fonts={fonts}
                selectedFontId={selectedFont.heading.fontId}
                onFontChange={(fontId) =>
                  setSelectedFont("heading", "fontId", fontId)
                }
                weight={selectedFont.heading.weight}
                onWeightChange={(weight) =>
                  setSelectedFont("heading", "weight", weight)
                }
                size={selectedFont.heading.size}
                onSizeChange={(size) =>
                  setSelectedFont("heading", "size", size)
                }
                font={headingFont}
              />
              <Separator />
              <FontEditor
                label={t("form.body")}
                fonts={fonts}
                selectedFontId={selectedFont.body.fontId}
                onFontChange={(fontId) =>
                  setSelectedFont("body", "fontId", fontId)
                }
                weight={selectedFont.body.weight}
                onWeightChange={(weight) =>
                  setSelectedFont("body", "weight", weight)
                }
                size={selectedFont.body.size}
                onSizeChange={(size) => setSelectedFont("body", "size", size)}
                font={bodyFont}
              />
            </div>
          </CollapsibleContent>
        </SidebarGroup>
      </Collapsible>
    </div>
  );
}
