import * as React from "react";
import { Seo } from "@/components/Seo";
import { SiteShell } from "@/components/SiteShell";
import { SectionHeading } from "@/components/SectionHeading";
import { ReviewCard } from "@/components/ReviewCard";
import { useReviews } from "@/hooks/use-reviews";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";

export default function Reviews() {
  const reviewsQ = useReviews();
  const [q, setQ] = React.useState("");

  const filtered = React.useMemo(() => {
    const all = reviewsQ.data ?? [];
    const s = q.trim().toLowerCase();
    if (!s) return all;
    return all.filter((r) => `${r.reviewerName} ${r.testimonialText}`.toLowerCase().includes(s));
  }, [reviewsQ.data, q]);

  return (
    <SiteShell>
      <Seo
        title="Reviews — Willow & Whelp"
        description="Read authentic testimonials from families. We believe in transparency and calm, thorough communication."
      />

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Reviews"
            title="Family Testimonials"
            description="Notes from homes—about temperament, transition, and the little joys of everyday life."
            data-testid="reviews-heading"
          />
          <div className="relative w-full md:w-[360px]">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search reviews…"
              className="pl-9 rounded-xl bg-card/70 border-border/70 focus-ring"
              data-testid="reviews-search"
            />
            {q ? (
              <button
                type="button"
                onClick={() => setQ("")}
                className="absolute right-2 top-2 rounded-lg p-2 text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-200 focus-ring"
                data-testid="reviews-search-clear"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            ) : null}
          </div>
        </div>

        {reviewsQ.isLoading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="rounded-3xl border border-border/70 bg-card p-6 shadow-sm">
                <div className="h-5 w-44 rounded-lg skeleton-shimmer" />
                <div className="mt-4 h-4 w-32 rounded-lg skeleton-shimmer" />
                <div className="mt-4 h-4 w-full rounded-lg skeleton-shimmer" />
                <div className="mt-2 h-4 w-5/6 rounded-lg skeleton-shimmer" />
                <div className="mt-2 h-4 w-2/3 rounded-lg skeleton-shimmer" />
              </div>
            ))}
          </div>
        ) : reviewsQ.isError ? (
          <div className="rounded-3xl border border-border/70 bg-card p-6 shadow-sm" data-testid="reviews-error">
            <div className="text-sm font-semibold">Couldn’t load reviews</div>
            <div className="mt-1 text-sm text-muted-foreground">{(reviewsQ.error as Error)?.message}</div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-[2rem] border border-border/70 bg-card/70 p-8 shadow-sm" data-testid="reviews-empty">
            <div className="text-lg font-semibold">No reviews found</div>
            <div className="mt-1 text-sm text-muted-foreground">Try a different search phrase.</div>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((r) => (
              <ReviewCard key={r.id} review={r} />
            ))}
          </div>
        )}
      </div>
    </SiteShell>
  );
}
