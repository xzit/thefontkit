import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/theme-toggle";
import Preview from "./components/preview";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { RiHeart3Fill } from "@remixicon/react";
import { useTranslations } from "next-intl";

export default function Page() {
  const t = useTranslations("Dashboard");

  return (
    <SidebarProvider>
      <SidebarInset>
        <header className="bg-background sticky top-0 flex h-16 shrink-0 justify-between items-center gap-2 px-4">
          <div className="ml-auto flex gap-2">
            <ModeToggle />
            <Button
              variant="outline"
              size="lg"
              className="rounded-full size-10 sm:w-auto"
              asChild
            >
              <Link href="https://github.com/sponsors/xzit" target="_blank">
                <RiHeart3Fill className="text-pink-500" />
                <span className="sr-only sm:not-sr-only">
                  {t("header.sponsor")}
                </span>
              </Link>
            </Button>
            <SidebarTrigger className="-mr-1" />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <Preview />
        </div>
      </SidebarInset>
      <AppSidebar side="right" />
    </SidebarProvider>
  );
}
