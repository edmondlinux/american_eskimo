import * as React from "react";
import { Seo } from "@/components/Seo";
import { SiteShell } from "@/components/SiteShell";
import { SectionHeading } from "@/components/SectionHeading";
import { InfoCard } from "@/components/InfoCard";
import { Mail, Phone, MapPin, Clock, ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function Contact() {
  return (
    <SiteShell>
      <Seo
        title="Contact Us — Willow & Whelp"
        description="Questions about temperament, timing, or raising approach? Reach out, or start with a simple inquiry."
      />

      <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
        <div className="lg:col-span-5">
          <SectionHeading
            eyebrow="Contact"
            title="We reply with care—no rush, no pressure."
            description="Tell us what you’re looking for, and we’ll respond with honest guidance and next steps."
            data-testid="contact-heading"
          />

          <div className="mt-6 grid gap-4">
            <InfoCard title="Email" icon={<Mail className="h-5 w-5" />} data-testid="contact-email">
              hello@willowandwhelp.example
            </InfoCard>
            <InfoCard title="Phone" icon={<Phone className="h-5 w-5" />} data-testid="contact-phone">
              (555) 013-2026
            </InfoCard>
            <InfoCard title="Location" icon={<MapPin className="h-5 w-5" />} data-testid="contact-location">
              Visits by appointment · Serving families nationwide
            </InfoCard>
            <InfoCard title="Hours" icon={<Clock className="h-5 w-5" />} data-testid="contact-hours">
              Mon–Sat · 9am–6pm (local) · We respond within 1–2 business days.
            </InfoCard>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="surface-card grain-overlay rounded-[2rem] border border-border/70 p-6 sm:p-8">
            <div className="text-xl font-semibold" style={{ fontFamily: "var(--font-serif)" }}>
              Best way to begin
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              For placements, we start with an inquiry so we can match temperament to home. It’s the quickest path to a good fit.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                { t: "Your lifestyle", d: "Schedule, activity level, household rhythm." },
                { t: "Your preferences", d: "Breed, age, and temperament tendencies you love." },
                { t: "Your timeline", d: "When you’d like to welcome a puppy home." },
                { t: "Your questions", d: "Raising, training, travel, or transition plans." },
              ].map((x) => (
                <div key={x.t} className="rounded-3xl border border-border/70 bg-card/70 p-5 shadow-sm">
                  <div className="text-sm font-semibold">{x.t}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{x.d}</div>
                </div>
              ))}
            </div>

            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <Link
                href="/inquiry"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary/85 px-5 py-3 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg focus-ring btn-sheen"
                data-testid="contact-cta-inquiry"
              >
                Start an inquiry
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/shop"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border/70 bg-card/70 px-5 py-3 text-sm font-semibold text-foreground shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-secondary focus-ring"
                data-testid="contact-cta-shop"
              >
                Browse puppies
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            </div>

            <div className="mt-8 rounded-3xl border border-border/70 bg-secondary/35 p-5">
              <div className="text-sm font-semibold">Note on privacy</div>
              <p className="mt-1 text-sm text-muted-foreground">
                We only use your contact details to respond to your inquiry and coordinate next steps.
              </p>
            </div>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
