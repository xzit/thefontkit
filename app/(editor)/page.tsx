import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/theme-toggle";
import Preview from "./components/preview";

export default function Page() {
  return (
    <SidebarProvider>
      <SidebarInset>
        <header className="bg-background sticky top-0 flex h-16 shrink-0 justify-between items-center gap-2 px-4">
          <div className="ml-auto flex gap-2">
            <ModeToggle />
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
