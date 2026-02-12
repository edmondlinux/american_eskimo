import * as React from "react";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

export function StarRating({
  rating,
  size = "md",
  className,
  "data-testid": dataTestId,
}: {
  rating: number;
  size?: "sm" | "md";
  className?: string;
  "data-testid"?: string;
}) {
  const cl = size === "sm" ? "h-4 w-4" : "h-5 w-5";
  const safe = Number.isFinite(rating) ? Math.max(0, Math.min(5, Math.round(rating))) : 0;

  return (
    <div className={cn("inline-flex items-center gap-1", className)} aria-label={`${safe} out of 5 stars`} data-testid={dataTestId}>
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < safe;
        return (
          <Star
            key={i}
            className={cn(
              cl,
              "transition-colors duration-200",
              filled ? "fill-[hsl(var(--chart-3))] text-[hsl(var(--chart-3))]" : "text-border"
            )}
          />
        );
      })}
    </div>
  );
}

export function StarRatingInput({
  value,
  onChange,
  className,
  "data-testid": dataTestId,
}: {
  value: number;
  onChange: (next: number) => void;
  className?: string;
  "data-testid"?: string;
}) {
  const [hover, setHover] = React.useState<number | null>(null);
  const display = hover ?? value;

  return (
    <div className={cn("inline-flex items-center gap-1", className)} data-testid={dataTestId}>
      {Array.from({ length: 5 }).map((_, i) => {
        const n = i + 1;
        const filled = n <= display;
        return (
          <button
            key={n}
            type="button"
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(null)}
            onClick={() => onChange(n)}
            className={cn(
              "rounded-lg p-1 transition-all duration-200 focus-ring",
              "hover:-translate-y-0.5"
            )}
            data-testid={`rating-star-${n}`}
            aria-label={`Set rating to ${n}`}
          >
            <Star
              className={cn(
                "h-6 w-6",
                filled ? "fill-[hsl(var(--chart-3))] text-[hsl(var(--chart-3))]" : "text-border"
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
