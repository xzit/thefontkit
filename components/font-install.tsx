import { Button } from "@/components/ui/button";
import { RiGlobalLine, RiTerminalFill } from "@remixicon/react";

export default function FontInstall() {
  return (
    <div className="flex flex-col gap-2">
      <Button>
        <RiTerminalFill />
        Install
      </Button>
      <Button>
        <RiGlobalLine />
        CDN
      </Button>
    </div>
  );
}
