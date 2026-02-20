import * as React from "react";
import { Seo } from "@/components/Seo";
import { SiteShell } from "@/components/SiteShell";
import { SectionHeading } from "@/components/SectionHeading";
import { InfoCard } from "@/components/InfoCard";
import { Mail, MapPin, Clock, ArrowRight, Phone } from "lucide-react";
import { Link } from "wouter";
import { useSettings } from "@/hooks/use-settings";

export default function Contact() {
  const settingsQ = useSettings();
  const contactPhone = (Array.isArray(settingsQ.data) ? settingsQ.data : [])?.find((s: any) => s.key === "contact_phone")?.value || "+1 (555) 000-0000";

  return (
    <SiteShell>
      <Seo
        title="Contact Us — American Eskimo Puppies"
        description="Questions about temperament, availability, or the adoption process? Contact us by email and we’ll respond with honest guidance."
      />

      <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
        <div className="lg:col-span-5">
          <SectionHeading
            eyebrow="Contact"
            title="We reply with care—no rush, no pressure."
            description="All inquiries are handled by email to ensure clear, organized communication and thoughtful responses."
            data-testid="contact-heading"
          />

          <div className="mt-6 grid gap-4">
            <InfoCard title="Email" icon={<Mail className="h-5 w-5" />} data-testid="contact-email">
              americaneskimopuppiesforsale@gmail.com
            </InfoCard>

            <InfoCard title="Phone" icon={<Phone className="h-5 w-5" />} data-testid="contact-phone">
              {contactPhone}
            </InfoCard>

            <InfoCard title="Availability" icon={<Clock className="h-5 w-5" />} data-testid="contact-hours">
              We respond within 1–2 business days.
            </InfoCard>

            <InfoCard title="Visits" icon={<MapPin className="h-5 w-5" />} data-testid="contact-location">
              Visits are scheduled by appointment after initial email inquiry.
            </InfoCard>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="surface-card grain-overlay rounded-[2rem] border border-border/70 p-6 sm:p-8">
            <div className="text-xl font-semibold" style={{ fontFamily: "var(--font-serif)" }}>
              Best way to begin
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              To ensure responsible placements, we begin all conversations by email. 
              Please include details about your home, lifestyle, and timeline so we can guide you properly.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                { t: "Your lifestyle", d: "Work schedule, activity level, and household environment." },
                { t: "Your preferences", d: "Temperament traits and characteristics you’re looking for." },
                { t: "Your timeline", d: "When you’d like to welcome a puppy home." },
                { t: "Your questions", d: "Care, training, health guarantee, or delivery questions." },
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
              <div className="text-sm font-semibold">Privacy Notice</div>
              <p className="mt-1 text-sm text-muted-foreground">
                We only use your email address to respond to your inquiry and coordinate next steps. 
                We do not sell or share your personal information.
              </p>
            </div>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}