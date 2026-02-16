import * as React from "react";
import { Seo } from "@/components/Seo";
import { SiteShell } from "@/components/SiteShell";
import { SectionHeading } from "@/components/SectionHeading";
import { PuppyCard } from "@/components/PuppyCard";
import { usePuppies } from "@/hooks/use-puppies";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Filter, Search, X, PawPrint } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Shop() {
  const [availableOnly, setAvailableOnly] = React.useState(true);
  const [search, setSearch] = React.useState("");

  const puppiesQ = usePuppies({ availableOnly });

  const filtered = React.useMemo(() => {
    const all = puppiesQ.data ?? [];
    const q = search.trim().toLowerCase();
    if (!q) return all;
    return all.filter((p) => {
      const hay = `${p.name} ${p.breed} ${p.sex} ${p.age} ${p.temperament} ${p.shortDescription}`.toLowerCase();
      return hay.includes(q);
    });
  }, [puppiesQ.data, search]);

  return (
    <SiteShell>
      <Seo
        title="Shop — American Eskimo"
        description="Browse available puppies. Each listing includes temperament notes, age, and an inquiry button to begin the conversation."
      />

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Shop"
            title="Available Puppies"
            description="No cart—just clarity. When you’re ready, we’ll start with a thoughtful inquiry."
            data-testid="shop-heading"
          />

          <div className="flex flex-col sm:flex-row gap-3 md:items-center">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, breed, temperament…"
                className="pl-9 rounded-xl bg-card/70 border-border/70 focus-ring w-full sm:w-[320px]"
                data-testid="shop-search"
              />
              {search ? (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-2 top-2 rounded-lg p-2 text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-200 focus-ring"
                  data-testid="shop-search-clear"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              ) : null}
            </div>

            <Button
              type="button"
              variant={availableOnly ? "default" : "outline"}
              className={cn(
                "rounded-xl transition-all duration-200",
                availableOnly
                  ? "bg-gradient-to-r from-primary to-primary/85 text-primary-foreground shadow-md shadow-primary/20 hover:shadow-lg hover:-translate-y-0.5 btn-sheen"
                  : "border-border/70 bg-card/70 hover:bg-secondary"
              )}
              onClick={() => setAvailableOnly((v) => !v)}
              data-testid="shop-toggle-available"
            >
              <Filter className="h-4 w-4 mr-2" />
              {availableOnly ? "Available only" : "All listings"}
            </Button>
          </div>
        </div>

        {puppiesQ.isLoading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="rounded-3xl border border-border/70 bg-card p-6 shadow-sm">
                <div className="h-6 w-44 rounded-lg skeleton-shimmer" />
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
          <div className="rounded-3xl border border-border/70 bg-card p-6 shadow-sm" data-testid="shop-error">
            <div className="text-sm font-semibold">Couldn’t load puppies</div>
            <div className="mt-1 text-sm text-muted-foreground">{(puppiesQ.error as Error)?.message}</div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-[2rem] border border-border/70 bg-card/70 p-8 shadow-sm" data-testid="shop-empty">
            <div className="flex items-start gap-4">
              <div className="rounded-2xl border border-border/70 bg-secondary/60 p-3 shadow-sm">
                <PawPrint className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="text-lg font-semibold">No results</div>
                <div className="mt-1 text-sm text-muted-foreground">
                  Try a different search—or toggle “All listings” to include reserved puppies.
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => (
              <div key={p.id} id={`puppy-${p.id}`} className="scroll-mt-24">
                <PuppyCard puppy={p} />
              </div>
            ))}
          </div>
        )}
      </div>
    </SiteShell>
  );
}
