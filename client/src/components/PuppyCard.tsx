import * as React from "react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import type { Puppy } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PawPrint, Sparkles, ArrowRight } from "lucide-react";

function Price({ value }: { value: number }) {
  const formatted = Number.isFinite(value)
    ? new Intl.NumberFormat(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value)
    : "—";
  return <span className="font-semibold text-foreground">{formatted}</span>;
}

export function PuppyCard({
  puppy,
  compact = false,
  showInquiry = true,
  className,
}: {
  puppy: Puppy;
  compact?: boolean;
  showInquiry?: boolean;
  className?: string;
}) {
  const meta = [
    { k: "Breed", v: puppy.breed },
    { k: "Sex", v: puppy.sex },
    { k: "Age", v: puppy.age },
    { k: "Temperament", v: puppy.temperament },
  ];

  return (
    <div
      className={cn(
        "surface-card grain-overlay group rounded-3xl border border-border/70 p-6",
        "transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]",
        className
      )}
      data-testid={`puppy-card-${puppy.id}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className={cn("text-xl font-semibold leading-tight", compact && "text-lg")}>{puppy.name}</h3>
            {puppy.isAvailable ? (
              <Badge className="border-border/60 bg-accent/12 text-accent hover:bg-accent/12">Available</Badge>
            ) : (
              <Badge variant="secondary" className="border-border/60 bg-muted text-muted-foreground hover:bg-muted">
                Reserved
              </Badge>
            )}
          </div>
          <p className="mt-2 text-sm text-muted-foreground line-clamp-2" data-testid={`puppy-short-${puppy.id}`}>
            {puppy.shortDescription}
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-2 rounded-2xl border border-border/70 bg-card/60 px-3 py-2 shadow-sm">
          <Sparkles className="h-4 w-4 text-[hsl(var(--chart-3))]" />
          <div className="text-sm">
            <div className="text-xs text-muted-foreground">Adoption fee</div>
            <div className="leading-tight">
              <Price value={puppy.price} />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {meta.map((m) => (
          <div key={m.k} className="flex items-baseline justify-between gap-3 rounded-2xl border border-border/60 bg-secondary/40 px-4 py-3">
            <div className="text-xs font-semibold tracking-wide text-muted-foreground">{m.k}</div>
            <div className="text-sm font-semibold text-foreground line-clamp-1">{m.v}</div>
          </div>
        ))}
      </div>

      {!compact ? (
        <div className="mt-5 rounded-2xl border border-border/60 bg-card/70 p-4">
          <div className="text-xs font-semibold tracking-wide text-muted-foreground">About</div>
          <p className="mt-2 text-sm text-muted-foreground line-clamp-3" data-testid={`puppy-desc-${puppy.id}`}>
            {puppy.description}
          </p>
        </div>
      ) : null}

      <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="sm:hidden flex items-center justify-between rounded-2xl border border-border/70 bg-card/60 px-4 py-3 shadow-sm">
          <div className="text-xs text-muted-foreground">Adoption fee</div>
          <Price value={puppy.price} />
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/shop#puppy-${puppy.id}`}
            className="inline-flex items-center gap-2 rounded-xl border border-border/70 bg-card/70 px-4 py-2 text-sm font-semibold text-foreground shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-secondary focus-ring"
            data-testid={`puppy-view-${puppy.id}`}
          >
            View
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </Link>

          {showInquiry ? (
            <Link
              href={`/inquiry?puppyId=${encodeURIComponent(puppy.id)}`}
              className={cn(
                "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 focus-ring btn-sheen",
                puppy.isAvailable
                  ? "bg-gradient-to-r from-primary to-primary/85 text-primary-foreground shadow-md shadow-primary/20 hover:-translate-y-0.5 hover:shadow-lg"
                  : "bg-muted text-muted-foreground cursor-not-allowed pointer-events-none"
              )}
              data-testid={`puppy-inquiry-${puppy.id}`}
              aria-disabled={!puppy.isAvailable}
            >
              <PawPrint className="h-4 w-4" />
              Inquiry
            </Link>
          ) : (
            <Button
              type="button"
              variant="secondary"
              className="rounded-xl"
              onClick={() => {}}
              data-testid={`puppy-inquiry-hidden-${puppy.id}`}
            >
              Inquiry
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
