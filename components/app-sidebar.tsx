import * as React from "react";
import { useTranslations } from "next-intl";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import Editor from "@/app/(editor)/components/editor";

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
    </Sidebar>
  );
}
