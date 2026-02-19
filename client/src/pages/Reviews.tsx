import * as React from "react";
import { Seo } from "@/components/Seo";
import { SiteShell } from "@/components/SiteShell";
import { SectionHeading } from "@/components/SectionHeading";
import { ReviewCard } from "@/components/ReviewCard";
import { useReviews } from "@/hooks/use-reviews";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { type Review } from "@shared/schema";

const HARDCODED_REVIEWS: Review[] = [
  {
    id: "static-1",
    reviewerName: "Sarah Johnson",
    rating: 5,
    testimonialText: "We adopted our little Eskie, Luna, three months ago and she has been the perfect addition to our family. The communication throughout the process was excellent.",
    isFeatured: true,
    createdAt: new Date(),
  },
  {
    id: "static-2",
    reviewerName: "Michael Chen",
    rating: 5,
    testimonialText: "Professional and caring. You can tell these puppies are raised with a lot of love. Our boy is healthy, happy, and so smart!",
    isFeatured: true,
    createdAt: new Date(),
  },
  {
    id: "static-3",
    reviewerName: "Emily Rodriguez",
    rating: 4,
    testimonialText: "Great experience overall. The puppy was well-socialized and adjusted to our home very quickly. Highly recommend!",
    isFeatured: false,
    createdAt: new Date(),
  },
  {
    id: "static-4",
    reviewerName: "David Wilson",
    rating: 5,
    testimonialText: "Beautiful dogs and wonderful people to work with. They answered all our questions and made the transition so smooth for us and the puppy.",
    isFeatured: true,
    createdAt: new Date(),
  },
  {
    id: "static-5",
    reviewerName: "Jessica Taylor",
    rating: 5,
    testimonialText: "Our American Eskimo is now 1 year old and is the healthiest dog we've ever owned. Thank you for such a wonderful companion!",
    isFeatured: true,
    createdAt: new Date(),
  },
  {
    id: "static-6",
    reviewerName: "Robert Brown",
    rating: 4,
    testimonialText: "Very happy with our new family member. The process was straightforward and the breeder was very helpful with advice for the first few weeks.",
    isFeatured: false,
    createdAt: new Date(),
  },
];

export default function Reviews() {
  const reviewsQ = useReviews();
  const [q, setQ] = React.useState("");

  const filtered = React.useMemo(() => {
    const fromDb = reviewsQ.data ?? [];
    const all = [...HARDCODED_REVIEWS, ...fromDb];
    const s = q.trim().toLowerCase();
    if (!s) return all;
    return all.filter((r) => `${r.reviewerName} ${r.testimonialText}`.toLowerCase().includes(s));
  }, [reviewsQ.data, q]);

  return (
    <SiteShell>
      <Seo
        title="Reviews — American Eskimo"
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
