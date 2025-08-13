import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { RiCheckLine, RiClipboardLine } from "@remixicon/react";

interface CopyablePreProps {
  children: React.ReactNode;
  className?: string;
}

export function CopyablePre({ children, className }: CopyablePreProps) {
  const t = useTranslations("Components.copyable-pre");
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(
        typeof children === "string" ? children : "",
      );
      setCopied(true);
    } catch (e) {
      console.error("Copy failed", e);
    }
  };

  // Volver a estado inicial después de 2 segundos
  useEffect(() => {
    if (!copied) return;
    const timeout = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timeout);
  }, [copied]);

  return (
    <div className={cn("group relative", className)}>
      <pre className="overflow-auto text-sm">{children}</pre>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleCopy}
        className="absolute top-2 right-2 flex size-7 items-center justify-center rounded text-xs opacity-0 transition-opacity group-hover:opacity-100"
        aria-label="Copy code"
        type="button"
      >
        {copied ? (
          <RiCheckLine className="size-4" />
        ) : (
          <RiClipboardLine className="size-4" />
        )}
      </Button>
    </div>
  );
}
