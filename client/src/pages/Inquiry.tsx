import * as React from "react";
import { useLocation } from "wouter";
import { Seo } from "@/components/Seo";
import { SiteShell } from "@/components/SiteShell";
import { SectionHeading } from "@/components/SectionHeading";
import { usePuppies } from "@/hooks/use-puppies";
import { useCreateInquiry } from "@/hooks/use-inquiries";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { PawPrint, CheckCircle2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { insertInquirySchema } from "@shared/schema";

function useQueryParams() {
  const [loc] = useLocation();
  return React.useMemo(() => {
    const idx = loc.indexOf("?");
    const qs = idx >= 0 ? loc.slice(idx + 1) : "";
    return new URLSearchParams(qs);
  }, [loc]);
}

type FormState = {
  selectedPuppyId: string | null;
  fullName: string;
  address: string;
  email: string;
  phone: string;
  message: string;
};

const empty: FormState = {
  selectedPuppyId: null,
  fullName: "",
  address: "",
  email: "",
  phone: "",
  message: "",
};

export default function Inquiry() {
  const params = useQueryParams();
  const puppyIdParam = params.get("puppyId");
  const puppiesQ = usePuppies({ availableOnly: false });
  const createInquiry = useCreateInquiry();
  const { toast } = useToast();

  const [state, setState] = React.useState<FormState>(() => ({
    ...empty,
    selectedPuppyId: puppyIdParam,
  }));

  React.useEffect(() => {
    // If route param changes while mounted
    setState((s) => ({ ...s, selectedPuppyId: puppyIdParam }));
  }, [puppyIdParam]);

  const puppies = puppiesQ.data ?? [];
  const selected = puppies.find((p) => p.id === state.selectedPuppyId) ?? null;

  const inquirySchema = insertInquirySchema.extend({
    // handle JSON string/optional from Select
    selectedPuppyId: z.string().optional().nullable(),
  });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    const parsed = inquirySchema.safeParse({
      fullName: state.fullName,
      address: state.address,
      email: state.email,
      phone: state.phone,
      message: state.message,
      selectedPuppyId: state.selectedPuppyId,
    });

    if (!parsed.success) {
      const first = parsed.error.errors[0];
      toast({
        title: "Please check your details",
        description: `${first.path.join(".") || "field"}: ${first.message}`,
        variant: "destructive",
      });
      return;
    }

    try {
      await createInquiry.mutateAsync(parsed.data);
      toast({
        title: "Inquiry sent",
        description: "We’ll respond within 1–2 business days with next steps.",
      });
      setState({ ...empty, selectedPuppyId: state.selectedPuppyId }); // keep selection
    } catch (err: any) {
      toast({
        title: "Couldn’t send inquiry",
        description: err?.message ?? "Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <SiteShell>
      <Seo
        title="Inquiry — American Eskimo"
        description="Start an inquiry for a puppy placement. Share your lifestyle, preferences, and timeline so we can recommend the best fit."
      />

      <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
        <div className="lg:col-span-5">
          <SectionHeading
            eyebrow="Inquiry"
            title="Let’s find your best match."
            description="Tell us about your home and what you’re looking for. We’ll respond with thoughtful guidance—never pressure."
            data-testid="inquiry-heading"
          />

          <div className="mt-6 surface-card grain-overlay rounded-[2rem] border border-border/70 p-6">
            <div className="flex items-start gap-3">
              <div className="rounded-2xl border border-border/70 bg-secondary/60 p-3 shadow-sm">
                <CheckCircle2 className="h-5 w-5 text-accent" />
              </div>
              <div>
                <div className="text-sm font-semibold">What to include</div>
                <div className="mt-1 text-sm text-muted-foreground">
                  Your schedule, household members, experience, and any preferences.
                </div>
              </div>
            </div>

            <Separator className="my-5" />

            <div className="grid gap-3">
              {[
                "Activity level (quiet, moderate, high-energy)",
                "Work schedule and time at home",
                "Other pets and children",
                "Training hopes and comfort level",
                "Timing and travel considerations",
              ].map((x) => (
                <div key={x} className="flex items-start gap-3 rounded-2xl border border-border/60 bg-card/70 p-4">
                  <div className="mt-1 h-2.5 w-2.5 rounded-full bg-primary" />
                  <div className="text-sm text-muted-foreground">{x}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="surface-card grain-overlay rounded-[2rem] border border-border/70 overflow-hidden">
            <div className="bg-gradient-to-br from-secondary/70 via-card to-card p-6 sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xl font-semibold" style={{ fontFamily: "var(--font-serif)" }}>
                    Placement Inquiry
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    You can choose a specific puppy—or ask for guidance.
                  </div>
                </div>
                <div className="rounded-2xl border border-border/70 bg-card px-3 py-2 text-xs font-bold text-muted-foreground shadow-sm">
                  ~ 2 minutes
                </div>
              </div>

              {selected ? (
                <div className="mt-5 rounded-3xl border border-border/70 bg-card/70 p-5 shadow-sm" data-testid="inquiry-selected-summary">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-sm font-semibold">Selected puppy</div>
                      <div className="mt-1 text-lg font-semibold leading-tight">
                        {selected.name} <span className="text-muted-foreground">·</span> {selected.breed}
                      </div>
                      <div className="mt-1 text-sm text-muted-foreground">
                        {selected.sex} · {selected.age} · {selected.temperament}
                      </div>
                    </div>
                    <div className={cn("rounded-2xl border border-border/70 bg-secondary/50 p-3", selected.isAvailable ? "" : "opacity-70")}>
                      <PawPrint className={cn("h-6 w-6", selected.isAvailable ? "text-primary" : "text-muted-foreground")} />
                    </div>
                  </div>
                  <div className="mt-3 text-sm text-muted-foreground line-clamp-2">
                    {selected.shortDescription}
                  </div>
                </div>
              ) : null}
            </div>

            <form onSubmit={onSubmit} className="p-6 sm:p-8">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label>Select a puppy (optional)</Label>
                  {puppiesQ.isLoading ? (
                    <div className="h-11 rounded-xl skeleton-shimmer" />
                  ) : puppiesQ.isError ? (
                    <div className="rounded-2xl border border-border/70 bg-card p-4 text-sm text-muted-foreground" data-testid="inquiry-puppies-error">
                      Couldn’t load puppies: {(puppiesQ.error as Error)?.message}
                    </div>
                  ) : (
                    <Select
                      value={state.selectedPuppyId ?? "none"}
                      onValueChange={(v) => setState((s) => ({ ...s, selectedPuppyId: v === "none" ? null : v }))}
                    >
                      <SelectTrigger className="rounded-xl bg-card/70 border-border/70 focus-ring" data-testid="inquiry-select-puppy">
                        <SelectValue placeholder="Choose a puppy (or leave blank)" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl">
                        <SelectItem value="none">No specific puppy</SelectItem>
                        {puppies.map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.name} — {p.breed} ({p.isAvailable ? "Available" : "Reserved"})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="fullName">Full name</Label>
                    <Input
                      id="fullName"
                      value={state.fullName}
                      onChange={(e) => setState((s) => ({ ...s, fullName: e.target.value }))}
                      className="rounded-xl bg-card/70 border-border/70 focus-ring"
                      placeholder="Your name"
                      data-testid="inquiry-fullName"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={state.phone}
                      onChange={(e) => setState((s) => ({ ...s, phone: e.target.value }))}
                      className="rounded-xl bg-card/70 border-border/70 focus-ring"
                      placeholder="(555) 000-0000"
                      data-testid="inquiry-phone"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={state.email}
                      onChange={(e) => setState((s) => ({ ...s, email: e.target.value }))}
                      className="rounded-xl bg-card/70 border-border/70 focus-ring"
                      placeholder="you@example.com"
                      data-testid="inquiry-email"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={state.address}
                      onChange={(e) => setState((s) => ({ ...s, address: e.target.value }))}
                      className="rounded-xl bg-card/70 border-border/70 focus-ring"
                      placeholder="City, State"
                      data-testid="inquiry-address"
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    value={state.message}
                    onChange={(e) => setState((s) => ({ ...s, message: e.target.value }))}
                    className="min-h-[180px] rounded-2xl bg-card/70 border-border/70 focus-ring"
                    placeholder="Tell us about your home, schedule, preferences, and any questions."
                    data-testid="inquiry-message"
                  />
                </div>

                <div className="mt-2 flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-xs text-muted-foreground">
                    By submitting, you agree to be contacted regarding your inquiry.
                  </div>
                  <Button
                    type="submit"
                    disabled={createInquiry.isPending}
                    className="rounded-xl bg-gradient-to-r from-primary to-primary/85 text-primary-foreground shadow-md shadow-primary/20 hover:shadow-lg hover:-translate-y-0.5 transition-all btn-sheen"
                    data-testid="inquiry-submit"
                  >
                    {createInquiry.isPending ? "Sending..." : "Send inquiry"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </form>
          </div>

          <div className="mt-6 rounded-[2rem] border border-border/70 bg-card/60 p-6 shadow-sm">
            <div className="text-sm font-semibold">What happens next?</div>
            <div className="mt-2 grid gap-3 sm:grid-cols-3">
              {[
                { t: "We review", d: "We read your details and questions." },
                { t: "We reply", d: "Email or phone within 1–2 business days." },
                { t: "We match", d: "Temperament guidance and timing options." },
              ].map((x, i) => (
                <div key={i} className="rounded-2xl border border-border/70 bg-secondary/30 p-4">
                  <div className="text-sm font-semibold">{x.t}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{x.d}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
