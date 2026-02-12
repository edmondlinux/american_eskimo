import * as React from "react";
import { cn } from "@/lib/utils";

export function InfoCard({
  icon,
  title,
  children,
  className,
  "data-testid": dataTestId,
}: {
  icon?: React.ReactNode;
  title: string;
  children: React.ReactNode;
  className?: string;
  "data-testid"?: string;
}) {
  return (
    <div
      className={cn(
        "surface-card grain-overlay rounded-3xl border border-border/70 p-6",
        "transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]",
        className
      )}
      data-testid={dataTestId}
    >
      <div className="flex items-start gap-4">
        {icon ? (
          <div className="rounded-2xl border border-border/70 bg-secondary/60 p-3 text-foreground shadow-sm">
            {icon}
          </div>
        ) : null}
        <div className="min-w-0">
          <div className="text-lg font-semibold leading-snug">{title}</div>
          <div className="mt-2 text-sm text-muted-foreground">{children}</div>
        </div>
      </div>
    </div>
  );
}
