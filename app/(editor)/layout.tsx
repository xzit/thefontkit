import Link from "next/link";
import { useTranslations } from "next-intl";

import { AppSidebar } from "@/components/app-sidebar";
import { ModeToggle } from "@/components/theme-toggle";

import Footer from "@/components/footer";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

import { RiGithubFill, RiHeart3Fill } from "@remixicon/react";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const t = useTranslations("Dashboard");

  return (
    <SidebarProvider>
      <SidebarInset>
        <header className="bg-background/60 sticky top-0 flex h-16 shrink-0 items-center justify-between gap-2 px-4 backdrop-blur-xs">
          <div className="ml-auto flex gap-2">
            <ModeToggle />
            <Button
              variant="outline"
              size="icon"
              className="size-10 rounded-full"
              asChild
            >
              <Link href="https://github.com/xzit/thefontkit" target="_blank">
                <RiGithubFill className="size-6" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="size-10 rounded-full sm:w-auto"
              asChild
            >
              <Link href="https://github.com/sponsors/xzit" target="_blank">
                <RiHeart3Fill className="text-pink-400 dark:text-pink-500" />
                <span className="sr-only sm:not-sr-only">
                  {t("header.sponsor")}
                </span>
              </Link>
            </Button>
            <SidebarTrigger className="-mr-1" />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-16 p-4">
          {children}
          <Footer />
        </div>
      </SidebarInset>
      <AppSidebar side="right" />
    </SidebarProvider>
  );
}
