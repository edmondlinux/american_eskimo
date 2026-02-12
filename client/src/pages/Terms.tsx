import * as React from "react";
import { Seo } from "@/components/Seo";
import { SiteShell } from "@/components/SiteShell";
import { SectionHeading } from "@/components/SectionHeading";
import { Separator } from "@/components/ui/separator";

export default function Terms() {
  return (
    <SiteShell>
      <Seo
        title="Terms of Service — Willow & Whelp"
        description="Read the terms of service for Willow & Whelp. Replace this template with your actual terms."
      />

      <div className="surface-card grain-overlay rounded-[2rem] border border-border/70 p-6 sm:p-10">
        <SectionHeading
          eyebrow="Legal"
          title="Terms of Service"
          description="This is a template for MVP. Replace with your official terms and consult counsel for accuracy."
          data-testid="terms-heading"
        />

        <Separator className="my-8" />

        <div className="prose prose-sm sm:prose-base max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-p:text-muted-foreground prose-li:text-muted-foreground">
          <h3>Use of website</h3>
          <p>
            The information on this website is provided for general informational purposes. Listings, timelines, and availability may change without notice.
          </p>

          <h3>Inquiries</h3>
          <p>
            Submitting an inquiry does not guarantee availability or placement. We reserve the right to decline inquiries to ensure appropriate matches and
            responsible placements.
          </p>

          <h3>Content</h3>
          <p>
            Text and branding on this site are provided for the breeder’s use. Unauthorized copying or commercial use is not permitted.
          </p>

          <h3>Limitation of liability</h3>
          <p>
            To the maximum extent permitted by law, we are not liable for any indirect or consequential damages arising from use of this site.
          </p>

          <h3>Contact</h3>
          <p>
            Questions about these terms can be sent via the contact page.
          </p>
        </div>
      </div>
    </SiteShell>
  );
}
