import * as React from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

import FontInstall from "@/components/install-dialog";
import Editor from "@/components/editor";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const t = useTranslations("AppLayout");

  return (
    <Sidebar variant="floating" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2.5 p-2 font-serif text-2xl font-bold">
          <Link href="/">
            <div className="bg-sidebar-primary text-sidebar-primary-foreground dark:text-sidebar flex aspect-square size-10 items-center justify-center rounded-lg">
              <svg
                width={24}
                height={24}
                fill="currentColor"
                clipRule="evenodd"
                fillRule="evenodd"
                strokeLinejoin="round"
                strokeMiterlimit="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="m0 .18.019-.12h.043c.027 0 .049-.007.066-.021s.028-.033.031-.058l.045-.281h-.152l.022-.135h.152l.02-.125c.005-.034.018-.064.038-.09.02-.025.045-.045.076-.059s.065-.021.103-.021h.137l-.021.13h-.132c-.013 0-.025.004-.034.012-.009.009-.015.02-.018.033l-.019.12h.195l-.022.135h-.195l-.046.286c-.01.06-.038.107-.084.142-.047.035-.105.052-.176.052z"
                  fillRule="nonzero"
                  transform="matrix(26.66664 0 0 26.3736 4.000000285 19.25276643)"
                />
              </svg>
            </div>
          </Link>
          <div className="flex w-full items-center justify-start gap-2.5">
            <Link href="/">
              <span>{t("name")}</span>
            </Link>
            <span className="font-sans text-xs font-normal">v1.0.1</span>
          </div>
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
