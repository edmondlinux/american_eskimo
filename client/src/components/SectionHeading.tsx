import * as React from "react";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  "data-testid": dataTestId,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  "data-testid"?: string;
}) {
  return (
    <div
      className={cn(
        "animate-float-in",
        align === "center" ? "mx-auto text-center" : "text-left",
        className
      )}
      data-testid={dataTestId}
    >
      {eyebrow ? (
        <div className={cn("inline-flex items-center rounded-full border border-border/70 bg-card/70 px-3 py-1 text-xs font-bold tracking-wide text-muted-foreground")}>
          {eyebrow}
        </div>
      ) : null}
      <h2 className={cn("mt-3 text-3xl sm:text-4xl font-semibold leading-tight")}>
        {title}
      </h2>
      {description ? (
        <p className={cn("mt-3 max-w-2xl text-sm sm:text-base text-muted-foreground", align === "center" && "mx-auto")}>
          {description}
        </p>
      ) : null}
    </div>
  );
}
