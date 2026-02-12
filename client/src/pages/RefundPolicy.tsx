import * as React from "react";
import { Seo } from "@/components/Seo";
import { SiteShell } from "@/components/SiteShell";
import { SectionHeading } from "@/components/SectionHeading";
import { Separator } from "@/components/ui/separator";

export default function RefundPolicy() {
  return (
    <SiteShell>
      <Seo
        title="Refund Policy — Willow & Whelp"
        description="Read our refund policy. Clear terms, calm expectations, and an emphasis on responsible placements."
      />

      <div className="surface-card grain-overlay rounded-[2rem] border border-border/70 p-6 sm:p-10">
        <SectionHeading
          eyebrow="Policy"
          title="Refund Policy"
          description="This is a template policy for the MVP frontend. Replace with your actual policy text."
          data-testid="refund-heading"
        />

        <Separator className="my-8" />

        <div className="prose prose-sm sm:prose-base max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-p:text-muted-foreground prose-li:text-muted-foreground">
          <h3>Deposits</h3>
          <p>
            Deposits are generally non-refundable because they reserve time, planning, and a place in the matching process. If we cannot provide a suitable
            match, we will offer a refund or transfer to a future litter.
          </p>

          <h3>Health guarantee and veterinary care</h3>
          <p>
            If a licensed veterinarian identifies a serious health condition within the agreed time window, we will work with you on a resolution per the
            written health guarantee (replacement, partial refund, or other remedy as appropriate).
          </p>

          <h3>Cancellations and transfers</h3>
          <p>
            If your timing changes, we may allow a transfer to a future litter at our discretion, depending on availability and the stage of the process.
          </p>

          <h3>Contact</h3>
          <p>
            For questions about refunds or the guarantee, please contact us with your name and the puppy’s details. We’ll reply promptly and with care.
          </p>
        </div>
      </div>
    </SiteShell>
  );
}
