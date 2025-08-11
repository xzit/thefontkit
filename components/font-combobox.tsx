"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import { useFontStore } from "@/stores/fonts";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { RiCheckFill, RiExpandUpDownFill } from "@remixicon/react";

export type Font = {
  id: string;
  family: string;
  subsets: string[];
  weights: number[];
  styles: string[];
  defSubset: string;
  variable: boolean;
  lastModified: string;
  category: string;
  version: string;
  type: string;
};

export function FontCombobox({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
}) {
  const t = useTranslations("Components.combobox");
  const { fonts, loading, error, fetchFonts } = useFontStore();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (fonts.length === 0 && !loading && !error) {
      fetchFonts();
    }
  }, [fonts.length, loading, error, fetchFonts]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between [&_svg:not([class*='size-'])]:size-4"
        >
          {value
            ? fonts.find((f) => f.id === value)?.family
            : t("placeholder", { label })}
          <RiExpandUpDownFill className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="max-w-[270px] p-0">
        <Command>
          <CommandInput
            placeholder={t("placeholder", { label })}
            className="h-9"
          />
          <CommandList>
            <CommandEmpty>{t("empty")}</CommandEmpty>
            <CommandGroup>
              {fonts.map((font) => (
                <CommandItem
                  key={font.id}
                  value={font.id}
                  onSelect={(currentValue) => {
                    onChange(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  {font.family}
                  <RiCheckFill
                    className={cn(
                      "ml-auto",
                      value === font.id ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
