import * as React from "react";
import { useTranslations } from "next-intl";

import Editor from "@/app/(editor)/components/editor";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import FontInstall from "@/components/font-install";
import { RiSparkling2Fill } from "@remixicon/react";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const t = useTranslations("AppLayout");

  return (
    <Sidebar variant="floating" {...props}>
      <SidebarHeader>
        <div className="font-heading flex items-center gap-2.5 p-2 text-3xl font-bold">
          <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
            <RiSparkling2Fill />
          </div>
          {t("name")}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <Editor />
      </SidebarContent>
      <SidebarFooter>
        <FontInstall />
      </SidebarFooter>
    </Sidebar>
  );
}
