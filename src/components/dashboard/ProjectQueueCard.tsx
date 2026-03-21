import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { QueueItem } from "@/types/dashboard";

export default function ProjectQueueCard({
  item,
  onPrimaryAction,
  primaryActionHref,
}: {
  item: QueueItem;
  onPrimaryAction?: () => void;
  primaryActionHref?: string;
}) {
  return (
    <div className="rounded-xl border border-black/10 bg-white px-5 py-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-[14px] font-oxanium tracking-wider font-semibold text-black leading-tight">
            {item.teamName}
          </div>
          <div className="mt-1 flex items-center gap-2">
            <Badge
              variant={item.status === "evaluated" ? "green" : item.status === "in_progress" ? "cyan" : "gray"}
              className="px-2 py-0.5"
            >
              {item.statusLabel}
            </Badge>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center">
        {primaryActionHref ? (
          <Button
            asChild
            variant="secondary"
            className={cn(
              "w-full rounded-xl",
              item.status === "pending" ? "bg-black/0" : "",
            )}
          >
            <Link href={primaryActionHref}>{item.actionLabel}</Link>
          </Button>
        ) : (
          <Button
            variant="secondary"
            className={cn(
              "w-full rounded-xl",
              item.status === "pending" ? "bg-black/0" : "",
            )}
            onClick={onPrimaryAction}
          >
            {item.actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
}

