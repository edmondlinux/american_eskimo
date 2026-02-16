import * as React from "react";
import { cn } from "@/lib/utils";
import type { Review } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/StarRating";
import { Quote } from "lucide-react";

export function ReviewCard({
  review,
  className,
}: {
  review: Review;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "surface-card grain-overlay rounded-3xl border border-border/70 p-6",
        "transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]",
        className
      )}
      data-testid={`review-card-${review.id}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div className="text-base font-semibold" data-testid={`reviewer-${review.id}`}>
              {review.reviewerName}
            </div>
            {review.isFeatured ? (
              <Badge className="border-border/60 bg-[hsl(var(--chart-3))]/15 text-foreground hover:bg-[hsl(var(--chart-3))]/15">
                Featured
              </Badge>
            ) : null}
          </div>
          <div className="mt-2">
            <StarRating rating={review.rating} data-testid={`review-rating-${review.id}`} />
          </div>
        </div>
        <div className="rounded-2xl border border-border/60 bg-secondary/50 p-3 text-muted-foreground">
          <Quote className="h-5 w-5" />
        </div>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-muted-foreground" data-testid={`review-text-${review.id}`}>
        {review.testimonialText}
      </p>

      <div className="mt-5 text-xs text-muted-foreground">
        {review.createdAt ? new Date(review.createdAt as unknown as string).toLocaleDateString() : ""}
      </div>
    </div>
  );
}
