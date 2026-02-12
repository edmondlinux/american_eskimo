import * as React from "react";
import { Link } from "wouter";
import { Seo } from "@/components/Seo";
import { SiteShell } from "@/components/SiteShell";
import { SectionHeading } from "@/components/SectionHeading";
import { PuppyCard } from "@/components/PuppyCard";
import { ReviewCard } from "@/components/ReviewCard";
import { InfoCard } from "@/components/InfoCard";
import { usePuppies } from "@/hooks/use-puppies";
import { useReviews } from "@/hooks/use-reviews";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowRight, HeartHandshake, ShieldCheck, Sparkles, PawPrint, ScrollText } from "lucide-react";

export default function Home() {
  const puppiesQ = usePuppies({ availableOnly: true });
  const reviewsQ = useReviews();

  const featuredPuppies = (puppiesQ.data ?? []).slice(0, 6);
  const reviews = reviewsQ.data ?? [];
  const featuredReviews = reviews.filter((r) => r.isFeatured).slice(0, 5);
  const moreReviews = reviews.filter((r) => !r.isFeatured).slice(0, 6);

  return (
    <SiteShell tone="hero">
      <Seo
        title="Willow & Whelp — Ethical Puppy Breeder"
        description="A classical, temperament-first breeder experience. Meet available puppies, read featured family reviews, and submit an inquiry with confidence."
        ogTitle="Willow & Whelp"
        ogDescription="Ethical breeding, transparent care, and lifelong support."
      />

      {/* Hero */}
      <section className="relative overflow-hidden rounded-[2rem] border border-border/70 bg-gradient-to-br from-card via-card to-secondary/70 p-6 sm:p-10 surface-card">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[hsl(var(--chart-3))]/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-28 -bottom-28 h-72 w-72 rounded-full bg-accent/15 blur-3xl" />

        <div className="relative grid gap-8 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/60 px-3 py-1 text-xs font-bold tracking-wide text-muted-foreground">
              <Sparkles className="h-4 w-4 text-[hsl(var(--chart-3))]" />
              Classical care · Modern standards
            </div>

            <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.02]">
              Temperament-first puppies,
              <span className="block text-primary"> raised with artistry & routine.</span>
            </h1>

            <p className="mt-4 max-w-2xl text-sm sm:text-base text-muted-foreground leading-relaxed">
              We’re a family-run breeder devoted to ethical practices, transparent communication, and thoughtful matches.
              Explore the shop, read what families say, and start with a simple inquiry.
            </p>

            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-200 focus-ring btn-sheen bg-gradient-to-r from-primary to-primary/85 text-primary-foreground shadow-md shadow-primary/20 hover:shadow-lg hover:-translate-y-0.5"
                data-testid="home-cta-shop"
              >
                <PawPrint className="h-4 w-4" />
                Browse available puppies
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/inquiry"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border/70 bg-card/70 px-6 py-3 text-sm font-semibold text-foreground shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-secondary focus-ring"
                data-testid="home-cta-inquiry"
              >
                Start an inquiry
                <ScrollText className="h-4 w-4 text-muted-foreground" />
              </Link>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                { icon: <ShieldCheck className="h-5 w-5 text-accent" />, title: "Health-minded", desc: "Clear routines and transparent records." },
                { icon: <HeartHandshake className="h-5 w-5 text-primary" />, title: "Lifetime support", desc: "Guidance from pickup to adulthood." },
                { icon: <Sparkles className="h-5 w-5 text-[hsl(var(--chart-3))]" />, title: "Enrichment", desc: "Early socialization and confidence work." },
              ].map((f) => (
                <div key={f.title} className="rounded-2xl border border-border/70 bg-secondary/30 p-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl border border-border/60 bg-card p-2 shadow-sm">{f.icon}</div>
                    <div>
                      <div className="text-sm font-semibold">{f.title}</div>
                      <div className="text-xs text-muted-foreground">{f.desc}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-[2rem] border border-border/70 bg-gradient-to-br from-secondary/60 via-card to-card p-6 shadow-[var(--shadow-soft)]">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold" style={{ fontFamily: "var(--font-serif)" }}>
                    The Willow Standard
                  </div>
                  <div className="text-xs text-muted-foreground">Our placement checklist</div>
                </div>
                <div className="rounded-2xl border border-border/70 bg-card px-3 py-2 text-xs font-bold text-muted-foreground shadow-sm">
                  5 pillars
                </div>
              </div>

              <div className="mt-5 grid gap-3">
                {[
                  "Temperament evaluation & best-fit home matching",
                  "Routine-based raising and early training markers",
                  "Social exposure: sounds, surfaces, gentle novelty",
                  "Clear communication and realistic expectations",
                  "Thoughtful transition plan and post-placement support",
                ].map((line, idx) => (
                  <div key={idx} className="flex items-start gap-3 rounded-2xl border border-border/60 bg-card/70 p-4">
                    <div className="mt-0.5 h-2.5 w-2.5 rounded-full bg-primary" />
                    <div className="text-sm text-muted-foreground">{line}</div>
                  </div>
                ))}
              </div>

              <div className="mt-5">
                <Link
                  href="/contact"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border/70 bg-card/70 px-4 py-3 text-sm font-semibold text-foreground shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-secondary focus-ring"
                  data-testid="home-cta-contact"
                >
                  Ask a question
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured puppies */}
      <section className="mt-12">
        <div className="flex items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Available now"
            title="Featured Puppies"
            description="A small selection of current listings. For the best match, we recommend starting with an inquiry."
            data-testid="home-featured-puppies-heading"
          />
          <div className="hidden md:flex gap-2">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 rounded-xl border border-border/70 bg-card/70 px-4 py-2 text-sm font-semibold text-foreground shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-secondary focus-ring"
              data-testid="home-featured-puppies-viewall"
            >
              View all
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          </div>
        </div>

        {puppiesQ.isLoading ? (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-3xl border border-border/70 bg-card p-6 shadow-sm">
                <div className="h-6 w-40 rounded-lg skeleton-shimmer" />
                <div className="mt-4 h-4 w-full rounded-lg skeleton-shimmer" />
                <div className="mt-2 h-4 w-5/6 rounded-lg skeleton-shimmer" />
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {Array.from({ length: 4 }).map((__, j) => (
                    <div key={j} className="h-12 rounded-2xl skeleton-shimmer" />
                  ))}
                </div>
                <div className="mt-6 h-11 rounded-xl skeleton-shimmer" />
              </div>
            ))}
          </div>
        ) : puppiesQ.isError ? (
          <div className="mt-6 rounded-3xl border border-border/70 bg-card p-6 shadow-sm" data-testid="home-puppies-error">
            <div className="text-sm font-semibold">Couldn’t load puppies</div>
            <div className="mt-1 text-sm text-muted-foreground">{(puppiesQ.error as Error)?.message}</div>
          </div>
        ) : featuredPuppies.length === 0 ? (
          <div className="mt-6 rounded-3xl border border-border/70 bg-card p-6 shadow-sm" data-testid="home-puppies-empty">
            <div className="text-sm font-semibold">No available puppies right now</div>
            <div className="mt-1 text-sm text-muted-foreground">
              Check back soon—or send an inquiry to be notified about upcoming litters.
            </div>
            <div className="mt-4">
              <Link
                href="/inquiry"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary/85 px-4 py-2 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg focus-ring btn-sheen"
                data-testid="home-puppies-empty-cta"
              >
                Start an inquiry
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featuredPuppies.map((p) => (
              <PuppyCard key={p.id} puppy={p} compact />
            ))}
          </div>
        )}

        <div className="mt-6 md:hidden">
          <Link
            href="/shop"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border/70 bg-card/70 px-4 py-3 text-sm font-semibold text-foreground shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-secondary focus-ring"
            data-testid="home-featured-puppies-viewall-mobile"
          >
            View all puppies
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </Link>
        </div>
      </section>

      {/* Mission */}
      <section className="mt-14 grid gap-5 lg:grid-cols-12 lg:items-stretch">
        <div className="lg:col-span-5">
          <SectionHeading
            eyebrow="Our mission"
            title="Ethical breeding, anchored in everyday care."
            description="We believe great companions are raised—not rushed. Our approach blends gentle structure, early enrichment, and honest communication."
            data-testid="home-mission-heading"
          />
          <div className="mt-6 grid gap-4">
            <InfoCard
              title="Authentic transparency"
              icon={<ShieldCheck className="h-5 w-5" />}
              data-testid="home-mission-card-1"
            >
              We share routines, progress markers, and placement expectations with clarity—before you decide.
            </InfoCard>
            <InfoCard
              title="Temperament over trends"
              icon={<HeartHandshake className="h-5 w-5" />}
              data-testid="home-mission-card-2"
            >
              Our best matches come from listening: your lifestyle, household rhythm, and what you hope to build together.
            </InfoCard>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="surface-card grain-overlay h-full rounded-[2rem] border border-border/70 p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xl font-semibold" style={{ fontFamily: "var(--font-serif)" }}>
                  The placement journey
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  A calm, well-documented path from hello to home.
                </div>
              </div>
              <div className="rounded-2xl border border-border/70 bg-secondary/50 px-3 py-2 text-xs font-bold text-muted-foreground">
                4 steps
              </div>
            </div>

            <div className="mt-6 grid gap-3">
              {[
                { t: "Inquiry", d: "Tell us about your home, schedule, and what you’re looking for." },
                { t: "Conversation", d: "We discuss fit, timing, and how we raise each puppy—no pressure." },
                { t: "Match", d: "We suggest a puppy based on temperament and your preferences." },
                { t: "Transition", d: "Pickup prep, routine notes, and support for the first weeks at home." },
              ].map((s, idx) => (
                <div key={s.t} className="rounded-2xl border border-border/60 bg-card/70 p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold shadow-sm">
                      {idx + 1}
                    </div>
                    <div className="text-sm font-semibold">{s.t}</div>
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">{s.d}</div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Link
                href="/inquiry"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary/85 px-5 py-3 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg focus-ring btn-sheen"
                data-testid="home-mission-cta-inquiry"
              >
                Begin inquiry
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/reviews"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border/70 bg-card/70 px-5 py-3 text-sm font-semibold text-foreground shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-secondary focus-ring"
                data-testid="home-mission-cta-reviews"
              >
                Read family reviews
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured reviews */}
      <section className="mt-14">
        <div className="flex items-end justify-between gap-6">
          <SectionHeading
            eyebrow="What families say"
            title="Featured Reviews"
            description="A few notes from homes we’ve had the honor to serve."
            data-testid="home-featured-reviews-heading"
          />
          <div className="hidden md:flex">
            <Link
              href="/reviews"
              className="inline-flex items-center gap-2 rounded-xl border border-border/70 bg-card/70 px-4 py-2 text-sm font-semibold text-foreground shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-secondary focus-ring"
              data-testid="home-featured-reviews-viewall"
            >
              View all
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          </div>
        </div>

        {reviewsQ.isLoading ? (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="rounded-3xl border border-border/70 bg-card p-6 shadow-sm">
                <Skeleton className="h-5 w-40 rounded-lg" />
                <div className="mt-4 h-4 w-32 rounded-lg skeleton-shimmer" />
                <div className="mt-4 h-4 w-full rounded-lg skeleton-shimmer" />
                <div className="mt-2 h-4 w-5/6 rounded-lg skeleton-shimmer" />
                <div className="mt-2 h-4 w-2/3 rounded-lg skeleton-shimmer" />
              </div>
            ))}
          </div>
        ) : reviewsQ.isError ? (
          <div className="mt-6 rounded-3xl border border-border/70 bg-card p-6 shadow-sm" data-testid="home-reviews-error">
            <div className="text-sm font-semibold">Couldn’t load reviews</div>
            <div className="mt-1 text-sm text-muted-foreground">{(reviewsQ.error as Error)?.message}</div>
          </div>
        ) : featuredReviews.length === 0 ? (
          <div className="mt-6 rounded-3xl border border-border/70 bg-card p-6 shadow-sm" data-testid="home-reviews-empty">
            <div className="text-sm font-semibold">No featured reviews yet</div>
            <div className="mt-1 text-sm text-muted-foreground">Check the Reviews page for the full list.</div>
            <div className="mt-4">
              <Link
                href="/reviews"
                className="inline-flex items-center gap-2 rounded-xl border border-border/70 bg-card/70 px-4 py-2 text-sm font-semibold text-foreground shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-secondary focus-ring"
                data-testid="home-reviews-empty-cta"
              >
                Go to reviews
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featuredReviews.map((r) => (
              <ReviewCard key={r.id} review={r} />
            ))}
          </div>
        )}

        {/* Additional testimonials */}
        {moreReviews.length > 0 ? (
          <div className="mt-10 rounded-[2rem] border border-border/70 bg-gradient-to-br from-secondary/60 via-card to-card p-6 sm:p-8 shadow-[var(--shadow-soft)]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-xl font-semibold" style={{ fontFamily: "var(--font-serif)" }}>
                  More testimonials
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  A few more notes—because the details matter.
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                className="rounded-xl"
                onClick={() => {
                  // No-op explicit onClick per requirement; navigation handled by Link below on mobile.
                }}
                data-testid="home-testimonials-button"
              >
                <span className="hidden sm:inline">Curated</span>
                <span className="sm:hidden">Notes</span>
              </Button>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {moreReviews.slice(0, 4).map((r) => (
                <div key={r.id} className="rounded-3xl border border-border/70 bg-card/70 p-5 shadow-sm">
                  <div className="text-sm font-semibold">{r.reviewerName}</div>
                  <div className="mt-2 text-sm text-muted-foreground line-clamp-3">{r.testimonialText}</div>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <Link
                href="/reviews"
                className="inline-flex items-center gap-2 rounded-xl border border-border/70 bg-card/70 px-5 py-3 text-sm font-semibold text-foreground shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-secondary focus-ring"
                data-testid="home-testimonials-cta"
              >
                Read all reviews
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            </div>
          </div>
        ) : null}
      </section>
    </SiteShell>
  );
}
