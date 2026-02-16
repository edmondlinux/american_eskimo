import * as React from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { PawPrint, Menu, Shield, Mail, Phone, MapPin } from "lucide-react";
import logo from "@/assets/logo.png.png";
import { useCurrentUser } from "@/hooks/use-auth";

const nav = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/reviews", label: "Reviews" },
  { href: "/contact", label: "Contact Us" },
  { href: "/refund-policy", label: "Refund Policy" },
  { href: "/terms", label: "Terms of Service" },
];

function HeaderLink({ href, children, "data-testid": dataTestId }: { href: string; children: React.ReactNode; "data-testid"?: string }) {
  const [loc] = useLocation();
  const active = loc === href;
  return (
    <Link
      href={href}
      data-testid={dataTestId}
      className={cn(
        "rounded-xl px-3 py-2 text-sm font-semibold transition-all duration-200 focus-ring",
        "hover:bg-secondary hover:text-foreground",
        active && "bg-secondary text-foreground shadow-[var(--shadow-crisp)]",
        !active && "text-muted-foreground"
      )}
    >
      {children}
    </Link>
  );
}

export function SiteShell({
  children,
  tone = "default",
}: {
  children: React.ReactNode;
  tone?: "default" | "hero";
}) {
  const { data: user } = useCurrentUser();

  return (
    <div className={cn("min-h-screen bg-atelier grain-overlay", tone === "hero" && "relative")}>
      <header className="sticky top-0 z-50">
        <div className="surface-glass border-b border-border/70">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between gap-3">
              <Link
                href="/"
                className="group flex items-center gap-3 rounded-2xl px-2 py-1.5 transition-all duration-200 hover:bg-secondary/70 focus-ring"
                data-testid="nav-home-logo"
              >
                <div className="relative">
                  <div className="absolute -inset-2 rounded-2xl bg-gradient-to-br from-primary/20 via-accent/10 to-transparent blur-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <img
                    src={logo}
                    alt="Breeder logo"
                    className="relative h-9 w-9 rounded-xl border border-border/70 bg-card p-1 shadow-sm"
                  />
                </div>
                <div className="leading-tight">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold tracking-tight text-[15px] sm:text-base" style={{ fontFamily: "var(--font-serif)" }}>
                      American Eskimo 
                    </span>
                    <Badge variant="secondary" className="hidden sm:inline-flex border-border/70 bg-card/60 text-foreground">
                      Ethical Breeding
                    </Badge>
                  </div>
                  <div className="hidden sm:block text-xs text-muted-foreground">
                    Family-raised, temperament-first companions
                  </div>
                </div>
              </Link>

              <nav className="hidden lg:flex items-center gap-1" aria-label="Primary navigation">
                {nav.map((item) => (
                  <HeaderLink key={item.href} href={item.href} data-testid={`nav-${item.label.toLowerCase().replaceAll(" ", "-")}`}>
                    {item.label}
                  </HeaderLink>
                ))}
              </nav>

              <div className="flex items-center gap-2">
                <Link
                  href="/inquiry"
                  className={cn(
                    "hidden sm:inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 focus-ring btn-sheen",
                    "bg-gradient-to-r from-primary to-primary/85 text-primary-foreground shadow-md shadow-primary/20",
                    "hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 active:translate-y-0"
                  )}
                  data-testid="nav-inquiry"
                >
                  <PawPrint className="h-4 w-4" />
                  Inquiry
                </Link>

                <Link
                  href="/dashboard"
                  className={cn(
                    "hidden md:inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition-all duration-200 focus-ring",
                    "border border-border/70 bg-card/70 text-foreground hover:bg-secondary"
                  )}
                  data-testid="nav-dashboard"
                >
                  <Shield className="h-4 w-4 text-accent" />
                  <span>Dashboard</span>
                  {user?.role === "admin" ? (
                    <span className="ml-1 rounded-lg bg-accent/15 px-2 py-0.5 text-xs font-bold text-accent">Admin</span>
                  ) : null}
                </Link>

                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      className="lg:hidden rounded-xl border-border/70 bg-card/70 hover:bg-secondary"
                      data-testid="nav-mobile-menu"
                    >
                      <Menu className="h-4 w-4" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[340px] sm:w-[380px]">
                    <SheetHeader>
                      <SheetTitle className="text-xl">Menu</SheetTitle>
                    </SheetHeader>
                    <div className="mt-5 grid gap-2">
                      {nav.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="rounded-xl border border-border/70 bg-card px-4 py-3 font-semibold text-foreground shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-secondary focus-ring"
                          data-testid={`nav-mobile-${item.label.toLowerCase().replaceAll(" ", "-")}`}
                        >
                          {item.label}
                        </Link>
                      ))}
                      <Separator className="my-2" />
                      <Link
                        href="/dashboard"
                        className="rounded-xl border border-border/70 bg-card px-4 py-3 font-semibold text-foreground shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-secondary focus-ring"
                        data-testid="nav-mobile-dashboard"
                      >
                        Dashboard
                      </Link>
                      <Link
                        href="/inquiry"
                        className="rounded-xl bg-gradient-to-r from-primary to-primary/85 px-4 py-3 font-semibold text-primary-foreground shadow-md shadow-primary/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg focus-ring btn-sheen"
                        data-testid="nav-mobile-inquiry"
                      >
                        Inquiry
                      </Link>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">{children}</main>

      <footer className="border-t border-border/80 bg-card/50">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid gap-10 md:grid-cols-12">
            <div className="md:col-span-5">
              <div className="flex items-center gap-3">
                <img src={logo} alt="Breeder logo" className="h-10 w-10 rounded-2xl border border-border/70 bg-card p-1 shadow-sm" />
                <div>
                  <div className="text-lg font-semibold" style={{ fontFamily: "var(--font-serif)" }}>
                    American Eskimo
                  </div>
                  <div className="text-sm text-muted-foreground">Classical care. Modern standards. Lifelong support.</div>
                </div>
              </div>

              <div className="mt-5 grid gap-3 text-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    Serving families nationwide · Visits by appointment
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">(555) 013-2026</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">americaneskimopuppiesforsale@gmail.com</span>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-border/70 bg-gradient-to-br from-secondary/70 via-card to-card p-5 shadow-sm">
                <div className="text-sm font-semibold text-foreground">A gentle promise</div>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  We raise with enrichment, early socialization, and transparent health practices. Every placement begins with an honest conversation.
                </p>
              </div>
            </div>

            <div className="md:col-span-7">
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                <div className="grid gap-2">
                  <div className="text-sm font-semibold">Explore</div>
                  {["Home", "Shop", "Reviews", "Inquiry"].map((label) => {
                    const href =
                      label === "Home" ? "/" : `/${label.toLowerCase()}`;
                    const fixedHref = label === "Inquiry" ? "/inquiry" : href;
                    return (
                      <Link
                        key={label}
                        href={fixedHref}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground focus-ring rounded-lg px-2 py-1"
                        data-testid={`footer-link-${label.toLowerCase()}`}
                      >
                        {label}
                      </Link>
                    );
                  })}
                </div>

                <div className="grid gap-2">
                  <div className="text-sm font-semibold">Policies</div>
                  <Link
                    href="/refund-policy"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground focus-ring rounded-lg px-2 py-1"
                    data-testid="footer-link-refund"
                  >
                    Refund Policy
                  </Link>
                  <Link
                    href="/terms"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground focus-ring rounded-lg px-2 py-1"
                    data-testid="footer-link-terms"
                  >
                    Terms of Service
                  </Link>
                  <Link
                    href="/contact"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground focus-ring rounded-lg px-2 py-1"
                    data-testid="footer-link-contact"
                  >
                    Contact Us
                  </Link>
                </div>

                <div className="grid gap-2">
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-8" />

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} American Eskimo. All rights reserved.
            </div>
            <div className="text-xs text-muted-foreground">
              Crafted with care · Temperament-first placements
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
