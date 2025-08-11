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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const t = useTranslations("AppLayout");

  return (
    <Sidebar variant="floating" {...props}>
      <SidebarHeader>
        <div className="text-2xl font-bold p-2">{t("name")}</div>
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
