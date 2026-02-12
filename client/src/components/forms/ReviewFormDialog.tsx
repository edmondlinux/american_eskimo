import * as React from "react";
import { z } from "zod";
import type { Review } from "@shared/schema";
import { insertReviewSchema } from "@shared/schema";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { StarRatingInput } from "@/components/StarRating";
import { useToast } from "@/hooks/use-toast";
import { useCreateReview, useUpdateReview } from "@/hooks/use-reviews";

function withCoercion() {
  return insertReviewSchema.extend({
    rating: z.coerce.number().int().min(1).max(5),
    isFeatured: z.coerce.boolean().optional(),
  });
}

type FormState = {
  reviewerName: string;
  rating: number;
  testimonialText: string;
  isFeatured: boolean;
};

const empty: FormState = {
  reviewerName: "",
  rating: 5,
  testimonialText: "",
  isFeatured: false,
};

export function ReviewFormDialog({
  open,
  onOpenChange,
  mode,
  review,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  mode: "create" | "edit";
  review?: Review | null;
}) {
  const { toast } = useToast();
  const create = useCreateReview();
  const update = useUpdateReview();

  const [state, setState] = React.useState<FormState>(empty);

  React.useEffect(() => {
    if (!open) return;
    if (mode === "edit" && review) {
      setState({
        reviewerName: review.reviewerName ?? "",
        rating: Number(review.rating ?? 5),
        testimonialText: review.testimonialText ?? "",
        isFeatured: !!review.isFeatured,
      });
    } else {
      setState(empty);
    }
  }, [open, mode, review]);

  const pending = create.isPending || update.isPending;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const schema = withCoercion();

    const parsed = schema.safeParse({
      reviewerName: state.reviewerName,
      rating: state.rating,
      testimonialText: state.testimonialText,
      isFeatured: state.isFeatured,
    });

    if (!parsed.success) {
      const first = parsed.error.errors[0];
      toast({
        title: "Please check the form",
        description: `${first.path.join(".") || "field"}: ${first.message}`,
        variant: "destructive",
      });
      return;
    }

    try {
      if (mode === "create") {
        await create.mutateAsync(parsed.data);
        toast({ title: "Review created", description: "Thank you—your testimonial is saved." });
      } else {
        if (!review?.id) throw new Error("Missing review id");
        await update.mutateAsync({ id: review.id, updates: parsed.data });
        toast({ title: "Review updated", description: "Your changes have been saved." });
      }
      onOpenChange(false);
    } catch (err: any) {
      toast({
        title: "Something went wrong",
        description: err?.message ?? "Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl rounded-3xl border-border/70 p-0 overflow-hidden">
        <div className="bg-gradient-to-br from-secondary/70 via-card to-card p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl">{mode === "create" ? "New Review" : "Edit Review"}</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Keep it authentic. Highlight temperament, communication, and the transition home.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={onSubmit} className="p-6">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="reviewerName">Reviewer name</Label>
              <Input
                id="reviewerName"
                value={state.reviewerName}
                onChange={(e) => setState((s) => ({ ...s, reviewerName: e.target.value }))}
                className="rounded-xl"
                placeholder="e.g., Amelia R."
                data-testid="review-form-name"
              />
            </div>

            <div className="flex flex-col gap-2 rounded-2xl border border-border/70 bg-secondary/40 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-semibold">Rating</div>
                  <div className="text-xs text-muted-foreground">Tap a star to set the rating.</div>
                </div>
                <div className="text-sm font-semibold text-muted-foreground" data-testid="review-form-rating-value">
                  {state.rating}/5
                </div>
              </div>
              <StarRatingInput value={state.rating} onChange={(n) => setState((s) => ({ ...s, rating: n }))} data-testid="review-form-rating" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="testimonialText">Testimonial</Label>
              <Textarea
                id="testimonialText"
                value={state.testimonialText}
                onChange={(e) => setState((s) => ({ ...s, testimonialText: e.target.value }))}
                className="min-h-[150px] rounded-2xl"
                placeholder="Share the story—what made your experience special?"
                data-testid="review-form-text"
              />
            </div>

            <div className="flex items-center justify-between gap-4 rounded-2xl border border-border/70 bg-card/60 p-4">
              <div>
                <div className="text-sm font-semibold">Featured</div>
                <div className="text-xs text-muted-foreground">Featured reviews appear on the Home page.</div>
              </div>
              <Switch
                checked={state.isFeatured}
                onCheckedChange={(v) => setState((s) => ({ ...s, isFeatured: v }))}
                data-testid="review-form-featured"
              />
            </div>
          </div>

          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
            <Button
              type="button"
              variant="outline"
              className="rounded-xl"
              onClick={() => onOpenChange(false)}
              disabled={pending}
              data-testid="review-form-cancel"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={pending}
              className="rounded-xl bg-gradient-to-r from-primary to-primary/85 text-primary-foreground shadow-md shadow-primary/20 hover:shadow-lg hover:-translate-y-0.5 transition-all btn-sheen"
              data-testid="review-form-submit"
            >
              {pending ? "Saving..." : mode === "create" ? "Create review" : "Save changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
